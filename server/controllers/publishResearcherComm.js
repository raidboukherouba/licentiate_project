const { PublishResearcherComm, Researcher, Communication } = require('../models');
const { publishResearcherCommSchema, publishResearcherCommIdSchema } = require('../validators/publishResearcherComm');
const { StatusCodes } = require('http-status-codes');

// Add a new communication for a researcher
const addPublishResearcherComm = async (req, res) => {
    try {
        const { error, value } = publishResearcherCommSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        // Ensure the communication is not already assigned to the researcher
        const existingEntry = await PublishResearcherComm.findOne({
            where: { res_code: value.res_code, id_comm: value.id_comm }
        });

        if (existingEntry) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.CommunicationResearcherAlreadyAssigned')
            });
        }

        const newEntry = await PublishResearcherComm.create(value);

        res.status(StatusCodes.CREATED).json({
            message: req.t('success.PublishResearcherCommCreated'),
            publishResearcherComm: newEntry
        });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all researcher communication assignments
const getPublishResearcherComms = async (req, res) => {
    try {
        const allEntries = await PublishResearcherComm.findAll({
            include: [
                { model: Researcher, attributes: ['res_code', 'res_prof_email'] },
                { model: Communication, attributes: ['id_comm', 'title_comm'] },
            ],
            order: [['res_code', 'ASC'], ['id_comm', 'ASC']]
        });

        if (allEntries.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.PublishResearcherCommEmptyTable'), entries: [] });
        }

        res.status(StatusCodes.OK).json({ entries: allEntries });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a specific researcher communication assignment
const getPublishResearcherComm = async (req, res) => {
    const { error, value: { res_code, id_comm } } = publishResearcherCommIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublishResearcherCommId') });

    try {
        const entry = await PublishResearcherComm.findOne({
            where: { res_code, id_comm },
            include: [
                { model: Researcher, attributes: ['res_code', 'res_prof_email'] },
                { model: Communication, attributes: ['id_comm', 'title_comm'] },
            ]
        });

        if (!entry) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublishResearcherCommNotFound') });
        }

        res.status(StatusCodes.OK).json({ publishResearcherComm: entry });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete a researcher's communication assignment
const deletePublishResearcherComm = async (req, res) => {
    const { error, value: { res_code, id_comm } } = publishResearcherCommIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublishResearcherCommId') });

    try {
        const entry = await PublishResearcherComm.findOne({ where: { res_code, id_comm } });

        if (!entry) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublishResearcherCommNotFound') });
        }

        await entry.destroy();

        res.status(StatusCodes.OK).json({ message: req.t('success.PublishResearcherCommDeleted'), publishResearcherComm: entry });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addPublishResearcherComm,
    getPublishResearcherComms,
    getPublishResearcherComm,
    deletePublishResearcherComm,
};
