const Joi = require("joi");

const organisationSchema = Joi.object({
  orgId: Joi.string(),
  orgName: Joi.string(),
  orgDescription: Joi.string(),
  userIds: Joi.array().items(Joi.string()),
  adminIds: Joi.array().items(Joi.string()),
});

module.exports = organisationSchema;
 