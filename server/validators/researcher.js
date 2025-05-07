const Joi = require('joi');

// Validation schema for researcher
const researcherSchema = (req) => Joi.object({
    res_fname: Joi.string().trim().max(50).required(),
    res_lname: Joi.string().trim().max(50).required(),
    res_fname_ar: Joi.string().trim().max(50).required(),
    res_lname_ar: Joi.string().trim().max(50).required(),
    res_gender: Joi.string().valid('Male', 'Female').required(),
    res_attach_struc: Joi.string().trim().max(100).allow(null, ""),
    res_birth_date: Joi.date().allow(null),
    res_phone: Joi.string().trim().pattern(/^(07|06|05)\d{8}$/).allow(null, ""),
    res_address: Joi.string().trim().max(250).allow(null, ""),
    res_grade: Joi.string().trim().max(50).allow(null, ""),
    res_diploma: Joi.string().trim().max(50).allow(null, ""),
    res_prof_email: Joi.string().email().max(100).required(),
    res_pers_email: Joi.string().email().max(100).allow(null, ""),
    res_gs_link: Joi.string().uri({ scheme: ["http", "https"] }).max(250).allow(null, ""),
    res_rg_link: Joi.string().uri({ scheme: ["http", "https"] }).max(250).allow(null, ""),
    res_page_link: Joi.string().uri({ scheme: ["http", "https"] }).max(250).allow(null, ""),
    res_orcid: Joi.string().trim().uri({ scheme: ['https'] }).pattern(/^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{4}$/).allow(null, ""),
    res_pub_count: Joi.number().integer().min(0).default(0),
    res_cit_count: Joi.number().integer().min(0).default(0),
    func_code: Joi.number().integer().positive().required(),
    spec_code: Joi.number().integer().positive().required(),
    team_id: Joi.number().integer().positive().required(),
    lab_code: Joi.number().integer().positive().required(),
    is_director: Joi.boolean().default(false)
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const researcherIdSchema = Joi.number().integer().positive().required();

module.exports = { researcherSchema, researcherIdSchema };