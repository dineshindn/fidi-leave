const router = require('express').Router();
const leaveController = require('../controllers/leaves.controller');
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");

router.post('/', leaveController.createLeave);
router.get('/', leaveController.getLeaves); // get all leaves by status
router.get('/:id', leaveController.getLeaveById);
router.put('/approve/:id',roleCheckMiddleware("rejectLeave"), leaveController.approveLeave);
router.put('/reject/:id',roleCheckMiddleware("rejectLeave"), leaveController.rejectLeave);
router.delete('/:id', leaveController.deleteLeave);
module.exports = router;