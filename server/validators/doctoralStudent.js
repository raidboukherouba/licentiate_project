const Joi = require('joi');

// Validation schema for doctoral student
const doctoralStudentSchema = (req) => Joi.object({
    reg_num: Joi.number().integer().min(100000000000).max(999999999999).required(),
    doc_stud_fname: Joi.string().trim().max(50).required(),
    doc_stud_lname: Joi.string().trim().max(50).required(),
    doc_stud_fname_ar: Joi.string().trim().max(50).required(),
    doc_stud_lname_ar: Joi.string().trim().max(50).required(),
    doc_stud_gender: Joi.string().valid('Male', 'Female').required(),
    doc_stud_attach_struc: Joi.string().trim().max(100).allow(null, ""),
    doc_stud_birth_date: Joi.date().allow(null),
    doc_stud_phone: Joi.string().trim().pattern(/^(07|06|05)\d{8}$/).allow(null, ""),
    doc_stud_address: Joi.string().trim().max(250).allow(null, ""),
    doc_stud_grade: Joi.string().trim().max(50).allow(null, ""),
    doc_stud_diploma: Joi.string().trim().max(50).allow(null, ""),
    doc_stud_prof_email: Joi.string().email().max(100).required(),
    doc_stud_pers_email: Joi.string().email().max(100).allow(null, ""),
    doc_stud_gs_link: Joi.string().uri({ scheme: ["http", "https"] }).max(250).allow(null, ""),
    doc_stud_rg_link: Joi.string().uri({ scheme: ["http", "https"] }).max(250).allow(null, ""),
    doc_stud_page_link: Joi.string().uri({ scheme: ["http", "https"] }).max(250).allow(null, ""),
    doc_stud_orcid: Joi.string().trim().uri({ scheme: ['https'] }).pattern(/^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{4}$/).allow(null, ""),
    doc_stud_pub_count: Joi.number().integer().min(0).default(0),
    doc_stud_cit_count: Joi.number().integer().min(0).default(0),
    lab_code: Joi.number().integer().positive().required(),
    team_id: Joi.number().integer().positive().required(),
    func_code: Joi.number().integer().positive().required(),
    spec_code: Joi.number().integer().positive().required(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const regNumSchema = Joi.number().integer().min(100000000000).max(999999999999).required();

module.exports = { doctoralStudentSchema, regNumSchema };