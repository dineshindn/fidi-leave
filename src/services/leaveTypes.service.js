const leavetrackerdb = require("../utils/firebasedb");
const admin = require("firebase-admin");

const createLeaveType = async (label,value,description,color,orgId)=>{


    const createdLeaveType = await leavetrackerdb.collection("leavetypes").add({
        label:label,
        value:value,
        description:description,
        color:color,
        orgId: orgId
    })
        return {
        id: createdLeaveType.id,
    }

}

const getLeaveTypes = async (orgId)=>{
    const leaveTypes = await leavetrackerdb.collection("leavetypes").where("orgId", "==", orgId).get();
    return leaveTypes.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
}

const getLeaveTypeById = async (orgId,leaveTypeId)=>{
    const leaveType = await leavetrackerdb.collection("leavetypes").where("orgId", "==", orgId).doc(leaveTypeId).get();
    return {
        id: leaveType.id,
        ...leaveType.data(),
      };
}

const updateLeaveType = async (orgId,leaveTypeId,label,value,description,color)=>{
    const leaveType = await leavetrackerdb.collection("leavetypes").where("orgId", "==", orgId).doc(leaveTypeId).update({
        label:label,
        value:value,
        description:description,
        color:color
    });
    return {
        id: leaveType.id
      };
}

const deleteLeaveType = async (orgId,leaveTypeId)=>{
    const leaveType = await leavetrackerdb.collection("leavetypes").where("orgId", "==", orgId).doc(leaveTypeId).delete();
    return {
        id: leaveType.id
      };
}
module.exports = {
    createLeaveType,
    getLeaveTypes,
    getLeaveTypeById,
    updateLeaveType,
    deleteLeaveType
}