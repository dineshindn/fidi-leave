const router = require("express").Router({
  mergeParams: true,
});

const allowanceController = require("../controllers/allowance.controller.js");

router.get("/add", allowanceController.getAllowanceDataForDropDown);
router.post("/", allowanceController.createAllowance);
router.get("/", allowanceController.getAllowances);
router.get("/:allowanceId", allowanceController.getAllowanceById);
router.patch("/:allowanceId", allowanceController.updateAllowance);
router.delete("/:allowanceId", allowanceController.deleteAllowance);

module.exports = router;
