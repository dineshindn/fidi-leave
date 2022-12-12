const leavetrackerdb = require("../utils/firebasedb");
const admin = require("firebase-admin");
const lta = require("../../leaveTypes");
const { leaveTypeService } = require("../services");
/**
 *  createOrg - Creates a new organisation in the database
 * @param {*} orgName
 * @param {*} orgDescription
 * @param {*} domain
 * @param {*} employeeCount
 * @param {*} adminEmail
 * @returns {Promise<object>}
 */

const createOrg = async (orgName, orgDescription, domain, adminEmail) => {
  const org = {
    orgName: orgName,
    orgDescription: orgDescription,
    domain: domain,
    employeeCount: 0,
    adminEmail: adminEmail,
  };
  const createdOrg = await leavetrackerdb.collection("orgs").doc().set(org);
  const newCreatedOrg = await leavetrackerdb
    .collection("orgs")
    .where("domain", "==", domain)
    .where("adminEmail", "==", adminEmail)
    .get();
  const newCreatedOrgData = newCreatedOrg.docs[0];

  const orgId = newCreatedOrgData.id;
  lta.forEach(async (elem) => {
    const cr = await leaveTypeService.createLeaveType(
      elem.label,
      elem.value,
      elem.description,
      elem.color,
      orgId
    );
  });

  return {
    id: newCreatedOrgData.id,
    ...newCreatedOrgData.data(),
  };
};

const addUsersToOrg = async (orgId, userId) => {
  try {
    const org = await leavetrackerdb
      .collection("orgs")
      .doc(orgId)
      .update({
        userIds: admin.firestore.FieldValue.arrayUnion(userId),
      });
    if (!org) {
      throw new Error("Error adding user to org");
    }
    return true;
  } catch (err) {
    throw new Error(err.message + "Error in adding user to org");
  }
};

const addAdminsToOrg = async (orgId, userId) => {
  const org = await leavetrackerdb
    .collection("orgs")
    .doc(orgId)
    .update({
      adminIds: admin.firestore.FieldValue.arrayUnion(userId),
    });
  if (!org) {
    throw new Error("Error adding admin to org");
  }
  return true;
};

const getOrg = async (orgId) => {
  const org = await leavetrackerdb.collection("orgs").doc(orgId).get();
  return org.data();
};

const getUsersbyOrgId = async (orgId) => {
  const users = await leavetrackerdb
    .collection("users")
    .where("orgId", "==", orgId)
    .get();
  return users.docs.map((doc) => doc.data());
};

const findOrgbyDomain = async (domain) => {
  const org = await leavetrackerdb
    .collection("orgs")
    .where("domain", "==", domain)
    .get();
  return org.docs.map((doc) => doc.data());
};

const updateOrg = async (orgId, orgData) => {
  try {
    //cheking if org exists
    const org = await leavetrackerdb.collection("orgs").doc(orgId).get();
    if (!org.exists) {
      throw new Error("Org does not exist");
    }
    const updatedOrg = await leavetrackerdb
      .collection("orgs")
      .doc(orgId)
      .update(orgData);
    if (!updatedOrg) {
      throw new Error("Error updating org");
    }
    return true;
  } catch (err) {
    throw new Error(err.message + "Error in updating org");
  }
};

const getOrgById = async (orgId) => {
  try {
    const org = await leavetrackerdb.collection("orgs").doc(orgId).get();
    if (!org.exists) {
      throw new Error("Org does not exist");
    }
    return {
      id: org.id,
      ...org.data(),
    };
  } catch (err) {
    throw new Error(err.message + "Error in getting orgbyId");
  }
};
const getOrgSpecificData = async (orgId, key) => {
  try {
    const org = await leavetrackerdb.collection("orgs").doc(orgId).get();
    if (!org.exists) {
      throw new Error("Org does not exist");
    }
    return org.data()[key];
  } catch (err) {
    throw new Error(err.message + "Error in getting orgbyId");
  }
};
module.exports = {
  createOrg,
  addUsersToOrg,
  addAdminsToOrg,
  getOrg,
  getUsersbyOrgId,
  findOrgbyDomain,
  updateOrg,
  getOrgById,
  getOrgSpecificData,
};
