const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config/config');
const jwtv = function (passport) {
     let opts = {};
    opts.jwtFromRequest =  ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.JWT_AT_SECRET;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
         return done(null, jwt_payload);
    }));
};
module.exports = {
    jwtv,
  }