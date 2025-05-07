const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addHasCategory,
    getHasCategory,
    getHasCategories,
    deleteHasCategory
} = require("../controllers/hasCategory")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/').get(getHasCategories).post(addHasCategory)
router.route('/:review_num/:cat_id').get(getHasCategory).delete(deleteHasCategory)

module.exports = router
