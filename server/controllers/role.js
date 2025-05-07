const { Op } = require('sequelize');
const { Role } = require('../models');
const { roleSchema, roleIdSchema } = require('../validators/role');
const { StatusCodes } = require('http-status-codes');

// Add Role
const addRole = async (req, res) => {
    try {
        const { error, value } = roleSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const newRole = await Role.create({ role_name: value.role_name });
        res.status(StatusCodes.CREATED).json({ message: req.t('success.RoleCreated'), role: newRole });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.RoleExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get All Roles
const getRoles = async (req, res) => {
    try {
        const allRoles = await Role.findAll({ order: [['role_id', 'ASC']] });
        if (allRoles.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.RoleEmptyTable'), roles: [] });
        }
        res.status(StatusCodes.OK).json({ roles: allRoles });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a Single Role
const getRole = async (req, res) => {
    const { error: idError, value: role_id } = roleIdSchema.validate(req.params.role_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: idError.details[0].message });

    try {
        const singleRole = await Role.findByPk(role_id);
        if (!singleRole) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.RoleNotFound') });
        }
        res.status(StatusCodes.OK).json({ role: singleRole });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update Role
const updateRole = async (req, res) => {
    const { error: idError, value: role_id } = roleIdSchema.validate(req.params.role_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: idError.details[0].message });

    const { error, value } = roleSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    try {
        const existingRole = await Role.findOne({
            where: {
                role_name: value.role_name,
                role_id: { [Op.ne]: role_id }
            }
        });

        if (existingRole) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.RoleExists') });
        }

        const [updated] = await Role.update({ role_name: value.role_name }, {
            where: { role_id: role_id }
        });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.RoleNotFound') });
        }

        const updatedRole = await Role.findByPk(role_id);
        res.status(StatusCodes.OK).json({ message: req.t('success.RoleUpdated'), role: updatedRole });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete Role
const deleteRole = async (req, res) => {
    const { error: idError, value: role_id } = roleIdSchema.validate(req.params.role_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: idError.details[0].message });

    try {
        const deletedRole = await Role.findByPk(role_id);
        if (!deletedRole) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.RoleNotFound') });
        }

        await deletedRole.destroy();

        res.status(StatusCodes.OK).json({ message: req.t('success.RoleDeleted'), role: deletedRole });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteRole') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addRole,
    getRole,
    getRoles,
    updateRole,
    deleteRole
};