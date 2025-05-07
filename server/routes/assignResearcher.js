const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addAssignResearcher,
    getAssignResearcher,
    getAssignResearchers,
    updateAssignResearcher,
    deleteAssignResearcher
} = require("../controllers/assignResearcher")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/').get(getAssignResearchers).post(addAssignResearcher)
router.route('/:res_code/:inventory_num').get(getAssignResearcher).put(updateAssignResearcher).delete(deleteAssignResearcher)

module.exports = router
