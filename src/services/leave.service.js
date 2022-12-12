const leavetrackerdb = require("../utils/firebasedb");
const { serverTimestamp } = require("firebase-admin").firestore.FieldValue;
const { userService } = require("../services");
const firestore = require("firebase-admin").firestore;
const createLeave = async (leave) => {
  const createdLeave = await leavetrackerdb.collection("leaves").add({
    ...leave,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await userService.updateleaverequestcount(leave.userId, "pending", 1);
  return {
    id: createdLeave.id,
    ...(await createdLeave.get()).data(),
  };
};

const updateLeave = async (id, leave) => {
  if (leave.status === "approved") {
    const allowanceUpdate = await userService.updateLeaveallowance(
      leave.userId,
      leave.days,
      leave.allowanceId
    );
    await userService.updateleaverequestcount(leave.userId, leave.status, 1);
    await userService.updateleaverequestcount(leave.userId, "pending", -1);
    const leaveToUpdate = await leavetrackerdb
      .collection("leaves")
      .doc(id)
      .update({
        ...leave,
        updatedAt: serverTimestamp(),
      });
    if (!leaveToUpdate || !allowanceUpdate) {
      throw new Error("Error updating leave");
    }
    return leaveToUpdate;
  } else if (leave.status === "rejected") {
    await userService.updateleaverequestcount(leave.userId, leave.status, 1);
    await userService.updateleaverequestcount(leave.userId, "pending", -1);
    const leaveToUpdate = await leavetrackerdb
      .collection("leaves")
      .doc(id)
      .update({
        ...leave,
        updatedAt: serverTimestamp(),
      });
    if (!leaveToUpdate) {
      throw new Error("Error updating leave");
    }
    return leaveToUpdate;
  } else {
    await userService.updateleaverequestcount(leave.userId, leave.status, 1);
    await userService.updateleaverequestcount(leave.userId, "pending", -1);
    const leaveToUpdate = await leavetrackerdb
      .collection("leaves")
      .doc(id)
      .update({
        ...leave,
        updatedAt: serverTimestamp(),
      });
    return leaveToUpdate;
  }
};
const getLeaves = async (status, orgId, userId) => {
  if (!userId) {
    if (!status) {
      const leaves = await leavetrackerdb
        .collection("leaves")
        .where("orgId", "==", orgId)
        .get();
      return leaves.docs.map((leave) => {
        return {
          id: leave.id,
          ...leave.data(),
        };
      });
    } else {
      const leaves = await leavetrackerdb
        .collection("leaves")
        .where("status", "==", status)
        .where("orgId", "==", orgId)
        .get();
      return leaves.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
    }
  } else {
    if (!status) {
      const leaves = await leavetrackerdb
        .collection("leaves")
        .where("userId", "==", userId)
        .where("orgId", "==", orgId)
        .get();
      return leaves.docs.map((leave) => {
        return {
          id: leave.id,
          ...leave.data(),
        };
      });
    } else {
      const leaves = await leavetrackerdb
        .collection("leaves")
        .where("status", "==", status)
        .where("userId", "==", userId)
        .get();
      return leaves.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
    }
  }
};

const getLeaveById = async (id) => {
  try {
    const leave = await leavetrackerdb.collection("leaves").doc(id).get();
    if (!leave.exists) {
      throw new Error("Leave not found");
    }
    return {
      id: leave.id,
      ...leave.data(),
    };
  } catch (err) {
    throw new Error(err.message + " getLeaveById error");
  }
};

const checkIfleaveExists = async (startDate, endDate, userId) => {
  const sd = new Date(startDate).toISOString().split("T")[0];
  const ed = new Date(endDate).toISOString().split("T")[0];
  const leaves = await leavetrackerdb
    .collection("leaves")
    .where("userId", "==", userId)
    .where("dates", "array-contains-any", [sd, ed, `${ed},${sd}`])
    .select("status")
    .get();
  //filter leaves with status rejected
  const filteredLeaves = leaves.docs.filter((doc) => {
    return doc.data().status !== "rejected";
  });
  if (filteredLeaves.length > 0) {
    return true;
  } else {
    return false;
  }
};

const getUserLeaveRequestCount = async (userId) => {
  try {
    const user = await leavetrackerdb.collection("users").doc(userId).get();
    if (!user.exists) {
      throw new Error("User not found");
    }
    const userData = {
      id: user.id,
      ...user.data(),
    };
    return userData.leaverequestcount;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteLeaveRequest = async (id) => {
  try {
    const leave = await leavetrackerdb.collection("leaves").doc(id).get();
    if (!leave.exists) {
      throw new Error("Leave not found");
    }
    const leaveData = {
      id: leave.id,
      ...leave.data(),
    };
    if (!leave.data().status === "pending") {
      throw new Error("Leave already approved or rejected unable to delete");
    }
    await leavetrackerdb.collection("leaves").doc(id).delete();
    await userService.updateleaverequestcount(leaveData.userId, "pending", -1);
    return leaveData;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getleaveAllowance = async (userId, type) => {
  try {
    const user = await leavetrackerdb.collection("users").doc(userId).get();
    if (!user.exists) {
      throw new Error("User not found");
    }
    const userData = {
      id: user.id,
      ...user.data().allowance[`${type}`],
    };
    return userData;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  checkIfleaveExists,
  getUserLeaveRequestCount,
  deleteLeaveRequest,
  getleaveAllowance,
};
