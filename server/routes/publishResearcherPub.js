const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addPublishResearcherPub,
    getPublishResearcherPub,
    getPublishResearcherPubs,
    deletePublishResearcherPub
} = require("../controllers/publishResearcherPub")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/').get(getPublishResearcherPubs).post(addPublishResearcherPub)
router.route('/:res_code/:doi').get(getPublishResearcherPub).delete(deletePublishResearcherPub)

module.exports = router
