const Joi = require('joi');

// Validation schema for assigning a category to a review
const hasCategorySchema = (req) => Joi.object({
    review_num: Joi.number().integer().positive().required(),
    cat_id: Joi.number().integer().positive().required(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Validation schema for assignment ID (composite key: review_num and cat_id)
const hasCategoryIdSchema = Joi.object({
    review_num: Joi.number().integer().positive().required(),
    cat_id: Joi.number().integer().positive().required(),
});

module.exports = { hasCategorySchema, hasCategoryIdSchema };
