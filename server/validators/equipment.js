const Joi = require('joi');

// Validation schema for Equipment
const equipmentSchema = (req) => Joi.object({
    inventory_num: Joi.string().max(50).pattern(/^[A-Za-z0-9-_]+$/),
    equip_name: Joi.string().trim().required(),
    equip_desc: Joi.string().trim().allow(null, ''),
    acq_date: Joi.date().allow(null),
    purchase_price: Joi.number().precision(2).positive().allow(null),
    equip_status: Joi.string().trim().max(50).allow(null, ''),
    equip_quantity: Joi.number().integer().positive().allow(null),
    lab_code: Joi.number().integer().positive().required(),
}).unknown(false).messages({
    "object.unknown": req.t("error.AttributeNotAllowed")
});
const inventoryNumSchema = Joi.string().min(8).max(50).pattern(/^[A-Za-z0-9-_]+$/).required();

module.exports = { equipmentSchema, inventoryNumSchema };