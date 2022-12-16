const leavetrackerdb = require("../utils/firebasedb");
const { orgService, allowanceService } = require("../services");
const { serverTimestamp } = require("firebase-admin").firestore.FieldValue;
const firestore = require("firebase-admin").firestore;

const createUser = async (userBody) => {
  try {
    const { orgId, email, policyId } = userBody;
    const domain = email.split("@")[1];
    const user = await leavetrackerdb
      .collection("users")
      .where("email", "==", email)
      .get();
    if (!user.empty) {
      throw new Error(
        JSON.stringify({
          message: "User already exists",
          email: user.docs[0].data().email,
          username: user.docs[0].data().name,
        })
      );
    }
    // if(isAdmin){
    //   userBody.role = 'admin';
    // }
    const leaverequestcount = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    userBody.jobRole = "employee";
    if (orgId) {
      if (!policyId) {
        throw new Error(
          JSON.stringify({
            message: "Policy not found, Please choose one",
          })
        );
      }
      userBody.role = "user";
      const addUser = await leavetrackerdb.collection("users").add({
        ...userBody,
        leaverequestcount,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      if (!addUser) {
        throw new Error("Error adding user");
      }
      policyAllowances = await allowanceService.getAllowances(orgId, policyId);
      policyAllowances.forEach(async (policyAllowance) => {
        await leavetrackerdb
          .collection("users")
          .doc(addUser.id)
          .collection("allowances")
          .doc(policyAllowance.id)
          .set({
            ...policyAllowance,
            used: 0,
            amount: parseInt(policyAllowance.amount),
            remaining: parseInt(policyAllowance.amount),
            maxLimitAmount: parseInt(policyAllowance.maxLimitAmount),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: addUser.id
          });
      });
      const org = await orgService.getOrg(orgId);
      if (!org) {
        throw new Error("Org does not exist");
      }
      const addUserToOrg = await orgService.addUsersToOrg(orgId, addUser.id);
      const updateUser = await leavetrackerdb
        .collection("users")
        .doc(addUser.id)
        .update({
          orgId: orgId,
        });
      if (!addUserToOrg && !updateUser) {
        throw new Error("Error adding user to org");
      }

      const createdUserref = await leavetrackerdb
        .collection("users")
        .doc(addUser.id)
        .get();
      const user = {
        id: createdUserref.id,
        ...createdUserref.data(),
      };

      return user;
    } else {
      // check if domain is in orgs
      const orgs = await orgService.findOrgbyDomain(domain);
      if (orgs.length === 0) {
        // console.log("No orgs found creating an org from domain");
        userBody.role = "admin";
        const addUser = await leavetrackerdb.collection("users").add({
          ...userBody,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        if (!addUser) {
          throw new Error("Error adding user");
        }
        const newOrg = await orgService.createOrg(
          "Default",
          "Default",
          domain,
          email
        );
        if (!newOrg) {
          throw new Error("Error creating org");
        }
        const addUserToOrg = await orgService.addUsersToOrg(
          newOrg.id,
          addUser.id
        );
        const addAdminToOrg = await orgService.addAdminsToOrg(
          newOrg.id,
          addUser.id
        );
        // add orgId to user
        const updateUser = await leavetrackerdb
          .collection("users")
          .doc(addUser.id)
          .update({
            orgId: newOrg.id,
          });
        if (!addUserToOrg && !addAdminToOrg && !updateUser) {
          throw new Error("Error adding user to org");
        }
        const createdUserref = await leavetrackerdb
          .collection("users")
          .doc(addUser.id)
          .get();
        const user = {
          id: createdUserref.id,
          ...createdUserref.data(),
        };
        return user;
      } else {
        throw new Error(
          JSON.stringify({
            message: "Org already exists please contact your admin",
            adminEmail: orgs[0].adminEmail,
          })
        );
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUser = async (userId) => {
  try {
    const user = await leavetrackerdb.collection("users").doc(userId).get();
    if (!user.exists) {
      throw new Error("User not found");
    }
    const userData = {
      id: user.id,
      ...user.data(),
    };
    return userData;
  } catch (err) {
    throw new Error(err.message);
  }
};

const setLeaveAllowance = async (userId, leaveType, amount) => {
  try {
    const userRef = await leavetrackerdb.collection("users").doc(userId);
    const user = await userRef.get();
    if (!user.exists) {
      throw new Error("User not found");
    }
    const userData = {
      id: user.id,
      ...user.data(),
    };
    const updatedUser = await leavetrackerdb
      .collection("users")
      .doc(userId)
      .update({
        [`allowance.${leaveType}.amount`]: amount,
        [`allowance.${leaveType}.remaining`]: amount,
        [`allowance.${leaveType}.used`]: 0,
        updatedAt: serverTimestamp(),
      });
    if (!updatedUser) {
      throw new Error("Error updating user");
    }
    return (await userRef.get()).data().allowance;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateLeaveallowance = async (userId, amount, allowanceId) => {
  try {
    const userAlowance = await leavetrackerdb
      .collection("users")
      .doc(userId)
      .collection("allowances")
      .doc(allowanceId)
      .get();
    if (!userAlowance.exists) {
      throw new Error("allowance not found");
    }
    const allowanceData = {
      id: userAlowance.id,
      ...userAlowance.data(),
    };
    if (
      allowanceData.amount !==
      allowanceData.used + amount + (allowanceData.remaining - amount)
    ) {
      throw new Error("Leave allowance updating error");
    }
    const allowanceUpdate = await leavetrackerdb
      .collection("users")
      .doc(userId)
      .collection("allowances")
      .doc(allowanceId)
      .update({
        used: allowanceData.used + amount,
        remaining: allowanceData.remaining - amount,
        updatedAt: serverTimestamp(),
      });

    if (!allowanceUpdate) {
      throw new Error("Error updating user allowance");
    }
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUsers = async (orgId, limit, page) => {
  try {
    const users = await leavetrackerdb
      .collection("users")
      .where("orgId", "==", orgId)
      .orderBy("createdAt", "desc")
      .offset(parseInt(page) * parseInt(limit))
      .limit(parseInt(limit))
      .get();
    if (users.empty) {
      throw new Error("No users found");
    }
    const usersData = users.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return usersData;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateleaverequestcount = async (userId, status, count) => {
  try {
    const user = await leavetrackerdb.collection("users").doc(userId).get();
    if (!user.exists) {
      throw new Error("User not found");
    }
    const userData = {
      id: user.id,
      ...user.data(),
    };
    const updatedUser = await leavetrackerdb
      .collection("users")
      .doc(userId)
      .update({
        [`leaverequestcount.${status}`]:
          userData.leaverequestcount[status] + count,
        updatedAt: serverTimestamp(),
      });

    if (!updatedUser) {
      throw new Error("Error updating user leave request count");
    }
    return updatedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};
/**
 * @param {string} userId
 * @param {object} userBody
 * @returns {object} updated user
 */

const updateUser = async (userId, userBody) => {
  try {
    const user = await leavetrackerdb.collection("users").doc(userId).get();
    if (!user.exists) {
      throw new Error("User not found");
    }
    const userData = {
      id: user.id,
      ...user.data(),
    };
    const updatedUser = await leavetrackerdb
      .collection("users")
      .doc(userId)
      .update({
        ...userBody,
        updatedAt: serverTimestamp(),
      });

    if (!updatedUser) {
      throw new Error("Error updating user");
    }
    return updatedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await leavetrackerdb.collection("users").doc(userId).get();
    if (!user.exists) {
      throw new Error("User not found");
    }
    const userData = {
      id: user.id,
      ...user.data(),
    };
    // delete user leaverequests before deleting user using batch for optimal performance
    const userLeaverequests = await leavetrackerdb
      .collection("leaves")
      .where("userId", "==", userId)
      .get();
    const batch = firestore().batch();

    if (!userLeaverequests.empty) {
      userLeaverequests.forEach(async (doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    const deletedUser = await leavetrackerdb
      .collection("users")
      .doc(userId)
      .delete();

    if (!deletedUser) {
      throw new Error("Error deleting user");
    }
    return userData;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserSpecificData = async (userId, key) => {
  try {
    const user = await leavetrackerdb.collection("users").doc(userId).get();
    if (!user.exists) {
      throw new Error("User not found");
    }
    const userData = {
      id: user.id,
      ...user.data(),
    };
    return userData[key];
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  createUser,
  getUser,
  updateLeaveallowance,
  getUsers,
  updateleaverequestcount,
  setLeaveAllowance,
  updateUser,
  deleteUser,
  getUserSpecificData,
};
