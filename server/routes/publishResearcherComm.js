const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addPublishResearcherComm,
    getPublishResearcherComm,
    getPublishResearcherComms,
    deletePublishResearcherComm
} = require("../controllers/publishResearcherComm")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/').get(getPublishResearcherComms).post(addPublishResearcherComm)
router.route('/:res_code/:id_comm').get(getPublishResearcherComm).delete(deletePublishResearcherComm)

module.exports = router
