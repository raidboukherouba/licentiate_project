const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addDomain,
    getDomain,
    getDomains,
    getAllDomains,
    updateDomain,
    deleteDomain
} = require("../controllers/domain")

// ensureRole(['Rector', 'Lab Manager']),
// ensureRole(['Rector']),
// ensureRole(['Rector', 'Lab Manager']),
// ensureRole(['Rector']),
// ensureRole(['Rector']),

router.route('/all').get(getAllDomains)
router.route('/').get(getDomains).post(addDomain)
router.route('/:domain_id').get( getDomain).put(updateDomain).delete(deleteDomain)


module.exports = router
