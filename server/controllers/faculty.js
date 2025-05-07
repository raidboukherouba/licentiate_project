const { Op } = require('sequelize');
const { Faculty } = require('../models');
const { facultySchema, facultyIdSchema } = require('../validators/faculty');
const { StatusCodes } = require('http-status-codes');

// Add faculty
const addFaculty = async (req, res) => {
    try {
        const { error, value } = facultySchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const newFaculty = await Faculty.create({ faculty_name: value.faculty_name });
        res.status(StatusCodes.CREATED).json({ message: req.t('success.FacultyCreated'), faculty: newFaculty });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.FacultyExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all faculties
const getAllFaculties = async (req, res) => {
    try {
        const allFaculties = await Faculty.findAll({ order: [['faculty_id', 'ASC']] });
        if (allFaculties.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.FacultyEmptyTable'), faculties: [] });
        }
        res.status(StatusCodes.OK).json({faculties: allFaculties});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getFaculties = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'faculty_id';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['faculty_id', 'faculty_name'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        const whereCondition = search
            ? { faculty_name: { [Op.iLike]: `%${search}%` } }
            : {};

        const { count, rows: faculties } = await Faculty.findAndCountAll({
            where: whereCondition,
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.FacultyEmptyTable'),
                faculties: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            faculties,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single faculty
const getFaculty = async (req, res) => {
    const { error, value: faculty_id } = facultyIdSchema.validate(req.params.faculty_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidFacultyId') });

    try {
        const singleFaculty = await Faculty.findByPk(faculty_id);
        if (!singleFaculty) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.FacultyNotFound') });
        }
        res.status(StatusCodes.OK).json({faculty: singleFaculty});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update faculty
const updateFaculty = async (req, res) => {
    const { error: idError, value: faculty_id } = facultyIdSchema.validate(req.params.faculty_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidFacultyId') });

    const { error, value } = facultySchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingFaculty = await Faculty.findOne({
            where: {
                faculty_name: value.faculty_name,
                faculty_id: { [Op.ne]: faculty_id }
            }
        });

        if (existingFaculty) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.FacultyExists') });
        }

        const [updated] = await Faculty.update({ faculty_name: value.faculty_name }, {
            where: { faculty_id: faculty_id }
        });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.FacultyNotFound') });
        }

        const updatedFaculty = await Faculty.findByPk(faculty_id);
        res.status(StatusCodes.OK).json({ message: req.t('success.FacultyUpdated'), faculty: updatedFaculty });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete faculty
const deleteFaculty = async (req, res) => {
    const { error, value: faculty_id } = facultyIdSchema.validate(req.params.faculty_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidFacultyId') });

    try {
        const deletedFaculty = await Faculty.findByPk(faculty_id);
        if (!deletedFaculty) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.FacultyNotFound') });
        }
    
        await deletedFaculty.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.FacultyDeleted'), faculty: deletedFaculty });
    } catch (error) {
        console.error("Database Error:", error.message);
        
        if (error.name === 'SequelizeDatabaseError' &&  error.parent?.code === '23502'){
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteFaculty') });
        }
    
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
    
};

module.exports = {
    addFaculty,
    getFaculty,
    getFaculties,
    getAllFaculties,
    updateFaculty,
    deleteFaculty
};