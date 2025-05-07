const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addEquipment,
    getEquipment,
    getEquipments,
    getAllEquipments,
    updateEquipment,
    deleteEquipment
} = require("../controllers/equipment")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllEquipments)
router.route('/').get(getEquipments).post(addEquipment)
router.route('/:inventory_num').get(getEquipment).put(updateEquipment).delete(deleteEquipment)

module.exports = router
