const router = require('express').Router(); 
const passport = require('passport');
const auth = require('../utils/auth');
auth.jwtv(passport)

const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");

router.use('/users', passport.authenticate('jwt',{session:false}), require('./users/index'));
router.use('/orgs', passport.authenticate('jwt',{session:false}),require('./orgs.route'));
router.use('/leaves', passport.authenticate('jwt',{session:false}),require('./leave.route'));
router.use('/dashboard',passport.authenticate('jwt',{session:false}),require('./dashboard.route'));
router.use('/auth', require('./auth.route'));
router.use('/tokens',require('./token.route'));
router.use('/leavetypes', passport.authenticate('jwt',{session:false}),require('./leavetypes.route'));
router.use('/policies', passport.authenticate('jwt',{session:false}),require('./policies.route'));
module.exports = router;