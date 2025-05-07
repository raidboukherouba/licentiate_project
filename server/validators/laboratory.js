const Joi = require('joi');

// Validation schema for laboratory
const laboratorySchema = (req) => Joi.object({
    lab_name: Joi.string().trim().max(250).required(),
    lab_abbr: Joi.string().trim().max(20).empty("").default(null),
    lab_desc: Joi.string().trim().empty("").default(null),
    lab_address: Joi.string().trim().max(250).empty("").default(null),
    lab_phone: Joi.string().trim().pattern(/^0\d{8}$/).empty("").default(null),
    faculty_id: Joi.number().integer().positive().required(),
    domain_id: Joi.number().integer().positive().required(),
    dept_id: Joi.number().integer().positive().required()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const laboratoryIdSchema = Joi.number().integer().positive().required();

module.exports = { laboratorySchema, laboratoryIdSchema };