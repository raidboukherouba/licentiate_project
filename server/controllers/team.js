const { Op } = require('sequelize');
const { Team } = require('../models');
const { teamSchema, teamIdSchema } = require('../validators/team');
const { StatusCodes } = require('http-status-codes');

// Add team
const addTeam = async (req, res) => {
    try {
        const { error, value } = teamSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const { team_name, team_abbr, team_desc } = value;
        const newTeam = await Team.create({ team_name, team_abbr, team_desc });
        res.status(StatusCodes.CREATED).json({ message: req.t('success.TeamCreated'), team: newTeam });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.TeamExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all teams
const getAllTeams = async (req, res) => {
    try {
        const allTeams = await Team.findAll({ order: [['team_id', 'ASC']] });
        if (allTeams.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.TeamEmptyTable'), teams: [] });
        }
        res.status(StatusCodes.OK).json({teams: allTeams});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

const getTeams = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Get sorting parameters from query (with default values)
        const sortBy = req.query.sortBy || 'team_id';
        const order = (req.query.order === 'desc') ? 'DESC' : 'ASC';
        const search = req.query.search || '';

        // Validate `sortBy` to avoid SQL injection (only allow known columns)
        const validColumns = ['team_id', 'team_name', 'team_abbr']; // Add other valid columns as needed
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        const whereCondition = search
            ? {
                [Op.or]: [
                    { team_name: { [Op.iLike]: `%${search}%` } },
                    { team_abbr: { [Op.iLike]: `%${search}%` } }
                ]
            }
            : {};

        const { count, rows: teams } = await Team.findAndCountAll({
            where: whereCondition,
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
            attributes: ['team_id', 'team_name', 'team_abbr', 'team_desc'], // Add other attributes as needed
        });

        if (count === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.TeamEmptyTable'),
                teams: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(count / limit);

        res.status(StatusCodes.OK).json({
            teams,
            totalPages,
            currentPage: page,
            totalItems: count
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single team
const getTeam = async (req, res) => {
    const { error, value: team_id } = teamIdSchema.validate(req.params.team_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidTeamId') });

    try {
        const singleTeam = await Team.findByPk(team_id);
        if (!singleTeam) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.TeamNotFound') });
        }
        res.status(StatusCodes.OK).json({team: singleTeam});
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update team
const updateTeam = async (req, res) => {
    const { error: idError, value: team_id } = teamIdSchema.validate(req.params.team_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidTeamId') });

    const { error, value } = teamSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    const { team_name, team_abbr, team_desc } = value;

    try {
        const existingTeam = await Team.findOne({
            where: {
                team_name: value.team_name,
                team_id: { [Op.ne]: team_id }, // Exclude the current team
            },
        });

        if (existingTeam) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.TeamExists') });
        }

        const [updated] = await Team.update(
            { team_name, team_abbr, team_desc },
            { where: { team_id } }
        );

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.TeamNotFound') });
        }

        const updatedTeam = await Team.findByPk(team_id);
        res.status(StatusCodes.OK).json({ message: req.t('success.TeamUpdated'), team: updatedTeam });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete team
const deleteTeam = async (req, res) => {
    const { error, value: team_id } = teamIdSchema.validate(req.params.team_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidTeamId') });

    try {
        const deletedTeam = await Team.findByPk(team_id);
        if (!deletedTeam) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.TeamNotFound') });
        }
    
        await deletedTeam.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.TeamDeleted'), team: deletedTeam });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteTeam') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addTeam,
    getTeam,
    getTeams,
    getAllTeams,
    updateTeam,
    deleteTeam,
};