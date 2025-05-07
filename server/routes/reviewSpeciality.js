const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addReviewSpeciality,
    getReviewSpeciality,
    getReviewSpecialities,
    getAllReviewSpecialities,
    updateReviewSpeciality,
    deleteReviewSpeciality
} = require("../controllers/reviewSpeciality")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllReviewSpecialities)
router.route('/').get(getReviewSpecialities).post(addReviewSpeciality)
router.route('/:spec_id_review').get(getReviewSpeciality).put(updateReviewSpeciality).delete(deleteReviewSpeciality)

module.exports = router
