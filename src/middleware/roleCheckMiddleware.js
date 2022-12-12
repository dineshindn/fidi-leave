const { roleRights } = require('../config/roles');
const roleCheckMiddleware = (...requiredRights) => async (req, res, next) => {
  if (requiredRights.length) {
    const userRights = roleRights.get(req.user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights) {
      res.status(403).json({
        message: 'You are not authorized to perform this action',
      });
    }else{
      next();
    }
  }
}

module.exports = roleCheckMiddleware;