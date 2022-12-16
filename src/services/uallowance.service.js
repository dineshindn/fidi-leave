const firebasedb = require("../utils/firebasedb");
const createAllowance = async (userId,allowanceObject) => {

    const createAllowance = await firebasedb.collection("users").doc(userId).collection("allowances").add(allowanceObject);
    return {
        id: createAllowance.id,
    }

}

const getAllowances = async (userId) => {
    const allowances = await firebasedb.collection("users").doc(userId).collection("allowances").get();
    const allowancesArray = [];
    allowances.forEach((doc) => {
        allowancesArray.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    return allowancesArray;
}

const getAllowanceById = async (userId,allowanceId) => {
    
    const allowance = await firebasedb.collection("users").doc(userId).collection("allowances").doc(allowanceId).get();
    if (!allowance.exists) {
        throw new Error("Allowance does not exist");
    }
    return {
        id: allowance.id,
        ...allowance.data(),
    }

}

const updateAllowance = async (userId,allowanceId,editedAllowanceObject) => {
    const allowance = await firebasedb.collection("users").doc(userId).collection("allowances").doc(allowanceId).get();
    if (!allowance.exists) {
        throw new Error("Allowance does not exist");
    }
    await firebasedb.collection("users").doc(userId).collection("allowances").doc(allowanceId).update(editedAllowanceObject);
    return {
        id: allowanceId,
    }
}

const deleteAllowance = async (userId,allowanceId) => {
    const allowance = await firebasedb.collection("users").doc(userId).collection("allowances").doc(allowanceId).get();
    if (!allowance.exists) {
        throw new Error("Allowance does not exist");
    }
    await firebasedb.collection("users").doc(userId).collection("allowances").doc(allowanceId).delete();
    return {
        id: allowanceId,
    }
}

// const createMultipleAllowances = async (orgId,policyId,allowanceObjects) => {
//     let createAllowances = [];
//     for (obj of allowanceObjects) {
//         delete obj.id;
//         const createAllowance = await firebasedb.collection("orgs").doc(orgId).collection("policies").doc(policyId).collection("allowances").add(obj);
//         createAllowances.push({
//             id: createAllowance.id,
//         });
//     }
//     return createAllowances;
// }

// const deleteMultipleAllowances = async (orgId,policyId) => {

//     const allowances = await firebasedb.collection("orgs").doc(orgId).collection("policies").doc(policyId).collection("allowances").get();
//     const allowancesArray = [];
//     allowances.forEach((doc) => {
//         allowancesArray.push({
//             id: doc.id,
//             ...doc.data(),
//         });
//     });
//     for (a of allowancesArray) {
//         await firebasedb.collection("orgs").doc(orgId).collection("policies").doc(policyId).collection("allowances").doc(a.id).delete();
//     }
//     return {
//         id: policyId,
//     }
// }

const getAllowanceSpecificData = async (userId, allowanceId,key) => {
    const allowance = await firebasedb.collection("users").doc(userId).collection("allowances").doc(allowanceId).get();
    if (!allowance.exists) {
        throw new Error("Allowance does not exist");
    }
    const allowanceData = {
        id: allowance.id,
        ...allowance.data(),
    }
    return allowanceData[key];
}
module.exports = {
    createAllowance,
    getAllowances,
    getAllowanceById,
    updateAllowance,
    deleteAllowance,
    // createMultipleAllowances,
    // deleteMultipleAllowances,
    getAllowanceSpecificData,
}