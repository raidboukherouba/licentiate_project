const Joi = require('joi');

// Validation schema for assigning a doctoral student
const assignDoctoralStudentSchema = (req) => Joi.object({
    reg_num: Joi.number().integer().min(100000000000).max(999999999999).required(),
    inventory_num: Joi.string().trim().max(50).required(),
    doc_stud_assign_date: Joi.date().iso().required(),
    doc_stud_return_date: Joi.date().iso().allow(null).optional(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Validation schema for updating an assignment (prevent reg_num & inventory_num updates)
const updateAssignDoctoralStudentSchema = (req) => Joi.object({
    doc_stud_assign_date: Joi.date().iso().required(),
    doc_stud_return_date: Joi.date().iso().allow(null).optional(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Validation schema for assignment ID (composite key: reg_num and inventory_num)
const assignDoctoralStudentIdSchema = Joi.object({
    reg_num: Joi.number().integer().min(100000000000).max(999999999999).required(),
    inventory_num: Joi.string().trim().max(50).required(),
});

module.exports = { assignDoctoralStudentSchema, updateAssignDoctoralStudentSchema, assignDoctoralStudentIdSchema };
