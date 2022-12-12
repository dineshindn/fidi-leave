const router = require('express').Router();
const {dashboardController} = require('../controllers');

router.get('/', dashboardController.getDashboard);

module.exports = router;