const { allowanceService } = require("../services");

const createAllowance = async (req, res) => {
  try {
    let allowanceObject = {};
    const orgId = req.user.orgId;
    const policyId = req.params.policyId;
    const name = req.body.name;
    const amount = parseInt(req.body.amount);
    const type = req.body.type; // this is leaveType from existing leaveTypes of the orgaization.
    const maxLimit = req.body.maxLimit;
    // implement maxLimitAmount and credit type in the future.
    if (maxLimit) {
      const maxLimitAmount = parseInt(req.body.maxLimitAmount);
      allowanceObject = {
        name,
        amount,
        type,
        maxLimit,
        maxLimitAmount,
        policyId,
        orgId
      };
    } else {
      allowanceObject = {
        name,
        amount,
        type,
        maxLimit: false,
        policyId,
        orgId
      };
    }
    console.log("dines", allowanceObject)
    const createdAllowance = await allowanceService.createAllowance(
      orgId,
      policyId,
      allowanceObject
    );
    res.status(200).json({
      message: "Allowance created successfully",
      allowance: createdAllowance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllowances = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const policyId = req.params.policyId;
    const allowances = await allowanceService.getAllowances(orgId, policyId);
    res.status(200).json({
      message: "Allowances fetched successfully",
      allowances,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllowanceById = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const policyId = req.params.policyId;
    const allowanceId = req.params.allowanceId;
    const allowance = await allowanceService.getAllowanceById(
      orgId,
      policyId,
      allowanceId
    );
    res.status(200).json({
      message: "Allowance fetched successfully",
      allowance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateAllowance = async (req, res) => {
  try {
    let allowanceObject = {};
    const orgId = req.user.orgId;
    const policyId = req.params.policyId;
    const allowanceId = req.params.allowanceId;
    const name = req.body.name;
    const amount = parseInt(req.body.amount);
    const type = req.body.type; // this is leaveType from existing leaveTypes of the orgaization.
    const maxLimit = req.body.maxLimit;
    // implement maxLimitAmount and credit type in the future.
    if (maxLimit) {
      const maxLimitAmount = parseInt(req.body.maxLimitAmount);
      allowanceObject = {
        name,
        amount,
        type,
        maxLimit,
        maxLimitAmount,
      };
    } else {
      allowanceObject = {
        name,
        amount,
        type,
        maxLimit: false,
      };
    }
    const updatedAllowance = await allowanceService.updateAllowance(
      orgId,
      policyId,
      allowanceId,
      allowanceObject
    );
    res.status(200).json({
      message: "Allowance updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteAllowance = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const policyId = req.params.policyId;
    const allowanceId = req.params.allowanceId;
    const deletedAllowance = await allowanceService.deleteAllowance(
      orgId,
      policyId,
      allowanceId
    );
    res.status(200).json({
      message: "Allowance deleted successfully",
      allowance: deletedAllowance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllowanceDataForDropDown = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const policyId = req.params.policyId;
    const allowanceData = await allowanceService.getAllowances(orgId, policyId);

    let forMattedData = [];

    allowanceData.forEach((element) => {
      let obj = {
        label: element.name,
        value: element.id,
      };
      forMattedData.push(obj);
    });

    res.status(200).json({
      data: forMattedData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createAllowance,
  getAllowances,
  getAllowanceById,
  updateAllowance,
  deleteAllowance,
  getAllowanceDataForDropDown,
};
