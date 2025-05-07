const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addPublishDoctoralStudentComm,
    getPublishDoctoralStudentComm,
    getPublishDoctoralStudentComms,
    deletePublishDoctoralStudentComm
} = require("../controllers/publishDoctoralStudentComm")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/').get(getPublishDoctoralStudentComms).post(addPublishDoctoralStudentComm)
router.route('/:reg_num/:id_comm').get(getPublishDoctoralStudentComm).delete(deletePublishDoctoralStudentComm)

module.exports = router
