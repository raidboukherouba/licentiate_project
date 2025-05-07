const { Op } = require('sequelize');
const { Function } = require('../models');
const { functionSchema, functionIdSchema } = require('../validators/function');
const { StatusCodes } = require('http-status-codes');

// Add function
const addFunction = async (req, res) => {
    try {
        const { error, value } = functionSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const newFunction = await Function.create({ func_name: value.func_name });
        res.status(StatusCodes.CREATED).json({ message: req.t('success.FunctionCreated'), function: newFunction });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.FunctionExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all functions
const getAllFunctions = async (req, res) => {
    try {
        const allFunctions = await Function.findAll({ order: [['func_code', 'ASC']] });
        if (allFunctions.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.FunctionEmptyTable'), functions: [] });
        }
        res.status(StatusCodes.OK).json({functions: allFunctions});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getFunctions = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'func_code';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['func_code', 'func_name']; // Add other valid columns if needed
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        // Define the search condition
        const whereCondition = search
            ? { func_name: { [Op.iLike]: `%${search}%` } } // Adjust the column name if necessary
            : {};

        // Fetch paginated and sorted data
        const { count, rows: functions } = await Function.findAndCountAll({
            where: whereCondition,
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        // Handle empty results
        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.FunctionEmptyTable'),
                functions: [],
                totalPages: 0,
                currentPage: page
            });
        }

        // Calculate total pages
        const totalPages = Math.ceil(count / limit);

        // Return the response
        res.status(StatusCodes.OK).json({
            functions,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single function
const getFunction = async (req, res) => {
    const { error, value: func_code } = functionIdSchema.validate(req.params.func_code);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidFunctionId') });

    try {
        const singleFunction = await Function.findByPk(func_code);
        if (!singleFunction) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.FunctionNotFound') });
        }
        res.status(StatusCodes.OK).json({function: singleFunction});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update function
const updateFunction = async (req, res) => {
    const { error: idError, value: func_code } = functionIdSchema.validate(req.params.func_code);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidFunctionId') });

    const { error, value } = functionSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingFunction = await Function.findOne({
            where: {
                func_name: value.func_name,
                func_code: { [Op.ne]: func_code }
            }
        });

        if (existingFunction) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.FunctionExists') });
        }

        const [updated] = await Function.update({ func_name: value.func_name }, {
            where: { func_code: func_code }
        });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.FunctionNotFound') });
        }

        const updatedFunction = await Function.findByPk(func_code);
        res.status(StatusCodes.OK).json({ message: req.t('success.FunctionUpdated'), function: updatedFunction });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete function
const deleteFunction = async (req, res) => {
    const { error, value: func_code } = functionIdSchema.validate(req.params.func_code);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidFunctionId') });

    try {
        const deletedFunction = await Function.findByPk(func_code);
        if (!deletedFunction) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.FunctionNotFound') });
        }
    
        await deletedFunction.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.FunctionDeleted'), function: deletedFunction });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteFunction') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addFunction,
    getFunction,
    getFunctions,
    getAllFunctions,
    updateFunction,
    deleteFunction
};