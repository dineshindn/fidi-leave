const leavetrackerdb = require("../utils/firebasedb");
const admin = require("firebase-admin");
const {allowanceService} = require('../services')

const createLeavePolicy = async (startMonth,endMonth,name,description,orgId)=>{
    const createdLeavePolicy = await leavetrackerdb.collection("policies").add({
       startMonth,
       endMonth,
       name,
       description,
       orgId
    })
        return {
        id: createdLeavePolicy.id,
    }
}

const getLeavePolicies = async (orgId)=>{
    console.log("orgId","==", orgId)
    const leavePolicies = await leavetrackerdb.collection("policies").where("orgId","==", orgId).get();
    return leavePolicies.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
}

const getLeavePolicyById = async (orgId,leavePolicyId)=>{
    const leavePolicy = await leavetrackerdb.collection("policies").where("orgId","==", orgId).doc(leavePolicyId).get();
    return {
        id: leavePolicy.id,
        ...leavePolicy.data(),
    }
}

const updateLeavePolicy = async (orgId,leavePolicyId,policyBody)=>{
    const leavePolicy = await leavetrackerdb.collection("policies").doc(leavePolicyId).update({
       ...policyBody
    });
    return {
        id: leavePolicy.id
      };
}

const deleteLeavePolicy = async (orgId,leavePolicyId)=>{
    const leavePolicy = await leavetrackerdb.collection("policies").doc(leavePolicyId).delete();
    return {
        id: leavePolicy.id
      };
}

module.exports = {
    createLeavePolicy,
    getLeavePolicies,
    getLeavePolicyById,
    updateLeavePolicy,
    deleteLeavePolicy
    
}