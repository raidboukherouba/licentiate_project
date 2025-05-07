const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addResearcher,
    getResearcher,
    getResearchers,
    getAllResearchers,
    updateResearcher,
    deleteResearcher
} = require("../controllers/researcher")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllResearchers)
router.route('/').get(getResearchers).post(addResearcher)
router.route('/:res_code').get(getResearcher).put(updateResearcher).delete(deleteResearcher)

module.exports = router
