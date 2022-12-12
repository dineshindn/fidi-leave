const { uallowanceService } = require("../services");

const createAllowance = async (req, res) => {
  try {
    let allowanceObject = {};
    const userId = req.params.userId;
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
        used: 0,
        remaining: amount,
        userId: userId
      };
    } else {
      allowanceObject = {
        name,
        amount,
        type,
        used: 0,
        remaining: amount,
        maxLimit: false,
        userId: userId
      };
    }
    const createdAllowance = await uallowanceService.createAllowance(userId, allowanceObject);
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

    const userId = req.params.userId;


    const allowances = await uallowanceService.getAllowances(userId);
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
    const userId = req.params.userId;

    const allowanceId = req.params.allowanceId;
    const allowance = await uallowanceService.getAllowanceById(userId, allowanceId);
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
    const userId = req.params.userId;

    const allowanceId = req.params.allowanceId;
    const name = req.body.name;
    const amount = req.body.amount;
    const type = req.body.type; // this is leaveType from existing leaveTypes of the orgaization.
    const maxLimit = req.body.maxLimit;
    // implement maxLimitAmount and credit type in the future.
    if (maxLimit) {
      const maxLimitAmount = req.body.maxLimitAmount;
      allowanceObject = {
        name,
        amount,
        type,
        maxLimit,
        maxLimitAmount,
        used: 0,
        remaining: amount,
      };
    } else {
      allowanceObject = {
        name,
        amount,
        type,
        maxLimit: false,
        used: 0,
        remaining: amount,
      };
    }
    const updatedAllowance = await uallowanceService.updateAllowance(userId,allowanceId,allowanceObject);
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
    const userId = req.params.userId;

    const allowanceId = req.params.allowanceId;
    const deletedAllowance = await uallowanceService.deleteAllowance(userId,allowanceId);
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
module.exports = {
  createAllowance,
  getAllowances,
  getAllowanceById,
  updateAllowance,
  deleteAllowance,
};
