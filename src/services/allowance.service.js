const firebasedb = require("../utils/firebasedb");
const createAllowance = async (orgId,policyId,allowanceObject) => {
    console.log("allowanceObject", allowanceObject)
    const createAllowance = await firebasedb.collection("allowances").add(allowanceObject);
    return {
        id: createAllowance.id,
    }

}

const getAllowances = async (orgId,policyId) => {
    const allowances = await firebasedb.collection("allowances").where('policyId' , '==', policyId).get();
    const allowancesArray = [];
    allowances.forEach((doc) => {
        allowancesArray.push({
            id: doc.id,
            allowanceId: doc.id,
            ...doc.data(),
        });
    });
    return allowancesArray;
}

const getAllowanceById = async (orgId,policyId,allowanceId) => {
    const allowance = await firebasedb.collection("allowances").doc(allowanceId).get();
    if (!allowance.exists) {
        throw new Error("Allowance does not exist");
    }
    return {
        id: allowance.id,
        ...allowance.data(),
    }
}

const updateAllowance = async (orgId,policyId,allowanceId,allowanceObject) => {
    const allowance = await firebasedb.collection("allowances").doc(allowanceId).get();
    if (!allowance.exists) {
        throw new Error("Allowance does not exist");
    }
    const updatedAllowance = await firebasedb.collection("allowances").doc(allowanceId).update(allowanceObject);
    return {
        id: updatedAllowance.id,
    }
}

const deleteAllowance = async (orgId,policyId,allowanceId) => {
    const allowance = await firebasedb.collection("allowances").doc(allowanceId).get();
    if (!allowance.exists) {
        throw new Error("Allowance does not exist");
    }
    await firebasedb.collection("allowances").doc(allowanceId).delete();
    return {
        id: allowanceId,
    }
}

const createMultipleAllowances = async (orgId,policyId,allowanceObjects) => {
    let createAllowances = [];
    for (obj of allowanceObjects) {
        delete obj.id;
        obj["orgId"]= orgId;
        obj["policyId"]= policyId;
        const createAllowance = await firebasedb.collection("allowances").add(obj);
        createAllowances.push({
            id: createAllowance.id,
        });
    }
    return createAllowances;
}

const deleteMultipleAllowances = async (orgId,policyId) => {

    const allowances = await firebasedb.collection("allowances").where("policyId", "==", policyId).get();
    const allowancesArray = [];
    allowances.forEach((doc) => {
        allowancesArray.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    for (a of allowancesArray) {
        await firebasedb.collection("allowances").doc(a.id).delete();
    }
    return {
        id: policyId,
    }
}

module.exports = {
    createAllowance,
    getAllowances,
    getAllowanceById,
    updateAllowance,
    deleteAllowance,
    createMultipleAllowances,
    deleteMultipleAllowances,
}