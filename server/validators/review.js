const Joi = require('joi');

// Validation schema for review
const reviewSchema = (req) => Joi.object({
    review_title: Joi.string().trim().max(200).required(),
    issn: Joi.string().trim().length(9).pattern(/^\d{4}-\d{3}[\dX]$/).required(),
    e_issn: Joi.string().trim().length(9).pattern(/^\d{4}-\d{3}[\dX]$/).empty("").default(null),
    review_vol: Joi.string().trim().max(20).empty("").default(null),
    publisher_id: Joi.number().integer().positive().required()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const reviewIdSchema = Joi.number().integer().positive().required();

module.exports = { reviewSchema, reviewIdSchema };