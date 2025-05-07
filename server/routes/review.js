const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addReview,
    getReview,
    getReviews,
    getAllReviews,
    updateReview,
    deleteReview
} = require("../controllers/review")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllReviews)
router.route('/').get(getReviews).post(addReview)
router.route('/:review_num').get(getReview).put(updateReview).delete(deleteReview)

module.exports = router
