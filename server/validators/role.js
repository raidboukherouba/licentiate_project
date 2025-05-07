const Joi = require('joi');

// Joi validation schemas for Role
const roleSchema = (req) => Joi.object({
    role_name: Joi.string().trim().max(100).required()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

const roleIdSchema = Joi.number().integer().positive().required();

module.exports = { roleSchema, roleIdSchema };