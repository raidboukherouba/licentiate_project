const { Op } = require('sequelize');
const { Domain } = require('../models');
const { domainSchema, domainIdSchema } = require('../validators/domain');
const { StatusCodes } = require('http-status-codes');

// Add domain
const addDomain = async (req, res) => {
    try {
        const { error, value } = domainSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const { domain_name, domain_abbr } = value;
        const newDomain = await Domain.create({ domain_name, domain_abbr });
        res.status(StatusCodes.CREATED).json({ message: req.t('success.DomainCreated'), domain: newDomain });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.DomainExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all domains
const getAllDomains = async (req, res) => {
    try {
        const allDomains = await Domain.findAll({ order: [['domain_id', 'ASC']] });
        if (allDomains.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.DomainEmptyTable'), domains: [] });
        }
        res.status(StatusCodes.OK).json({domains: allDomains});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getDomains = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'domain_id';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['domain_id', 'domain_name', 'domain_abbr'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        const whereCondition = search
            ? {
                [Op.or]: [
                    { domain_name: { [Op.iLike]: `%${search}%` } },
                    { domain_abbr: { [Op.iLike]: `%${search}%` } }
                ]
            }
            : {};

        const { count, rows: domains } = await Domain.findAndCountAll({
            where: whereCondition,
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
            attributes: ['domain_id', 'domain_name', 'domain_abbr'],
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.DomainEmptyTable'),
                domains: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            domains,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single domain
const getDomain = async (req, res) => {
    const { error, value: domain_id } = domainIdSchema.validate(req.params.domain_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidDomainId') });

    try {
        const singleDomain = await Domain.findByPk(domain_id);
        if (!singleDomain) return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.DomainNotFound') });

        res.status(StatusCodes.OK).json({domain: singleDomain});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update domain
const updateDomain = async (req, res) => {
    const { error: idError, value: domain_id } = domainIdSchema.validate(req.params.domain_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidDomainId') });

    const { error, value } = domainSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    const { domain_name, domain_abbr } = value;

    try {
        const existingDomain = await Domain.findOne({
            where: {
                domain_name: value.domain_name,
                domain_id: { [Op.ne]: domain_id }, // Exclude the current domain
            },
        });

        if (existingDomain) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.DomainExists') });
        }

        const [updated] = await Domain.update(
            { domain_name, domain_abbr },
            { where: { domain_id } }
        );

        if (!updated) return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.DomainNotFound') });

        const updatedDomain = await Domain.findByPk(domain_id);
        res.status(StatusCodes.OK).json({ message: req.t('success.DomainUpdated'), domain: updatedDomain });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete domain
const deleteDomain = async (req, res) => {
    const { error, value: domain_id } = domainIdSchema.validate(req.params.domain_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidDomainId') });

    try {
        const deletedDomain = await Domain.findByPk(domain_id);
        if (!deletedDomain) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.DomainNotFound') });
        }
    
        await deletedDomain.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.DomainDeleted'), domain: deletedDomain });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeDatabaseError' &&  error.parent?.code === '23502') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteDomain') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addDomain,
    getDomain,
    getDomains,
    getAllDomains,
    updateDomain,
    deleteDomain,
};