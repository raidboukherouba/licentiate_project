const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addLaboratory,
    getLaboratory,
    getLaboratories,
    getAllLaboratories,
    updateLaboratory,
    deleteLaboratory
} = require("../controllers/laboratory")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Rector']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Rector']), 
// ensureRole(['Rector']), 
router.route('/all').get(getAllLaboratories)
router.route('/').get(getLaboratories).post(addLaboratory)
router.route('/:lab_code').get(getLaboratory).put(updateLaboratory).delete(deleteLaboratory)

module.exports = router
