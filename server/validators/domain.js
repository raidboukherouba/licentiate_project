const Joi = require('joi');

// Validation schema for domain
const domainSchema = (req) => Joi.object({
    domain_name: Joi.string().trim().max(200).required(),
    domain_abbr: Joi.string().trim().max(20).empty("").default(null),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const domainIdSchema = Joi.number().integer().positive().required();

module.exports = { domainSchema, domainIdSchema };