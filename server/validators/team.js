const Joi = require('joi');

// Validation schema for team
const teamSchema = (req) => Joi.object({
    team_name: Joi.string().trim().max(200).required(),
    team_abbr: Joi.string().trim().max(20).empty("").default(null),
    team_desc: Joi.string().trim().empty("").default(null)
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const teamIdSchema = Joi.number().integer().positive().required();

module.exports = { teamSchema, teamIdSchema };