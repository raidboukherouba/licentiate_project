const { Op } = require('sequelize');
const { AssignDoctoralStudent, DoctoralStudent, Equipment, AssignResearcher, Laboratory } = require('../models');
const { assignDoctoralStudentSchema, updateAssignDoctoralStudentSchema, assignDoctoralStudentIdSchema } = require('../validators/assignDoctoralStudent');
const { StatusCodes } = require('http-status-codes');

// Assign equipment to a doctoral student
const addAssignDoctoralStudent = async (req, res) => {
    try {
        const { error, value } = assignDoctoralStudentSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        // Check if the equipment is already assigned and not returned
        const existingAssignment = await AssignDoctoralStudent.findOne({
            where: {
                inventory_num: value.inventory_num,
                doc_stud_return_date: { [Op.is]: null }
            }
        });

        if (existingAssignment) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.EquipmentAlreadyAssignedDoctoralStudent')
            });
        }

        // Check if the doctoral student is already assigned the equipment 
        const existingDocAffiliation = await AssignDoctoralStudent.findOne({
            where: {
                reg_num: value.reg_num,
                inventory_num: value.inventory_num
            }
        });

        if (existingDocAffiliation) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.DoctoralStudentAlreadyAssignedPast')
            });
        }

        // Check if the researcher is already assigned the equipment 
        const existingResAffiliation = await AssignResearcher.findOne({
            where: {
                inventory_num: value.inventory_num,
                res_return_date: { [Op.is]: null }
            }
        });

        if (existingResAffiliation) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.ResearcherAlreadyAssignedPast')
            });
        }

        // Ensure doc_stud_return_date is after doc_stud_assign_date
        if (value.doc_stud_return_date && new Date(value.doc_stud_return_date) < new Date(value.doc_stud_assign_date)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidReturnDate')
            });
        }

        const newAssignment = await AssignDoctoralStudent.create(value);

        res.status(StatusCodes.CREATED).json({ message: req.t('success.AssignmentDoctoralStudentCreated'), assignment: newAssignment });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all doctoral student assignments
// const getAssignDoctoralStudents = async (req, res) => {
//     try {
//         const allAssignments = await AssignDoctoralStudent.findAll({
//             include: [
//                 { model: DoctoralStudent, attributes: ['reg_num', 'doc_stud_prof_email'] },
//                 { model: Equipment, attributes: ['inventory_num', 'equip_name'] },
//             ],
//             order: [['reg_num', 'ASC'], ['inventory_num', 'ASC']]
//         });

//         if (allAssignments.length === 0) {
//             return res.status(StatusCodes.OK).json({ message: req.t('success.AssignmentDoctoralStudentEmptyTable'), assignments: [] });
//         }

//         res.status(StatusCodes.OK).json({ assignments: allAssignments });
//     } catch (error) {
//         console.error("Database Error:", error.message);
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
//     }
// };

const getAssignDoctoralStudents = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'reg_num';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';
        const labCode = req.query.labCode || null; // Add laboratory filter

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['reg_num', 'inventory_num', 'doc_stud_assign_date', 'doc_stud_return_date'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        // Base where condition for search
        const searchCondition = search
            ? {
                [Op.or]: [
                    { '$DoctoralStudent.doc_stud_fname$': { [Op.iLike]: `%${search}%` } },
                    { '$DoctoralStudent.doc_stud_lname$': { [Op.iLike]: `%${search}%` } },
                    { '$DoctoralStudent.doc_stud_prof_email$': { [Op.iLike]: `%${search}%` } },
                    { '$Equipment.equip_name$': { [Op.iLike]: `%${search}%` } },
                    { '$Equipment.inventory_num$': { [Op.iLike]: `%${search}%` } },
                ]
            }
            : {};

        // Add laboratory filter if provided
        const laboratoryCondition = labCode
            ? { '$DoctoralStudent.lab_code$': labCode }
            : {};

        // Combine search and laboratory conditions
        const whereCondition = {
            ...searchCondition,
            ...laboratoryCondition,
        };

        const { count, rows: assignments } = await AssignDoctoralStudent.findAndCountAll({
            where: whereCondition,
            include: [
                { 
                    model: DoctoralStudent, 
                    attributes: ['reg_num', 'doc_stud_fname', 'doc_stud_lname', 'doc_stud_prof_email', 'lab_code'],
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
                message: req.t('success.AssignmentDoctoralStudentEmptyTable'),
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

// Get a single assignment by reg_num and inventory_num
const getAssignDoctoralStudent = async (req, res) => {
    const { error, value: { reg_num, inventory_num } } = assignDoctoralStudentIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidAssignmentId') });

    try {
        const singleAssignment = await AssignDoctoralStudent.findOne({
            where: { reg_num, inventory_num },
            include: [
                { model: DoctoralStudent, attributes: ['reg_num', 'doc_stud_prof_email', 'doc_stud_fname', 'doc_stud_lname'],
                    include: [{ 
                        model: Laboratory, 
                        as: "laboratory", 
                        attributes: ["lab_name"] 
                    }] },
                { model: Equipment, attributes: ['inventory_num', 'equip_name'] },
            ]
        });

        if (!singleAssignment) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.AssignmentDoctoralStudentNotFound') });
        }

        res.status(StatusCodes.OK).json({ assignment: singleAssignment });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update an assignment
const updateAssignDoctoralStudent = async (req, res) => {
    const { error: idError, value: { reg_num, inventory_num } } = assignDoctoralStudentIdSchema.validate(req.params);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidAssignmentId') });

    const { error, value } = updateAssignDoctoralStudentSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingAssignment = await AssignDoctoralStudent.findOne({ where: { reg_num, inventory_num } });

        if (!existingAssignment) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.AssignmentDoctoralStudentNotFound') });
        }

        if (value.hasOwnProperty('doc_stud_return_date') && value.doc_stud_return_date !== existingAssignment.doc_stud_return_date) {
            // Prevent updating res_return_date if the equipment is assigned to someone else
            const existingActiveAssignment = await AssignDoctoralStudent.findOne({
                where: {
                    inventory_num,
                    reg_num: { [Op.ne]: reg_num }, // Ensure it's assigned to a different doctoral student
                    doc_stud_return_date: { [Op.is]: null }
                }
            });

            if (existingActiveAssignment && (value.doc_stud_return_date === undefined || value.doc_stud_return_date === null)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: req.t('error.EquipmentAlreadyAssignedDoctoralStudent')
                });
            }

            const existingActiveResAssignment = await AssignResearcher.findOne({
                where: {
                    inventory_num,
                    res_return_date: { [Op.is]: null }
                }
            });

            if (existingActiveResAssignment && (value.doc_stud_return_date === undefined || value.doc_stud_return_date === null)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: req.t('error.EquipmentAlreadyAssignedResearcher')
                });
            }
        }    

        // Ensure doc_stud_return_date is after doc_stud_assign_date
        if (value.doc_stud_return_date && new Date(value.doc_stud_return_date) < new Date(value.doc_stud_assign_date)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidReturnDate')
            });
        }

        // Update assignment
        const [updated] = await AssignDoctoralStudent.update(value, { where: { reg_num, inventory_num } });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.AssignmentDoctoralStudentNotFound') });
        }

        const updatedAssignment = await AssignDoctoralStudent.findOne({
            where: { reg_num, inventory_num },
            include: [
                { model: DoctoralStudent, attributes: ['reg_num', 'doc_stud_prof_email'] },
                { model: Equipment, attributes: ['inventory_num', 'equip_name'] },
            ]
        });

        res.status(StatusCodes.OK).json({ message: req.t('success.AssignmentDoctoralStudentUpdated'), assignment: updatedAssignment });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete an assignment
const deleteAssignDoctoralStudent = async (req, res) => {
    const { error, value: { reg_num, inventory_num } } = assignDoctoralStudentIdSchema.validate(req.params);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidAssignmentId') });

    try {
        const deletedAssignment = await AssignDoctoralStudent.findOne({ where: { reg_num, inventory_num } });
        if (!deletedAssignment) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.AssignmentDoctoralStudentNotFound') });
        }

        await deletedAssignment.destroy();

        res.status(StatusCodes.OK).json({ message: req.t('success.AssignmentDoctoralStudentDeleted'), assignment: deletedAssignment });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addAssignDoctoralStudent,
    getAssignDoctoralStudent,
    getAssignDoctoralStudents,
    updateAssignDoctoralStudent,
    deleteAssignDoctoralStudent,
};
