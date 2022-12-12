const router = require('express').Router();
const orgController = require('../controllers/orgs.controller');
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");

router.get('/', orgController.getUsersbyOrgId);
router.patch('/',roleCheckMiddleware("updateOrg") ,orgController.updateOrg);
router.get('/:orgId', orgController.getOrgbyId);

module.exports = router;