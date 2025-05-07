const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addCategory,
    getCategory,
    getCategories,
    getAllCategories,
    updateCategory,
    deleteCategory
} = require("../controllers/category")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllCategories)
router.route('/').get(getCategories).post(addCategory)
router.route('/:cat_id').get(getCategory).put(updateCategory).delete(deleteCategory)

module.exports = router
