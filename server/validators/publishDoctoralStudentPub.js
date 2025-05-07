const Joi = require('joi');

// Validation schema for associating a doctoral student with a publication
const publishDoctoralStudentPubSchema = (req) => Joi.object({
    reg_num: Joi.number().integer().min(100000000000).max(999999999999).required(),
    doi: Joi.string().trim().max(50).required(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Validation schema for publication ID (composite key: reg_num and doi)
const publishDoctoralStudentPubIdSchema = Joi.object({
    reg_num: Joi.number().integer().min(100000000000).max(999999999999).required(),
    doi: Joi.string().trim().max(50).required(),
});

module.exports = { 
    publishDoctoralStudentPubSchema, 
    publishDoctoralStudentPubIdSchema 
};
