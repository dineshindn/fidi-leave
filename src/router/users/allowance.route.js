const router = require("express").Router({
  mergeParams: true,
});

const uallowanceController = require("../../controllers/uallowance.controller.js");

router.post("/", uallowanceController.createAllowance);
router.get("/", uallowanceController.getAllowances);
router.get("/:allowanceId", uallowanceController.getAllowanceById);
router.patch("/:allowanceId", uallowanceController.updateAllowance);
router.delete("/:allowanceId", uallowanceController.deleteAllowance);

module.exports = router;
