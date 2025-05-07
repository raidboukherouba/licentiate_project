const { Op } = require('sequelize');
const { Category } = require('../models');
const { categorySchema, categoryIdSchema } = require('../validators/category');
const { StatusCodes } = require('http-status-codes');

// Add category
const addCategory = async (req, res) => {
    try {
        const { error, value } = categorySchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const newCategory = await Category.create({ cat_name: value.cat_name });
        res.status(StatusCodes.CREATED).json({ message: req.t('success.CategoryCreated'), category: newCategory });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CategoryExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.findAll({ order: [['cat_id', 'ASC']] });
        if (allCategories.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.CategoryEmptyTable'), categories: [] });
        }
        res.status(StatusCodes.OK).json({categories: allCategories});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getCategories = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'cat_id';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['cat_id', 'cat_name'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        const whereCondition = search
            ? { cat_name: { [Op.iLike]: `%${search}%` } }
            : {};

        const { count, rows: categories } = await Category.findAndCountAll({
            where: whereCondition,
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.CategoryEmptyTable'),
                categories: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            categories,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single category
const getCategory = async (req, res) => {
    const { error: idError, value: cat_id } = categoryIdSchema.validate(req.params.cat_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: idError.details[0].message });

    try {
        const singleCategory = await Category.findByPk(cat_id);
        if (!singleCategory) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.CategoryNotFound') });
        }
        res.status(StatusCodes.OK).json({ category: singleCategory });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update category
const updateCategory = async (req, res) => {
    const { error: idError, value: cat_id } = categoryIdSchema.validate(req.params.cat_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: idError.details[0].message });

    const { error, value } = categorySchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingCategory = await Category.findOne({
            where: {
                cat_name: value.cat_name,
                cat_id: { [Op.ne]: cat_id }
            }
        });

        if (existingCategory) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CategoryExists') });
        }

        const [updated] = await Category.update({ cat_name: value.cat_name }, {
            where: { cat_id: cat_id }
        });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.CategoryNotFound') });
        }

        const updatedCategory = await Category.findByPk(cat_id);
        res.status(StatusCodes.OK).json({ message: req.t('success.CategoryUpdated'), category: updatedCategory });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    const { error: idError, value: cat_id } = categoryIdSchema.validate(req.params.cat_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: idError.details[0].message });

    try {
        const deletedCategory = await Category.findByPk(cat_id);
        if (!deletedCategory) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.CategoryNotFound') });
        }
    
        await deletedCategory.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.CategoryDeleted'), category: deletedCategory });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteCategory') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addCategory,
    getCategory,
    getCategories,
    getAllCategories,
    updateCategory,
    deleteCategory
};