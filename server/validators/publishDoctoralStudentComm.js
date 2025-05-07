const Joi = require('joi');

// Validation schema for associating a doctoral student with a communication
const publishDoctoralStudentCommSchema = (req) => Joi.object({
    reg_num: Joi.number().integer().min(100000000000).max(999999999999).required(),
    id_comm: Joi.number().integer().positive().required(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Validation schema for publication ID (composite key: reg_num and id_comm)
const publishDoctoralStudentCommIdSchema = Joi.object({
    reg_num: Joi.number().integer().min(100000000000).max(999999999999).required(),
    id_comm: Joi.number().integer().positive().required(),
});

module.exports = { 
    publishDoctoralStudentCommSchema, 
    publishDoctoralStudentCommIdSchema 
};
