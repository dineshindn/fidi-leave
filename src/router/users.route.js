const router = require("express").Router();
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const { userController } = require("../controllers");
router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.patch("/:id/allowance", roleCheckMiddleware('setUserLeavebalance'),userController.setUserLeaveBalance);
router.patch("/:id", roleCheckMiddleware('updateUser'),userController.updateUser);
router.delete("/:id", roleCheckMiddleware('deleteUser'),userController.deleteUser);
router.use('/:userId/allowances', require('./uallowance.route'));

module.exports = router;
