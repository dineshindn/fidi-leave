const {
  leaveService,
  userService,
  orgService,
  uallowanceService,
} = require("../services");
const { leaveSchema } = require("../validations");
const firestore = require("firebase-admin").firestore;

function getDates(start, end) {
  let startDate = new Date(start);
  let endDate = new Date(end);
  let dates = [],
    currentDate = startDate,
    addDays = function (days) {
      let date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  // return formatted dates array yyyy-mm-dd e.g. 2022-10-01
  return dates.map((date) => date.toISOString().split("T")[0]);
}

function powerset(arr) {
  return arr
    .reduce((a, v) => a.concat(a.map((r) => [v].concat(r))), [[]])
    .filter((item) => item.length > 0)
    .map((item) => item.join(","));
}

const createLeave = async (req, res) => {
  try {
    const leaveReq = {
      ...req.body,
      userId: req.user.userId,
      orgId: req.user.orgId,
      status: "pending",
      username: req.user.name,
      useremail: await userService.getUserSpecificData(
        req.user.userId,
        "email"
      ),
      orgName: await orgService.getOrgSpecificData(req.user.orgId, "orgName"),
      sd: firestore.Timestamp.fromDate(new Date(req.body.startDate)),
      ed: firestore.Timestamp.fromDate(new Date(req.body.endDate)),
      dates: powerset(getDates(req.body.startDate, req.body.endDate)),
      type: await uallowanceService.getAllowanceSpecificData(req.user.userId, req.body.allowanceId, "type"),
    };
    const leaveAllowance = await uallowanceService.getAllowanceById(
      req.user.userId,
      leaveReq.allowanceId
    );
    if (leaveAllowance.remaining < leaveReq.days) {
      throw new Error("you dont have enough leave allowance for this leave");
    }
    if (leaveAllowance.maxLimit) {
      if (leaveReq.days > leaveAllowance.maxLimitAmount) {
        throw new Error(
          "you have exceeded the maximum allowed leave for this leave type"
        );
      }
    }
    const leaveExist = await leaveService.checkIfleaveExists(
      leaveReq.startDate,
      leaveReq.endDate,
      req.user.userId
    );
    if (leaveExist) {
      throw new Error(
        `Leave already exists for this date Range with status pending or approved`
      );
    }
    //check if leave allowance is available for the specified type
    const leave = await leaveService.createLeave(leaveReq);
    return res.status(201).json({
      message: "Leave created successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getLeaves = async (req, res) => {
  try {
    let leaveReqCount;
    if (req.query.ids) {
      let leaves = [];
      const idsString = req.query.ids;
      const ids = idsString.split(",");

      //wait for all leaves to be fetched
      await Promise.all(
        ids.map(async (id) => {
          const leave = await leaveService.getLeaveById(id);
          leaves.push(leave);
        })
      );
      res.json({
        message: "Leaves fetched successfully for the given ids",
        leaves,
      });
    } else {
      let leaves = [];
      const { status } = req.query;
      if (status) {
        const { error } = leaveSchema.getleaves.validate(status);
        if (error) {
          return res.status(400).json({
            message: error.details[0].message,
          });
        }
      }
      const orgId = req.user.orgId;
      const role = req.user.role;

      if (role === "admin") {
        leaves = await leaveService.getLeaves(status, orgId);
      } else {
        leaves = await leaveService.getLeaves(status, orgId, req.user.userId);
        leaveReqCount = await leaveService.getUserLeaveRequestCount(
          req.user.userId
        );
      }
      return res.status(200).json({
        message: "Leaves fetched successfully",
        leaves,
        leaveReqCount,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const approveLeave = async (req, res) => {
  try {
    // change status to approved
    // add approverId
    const id = req.params.id;
    const leave = await leaveService.getLeaveById(id);
    const updatedleaveReq = {
      ...leave,
      status: "approved",
      approverId: req.user.userId,
      approverEmail: await userService.getUserSpecificData(
        req.user.userId,
        "email"
      ),
    };
    const updatedLeave = await leaveService.updateLeave(id, updatedleaveReq);
    if (!updatedLeave) {
      return res.status(500).json({
        message: "Error updating leave",
      });
    }
    return res.status(200).json({
      message: "Leave approved successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
/**
 * @description - reject leave request
 * @param {object} req - request object
 * @param {object} res - response object
 */

const rejectLeave = async (req, res) => {
  try {
    // change status to rejected
    // add approverId
    const id = req.params.id;
    const leave = await leaveService.getLeaveById(id);
    const updatedleaveReq = {
      approverId: req.user.userId,
      ...leave,
      status: "rejected",
    };
    const updatedLeave = await leaveService.updateLeave(id, updatedleaveReq);
    if (!updatedLeave) {
      return res.status(500).json({
        message: "Error updating leave",
      });
    }
    return res.status(200).json({
      message: "Leave rejected successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLeave = await leaveService.deleteLeaveRequest(id);
    if (!deletedLeave) {
      return res.status(500).json({
        message: "Error deleting leave",
      });
    }
    return res.status(200).json({
      message: "Leave deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getLeaveById = async (req, res) => {
  try {
    const id = req.params.id;
    const leave = await leaveService.getLeaveById(id);
    if (!leave) {
      return res.status(404).json({
        message: "Leave not found",
      });
    }
    return res.status(200).json({
      message: "Leave fetched successfully",
      leave,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getLeavesByIds = async (req, res) => {
  try {
    const ids = req.query.ids;
    res.json({
      message: "Leaves fetched successfully",
      ids,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createLeave,
  getLeaves,
  approveLeave,
  rejectLeave,
  deleteLeave,
  getLeaveById,
  getLeavesByIds,
};
