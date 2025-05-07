const Joi = require('joi');

// Joi validation schemas
const facultySchema = (req) => Joi.object({
    faculty_name: Joi.string().trim().max(250).required()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const facultyIdSchema = Joi.number().integer().positive().required();

module.exports = { facultySchema, facultyIdSchema };