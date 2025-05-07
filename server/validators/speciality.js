const Joi = require('joi');

// Joi validation schemas
const specialitySchema = (req) => Joi.object({
    spec_name: Joi.string().trim().max(100).required()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const specialityIdSchema = Joi.number().integer().positive().required();

module.exports = { specialitySchema, specialityIdSchema };