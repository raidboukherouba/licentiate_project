const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addPublishDoctoralStudentPub,
    getPublishDoctoralStudentPub,
    getPublishDoctoralStudentPubs,
    deletePublishDoctoralStudentPub
} = require("../controllers/publishDoctoralStudentPub")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/').get(getPublishDoctoralStudentPubs).post(addPublishDoctoralStudentPub)
router.route('/:reg_num/:doi').get(getPublishDoctoralStudentPub).delete(deletePublishDoctoralStudentPub)

module.exports = router
