const Joi = require('joi');

// Joi validation schemas
const functionSchema = (req) => Joi.object({
    func_name: Joi.string().trim().max(100).required()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const functionIdSchema = Joi.number().integer().positive().required();

module.exports = { functionSchema, functionIdSchema };