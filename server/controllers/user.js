const { Op } = require('sequelize');
const { User, Role } = require('../models');
const { userSchema, userUpdateSchema, userIdSchema } = require('../validators/user');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt'); // To hash the password

// Add User
const addUser = async (req, res) => {
    try {
        const { error, value } = userSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const { username, password, full_name, email, role_id } = value;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            password: hashedPassword,
            full_name,
            email,
            role_id,
        });

        res.status(StatusCodes.CREATED).json({ message: req.t('success.UserCreated'), user: newUser });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.UserExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get All Users
const getUsers = async (req, res) => {
    try {
        const allUsers = await User.findAll({
            include: [
                { model: Role, as: 'role', attributes: ['role_name'] } // Include role details
            ],
            order: [['user_id', 'ASC']]
        });

        if (allUsers.length === 0) {
            return res.status(StatusCodes.OK).json({ message: req.t('success.UserEmptyTable'), users: [] });
        }

        res.status(StatusCodes.OK).json({ users: allUsers });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a Single User
const getUser = async (req, res) => {
    const { error, value: user_id } = userIdSchema.validate(req.params.user_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidUserId') });

    try {
        const singleUser = await User.findByPk(user_id, {
            include: [
                { model: Role, as: 'role', attributes: ['role_name'] } // Include role details
            ]
        });

        if (!singleUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.UserNotFound') });
        }

        res.status(StatusCodes.OK).json({ user: singleUser });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update User
const updateUser = async (req, res) => {
    const { error: idError, value: user_id } = userIdSchema.validate(req.params.user_id);
    if (idError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidUserId') });

    const { error, value } = userUpdateSchema(req).validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

    const { username, password, full_name, email, role_id } = value;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email }
                ],
                user_id: { [Op.ne]: user_id } // Exclude the current user
            }
        });

        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.UserExists') });
        }

        const [updated] = await User.update(
            { 
                username,
                password: hashedPassword,
                full_name,
                email,
                role_id 
            },
            { where: { user_id } }
        );

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.UserNotFound') });
        }

        const updatedUser = await User.findByPk(user_id, {
            include: [
                { model: Role, as: 'role', attributes: ['role_name'] } // Include role details
            ]
        });

        res.status(StatusCodes.OK).json({ message: req.t('success.UserUpdated'), user: updatedUser });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    const { error, value: user_id } = userIdSchema.validate(req.params.user_id);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidUserId') });

    try {
        const deletedUser = await User.findByPk(user_id);
        if (!deletedUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.UserNotFound') });
        }

        await deletedUser.destroy();

        res.status(StatusCodes.OK).json({ message: req.t('success.UserDeleted'), user: deletedUser });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeleteUser') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
};