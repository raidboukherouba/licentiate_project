const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addAssignDoctoralStudent,
    getAssignDoctoralStudent,
    getAssignDoctoralStudents,
    updateAssignDoctoralStudent,
    deleteAssignDoctoralStudent
} = require("../controllers/assignDoctoralStudent")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/').get(getAssignDoctoralStudents).post(addAssignDoctoralStudent)
router.route('/:reg_num/:inventory_num').get(getAssignDoctoralStudent).put(updateAssignDoctoralStudent).delete(deleteAssignDoctoralStudent)

module.exports = router
