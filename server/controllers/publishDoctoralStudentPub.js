const { PublishDoctoralStudentPub, DoctoralStudent, Publication } = require('../models');
const { publishDoctoralStudentPubSchema, publishDoctoralStudentPubIdSchema } = require('../validators/publishDoctoralStudentPub');
const { StatusCodes } = require('http-status-codes');

// Add a new publication entry for a doctoral student
const addPublishDoctoralStudentPub = async (req, res) => {
    try {
        const { error, value } = publishDoctoralStudentPubSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        // Ensure the publication is not already assigned to the student
        const existingEntry = await PublishDoctoralStudentPub.findOne({
            where: { reg_num: value.reg_num, doi: value.doi }
        });

        if (existingEntry) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.PublicationDoctoralStudentAlreadyAssigned')
            });
        }

        const newEntry = await PublishDoctoralStudentPub.create(value);

        res.status(StatusCodes.CREATED).json({
            message: req.t('success.PublishDoctoralStudentPubCreated'),
            publishDoctoralStudentPub: newEntry
        });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all doctoral student publication assignments
const getPublishDoctoralStudentPubs = async (req, res) => {
    try {
        const allEntries = await PublishDoctoralStudentPub.findAll({
            include: [
                { model: DoctoralStudent, attributes: ['reg_num', 'doc_stud_prof_email'] },
                { model: Publication, attributes: ['doi', 'article_title'] },
            ],
            order: [['reg_num', 'ASC'], ['doi', 'ASC']]
        });

        if (allEntries.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.PublishDoctoralStudentPubEmptyTable'), entries: [] });
        }

        res.status(StatusCodes.OK).json({ entries: allEntries });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a specific doctoral student publication assignment
const getPublishDoctoralStudentPub = async (req, res) => {
    const { error, value: { reg_num, doi } } = publishDoctoralStudentPubIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublishDoctoralStudentPubId') });

    try {
        const entry = await PublishDoctoralStudentPub.findOne({
            where: { reg_num, doi },
            include: [
                { model: DoctoralStudent, attributes: ['reg_num', 'doc_stud_prof_email'] },
                { model: Publication, attributes: ['doi', 'article_title'] },
            ]
        });

        if (!entry) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublishDoctoralStudentPubNotFound') });
        }

        res.status(StatusCodes.OK).json({ publishDoctoralStudentPub: entry });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete a publication assignment for a doctoral student
const deletePublishDoctoralStudentPub = async (req, res) => {
    // Decode the encoded DOI from the URL
    const decodedDoi = decodeURIComponent(req.params.doi);
    const { reg_num } = req.params; // Extract reg_num from request params

    const { error } = publishDoctoralStudentPubIdSchema.validate({ reg_num, doi: decodedDoi });
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublishDoctoralStudentPubId') });

    try {
        const entry = await PublishDoctoralStudentPub.findOne({ reg_num, doi: decodedDoi });

        if (!entry) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublishDoctoralStudentPubNotFound') });
        }

        await entry.destroy();

        res.status(StatusCodes.OK).json({ message: req.t('success.PublishDoctoralStudentPubDeleted'), publishDoctoralStudentPub: entry });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addPublishDoctoralStudentPub,
    getPublishDoctoralStudentPubs,
    getPublishDoctoralStudentPub,
    deletePublishDoctoralStudentPub,
};
