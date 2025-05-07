const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addSupervise,
    getSupervise,
    getSupervises,
    updateSupervise,
    deleteSupervise
} = require("../controllers/supervise")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/').get(getSupervises).post(addSupervise)
router.route('/:res_code/:reg_num').get(getSupervise).put(updateSupervise).delete(deleteSupervise)

module.exports = router
