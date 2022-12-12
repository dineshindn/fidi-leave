const jwt = require("jsonwebtoken");
const config = require("../config/config");
const createAccessToken = (userId, orgId, role, name) => {
  return jwt.sign(
    {
      userId,
      orgId,
      role,
      name,
    },
    config.JWT_AT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
const createRefreshToken = (userId, orgId, role, name) => {
  return jwt.sign(
    {
      userId,
      orgId,
      role,
      name,
    },
    config.JWT_AT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};
const createTokens = (userId, orgId, role, name) => {
  return {
    accessToken: createAccessToken(userId, orgId, role, name),
    refreshToken: createRefreshToken(userId, orgId, role, name),
  };
};

const createAccessTokenFromRefreshToken = (refreshToken) => {
  const { userId, orgId, role, name } = jwt.verify(
    refreshToken,
    config.JWT_RT_SECRET
  );
  return createAccessToken(userId, orgId, role, name);
};
module.exports = {
  createTokens,
  createAccessTokenFromRefreshToken,
};
