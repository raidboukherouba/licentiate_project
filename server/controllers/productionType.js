const { Op } = require('sequelize');
const { ProductionType } = require('../models');
const { productionTypeSchema, productionTypeIdSchema } = require('../validators/productionType');
const { StatusCodes } = require('http-status-codes');

// Add production type
const addProductionType = async (req, res) => {
    try {
        const { error, value } = productionTypeSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const newProductionType = await ProductionType.create({ type_name: value.type_name });
        res.status(StatusCodes.CREATED).json({ message: req.t('success.ProductionTypeCreated'), productionType: newProductionType });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.ProductionTypeExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all production types
const getAllProductionTypes = async (req, res) => {
    try {
        const allProductionTypes = await ProductionType.findAll({ order: [['type_id', 'ASC']] });
        if (allProductionTypes.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.ProductionTypeEmptyTable'), productionTypes: [] });
        }
        res.status(StatusCodes.OK).json({productionTypes: allProductionTypes});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getProductionTypes = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'type_id';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['type_id', 'type_name'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        const whereCondition = search
            ? { type_name: { [Op.iLike]: `%${search}%` } }
            : {};

        const { count, rows: productionTypes } = await ProductionType.findAndCountAll({
            where: whereCondition,
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.ProductionTypeEmptyTable'),
                productionTypes: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            productionTypes,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single production type
const getProductionType = async (req, res) => {
    const { error, value: type_id } = productionTypeIdSchema.validate(req.params.type_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidProductionTypeId') });

    try {
        const singleProductionType = await ProductionType.findByPk(type_id);
        if (!singleProductionType) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ProductionTypeNotFound') });
        }
        res.status(StatusCodes.OK).json({productionType: singleProductionType});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update production type
const updateProductionType = async (req, res) => {
    const { error: idError, value: type_id } = productionTypeIdSchema.validate(req.params.type_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidProductionTypeId') });

    const { error, value } = productionTypeSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingProductionType = await ProductionType.findOne({
            where: {
                type_name: value.type_name,
                type_id: { [Op.ne]: type_id }
            }
        });

        if (existingProductionType) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.ProductionTypeExists') });
        }

        const [updated] = await ProductionType.update({ type_name: value.type_name }, {
            where: { type_id: type_id }
        });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ProductionTypeNotFound') });
        }

        const updatedProductionType = await ProductionType.findByPk(type_id);
        res.status(StatusCodes.OK).json({ message: req.t('success.ProductionTypeUpdated'), productionType: updatedProductionType });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete production type
const deleteProductionType = async (req, res) => {
    const { error, value: type_id } = productionTypeIdSchema.validate(req.params.type_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidProductionTypeId') });

    try {
        const deletedProductionType = await ProductionType.findByPk(type_id);
        if (!deletedProductionType) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ProductionTypeNotFound') });
        }
    
        await deletedProductionType.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.ProductionTypeDeleted'), productionType: deletedProductionType });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteProductionType') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addProductionType,
    getProductionType,
    getProductionTypes,
    getAllProductionTypes,
    updateProductionType,
    deleteProductionType
};