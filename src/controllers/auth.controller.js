const { authService, tokenService, userService } = require("../services");
const { userSchema } = require("../validations");
const login = async (req, res) => {
  try {
    const user = await authService.login(req.body.email);
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    const tokens = tokenService.createTokens(user.id, user.orgId, user.role,user.name);
    res.status(200).json({
      user,
      tokens,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const { body } = req;
    const { error } = userSchema.createUserSchema.validate(body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const user = await userService.createUser(body);
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    const tokens = tokenService.createTokens(user.id, user.orgId, user.role,user.name);
    if(user.role === "admin"){
      res.status(200).json({
        user,
        tokens,
        orgUpdate: true,
      });
    }else{
    res.status(200).json({
      user,
      tokens,
    });
  }
  } catch (err) {    const Json = JSON.parse(err.message);
    res.status(500).json({
      ...Json,
    });
  }
};

module.exports = {
  login,
  register,
};
