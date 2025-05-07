const { PublishResearcherPub, Researcher, Publication } = require('../models');
const { publishResearcherPubSchema, publishResearcherPubIdSchema } = require('../validators/publishResearcherPub');
const { StatusCodes } = require('http-status-codes');

// Add a new publication for a researcher
const addPublishResearcherPub = async (req, res) => {
    try {
        const { error, value } = publishResearcherPubSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        // Ensure the publication is not already assigned to the researcher
        const existingEntry = await PublishResearcherPub.findOne({
            where: { res_code: value.res_code, doi: value.doi }
        });

        if (existingEntry) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.PublicationResearcherAlreadyAssigned')
            });
        }

        const newEntry = await PublishResearcherPub.create(value);

        res.status(StatusCodes.CREATED).json({
            message: req.t('success.PublishResearcherPubCreated'),
            publishResearcherPub: newEntry
        });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all researcher publication assignments
const getPublishResearcherPubs = async (req, res) => {
    try {
        const allEntries = await PublishResearcherPub.findAll({
            include: [
                { model: Researcher, attributes: ['res_code', 'res_prof_email'] },
                { model: Publication, attributes: ['doi', 'article_title'] },
            ],
            order: [['res_code', 'ASC'], ['doi', 'ASC']]
        });

        if (allEntries.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.PublishResearcherPubEmptyTable'), entries: [] });
        }

        res.status(StatusCodes.OK).json({ entries: allEntries });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a specific researcher publication assignment
const getPublishResearcherPub = async (req, res) => {
    const { error, value: { res_code, doi } } = publishResearcherPubIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublishResearcherPubId') });

    try {
        const entry = await PublishResearcherPub.findOne({
            where: { res_code, doi },
            include: [
                { model: Researcher, attributes: ['res_code', 'res_prof_email'] },
                { model: Publication, attributes: ['doi', 'article_title'] },
            ]
        });

        if (!entry) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublishResearcherPubNotFound') });
        }

        res.status(StatusCodes.OK).json({ publishResearcherPub: entry });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete a researcher's publication assignment
const deletePublishResearcherPub = async (req, res) => {
    // Decode the encoded DOI from the URL
    const decodedDoi = decodeURIComponent(req.params.doi);
    const { res_code } = req.params; // Extract res_code from request params

    const { error } = publishResearcherPubIdSchema.validate({ res_code, doi: decodedDoi });
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublishResearcherPubId') });

    try {
        const entry = await PublishResearcherPub.findOne({ res_code, doi: decodedDoi });

        if (!entry) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublishResearcherPubNotFound') });
        }

        await entry.destroy();

        res.status(StatusCodes.OK).json({ message: req.t('success.PublishResearcherPubDeleted'), publishResearcherPub: entry });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addPublishResearcherPub,
    getPublishResearcherPubs,
    getPublishResearcherPub,
    deletePublishResearcherPub,
};
