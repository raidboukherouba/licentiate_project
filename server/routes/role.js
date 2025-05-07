const express = require("express")
const router = express.Router()

const{
    addRole,
    getRole,
    getRoles,
    updateRole,
    deleteRole
} = require("../controllers/role")

router.route('/').get(getRoles).post(addRole)
router.route('/:role_id').get(getRole).put(updateRole).delete(deleteRole)

module.exports = router
