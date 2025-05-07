const Joi = require('joi');

// Joi validation schemas
const categorySchema = (req) => Joi.object({
    cat_name: Joi.string().trim().max(100).required()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const categoryIdSchema = Joi.number().integer().positive().required();

module.exports = { categorySchema, categoryIdSchema };