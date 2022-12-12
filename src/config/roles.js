var applicant = ["createLeave", "updateLeave", "getLeave"];
var approver = ["approveLeave", "rejectLeave"];
applicant.push.apply(applicant, ["deleteLeave"]);
approver.push.apply(approver, applicant);
var admin = [
  "createTeam",
  "updateTeam",
  "getTeam",
  "deleteTeam",
  "setUserLeavebalance",
  "updateUser",
  "deleteUser",
  "updateOrg",
  "crudLeaveType",
  "crudLeavePolicy",
  "crudLeaveAllowance"
];
admin.push.apply(admin, approver);
const allRoles = {
  user: applicant,
  approver: approver,
  admin: admin,
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));
module.exports = {
  roles,
  roleRights,
};
