const Joi = require('joi');

// Validation schema for Communication
const communicationSchema = (req) => Joi.object({
    title_comm: Joi.string().trim().max(150).required(),
    event_title: Joi.string().trim().max(150).required(),
    year_comm: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    url_comm: Joi.string().trim().max(250).uri({ scheme: ["http", "https"] }).allow(null, ''),
    type_id: Joi.number().integer().positive().required(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const communicationIdSchema = Joi.number().integer().positive().required();

module.exports = { communicationSchema, communicationIdSchema };