const { PublishDoctoralStudentComm, DoctoralStudent, Communication } = require('../models');
const { publishDoctoralStudentCommSchema, publishDoctoralStudentCommIdSchema } = require('../validators/publishDoctoralStudentComm');
const { StatusCodes } = require('http-status-codes');

// Add a new communication entry for a doctoral student
const addPublishDoctoralStudentComm = async (req, res) => {
    try {
        const { error, value } = publishDoctoralStudentCommSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        // Ensure the communication is not already assigned to the student
        const existingEntry = await PublishDoctoralStudentComm.findOne({
            where: { reg_num: value.reg_num, id_comm: value.id_comm }
        });

        if (existingEntry) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.CommunicationDoctoralStudentAlreadyAssigned')
            });
        }

        const newEntry = await PublishDoctoralStudentComm.create(value);

        res.status(StatusCodes.CREATED).json({
            message: req.t('success.PublishDoctoralStudentCommCreated'),
            publishDoctoralStudentComm: newEntry
        });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all doctoral student communication assignments
const getPublishDoctoralStudentComms = async (req, res) => {
    try {
        const allEntries = await PublishDoctoralStudentComm.findAll({
            include: [
                { model: DoctoralStudent, attributes: ['reg_num', 'doc_stud_prof_email'] },
                { model: Communication, attributes: ['id_comm', 'title_comm'] },
            ],
            order: [['reg_num', 'ASC'], ['id_comm', 'ASC']]
        });

        if (allEntries.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.PublishDoctoralStudentCommEmptyTable'), entries: [] });
        }

        res.status(StatusCodes.OK).json({ entries: allEntries });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a specific doctoral student communication assignment
const getPublishDoctoralStudentComm = async (req, res) => {
    const { error, value: { reg_num, id_comm } } = publishDoctoralStudentCommIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublishDoctoralStudentCommId') });

    try {
        const entry = await PublishDoctoralStudentComm.findOne({
            where: { reg_num, id_comm },
            include: [
                { model: DoctoralStudent, attributes: ['reg_num', 'doc_stud_prof_email'] },
                { model: Communication, attributes: ['id_comm', 'title_comm'] },
            ]
        });

        if (!entry) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublishDoctoralStudentCommNotFound') });
        }

        res.status(StatusCodes.OK).json({ publishDoctoralStudentComm: entry });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete a communication assignment for a doctoral student
const deletePublishDoctoralStudentComm = async (req, res) => {
    const { error, value: { reg_num, id_comm } } = publishDoctoralStudentCommIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublishDoctoralStudentCommId') });

    try {
        const entry = await PublishDoctoralStudentComm.findOne({ where: { reg_num, id_comm } });

        if (!entry) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublishDoctoralStudentCommNotFound') });
        }

        await entry.destroy();

        res.status(StatusCodes.OK).json({ message: req.t('success.PublishDoctoralStudentCommDeleted'), publishDoctoralStudentComm: entry });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addPublishDoctoralStudentComm,
    getPublishDoctoralStudentComms,
    getPublishDoctoralStudentComm,
    deletePublishDoctoralStudentComm,
};
