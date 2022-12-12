const router = require('express').Router();
const allowanceRoute = require('../router/allowance.route')
const policiesController = require('../controllers/policies.controller.js');
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");

router.post('/', policiesController.createPolicy);
router.get('/', policiesController.getPolicies);
router.get('/:id', policiesController.getPolicyById);
router.patch('/:id', policiesController.updatePolicy);
router.delete('/:id', policiesController.deletePolicy);

router.use('/:policyId/allowances', allowanceRoute);
module.exports = router;