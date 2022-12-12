const firebasedb = require("../utils/firebasedb");

const updateOrganisation = async (orgId, orgBody) => {
    try {
        const org = await firebasedb
        .collection("orgs")
        .doc(orgId)
        .update(orgBody);
        if (!org) {
        throw new Error("Error updating organisation");
        }
        const updatedOrgref = await firebasedb
        .collection("organisations")
        .doc(orgId)
        .get();
        const updatedOrg = {
        id: updatedOrgref.id,
        ...updatedOrgref.data(),
        };
        return updatedOrg;
    } catch (error) {
        throw error;
    }
}

const  getOrganisation = async (orgId) => {
    try {
        const org = await firebasedb
        .collection("orgs")
        .doc(orgId)
        .get();
        if (!org) {
        throw new Error("Error getting organisation");
        }
        const updatedOrg = {
        id: org.id,
        ...org.data(),
        };
        return updatedOrg;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    updateOrganisation,
    getOrganisation
}
