const { HasCategory, Review, Category } = require('../models');
const { hasCategorySchema, hasCategoryIdSchema } = require('../validators/hasCategory');
const { StatusCodes } = require('http-status-codes');

// Add a new category assignment to a review
const addHasCategory = async (req, res) => {
    try {
        const { error, value } = hasCategorySchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        // Ensure the category is not already assigned to the review
        const existingAssignment = await HasCategory.findOne({
            where: { review_num: value.review_num, cat_id: value.cat_id }
        });

        if (existingAssignment) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.CategoryAlreadyAssigned')
            });
        }

        const newHasCategory = await HasCategory.create(value);

        res.status(StatusCodes.CREATED).json({
            message: req.t('success.HasCategoryCreated'),
            hasCategory: newHasCategory
        });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all category assignments
const getHasCategories = async (req, res) => {
    try {
        const allHasCategories = await HasCategory.findAll({
            include: [
                { model: Review, attributes: ['review_num', 'review_title'] },
                { model: Category, attributes: ['cat_id', 'cat_name'] },
            ],
            order: [['review_num', 'ASC'], ['cat_id', 'ASC']]
        });

        if (allHasCategories.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.HasCategoryEmptyTable'), hasCategories: [] });
        }

        res.status(StatusCodes.OK).json({ hasCategories: allHasCategories });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a specific category assignment by review_num and cat_id
const getHasCategory = async (req, res) => {
    const { error, value: { review_num, cat_id } } = hasCategoryIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidHasCategoryId') });

    try {
        const singleHasCategory = await HasCategory.findOne({
            where: { review_num, cat_id },
            include: [
                { model: Review, attributes: ['review_num', 'review_title'] },
                { model: Category, attributes: ['cat_id', 'cat_name'] },
            ]
        });

        if (!singleHasCategory) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.HasCategoryNotFound') });
        }

        res.status(StatusCodes.OK).json({ hasCategory: singleHasCategory });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete a category assignment
const deleteHasCategory = async (req, res) => {
    const { error, value: { review_num, cat_id } } = hasCategoryIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidHasCategoryId') });

    try {
        const deletedHasCategory = await HasCategory.findOne({ where: { review_num, cat_id } });

        if (!deletedHasCategory) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.HasCategoryNotFound') });
        }

        await deletedHasCategory.destroy();

        res.status(StatusCodes.OK).json({ message: req.t('success.HasCategoryDeleted'), hasCategory: deletedHasCategory });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addHasCategory,
    getHasCategories,
    getHasCategory,
    deleteHasCategory,
};
