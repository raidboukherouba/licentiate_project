const { Op } = require('sequelize');
const { Speciality } = require('../models');
const { specialitySchema, specialityIdSchema } = require('../validators/speciality');
const { StatusCodes } = require('http-status-codes');

// Add speciality
const addSpeciality = async (req, res) => {
    try {
        const { error, value } = specialitySchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const newSpeciality = await Speciality.create({ spec_name: value.spec_name });
        res.status(StatusCodes.CREATED).json({ message: req.t('success.SpecialityCreated'), speciality: newSpeciality });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.SpecialityExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all specialities
const getAllSpecialities = async (req, res) => {
    try {
        const allSpecialities = await Speciality.findAll({ order: [['spec_code', 'ASC']] });
        if (allSpecialities.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.SpecialityEmptyTable'), specialities: [] });
        }
        res.status(StatusCodes.OK).json({specialities: allSpecialities});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getSpecialities = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'spec_code';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['spec_code', 'spec_name'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        const whereCondition = search
            ? { spec_name: { [Op.iLike]: `%${search}%` } }
            : {};

        const { count, rows: specialities } = await Speciality.findAndCountAll({
            where: whereCondition,
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.SpecialityEmptyTable'),
                specialities: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            specialities,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single speciality
const getSpeciality = async (req, res) => {
    const { error, value: spec_code } = specialityIdSchema.validate(req.params.spec_code);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidSpecialityId') });

    try {
        const singleSpeciality = await Speciality.findByPk(spec_code);
        if (!singleSpeciality) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.SpecialityNotFound') });
        }
        res.status(StatusCodes.OK).json({speciality: singleSpeciality});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update speciality
const updateSpeciality = async (req, res) => {
    const { error: idError, value: spec_code } = specialityIdSchema.validate(req.params.spec_code);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidSpecialityId') });

    const { error, value } = specialitySchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingSpeciality = await Speciality.findOne({
            where: {
                spec_name: value.spec_name,
                spec_code: { [Op.ne]: spec_code }
            }
        });

        if (existingSpeciality) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.SpecialityExists') });
        }

        const [updated] = await Speciality.update({ spec_name: value.spec_name }, {
            where: { spec_code: spec_code }
        });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.SpecialityNotFound') });
        }

        const updatedSpeciality = await Speciality.findByPk(spec_code);
        res.status(StatusCodes.OK).json({ message: req.t('success.SpecialityUpdated'), speciality: updatedSpeciality });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete speciality
const deleteSpeciality = async (req, res) => {
    const { error, value: spec_code } = specialityIdSchema.validate(req.params.spec_code);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidSpecialityId') });

    try {
        const deletedSpeciality = await Speciality.findByPk(spec_code);
        if (!deletedSpeciality) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.SpecialityNotFound') });
        }
    
        await deletedSpeciality.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.SpecialityDeleted'), speciality: deletedSpeciality });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteSpeciality') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addSpeciality,
    getSpeciality,
    getSpecialities,
    getAllSpecialities,
    updateSpeciality,
    deleteSpeciality
};