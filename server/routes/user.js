const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser
} = require("../controllers/user")

router.route('/').get(ensureRole(["Admin"]), getUsers).post(ensureRole(["Admin"]), addUser)
router.route('/:user_id').get(ensureRole(["Admin"]), getUser).put(ensureRole(["Admin", 'Rector', 'Lab Manager']), updateUser).delete(ensureRole(["Admin"]), deleteUser)

module.exports = router
