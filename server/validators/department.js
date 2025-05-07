const Joi = require('joi');

// Joi validation schemas
const departmentSchema = (req) => Joi.object({
    dept_name: Joi.string().trim().max(100).required()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const departmentIdSchema = Joi.number().integer().positive().required();

module.exports = { departmentSchema, departmentIdSchema };