const { Op } = require('sequelize');
const { Publisher } = require('../models');
const { publisherSchema, publisherIdSchema } = require('../validators/publisher');
const { StatusCodes } = require('http-status-codes');

// Add publisher
const addPublisher = async (req, res) => {
    try {
        const { error, value } = publisherSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const { publisher_name, country } = value;
        const newPublisher = await Publisher.create({ publisher_name, country });
        res.status(StatusCodes.CREATED).json({ message: req.t('success.PublisherCreated'), publisher: newPublisher });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.PublisherExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all publishers
const getAllPublishers = async (req, res) => {
    try {
        const allPublishers = await Publisher.findAll({ order: [['publisher_id', 'ASC']] });
        if (allPublishers.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.PublisherEmptyTable'), publishers: [] });
        }
        res.status(StatusCodes.OK).json({publishers: allPublishers});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getPublishers = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'publisher_id';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['publisher_id', 'publisher_name', 'country'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        const whereCondition = search
            ? {
                [Op.or]: [
                    { publisher_name: { [Op.iLike]: `%${search}%` } },
                    { country: { [Op.iLike]: `%${search}%` } }
                ]
            }
            : {};

        const { count, rows: publishers } = await Publisher.findAndCountAll({
            where: whereCondition,
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
            attributes: ['publisher_id', 'publisher_name', 'country'],
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.PublisherEmptyTable'),
                publishers: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            publishers,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single publisher
const getPublisher = async (req, res) => {
    const { error, value: publisher_id } = publisherIdSchema.validate(req.params.publisher_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublisherId') });

    try {
        const singlePublisher = await Publisher.findByPk(publisher_id);
        if (!singlePublisher) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublisherNotFound') });
        }
        res.status(StatusCodes.OK).json({publisher: singlePublisher});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update publisher
const updatePublisher = async (req, res) => {
    const { error: idError, value: publisher_id } = publisherIdSchema.validate(req.params.publisher_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublisherId') });

    const { error, value } = publisherSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    const { publisher_name, country } = value;

    try {
        const existingPublisher = await Publisher.findOne({
            where: {
                publisher_name: value.publisher_name,
                publisher_id: { [Op.ne]: publisher_id }, // Exclude the current publisher
            },
        });

        if (existingPublisher) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.PublisherExists') });
        }

        const [updated] = await Publisher.update(
            { publisher_name, country },
            { where: { publisher_id } }
        );

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublisherNotFound') });
        }

        const updatedPublisher = await Publisher.findByPk(publisher_id);
        res.status(StatusCodes.OK).json({ message: req.t('success.PublisherUpdated'), publisher: updatedPublisher });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete publisher
const deletePublisher = async (req, res) => {
    const { error, value: publisher_id } = publisherIdSchema.validate(req.params.publisher_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublisherId') });

    try {
        const deletedPublisher = await Publisher.findByPk(publisher_id);
        if (!deletedPublisher) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublisherNotFound') });
        }
    
        await deletedPublisher.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.PublisherDeleted'), publisher: deletedPublisher });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeletePublisher') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addPublisher,
    getPublisher,
    getPublishers,
    getAllPublishers,
    updatePublisher,
    deletePublisher,
};