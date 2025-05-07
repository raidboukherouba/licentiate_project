const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addSpeciality,
    getSpeciality,
    getSpecialities,
    getAllSpecialities,
    updateSpeciality,
    deleteSpeciality
} = require("../controllers/speciality")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllSpecialities)
router.route('/').get(getSpecialities).post(addSpeciality)
router.route('/:spec_code').get(getSpeciality).put(updateSpeciality).delete(deleteSpeciality)

module.exports = router
