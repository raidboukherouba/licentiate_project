const Joi = require('joi');

// Validation schema for assigning a speciality to a review
const hasSpecialitySchema = (req) => Joi.object({
    review_num: Joi.number().integer().positive().required(),
    spec_id_review: Joi.number().integer().positive().required(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Validation schema for assignment ID (composite key: review_num and spec_id_review)
const hasSpecialityIdSchema = Joi.object({
    review_num: Joi.number().integer().positive().required(),
    spec_id_review: Joi.number().integer().positive().required(),
});

module.exports = { hasSpecialitySchema, hasSpecialityIdSchema };
