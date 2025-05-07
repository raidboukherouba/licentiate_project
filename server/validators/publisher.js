const Joi = require('joi');

// Validation schema for publisher
const publisherSchema = (req) => Joi.object({
    publisher_name: Joi.string().trim().max(50).required(),
    country: Joi.string().trim().max(50).empty("").default(null)
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const publisherIdSchema = Joi.number().integer().positive().required();

module.exports = { publisherSchema, publisherIdSchema };