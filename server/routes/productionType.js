const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addProductionType,
    getProductionType,
    getProductionTypes,
    getAllProductionTypes,
    updateProductionType,
    deleteProductionType
} = require("../controllers/productionType")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllProductionTypes)
router.route('/').get(getProductionTypes).post(addProductionType)
router.route('/:type_id').get(getProductionType).put(updateProductionType).delete(deleteProductionType)

module.exports = router
