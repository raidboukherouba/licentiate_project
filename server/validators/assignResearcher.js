const Joi = require('joi');

// Validation schema for assigning a researcher
const assignResearcherSchema = (req) => Joi.object({
    res_code: Joi.number().integer().positive().required(),
    inventory_num: Joi.string().trim().max(50).required(),
    res_assign_date: Joi.date().iso().required(),
    res_return_date: Joi.date().iso().allow(null).optional(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Validation schema for updating an assignment (prevent res_code & inventory_num updates)
const updateAssignResearcherSchema = (req) => Joi.object({
    res_assign_date: Joi.date().iso().required(),
    res_return_date: Joi.date().iso().allow(null).optional(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Validation schema for assignment ID (composite key: res_code and inventory_num)
const assignResearcherIdSchema = Joi.object({
    res_code: Joi.number().integer().positive().required(),
    inventory_num: Joi.string().trim().max(50).required(),
});

module.exports = { assignResearcherSchema, updateAssignResearcherSchema, assignResearcherIdSchema };
