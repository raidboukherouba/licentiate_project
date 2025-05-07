const Joi = require('joi');

// Joi validation schema for creating a user
const userSchema = (req) => Joi.object({
    username: Joi.string().trim().max(50).required(),
    password: Joi.string().trim().min(8).max(30).required(),
    full_name: Joi.string().trim().max(100).required(),
    email: Joi.string().trim().email().max(100).required(),
    role_id: Joi.number().integer().positive().required()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Joi validation schema for updating a user
const userUpdateSchema = (req) => Joi.object({
    username: Joi.string().trim().max(50),
    password: Joi.string().trim().min(8).max(30),
    full_name: Joi.string().trim().max(100),
    email: Joi.string().trim().email().max(100),
    role_id: Joi.number().integer().positive()
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});

// Joi validation schema for user ID
const userIdSchema = Joi.number().integer().positive().required();

module.exports = { userSchema, userUpdateSchema, userIdSchema };