const { HasSpeciality, Review, ReviewSpeciality } = require('../models');
const { hasSpecialitySchema, hasSpecialityIdSchema } = require('../validators/hasSpeciality');
const { StatusCodes } = require('http-status-codes');

// Add a new speciality assignment to a review
const addHasSpeciality = async (req, res) => {
    try {
        const { error, value } = hasSpecialitySchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        // Ensure the speciality is not already assigned to the review
        const existingAssignment = await HasSpeciality.findOne({
            where: { review_num: value.review_num, spec_id_review: value.spec_id_review }
        });

        if (existingAssignment) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.SpecialityAlreadyAssigned')
            });
        }

        const newHasSpeciality = await HasSpeciality.create(value);

        res.status(StatusCodes.CREATED).json({
            message: req.t('success.HasSpecialityCreated'),
            hasSpeciality: newHasSpeciality
        });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all speciality assignments
const getHasSpecialities = async (req, res) => {
    try {
        const allHasSpecialities = await HasSpeciality.findAll({
            include: [
                { model: Review, attributes: ['review_num', 'review_title'] },
                { model: ReviewSpeciality, attributes: ['spec_id_review', 'spec_name_review'] },
            ],
            order: [['review_num', 'ASC'], ['spec_id_review', 'ASC']]
        });

        if (allHasSpecialities.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.HasSpecialityEmptyTable'), hasSpecialities: [] });
        }

        res.status(StatusCodes.OK).json({ hasSpecialities: allHasSpecialities });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a specific speciality assignment by review_num and spec_id_review
const getHasSpeciality = async (req, res) => {
    const { error, value: { review_num, spec_id_review } } = hasSpecialityIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidHasSpecialityId') });

    try {
        const singleHasSpeciality = await HasSpeciality.findOne({
            where: { review_num, spec_id_review },
            include: [
                { model: Review, attributes: ['review_num', 'review_title'] },
                { model: ReviewSpeciality, attributes: ['spec_id_review', 'spec_name_review'] },
            ]
        });

        if (!singleHasSpeciality) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.HasSpecialityNotFound') });
        }

        res.status(StatusCodes.OK).json({ hasSpeciality: singleHasSpeciality });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete a speciality assignment
const deleteHasSpeciality = async (req, res) => {
    const { error, value: { review_num, spec_id_review } } = hasSpecialityIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidHasSpecialityId') });

    try {
        const deletedHasSpeciality = await HasSpeciality.findOne({ where: { review_num, spec_id_review } });

        if (!deletedHasSpeciality) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.HasSpecialityNotFound') });
        }

        await deletedHasSpeciality.destroy();

        res.status(StatusCodes.OK).json({ message: req.t('success.HasSpecialityDeleted'), hasSpeciality: deletedHasSpeciality });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addHasSpeciality,
    getHasSpecialities,
    getHasSpeciality,
    deleteHasSpeciality,
};
