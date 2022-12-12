const router = require('express').Router();
const {tokenController} = require('../controllers');
router.post('/rt', tokenController.rt);
module.exports = router;