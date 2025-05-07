const { Op } = require('sequelize');
const { Researcher, Function, Speciality, Team, Laboratory } = require('../models');
const { researcherSchema, researcherIdSchema } = require('../validators/researcher');
const { StatusCodes } = require('http-status-codes');

// Add researcher
const addResearcher = async (req, res) => {
    try {
        const { error, value } = researcherSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        // Check if the researcher is a director
        if (value.is_director) {
            // Ensure there's no other director in the same laboratory
            const existingDirector = await Researcher.findOne({
                where: {
                    lab_code: value.lab_code,
                    is_director: true
                }
            });

            if (existingDirector) {
                return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.DirectorExists') });
            }
        }


        const newResearcher = await Researcher.create(value);

        res.status(StatusCodes.CREATED).json({ message: req.t('success.ResearcherCreated'), researcher: newResearcher });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.ResearcherExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all researchers
const getAllResearchers = async (req, res) => {
    try {
        const allResearchers = await Researcher.findAll({
            include: [
                { model: Team, as: 'team', attributes: ['team_name'] },
                { model: Function, as: 'function', attributes: ['func_name'] },
                { model: Speciality, as: 'speciality', attributes: ['spec_name'] },
                { model: Laboratory, as: 'laboratory', attributes: ['lab_name'] },
            ],
            order: [['res_code', 'ASC']]
        });

        if (allResearchers.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.ResearcherEmptyTable'), researchers: [] });
        }

        res.status(StatusCodes.OK).json({researchers: allResearchers});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};



const getResearchers = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'res_code';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';
        const teamId = req.query.teamId || null; // Add teamId from query
        const laboratoryId = req.query.laboratoryId || null; // Add laboratoryId from query

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['res_code', 'res_fname', 'res_lname', 'res_prof_email', 'res_grade'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        // Base where condition for search
        const searchCondition = search
            ? {
                [Op.or]: [
                    { res_fname: { [Op.iLike]: `%${search}%` } },
                    { res_lname: { [Op.iLike]: `%${search}%` } },
                    { res_prof_email: { [Op.iLike]: `%${search}%` } },
                    { res_grade: { [Op.iLike]: `%${search}%` } },
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

        const { count, rows: researchers } = await Researcher.findAndCountAll({
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
                message: req.t('success.ResearcherEmptyTable'),
                researchers: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            researchers,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single researcher
const getResearcher = async (req, res) => {
    const { error, value: res_code } = researcherIdSchema.validate(req.params.res_code);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidResearcherId') });

    try {
        const singleResearcher = await Researcher.findByPk(res_code, {
            include: [
                { model: Team, as: 'team', attributes: ['team_name'] },
                { model: Function, as: 'function', attributes: ['func_name'] },
                { model: Speciality, as: 'speciality', attributes: ['spec_name'] },
                { model: Laboratory, as: 'laboratory', attributes: ['lab_name'] },
            ]
        });

        if (!singleResearcher) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ResearcherNotFound') });
        }

        res.status(StatusCodes.OK).json({researcher: singleResearcher});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update researcher
const updateResearcher = async (req, res) => {
    const { error: idError, value: res_code } = researcherIdSchema.validate(req.params.res_code);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidResearcherId') });

    const { error, value } = researcherSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingResearcher = await Researcher.findOne({
            where: {res_code },
        });

        
        if (!existingResearcher) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ResearcherNotFound') });
        }

        // Prevent changing laboratory if researcher is a director
        if (existingResearcher.is_director && value.lab_code && value.lab_code !== existingResearcher.lab_code) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.DirectorLabChangeNotAllowed') });
        }

        // If updating to director, ensure no other director exists in the same laboratory
        if (value.is_director && !existingResearcher.is_director) {
            const existingDirector = await Researcher.findOne({
                where: {
                    lab_code: existingResearcher.lab_code, // Same lab
                    is_director: true,
                    res_code: { [Op.ne]: res_code } // Exclude current researcher
                }
            });

            if (existingDirector) {
                return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.DirectorExists') });
            }
        }

        const [updated] = await Researcher.update(value, { where: { res_code } });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ResearcherNotFound') });
        }

        const updatedResearcher = await Researcher.findByPk(res_code, {
            include: [
                { model: Team, as: 'team', attributes: ['team_name'] },
                { model: Function, as: 'function', attributes: ['func_name'] },
                { model: Speciality, as: 'speciality', attributes: ['spec_name'] },
                { model: Laboratory, as: 'laboratory', attributes: ['lab_name'] },
            ]
        });

        res.status(StatusCodes.OK).json({ message: req.t('success.ResearcherUpdated'), researcher: updatedResearcher });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete researcher
const deleteResearcher = async (req, res) => {
    const { error, value: res_code } = researcherIdSchema.validate(req.params.res_code);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidResearcherId') });

    try {
        const deletedResearcher = await Researcher.findByPk(res_code);
        if (!deletedResearcher) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.ResearcherNotFound') });
        }
    
        await deletedResearcher.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.ResearcherDeleted'), researcher: deletedResearcher });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteResearcher') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addResearcher,
    getResearcher,
    getResearchers,
    getAllResearchers,
    updateResearcher,
    deleteResearcher,
};