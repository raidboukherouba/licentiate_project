const { Op } = require('sequelize');
const { AssignResearcher, Researcher, Equipment, AssignDoctoralStudent, Laboratory } = require('../models');
const { assignResearcherSchema, updateAssignResearcherSchema, assignResearcherIdSchema } = require('../validators/assignResearcher');
const { StatusCodes } = require('http-status-codes');

// Assign equipment to a researcher
const addAssignResearcher = async (req, res) => {
    try {
        const { error, value } = assignResearcherSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        // Check if the equipment is already assigned with NULL res_return_date
        const existingAssignment = await AssignResearcher.findOne({
            where: {
                inventory_num: value.inventory_num,
                res_return_date: { [Op.is]: null }
            }
        });

        if (existingAssignment) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.EquipmentAlreadyAssignedResearcher')
            });
        }

         // Check if the researcher is already assigned the equipment 
         const existingResAffiliation = await AssignResearcher.findOne({
            where: {
                res_code: value.res_code,
                inventory_num: value.inventory_num
            }
        });

        if (existingResAffiliation) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.ResearcherAlreadyAssignedPast')
            });
        }

        // Check if the doctoral student is already assigned the equipment 
        const existingDocAffiliation = await AssignDoctoralStudent.findOne({
            where: {
                inventory_num: value.inventory_num,
                doc_stud_return_date: { [Op.is]: null }
            }
        });

        if (existingDocAffiliation) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.DoctoralStudentAlreadyAssignedPast')
            });
        }

        // Check if res_return_date is after res_assign_date
        if (value.res_return_date && new Date(value.res_return_date) < new Date(value.res_assign_date)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidReturnDate')
            });
        }

        const newAssignment = await AssignResearcher.create(value);

        res.status(StatusCodes.CREATED).json({ message: req.t('success.AssignmentResearcherCreated'), assignment: newAssignment });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all assignments

// const getAssignResearchers = async (req, res) => {
//     try {
//         const allAssignments = await AssignResearcher.findAll({
//             include: [
//                 { model: Researcher, attributes: ['res_code', 'res_prof_email'] },
//                 { model: Equipment, attributes: ['inventory_num', 'equip_name'] },
//             ],
//             order: [['res_code', 'ASC'], ['inventory_num', 'ASC']]
//         });

//         if (allAssignments.length === 0) {
//             return res.status(StatusCodes.OK).json({ message: req.t('success.AssignmentResearcherEmptyTable'), assignments: [] });
//         }

//         res.status(StatusCodes.OK).json({ assignments: allAssignments });
//     } catch (error) {
//         console.error("Database Error:", error.message);
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
//     }
// };

const getAssignResearchers = async (req, res) => {
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
        const validColumns = ['res_code', 'inventory_num', 'res_assign_date', 'res_return_date'];
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
                    { '$Equipment.equip_name$': { [Op.iLike]: `%${search}%` } },
                    { '$Equipment.inventory_num$': { [Op.iLike]: `%${search}%` } },
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

        const { count, rows: assignments } = await AssignResearcher.findAndCountAll({
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
                    model: Equipment, 
                    attributes: ['inventory_num', 'equip_name'] 
                },
            ],
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.AssignmentResearcherEmptyTable'),
                assignments: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            assignments,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single assignment by res_code and inventory_num
const getAssignResearcher = async (req, res) => {
    const { error, value: { res_code, inventory_num } } = assignResearcherIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidAssignmentId') });

    try {
        const singleAssignment = await AssignResearcher.findOne({
            where: { res_code, inventory_num },
            include: [
                { model: Researcher, attributes: ['res_code', 'res_prof_email', 'res_fname', 'res_lname'],
                    include: [{ 
                        model: Laboratory, 
                        as: "laboratory", 
                        attributes: ["lab_name"] 
                    }] },
                { model: Equipment, attributes: ['inventory_num', 'equip_name'] },
            ]
        });

        if (!singleAssignment) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.AssignmentResearcherNotFound') });
        }

        res.status(StatusCodes.OK).json({ assignment: singleAssignment });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update an assignment
const updateAssignResearcher = async (req, res) => {
    const { error: idError, value: { res_code, inventory_num } } = assignResearcherIdSchema.validate(req.params);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidAssignmentId') });

    const { error, value } = updateAssignResearcherSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingAssignment = await AssignResearcher.findOne({
            where: { res_code, inventory_num }
        });

        if (!existingAssignment) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.AssignmentResearcherNotFound') });
        }

        if (value.hasOwnProperty('res_return_date') && value.res_return_date !== existingAssignment.res_return_date) {
            // Prevent updating res_return_date if the equipment is assigned to someone else
            const existingActiveAssignment = await AssignResearcher.findOne({
                where: {
                    inventory_num,
                    res_code: { [Op.ne]: res_code }, // Ensure it's assigned to a different researcher
                    res_return_date: { [Op.is]: null }
                }
            });

            if (existingActiveAssignment && (value.res_return_date === undefined || value.res_return_date === null)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: req.t('error.EquipmentAlreadyAssignedResearcher')
                });
            }

            const existingActiveDocAssignment = await AssignDoctoralStudent.findOne({
                where: {
                    inventory_num,
                    doc_stud_return_date: { [Op.is]: null }
                }
            });

            if (existingActiveDocAssignment && (value.doc_stud_return_date === undefined || value.doc_stud_return_date === null)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: req.t('error.EquipmentAlreadyAssignedDoctoralStudent')
                });
            }
        }    

        // Check if res_return_date is after res_assign_date
        if (value.res_return_date && new Date(value.res_return_date) < new Date(value.res_assign_date)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidReturnDate')
            });
        }

        // Update assignment
        const [updated] = await AssignResearcher.update(value, { where: { res_code, inventory_num } });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.AssignmentResearcherNotFound') });
        }

        const updatedAssignment = await AssignResearcher.findOne({
            where: { res_code, inventory_num },
            include: [
                { model: Researcher, attributes: ['res_code', 'res_prof_email'] },
                { model: Equipment, attributes: ['inventory_num', 'equip_name'] },
            ]
        });

        res.status(StatusCodes.OK).json({ message: req.t('success.AssignmentResearcherUpdated'), assignment: updatedAssignment });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete an assignment
const deleteAssignResearcher = async (req, res) => {
    const { error, value: { res_code, inventory_num } } = assignResearcherIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidAssignmentId') });

    try {
        const deletedAssignment = await AssignResearcher.findOne({ where: { res_code, inventory_num } });
        if (!deletedAssignment) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.AssignmentResearcherNotFound') });
        }

        await deletedAssignment.destroy();

        res.status(StatusCodes.OK).json({ message: req.t('success.AssignmentResearcherDeleted'), assignment: deletedAssignment });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addAssignResearcher,
    getAssignResearcher,
    getAssignResearchers,
    updateAssignResearcher,
    deleteAssignResearcher,
};
