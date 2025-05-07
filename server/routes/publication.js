const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addPublication,
    getPublication,
    getPublications,
    getAllPublications,
    updatePublication,
    deletePublication
} = require("../controllers/publication")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllPublications)
router.route('/').get(getPublications).post(addPublication)
router.route('/:doi').get(getPublication).put(updatePublication).delete(deletePublication)

module.exports = router
