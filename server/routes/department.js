const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addDepartment,
    getDepartment,
    getDepartments,
    getAllDepartments,
    updateDepartment,
    deleteDepartment
} = require("../controllers/department")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Rector']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Rector']), 
// ensureRole(['Rector']), 

router.route('/all').get(getAllDepartments)
router.route('/').get(getDepartments).post(addDepartment)
router.route('/:dept_id').get(getDepartment).put(updateDepartment).delete(deleteDepartment)


module.exports = router
