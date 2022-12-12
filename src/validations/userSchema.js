const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  orgId: Joi.string(),
});

const createUserSchema = userSchema.keys({
    name: Joi.required(),
    email: Joi.required(),
    orgId: Joi.optional(),
});
module.exports = {
    createUserSchema
};