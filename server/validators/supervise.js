const Joi = require('joi');

// Validation schema for supervise
const superviseSchema = (req) => Joi.object({
    res_code: Joi.number().integer().positive().required(),
    reg_num: Joi.number().integer().min(100000000000).max(999999999999).required(),
    super_start_date: Joi.date().iso().required(),
    super_end_date: Joi.date().iso().allow(null).optional(),
    super_theme: Joi.string().trim().max(250).required(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Validation schema for updating a supervise entry (prevent res_code & reg_num updates)
const updateSuperviseSchema = (req) => Joi.object({
    super_start_date: Joi.date().iso().required(),
    super_end_date: Joi.date().iso().allow(null).optional(),
    super_theme: Joi.string().trim().max(250).required(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Validation schema for supervise ID (composite key: res_code and reg_num)
const superviseIdSchema = Joi.object({
    res_code: Joi.number().integer().positive().required(),
    reg_num: Joi.number().integer().min(100000000000).max(999999999999).required(),
});

module.exports = { superviseSchema, updateSuperviseSchema, superviseIdSchema };