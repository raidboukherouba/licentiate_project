const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addFunction,
    getFunction,
    getFunctions,
    getAllFunctions,
    updateFunction,
    deleteFunction
} = require("../controllers/function")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllFunctions)
router.route('/').get(getFunctions).post(addFunction)
router.route('/:func_code').get(getFunction).put(updateFunction).delete(deleteFunction)

module.exports = router
