const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addHasSpeciality,
    getHasSpeciality,
    getHasSpecialities,
    deleteHasSpeciality
} = require("../controllers/hasSpeciality")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/').get(getHasSpecialities).post(addHasSpeciality)
router.route('/:review_num/:spec_id_review').get(getHasSpeciality).delete(deleteHasSpeciality)

module.exports = router
