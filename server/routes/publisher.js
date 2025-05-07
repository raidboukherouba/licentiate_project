const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addPublisher,
    getPublisher,
    getPublishers,
    getAllPublishers,
    updatePublisher,
    deletePublisher
} = require("../controllers/publisher")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllPublishers)
router.route('/').get(getPublishers).post(addPublisher)
router.route('/:publisher_id').get(getPublisher).put(updatePublisher).delete(deletePublisher)

module.exports = router
