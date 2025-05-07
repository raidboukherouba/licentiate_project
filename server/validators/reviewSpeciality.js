const Joi = require('joi');

// Joi validation schemas
const reviewSpecialitySchema = (req) => Joi.object({
    spec_name_review: Joi.string().trim().max(100).required()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const reviewSpecialityIdSchema = Joi.number().integer().positive().required();

module.exports = { reviewSpecialitySchema, reviewSpecialityIdSchema };