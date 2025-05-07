const { Op } = require('sequelize');
const { Review, Publisher, Publication, Category, ReviewSpeciality } = require('../models');
const { reviewSchema, reviewIdSchema } = require('../validators/review');
const { StatusCodes } = require('http-status-codes');

// Add a review
const addReview = async (req, res) => {
    try {
        const { error, value } = reviewSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const { review_title, issn, e_issn, review_vol, publisher_id } = value;

        const newReview = await Review.create({
            review_title,
            issn,
            e_issn,
            review_vol,
            publisher_id,
        });

        res.status(StatusCodes.CREATED).json({ message: req.t('success.ReviewCreated'), review: newReview });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.ReviewExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all reviews
const getAllReviews = async (req, res) => {
    try {
        const allReviews = await Review.findAll({
            include: [
                { model: Publisher, as: 'publisher', attributes: ['publisher_name'] },
                { model: Publication, as: 'publication', attributes: ['doi', 'article_title'] },
            ],
            order: [['review_num', 'ASC']]
        });

        if (allReviews.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.ReviewEmptyTable'), reviews: [] });
        }

        res.status(StatusCodes.OK).json({reviews: allReviews});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getReviews = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'review_num';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['review_num', 'review_title', 'issn', 'e_issn', 'review_vol', 'publisher_name'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        const whereCondition = search
            ? {
                [Op.or]: [
                    { review_title: { [Op.iLike]: `%${search}%` } },
                    { issn: { [Op.iLike]: `%${search}%` } },
                    { e_issn: { [Op.iLike]: `%${search}%` } },
                    { review_vol: { [Op.iLike]: `%${search}%` } },
                    { '$publisher.publisher_name$': { [Op.iLike]: `%${search}%` } },
                    // { '$publication.article_title$': { [Op.iLike]: `%${search}%` } },
                    // { '$publication.doi$': { [Op.iLike]: `%${search}%` } }
                ]
            }
            : {};

        const { count, rows: reviews } = await Review.findAndCountAll({
            where: whereCondition,
            include: [
                { model: Publisher, as: 'publisher', attributes: ['publisher_name'] },
            ],
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.ReviewEmptyTable'),
                reviews: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            reviews,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single review
const getReview = async (req, res) => {
    const { error, value: review_num } = reviewIdSchema.validate(req.params.review_num);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidReviewId') });

    try {
        const singleReview = await Review.findByPk(review_num, {
            include: [
                { model: Publisher, as: 'publisher', attributes: ['publisher_name'] },
                { model: Publication, as: 'publication', attributes: ['doi', 'article_title'] },
                { 
                    model: Category,
                    through: { attributes: [] }, // This excludes the join table attributes
                    attributes: ['cat_id', 'cat_name'] 
                },
                {
                    model: ReviewSpeciality,
                    through: { attributes: [] },
                    attributes: ['spec_id_review', 'spec_name_review'] 
                },
            ]
        });

        if (!singleReview) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ReviewNotFound') });
        }

        res.status(StatusCodes.OK).json({review: singleReview});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update a review
const updateReview = async (req, res) => {
    const { error: idError, value: review_num } = reviewIdSchema.validate(req.params.review_num);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidReviewId') });

    const { error, value } = reviewSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    const { review_title, issn, e_issn, review_vol, publisher_id } = value;

    try {
        const existingReview = await Review.findOne({
            where: {
                issn: value.issn,
                review_num: { [Op.ne]: review_num }, // Exclude current review
            },
        });

        if (existingReview) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.ReviewExists') });
        }

        const [updated] = await Review.update(
            { review_title, issn, e_issn, review_vol, publisher_id },
            { where: { review_num } }
        );

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ReviewNotFound') });
        }

        const updatedReview = await Review.findByPk(review_num, {
            include: [
                { model: Publisher, as: 'publisher', attributes: ['publisher_name'] },
                { model: Publication, as: 'publication', attributes: ['doi', 'article_title'] },
            ]
        });

        res.status(StatusCodes.OK).json({ message: req.t('success.ReviewUpdated'), review: updatedReview });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    const { error, value: review_num } = reviewIdSchema.validate(req.params.review_num);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidReviewId') });

    try {
        const deletedReview = await Review.findByPk(review_num);
        if (!deletedReview) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ReviewNotFound') });
        }
    
        await deletedReview.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.ReviewDeleted'), review: deletedReview });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteReview') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addReview,
    getReviews,
    getReview,
    getAllReviews,
    updateReview,
    deleteReview,
};