const { Op, Sequelize } = require('sequelize');
const { Communication, ProductionType, DoctoralStudent, Researcher, Laboratory } = require('../models');
const { communicationSchema, communicationIdSchema } = require('../validators/communication');
const { StatusCodes } = require('http-status-codes');

// Add a Communication
const addCommunication = async (req, res) => {
    try {
        const { error, value } = communicationSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const newCommunication = await Communication.create(value);

        res.status(StatusCodes.CREATED).json({ message: req.t('success.CommunicationCreated'), communication: newCommunication });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CommunicationExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all Communications
const getAllCommunications = async (req, res) => {
    try {
        const allCommunications = await Communication.findAll({
            include: [
                { model: ProductionType, as: 'production_type', attributes: ['type_name'] },
                { 
                    model: Researcher,
                    through: { attributes: [] }, // This excludes the join table attributes
                    attributes: ['res_code', 'res_fname', 'res_lname', 'res_prof_email'] 
                },
                {
                    model: DoctoralStudent,
                    through: { attributes: [] },
                    attributes: ['reg_num', 'doc_stud_fname', 'doc_stud_lname', 'doc_stud_prof_email'] 
                },
            ],
            order: [['year_comm', 'DESC']]
        });

        if (allCommunications.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.CommunicationEmptyTable'), communications: [] });
        }

        res.status(StatusCodes.OK).json({ communications: allCommunications});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getCommunications = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Keep sorting logic as it is
        const sortBy = req.query.sortBy || 'year_comm';
        const order = (req.query.order === 'asc') ? 'ASC' : 'DESC';
        const search = req.query.search || '';
        const laboratoryCode = req.query.laboratoryCode || null;

        // Validate sortBy column
        const validColumns = ['comm_num', 'event_title', 'title_comm', 'year_comm', 'type_id'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        // Search condition
        const searchCondition = search ? {
            [Op.or]: [
                { title_comm: { [Op.iLike]: `%${search}%` } },
                { event_title: { [Op.iLike]: `%${search}%` } },
                Sequelize.where(Sequelize.cast(Sequelize.col("year_comm"), "TEXT"), {
                    [Op.iLike]: `%${search}%`,
                }),
            ]
        } : {};

        // Base where condition
        const whereCondition = { ...searchCondition };

        // Include associated models
        const include = [
            { model: ProductionType, as: 'production_type', attributes: ['type_name'] },
            { 
                model: Researcher,
                through: { attributes: [] },
                attributes: ['res_code', 'res_fname', 'res_lname', 'res_prof_email'],
                include: [{ 
                    model: Laboratory, 
                    as: "laboratory", 
                    attributes: ["lab_name"],
                    ...(laboratoryCode ? { where: { lab_code: laboratoryCode } } : {})
                }]
            },
            {
                model: DoctoralStudent,
                through: { attributes: [] },
                attributes: ['reg_num', 'doc_stud_fname', 'doc_stud_lname', 'doc_stud_prof_email'] 
            },
        ];

        // Fetch paginated results
        const communications = await Communication.findAll({
            where: whereCondition,
            include: include,
            order: [[sortBy, order]],
            limit: limit,
            offset: offset
        });

        // Fetch total count separately for better performance
        const totalItems = await Communication.count({ where: whereCondition });

        if (totalItems === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.CommunicationEmptyTable'),
                communications: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(totalItems / limit);

        res.status(StatusCodes.OK).json({
            communications,
            totalPages,
            currentPage: page,
            totalItems
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single Communication
const getCommunication = async (req, res) => {
    const { error, value: id_comm } = communicationIdSchema.validate(req.params.id_comm);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidCommunicationId') });

    try {
        const singleCommunication = await Communication.findByPk(id_comm, {
            include: [
                { model: ProductionType, as: 'production_type', attributes: ['type_name'] },
                { 
                    model: Researcher,
                    through: { attributes: [] }, // This excludes the join table attributes
                    attributes: ['res_code', 'res_fname', 'res_lname', 'res_prof_email'],
                    include: [{ model: Laboratory, as: "laboratory", attributes: ["lab_name"] }]
                },
                {
                    model: DoctoralStudent,
                    through: { attributes: [] },
                    attributes: ['reg_num', 'doc_stud_fname', 'doc_stud_lname', 'doc_stud_prof_email'] 
                },
            ]
        });

        if (!singleCommunication) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.CommunicationNotFound') });
        }

        res.status(StatusCodes.OK).json({communication: singleCommunication});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update a Communication
const updateCommunication = async (req, res) => {
    const { error: idError, value: id_comm } = communicationIdSchema.validate(req.params.id_comm);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidCommunicationId') });

    const { error, value } = communicationSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingCommunication = await Communication.findOne({
            where: {
                title_comm: value.title_comm,
                id_comm: { [Op.ne]: id_comm },
            },
        });

        if (existingCommunication) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CommunicationExists') });
        }

        const [updated] = await Communication.update(value, { where: { id_comm } });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.CommunicationNotFound') });
        }

        const updatedCommunication = await Communication.findByPk(id_comm, {
            include: [{ model: ProductionType, as: 'production_type', attributes: ['type_name'] }],
        });

        res.status(StatusCodes.OK).json({ message: req.t('success.CommunicationUpdated'), communication: updatedCommunication });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete a Communication
const deleteCommunication = async (req, res) => {
    const { error, value: id_comm } = communicationIdSchema.validate(req.params.id_comm);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidCommunicationId') });

    try {
        const deletedCommunication = await Communication.findByPk(id_comm);
        if (!deletedCommunication) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.CommunicationNotFound') });
        }
    
        await deletedCommunication.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.CommunicationDeleted'), communication: deletedCommunication });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteCommunication') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addCommunication,
    getCommunications,
    getAllCommunications,
    getCommunication,
    updateCommunication,
    deleteCommunication,
};