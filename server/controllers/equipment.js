const { Op } = require('sequelize');
const { Equipment, Laboratory } = require('../models');
const { equipmentSchema, inventoryNumSchema } = require('../validators/equipment');
const { StatusCodes } = require('http-status-codes');

// Add Equipment
const addEquipment = async (req, res) => {
    try {
        const { error, value } = equipmentSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const newEquipment = await Equipment.create(value);

        res.status(StatusCodes.CREATED).json({ message: req.t('success.EquipmentCreated'), equipment: newEquipment });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.EquipmentExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all Equipment
const getAllEquipments = async (req, res) => {
    try {
        const allEquipments = await Equipment.findAll({ order: [['inventory_num', 'ASC']] });
        if (allEquipments.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.EquipmentEmptyTable'), equipments: [] });
        }
        res.status(StatusCodes.OK).json({equipments: allEquipments});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getEquipments = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'inventory_num';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';
        const laboratoryCode = req.query.laboratoryCode || null; // Add laboratoryCode from query

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['inventory_num', 'equip_status', 'equip_name', 'purchase_price', 'acq_date'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        // Base where condition for search
        const searchCondition = search
            ? {
                [Op.or]: [
                    { equip_name: { [Op.iLike]: `%${search}%` } },
                    { inventory_num: { [Op.iLike]: `%${search}%` } },
                    { equip_status: { [Op.iLike]: `%${search}%` } }
                    // { '$laboratory.lab_name$': { [Op.iLike]: `%${search}%` } }
                ]
            }
            : {};

        // Add laboratoryCode filter if provided
        const laboratoryCondition = laboratoryCode
            ? { lab_code: laboratoryCode }
            : {};

        // Combine search and laboratory conditions
        const whereCondition = {
            ...searchCondition,
            ...laboratoryCondition,
        };

        const { count, rows: equipments } = await Equipment.findAndCountAll({
            where: whereCondition,
            include: [
                { model: Laboratory, as: 'laboratory', attributes: ['lab_name'] },
            ],
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.EquipmentEmptyTable'),
                equipments: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            equipments,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single Equipment
const getEquipment = async (req, res) => {
    const { error, value: inventory_num } = inventoryNumSchema.validate(req.params.inventory_num);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidEquipmentId') });

    try {
        const singleEquipment = await Equipment.findByPk(inventory_num, {
            include: [
                { model: Laboratory, as: 'laboratory', attributes: ['lab_name'] },
            ]
        });

        if (!singleEquipment) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.EquipmentNotFound') });
        }

        res.status(StatusCodes.OK).json({equipment: singleEquipment});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update Equipment
const updateEquipment = async (req, res) => {
    const { error: idError, value: inventory_num } = inventoryNumSchema.validate(req.params.inventory_num);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidEquipmentId') });

    const { error, value } = equipmentSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingEquipment = await Equipment.findOne({
            where: {
                equip_name: value.equip_name,
                inventory_num: { [Op.ne]: inventory_num },
            },
        });

        if (existingEquipment) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.EquipmentExists') });
        }

        const [updated] = await Equipment.update(value, { where: { inventory_num } });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.EquipmentNotFound') });
        }

        const updatedEquipment = await Equipment.findByPk(inventory_num, {
            include: [
                { model: Laboratory, as: 'laboratory', attributes: ['lab_name'] },
            ],
        });

        res.status(StatusCodes.OK).json({ message: req.t('success.EquipmentUpdated'), equipment: updatedEquipment });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete Equipment
const deleteEquipment = async (req, res) => {
    const { error, value: inventory_num } = inventoryNumSchema.validate(req.params.inventory_num);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidEquipmentId') });

    try {
        const deletedEquipment = await Equipment.findByPk(inventory_num);
        if (!deletedEquipment) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.EquipmentNotFound') });
        }
    
        await deletedEquipment.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.EquipmentDeleted'), equipment: deletedEquipment });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteEquipment') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addEquipment,
    getEquipments,
    getEquipment,
    getAllEquipments,
    updateEquipment,
    deleteEquipment,
};