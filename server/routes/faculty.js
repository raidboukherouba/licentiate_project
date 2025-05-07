const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addFaculty,
    getFaculty,
    getFaculties,
    getAllFaculties,
    updateFaculty,
    deleteFaculty
} = require("../controllers/faculty")
//ensureRole(['Rector', 'Lab Manager']), 
//ensureRole(['Rector']), 
//ensureRole(['Rector', 'Lab Manager']), 
//ensureRole(['Rector']), 
// ensureRole(['Rector']), 

router.route('/all').get(getAllFaculties)
router.route('/').get(getFaculties).post(addFaculty)
router.route('/:faculty_id').get(getFaculty).put(updateFaculty).delete(deleteFaculty)


module.exports = router
