const Joi = require("joi");

const leaveSchema = Joi.object({
    username: Joi.string().required(),
    leaveId: Joi.string(),
    userId: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    status: Joi.string(),
    approverId: Joi.string(),
    approverComment: Joi.string(),
    reason: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    orgId: Joi.string(),
    type: Joi.string().valid("cos", "gen"),
    days: Joi.number().integer().less(3).greater(0),
    status: Joi.string().valid("pending", "approved", "rejected"),
});
const createLeaveSchema = leaveSchema.required();

// const createLeaveSchema = leaveSchema.keys({
//     userId: Joi.required(),
//     startDate: Joi.required(),
//     endDate: Joi.required(),
//     reason: Joi.required(),
//     orgId: Joi.required(),
//     type: Joi.required(),
//     days: Joi.required(),
// });

const getleaves = Joi.string().valid("pending", "approved", "rejected");

module.exports = {
    createLeaveSchema,
    getleaves
}
