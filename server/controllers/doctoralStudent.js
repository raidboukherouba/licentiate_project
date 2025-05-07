const { Op } = require('sequelize');
const { DoctoralStudent, Team, Function, Speciality, Laboratory } = require('../models');
const { doctoralStudentSchema, regNumSchema } = require('../validators/doctoralStudent');
const { StatusCodes } = require('http-status-codes');

// Add doctoral student
const addDoctoralStudent = async (req, res) => {
    try {
        const { error, value } = doctoralStudentSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const newDoctoralStudent = await DoctoralStudent.create(value);

        res.status(StatusCodes.CREATED).json({ message: req.t('success.DoctoralStudentCreated'), doctoralStudent: newDoctoralStudent });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.DoctoralStudentExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all doctoral students
const getAllDoctoralStudents = async (req, res) => {
    try {
        const allDoctoralStudents = await DoctoralStudent.findAll({
            include: [
                { model: Team, as: 'team', attributes: ['team_name'] },
                { model: Function, as: 'function', attributes: ['func_name'] },
                { model: Speciality, as: 'speciality', attributes: ['spec_name'] },
                { model: Laboratory, as: 'laboratory', attributes: ['lab_name'] },
            ],
            order: [['reg_num', 'ASC']]
        });

        if (allDoctoralStudents.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.DoctoralStudentEmptyTable'), doctoralStudents: [] });
        }

        res.status(StatusCodes.OK).json({doctoralStudents: allDoctoralStudents});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getDoctoralStudents = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'reg_num';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';
        const teamId = req.query.teamId || null; // Add teamId from query
        const laboratoryId = req.query.laboratoryId || null; // Add laboratoryId from query

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['reg_num', 'doc_stud_fname', 'doc_stud_lname', 'doc_stud_prof_email', 'doc_stud_grade'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        // Base where condition for search
        const searchCondition = search
            ? {
                [Op.or]: [
                    { doc_stud_fname: { [Op.iLike]: `%${search}%` } },
                    { doc_stud_lname: { [Op.iLike]: `%${search}%` } },
                    { doc_stud_prof_email: { [Op.iLike]: `%${search}%` } },
                    { doc_stud_grade: { [Op.iLike]: `%${search}%` } },
                ]
            }
            : {};

        // Add team and laboratory filters if provided
        const teamCondition = teamId
            ? { team_id: teamId }
            : {};
        const laboratoryCondition = laboratoryId
            ? { lab_code: laboratoryId }
            : {};

        // Combine search, team, and laboratory conditions
        const whereCondition = {
            ...searchCondition,
            ...teamCondition,
            ...laboratoryCondition,
        };

        const { count, rows: doctoralStudents } = await DoctoralStudent.findAndCountAll({
            where: whereCondition,
            include: [
                { model: Team, as: 'team', attributes: ['team_name'] },
                { model: Function, as: 'function', attributes: ['func_name'] },
                { model: Speciality, as: 'speciality', attributes: ['spec_name'] },
                { model: Laboratory, as: 'laboratory', attributes: ['lab_name'] },
            ],
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.DoctoralStudentEmptyTable'),
                doctoralStudents: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            doctoralStudents,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single doctoral student
const getDoctoralStudent = async (req, res) => {
    const { error, value: reg_num } = regNumSchema.validate(req.params.reg_num);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidDoctoralStudentId') });

    try {
        const singleDoctoralStudent = await DoctoralStudent.findByPk(reg_num, {
            include: [
                { model: Team, as: 'team', attributes: ['team_name'] },
                { model: Function, as: 'function', attributes: ['func_name'] },
                { model: Speciality, as: 'speciality', attributes: ['spec_name'] },
                { model: Laboratory, as: 'laboratory', attributes: ['lab_name'] },
            ]
        });

        if (!singleDoctoralStudent) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.DoctoralStudentNotFound') });
        }

        res.status(StatusCodes.OK).json({doctoralStudent: singleDoctoralStudent});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update doctoral student
const updateDoctoralStudent = async (req, res) => {
    const { error: idError, value: reg_num } = regNumSchema.validate(req.params.reg_num);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidDoctoralStudentId') });

    const { error, value } = doctoralStudentSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingDoctoralStudent = await DoctoralStudent.findOne({
            where: {
                doc_stud_prof_email: value.doc_stud_prof_email,
                reg_num: { [Op.ne]: reg_num }, // Exclude the current doctoralStudent
            },
        });

        if (existingDoctoralStudent) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.DoctoralStudentExists') });
        }

        const [updated] = await DoctoralStudent.update(value, { where: { reg_num } });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.DoctoralStudentNotFound') });
        }

        const updatedDoctoralStudent = await DoctoralStudent.findByPk(reg_num, {
            include: [
                { model: Team, as: 'team', attributes: ['team_name'] },
                { model: Function, as: 'function', attributes: ['func_name'] },
                { model: Speciality, as: 'speciality', attributes: ['spec_name'] },
                { model: Laboratory, as: 'laboratory', attributes: ['lab_name'] },
            ]
        });

        res.status(StatusCodes.OK).json({ message: req.t('success.DoctoralStudentUpdated'), doctoralStudent: updatedDoctoralStudent });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete doctoral student
const deleteDoctoralStudent = async (req, res) => {
    const { error, value: reg_num } = regNumSchema.validate(req.params.reg_num);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidDoctoralStudentId') });

    try {
        const deletedDoctoralStudent = await DoctoralStudent.findByPk(reg_num);
        if (!deletedDoctoralStudent) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.DoctoralStudentNotFound') });
        }
    
        await deletedDoctoralStudent.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.DoctoralStudentDeleted'), DoctoralStudent: deletedDoctoralStudent });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteDoctoralStudent') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addDoctoralStudent,
    getDoctoralStudent,
    getDoctoralStudents,
    getAllDoctoralStudents,
    updateDoctoralStudent,
    deleteDoctoralStudent,
};