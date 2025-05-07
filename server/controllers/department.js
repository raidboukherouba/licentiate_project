const { Op } = require('sequelize');
const { Department } = require('../models');
const { departmentSchema, departmentIdSchema } = require('../validators/department');
const { StatusCodes } = require('http-status-codes');

// Add department
const addDepartment = async (req, res) => {
    try {
        const { error, value } = departmentSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const newDepartment = await Department.create({ dept_name: value.dept_name });
        res.status(StatusCodes.CREATED).json({ message: req.t('success.DepartmentCreated'), department: newDepartment });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.DepartmentExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all departments
const getAllDepartments = async (req, res) => {
    try {
        const allDepartments = await Department.findAll({ order: [['dept_id', 'ASC']] });
        if (allDepartments.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.DepartmentsEmptyTable'), departments: [] });
        }
        res.status(StatusCodes.OK).json({departments: allDepartments});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getDepartments = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1); // Default page: 1
        const limit = Math.max(1, parseInt(req.query.limit) || 8); // Default limit: 8
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'dept_id'; // Default sort column: dept_id
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC'; // Default order: ASC
        const search = req.query.search || ''; // Default search: empty string

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['dept_id', 'dept_name']; // Add valid columns for sorting
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        // Define the search condition
        const whereCondition = search
            ? { dept_name: { [Op.iLike]: `%${search}%` } } // Case-insensitive search
            : {};

        // Fetch departments with pagination, sorting, and search
        const { count, rows: departments } = await Department.findAndCountAll({
            where: whereCondition,
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        // If no departments are found
        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.DepartmentEmptyTable'),
                departments: [],
                totalPages: 0,
                currentPage: page
            });
        }

        // Calculate total pages
        const totalPages = Math.ceil(count / limit);

        // Return the response
        res.status(StatusCodes.OK).json({
            departments,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single department
const getDepartment = async (req, res) => {
    const { error, value: dept_id } = departmentIdSchema.validate(req.params.dept_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidDepartmentId') });

    try {
        const singleDepartment = await Department.findByPk(dept_id);
        if (!singleDepartment) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.DepartmentNotFound') });
        }
        res.status(StatusCodes.OK).json({department: singleDepartment});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update department
const updateDepartment = async (req, res) => {
    const { error: idError, value: dept_id } = departmentIdSchema.validate(req.params.dept_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidDepartmentId') });

    const { error, value } = departmentSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingDepartment = await Department.findOne({
            where: {
                dept_name: value.dept_name,
                dept_id: { [Op.ne]: dept_id }
            }
        });

        if (existingDepartment) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.DepartmentExists') });
        }

        const [updated] = await Department.update({ dept_name: value.dept_name }, {
            where: { dept_id: dept_id }
        });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.DepartmentNotFound') });
        }

        const updatedDepartment = await Department.findByPk(dept_id);
        res.status(StatusCodes.OK).json({ message: req.t('success.DepartmentUpdated'), department: updatedDepartment });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete department
const deleteDepartment = async (req, res) => {
    const { error, value: dept_id } = departmentIdSchema.validate(req.params.dept_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidDepartmentId') });

    try {
        const deletedDepartment = await Department.findByPk(dept_id);
        if (!deletedDepartment) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.DepartmentNotFound') });
        }
    
        await deletedDepartment.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.DepartmentDeleted'), department: deletedDepartment });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteDepartment') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addDepartment,
    getDepartment,
    getDepartments,
    getAllDepartments,
    updateDepartment,
    deleteDepartment
};