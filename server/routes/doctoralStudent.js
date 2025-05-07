const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addDoctoralStudent,
    getDoctoralStudent,
    getDoctoralStudents,
    getAllDoctoralStudents,
    updateDoctoralStudent,
    deleteDoctoralStudent
} = require("../controllers/doctoralStudent")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllDoctoralStudents)
router.route('/').get(getDoctoralStudents).post(addDoctoralStudent)
router.route('/:reg_num').get(getDoctoralStudent).put(updateDoctoralStudent).delete(deleteDoctoralStudent)

module.exports = router
