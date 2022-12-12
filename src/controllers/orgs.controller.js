const { orgService } = require("../services");

const getUsersbyOrgId = async (req, res) => {
  try {
    const users = await orgService.getUsersbyOrgId(req.user.orgId);
    if (!users) {
      return res.status(404).json({
        message: "Users not found",
      });
    }
    return res.status(200).json({
      message: "Users found",
      users,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateOrg = async (req, res) => {
  try {
    const org = await orgService.updateOrg(req.user.orgId, req.body);
    if(org){
      return res.status(200).json({
        message: "Organisation updated successfully",
      });
    }else{
      return res.status(404).json({
        message: "Organisation not updated",
      });
    }

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

const getOrgbyId = async (req, res) => {
  try {
    const org = await orgService.getOrgById(req.params.orgId);
    if (!org) {
      return res.status(404).json({
        message: "Organisation not found",
      });
    }
    return res.status(200).json({
      message: "Organisation found",
      org,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
module.exports = {
  getUsersbyOrgId,
  updateOrg,
  getOrgbyId
  
};
