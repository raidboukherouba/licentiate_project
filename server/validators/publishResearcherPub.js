const Joi = require('joi');

// Validation schema for associating a researcher with a publication
const publishResearcherPubSchema = (req) => Joi.object({
    res_code: Joi.number().integer().positive().required(),
    doi: Joi.string().trim().max(50).required(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Validation schema for publication ID (composite key: res_code and doi)
const publishResearcherPubIdSchema = Joi.object({
    res_code: Joi.number().integer().positive().required(),
    doi: Joi.string().trim().max(50).required(),
});

module.exports = { 
    publishResearcherPubSchema, 
    publishResearcherPubIdSchema 
};
