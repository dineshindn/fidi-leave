const { policiesService, allowanceService } = require("../services");

const createPolicy = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const startMonth = req.body.startMonth;
    const endMonth = req.body.endMonth;
    const name = req.body.name;
    const description = req.body.description;
    const allowances = req.body.allowances;
    if (!allowances) {
      const policy = await policiesService.createLeavePolicy(
        startMonth,
        endMonth,
        name,
        description,
        orgId
      );
      res.status(201).send(policy);
    }
    const policyId = await policiesService.createLeavePolicy(
      startMonth,
      endMonth,
      name,
      description,
      orgId
    );
    if (policyId) {
      await allowanceService.createMultipleAllowances(
        orgId,
        policyId.id,
        allowances
      );
    }
    res.status(201).send(policyId);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getPolicies = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const policies = await policiesService.getLeavePolicies(orgId);
    res.status(200).send(policies);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getPolicyById = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const policyId = req.params.id;
    const policy = await policiesService.getLeavePolicyById(orgId, policyId);
    res.status(200).send(policy);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updatePolicy = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const policyId = req.params.id;
   const pallowances = req.body.allowances;
    let pbody = req.body;
    delete pbody.allowances;
    let policy;
    if(pallowances){
      policy = await policiesService.getLeavePolicyById(orgId, policyId);
      await allowanceService.deleteMultipleAllowances(orgId, policyId);
      await allowanceService.createMultipleAllowances(
        orgId,
        policyId,
        pallowances
      );
    }

    if (pbody) {
        policy = await policiesService.updateLeavePolicy(
        orgId,
        policyId,
        pbody
      );
    }
     res.status(200).send({
     message:"Policy Updated Successfully"
     });

  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deletePolicy = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const policyId = req.params.id;
    const policy = await policiesService.deleteLeavePolicy(orgId, policyId);
    res.status(200).send(policy);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  createPolicy,
  getPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy,
};
