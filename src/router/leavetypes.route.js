const router = require('express').Router();

const leaveTypeController = require('../controllers/leavetypes.controller.js');
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");

router.get('/add',leaveTypeController.getleaveTypeDataForDropDown);
router.post('/',  leaveTypeController.createLeaveType);
router.get('/', leaveTypeController.getLeaveTypes);
router.get('/:id', leaveTypeController.getLeaveTypeById);
router.patch('/:id', leaveTypeController.updateLeaveType);
router.delete('/:id', leaveTypeController.deleteLeaveType);

module.exports = router;