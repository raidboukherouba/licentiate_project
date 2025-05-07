const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addCommunication,
    getCommunication,
    getCommunications,
    getAllCommunications,
    updateCommunication,
    deleteCommunication
} = require("../controllers/communication")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllCommunications)
router.route('/').get(getCommunications).post(addCommunication)
router.route('/:id_comm').get(getCommunication).put(updateCommunication).delete(deleteCommunication)

module.exports = router
