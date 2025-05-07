const Joi = require('joi');

// Validation schema for associating a researcher with a communication
const publishResearcherCommSchema = (req) => Joi.object({
    res_code: Joi.number().integer().positive().required(),
    id_comm: Joi.number().integer().positive().required(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Validation schema for publication ID (composite key: res_code and id_comm)
const publishResearcherCommIdSchema = Joi.object({
    res_code: Joi.number().integer().positive().required(),
    id_comm: Joi.number().integer().positive().required(),
});

module.exports = { 
    publishResearcherCommSchema, 
    publishResearcherCommIdSchema 
};
