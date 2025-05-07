const Joi = require('joi');

// Validation schema for Publication
const publicationSchema = (req) => Joi.object({
    doi: Joi.string().trim().max(50).pattern(/^(https:\/\/doi\.org\/)?10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/),
    article_title: Joi.string().trim().max(200).required(),
    submission_date: Joi.date().required(),
    acceptance_date: Joi.date().required(),
    pub_pages: Joi.string().trim().max(10).allow(null, ''),
    review_num: Joi.number().integer().positive().required(),
    type_id: Joi.number().integer().positive().required()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const doiSchema = Joi.string().trim().max(50).required();

module.exports = { publicationSchema, doiSchema };