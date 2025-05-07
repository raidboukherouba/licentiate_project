const { Op } = require('sequelize');
const { Supervise, Researcher, DoctoralStudent, Laboratory } = require('../models');
const { superviseSchema, updateSuperviseSchema, superviseIdSchema } = require('../validators/supervise');
const { StatusCodes } = require('http-status-codes');

// Add a new supervision
const addSupervise = async (req, res) => {
    try {
        const { error, value } = superviseSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        // Check if the researcher is already supervising another student with NULL super_end_date
        const existingSupervision = await Supervise.findOne({
            where: {
                res_code: value.res_code,
                super_end_date: { [Op.is]: null }  // Check for active supervision
            }
        });
        if (existingSupervision) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                error: req.t('error.ResearcherAlreadySupervising') 
            });
        }

        // Check if the student is already being supervised by another researcher with NULL super_end_date
        const existingSupervisionStudent = await Supervise.findOne({
            where: {
                reg_num: value.reg_num,
                super_end_date: { [Op.is]: null }  // Check for active supervision
            }
        });

        if (existingSupervisionStudent) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                error: req.t('error.StudentAlreadySupervised') 
            });
        }

        // Check if the supervision is already set but finished
        const existingPastSupervision = await Supervise.findOne({
            where: {
                res_code: value.res_code,
                reg_num: value.reg_num
            }
        });

        if (existingPastSupervision) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.SupervisionSetPast')
            });
        }

        // Check if super_end_date is after super_start_date
        if (value.super_end_date && new Date(value.super_end_date) < new Date(value.super_start_date)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidEndDate')
            });
        }

        const newSupervise = await Supervise.create(value);

        res.status(StatusCodes.CREATED).json({ message: req.t('success.SuperviseCreated'), supervise: newSupervise });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all supervisions

// const getSupervises = async (req, res) => {
//     try {
//         const allSupervises = await Supervise.findAll({
//             include: [
//                 { model: Researcher, attributes: ['res_code', 'res_prof_email', 'lab_code'],  include: [{ model: Laboratory, as: "laboratory", attributes: ["lab_name"] }] },
//                 { model: DoctoralStudent, attributes: ['reg_num', 'doc_stud_prof_email'] },
//             ],
//             order: [['res_code', 'ASC'], ['reg_num', 'ASC']]
//         });

//         if (allSupervises.length === 0) {
//             return res.status(StatusCodes.OK).json({ message: req.t('success.SuperviseEmptyTable'), supervises: [] });
//         }

//         res.status(StatusCodes.OK).json({ supervises: allSupervises });
//     } catch (error) {
//         console.error("Database Error:", error.message);
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
//     }
// };

const getSupervises = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'res_code';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';
        const labCode = req.query.labCode || null; // Add laboratory filter

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['res_code', 'reg_num', 'super_start_date', 'super_end_date', 'super_theme'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        // Base where condition for search
        const searchCondition = search
            ? {
                [Op.or]: [
                    { '$Researcher.res_fname$': { [Op.iLike]: `%${search}%` } },
                    { '$Researcher.res_lname$': { [Op.iLike]: `%${search}%` } },
                    { '$Researcher.res_prof_email$': { [Op.iLike]: `%${search}%` } },
                    { '$DoctoralStudent.doc_stud_fname$': { [Op.iLike]: `%${search}%` } },
                    { '$DoctoralStudent.doc_stud_lname$': { [Op.iLike]: `%${search}%` } },
                    { '$DoctoralStudent.doc_stud_prof_email$': { [Op.iLike]: `%${search}%` } },
                    { super_theme: { [Op.iLike]: `%${search}%` } },
                ]
            }
            : {};

        // Add laboratory filter if provided
        const laboratoryCondition = labCode
            ? { '$Researcher.lab_code$': labCode }
            : {};

        // Combine search and laboratory conditions
        const whereCondition = {
            ...searchCondition,
            ...laboratoryCondition,
        };

        const { count, rows: supervises } = await Supervise.findAndCountAll({
            where: whereCondition,
            include: [
                { 
                    model: Researcher, 
                    attributes: ['res_code', 'res_fname', 'res_lname', 'res_prof_email', 'lab_code'],  
                    include: [{ 
                        model: Laboratory, 
                        as: "laboratory", 
                        attributes: ["lab_name"] 
                    }] 
                },
                { 
                    model: DoctoralStudent, 
                    attributes: ['reg_num', 'doc_stud_fname', 'doc_stud_lname', 'doc_stud_prof_email'] 
                },
            ],
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.SuperviseEmptyTable'),
                supervises: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            supervises,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};


// Get a single supervision by res_code and reg_num
const getSupervise = async (req, res) => {
    const { error, value: { res_code, reg_num } } = superviseIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidSuperviseId') });

    try {
        const singleSupervise = await Supervise.findOne({
            where: { res_code, reg_num },
            include: [
                { model: Researcher, attributes: ['res_code', 'res_prof_email', 'res_fname', 'res_lname'],
                    include: [{ 
                        model: Laboratory, 
                        as: "laboratory", 
                        attributes: ["lab_name"] 
                    }] 
                 },
                { model: DoctoralStudent, attributes: ['reg_num', 'doc_stud_prof_email', 'doc_stud_fname', 'doc_stud_lname'] },
            ]
        });

        if (!singleSupervise) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.SuperviseNotFound') });
        }

        res.status(StatusCodes.OK).json({ supervise: singleSupervise });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update a supervision
const updateSupervise = async (req, res) => {
    const { error: idError, value: { res_code, reg_num } } = superviseIdSchema.validate(req.params);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidSuperviseId') });

    const { error, value } = updateSuperviseSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });
    
    try {
        // Fetch existing supervision
        const existingSupervision = await Supervise.findOne({
            where: { res_code, reg_num }
        });

        if (!existingSupervision) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.SuperviseNotFound') });
        }

        // Only check active supervision if updating super_end_date
        if (value.hasOwnProperty('super_end_date') && value.super_end_date !== existingSupervision.super_end_date) {
            // Check if the rsearcher is already supervise another student
            const activeSupervision = await Supervise.findOne({
                where: {
                    res_code: res_code, // Same researcher
                    super_end_date: { [Op.is]: null }, // Active supervision
                    reg_num: { [Op.ne]: reg_num } // Exclude current supervision
                }
            });

            if (activeSupervision) {
                return res.status(StatusCodes.BAD_REQUEST).json({ 
                    error: req.t('error.ResearcherAlreadySupervising') 
                });
            }

            // Check if the student is already supervised by another researcher
            const activeStudentSupervision = await Supervise.findOne({
                where: {
                    reg_num: reg_num, // Same student
                    super_end_date: { [Op.is]: null }, // Active supervision
                    res_code: { [Op.ne]: res_code } // Different researcher
                }
            });

            if (activeStudentSupervision) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.StudentAlreadySupervised') });
            }

        }

        // Ensure that super_end_date is after super_start_date
        if (value.super_end_date && new Date(value.super_end_date) < new Date(value.super_start_date)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidEndDate')
            });
        }

        // Update supervision
        const [updated] = await Supervise.update(value, { where: { res_code, reg_num } });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.SuperviseNotFound') });
        }

        const updatedSupervise = await Supervise.findOne({
            where: { res_code, reg_num },
            include: [
                { model: Researcher, attributes: ['res_code', 'res_prof_email'] },
                { model: DoctoralStudent, attributes: ['reg_num', 'doc_stud_prof_email'] },
            ]
        });

        res.status(StatusCodes.OK).json({ message: req.t('success.SuperviseUpdated'), supervise: updatedSupervise });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete a supervision
const deleteSupervise = async (req, res) => {
    const { error, value: { res_code, reg_num } } = superviseIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidSuperviseId') });

    try {
        const deletedSupervise = await Supervise.findOne({ where: { res_code, reg_num } });
        if (!deletedSupervise) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.SuperviseNotFound') });
        }

        await deletedSupervise.destroy();

        res.status(StatusCodes.OK).json({ message: req.t('success.SuperviseDeleted'), supervise: deletedSupervise });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addSupervise,
    getSupervise,
    getSupervises,
    updateSupervise,
    deleteSupervise,
};