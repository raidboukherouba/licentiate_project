const Joi = require('joi');

// Joi validation schemas
const productionTypeSchema = (req) => Joi.object({
    type_name: Joi.string().trim().max(100).required()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const productionTypeIdSchema = Joi.number().integer().positive().required();

module.exports = { productionTypeSchema, productionTypeIdSchema };