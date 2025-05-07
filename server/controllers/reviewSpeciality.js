const { Op } = require('sequelize');
const { ReviewSpeciality } = require('../models');
const { reviewSpecialitySchema, reviewSpecialityIdSchema } = require('../validators/reviewSpeciality');
const { StatusCodes } = require('http-status-codes');

// Add review speciality
const addReviewSpeciality = async (req, res) => {
    try {
        const { error, value } = reviewSpecialitySchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const newReviewSpeciality = await ReviewSpeciality.create({ spec_name_review: value.spec_name_review });
        res.status(StatusCodes.CREATED).json({ message: req.t('success.ReviewSpecialityCreated'), reviewSpeciality: newReviewSpeciality });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.ReviewSpecialityExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all review specialities
const getAllReviewSpecialities = async (req, res) => {
    try {
        const allReviewSpecialities = await ReviewSpeciality.findAll({ order: [['spec_id_review', 'ASC']] });
        if (allReviewSpecialities.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.ReviewSpecialityEmptyTable'), reviewSpecialities: [] });
        }
        res.status(StatusCodes.OK).json({reviewSpecialities: allReviewSpecialities});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getReviewSpecialities = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'spec_id_review';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['spec_id_review', 'spec_name_review']; // Add other valid columns as needed
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        const whereCondition = search
            ? { spec_name_review: { [Op.iLike]: `%${search}%` } } // Adjust the column name as needed
            : {};

        const { count, rows: reviewSpecialities } = await ReviewSpeciality.findAndCountAll({
            where: whereCondition,
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.ReviewSpecialityEmptyTable'),
                reviewSpecialities: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            reviewSpecialities,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single review speciality
const getReviewSpeciality = async (req, res) => {
    const { error, value: spec_id_review } = reviewSpecialityIdSchema.validate(req.params.spec_id_review);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidReviewSpecialityId') });

    try {
        const singleReviewSpeciality = await ReviewSpeciality.findByPk(spec_id_review);
        if (!singleReviewSpeciality) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ReviewSpecialityNotFound') });
        }
        res.status(StatusCodes.OK).json({reviewSpeciality: singleReviewSpeciality});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update review speciality
const updateReviewSpeciality = async (req, res) => {
    const { error: idError, value: spec_id_review } = reviewSpecialityIdSchema.validate(req.params.spec_id_review);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidReviewSpecialityId') });

    const { error, value } = reviewSpecialitySchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingReviewSpeciality = await ReviewSpeciality.findOne({
            where: {
                spec_name_review: value.spec_name_review,
                spec_id_review: { [Op.ne]: spec_id_review }
            }
        });

        if (existingReviewSpeciality) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.ReviewSpecialityExists') });
        }

        const [updated] = await ReviewSpeciality.update({ spec_name_review: value.spec_name_review }, {
            where: { spec_id_review: spec_id_review }
        });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ReviewSpecialityNotFound') });
        }

        const updatedReviewSpeciality = await ReviewSpeciality.findByPk(spec_id_review);
        res.status(StatusCodes.OK).json({ message: req.t('success.ReviewSpecialityUpdated'), reviewSpeciality: updatedReviewSpeciality });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete review speciality
const deleteReviewSpeciality = async (req, res) => {
    const { error, value: spec_id_review } = reviewSpecialityIdSchema.validate(req.params.spec_id_review);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidReviewSpecialityId') });

    try {
        const deletedReviewSpeciality = await ReviewSpeciality.findByPk(spec_id_review);
        if (!deletedReviewSpeciality) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ReviewSpecialityNotFound') });
        }
    
        await deletedReviewSpeciality.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.ReviewSpecialityDeleted'), reviewSpeciality: deletedReviewSpeciality });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteReviewSpeciality') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addReviewSpeciality,
    getReviewSpeciality,
    getReviewSpecialities,
    getAllReviewSpecialities,
    updateReviewSpeciality,
    deleteReviewSpeciality
};