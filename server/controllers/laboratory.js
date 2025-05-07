const { Op } = require('sequelize');
const { Laboratory, Faculty, Domain, Department } = require('../models');
const { laboratorySchema, laboratoryIdSchema } = require('../validators/laboratory');
const { StatusCodes } = require('http-status-codes');

// Add laboratory
const addLaboratory = async (req, res) => {
    try {
        const { error, value } = laboratorySchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const { lab_name, lab_abbr, lab_desc, lab_address, lab_phone, faculty_id, domain_id, dept_id } = value;
        const newLaboratory = await Laboratory.create({
            lab_name,
            lab_abbr,
            lab_desc,
            lab_address,
            lab_phone,
            faculty_id,
            domain_id,
            dept_id,
        });

        res.status(StatusCodes.CREATED).json({ message: req.t('success.LaboratoryCreated'), laboratory: newLaboratory });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.LaboratoryExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all laboratories
const getAllLaboratories = async (req, res) => {
    try {
        const allLaboratories = await Laboratory.findAll({ order: [['lab_code', 'ASC']] });
        if (allLaboratories.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.LaboratoryEmptyTable'), laboratories: [] });
        }
        res.status(StatusCodes.OK).json({laboratories: allLaboratories});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getLaboratories = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'lab_code';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';
        const facultyId = req.query.facultyId || null; // Add facultyId from query

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['lab_code', 'lab_name', 'lab_abbr', 'lab_desc', 'lab_adress', 'lab_phone', 'faculty_name', 'domain_name', 'dept_name'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        // Base where condition for search
        const searchCondition = search
            ? {
                [Op.or]: [
                    { lab_name: { [Op.iLike]: `%${search}%` } },
                    { lab_abbr: { [Op.iLike]: `%${search}%` } },
                    { '$faculty.faculty_name$': { [Op.iLike]: `%${search}%` } },
                    { '$domain.domain_name$': { [Op.iLike]: `%${search}%` } },
                    { '$department.dept_name$': { [Op.iLike]: `%${search}%` } }
                ]
            }
            : {};

        // Add facultyId filter if provided
        const facultyCondition = facultyId
            ? { faculty_id: facultyId }
            : {};

        // Combine search and faculty conditions
        const whereCondition = {
            ...searchCondition,
            ...facultyCondition,
        };

        const { count, rows: laboratories } = await Laboratory.findAndCountAll({
            where: whereCondition,
            include: [
                { model: Faculty, as: 'faculty', attributes: ['faculty_name'] },
                { model: Domain, as: 'domain', attributes: ['domain_name'] },
                { model: Department, as: 'department', attributes: ['dept_name'] }
            ],
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.LaboratoryEmptyTable'),
                laboratories: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            laboratories,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single laboratory
const getLaboratory = async (req, res) => {
    const { error, value: lab_code } = laboratoryIdSchema.validate(req.params.lab_code);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidLaboratoryId') });

    try {
        const singleLaboratory = await Laboratory.findByPk(lab_code, {
            include: [
                { model: Faculty, as: 'faculty', attributes: ['faculty_name'] },
                { model: Domain, as: 'domain', attributes: ['domain_name'] },
                { model: Department, as: 'department', attributes: ['dept_name'] }
            ]
        });

        if (!singleLaboratory) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.LaboratoryNotFound') });
        }

        res.status(StatusCodes.OK).json({laboratory: singleLaboratory});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update laboratory
const updateLaboratory = async (req, res) => {
    const { error: idError, value: lab_code } = laboratoryIdSchema.validate(req.params.lab_code);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidLaboratoryId') });

    const { error, value } = laboratorySchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    const { lab_name, lab_abbr, lab_desc, lab_address, lab_phone, faculty_id, domain_id, dept_id } = value;

    try {
        const existingLaboratory = await Laboratory.findOne({
            where: {
                lab_name: value.lab_name,
                lab_code: { [Op.ne]: lab_code }, // Exclude the current laboratory
            },
        });

        if (existingLaboratory) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.LaboratoryExists') });
        }

        const [updated] = await Laboratory.update(
            { lab_name, lab_abbr, lab_desc, lab_address, lab_phone, faculty_id, domain_id, dept_id },
            { where: { lab_code } }
        );

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.LaboratoryNotFound') });
        }

        const updatedLaboratory = await Laboratory.findByPk(lab_code, {
            include: [
                { model: Faculty, as: 'faculty', attributes: ['faculty_name'] },
                { model: Domain, as: 'domain', attributes: ['domain_name'] },
                { model: Department, as: 'department', attributes: ['dept_name'] }
            ]
        });

        res.status(StatusCodes.OK).json({ message: req.t('success.LaboratoryUpdated'), laboratory: updatedLaboratory });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete laboratory
const deleteLaboratory = async (req, res) => {
    const { error, value: lab_code } = laboratoryIdSchema.validate(req.params.lab_code);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidLaboratoryId') });

    try {
        const deletedLaboratory = await Laboratory.findByPk(lab_code);
        if (!deletedLaboratory) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.LaboratoryNotFound') });
        }
    
        await deletedLaboratory.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.LaboratoryDeleted'), laboratory: deletedLaboratory });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteLaboratory') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addLaboratory,
    getLaboratory,
    getLaboratories,
    getAllLaboratories,
    updateLaboratory,
    deleteLaboratory,
};