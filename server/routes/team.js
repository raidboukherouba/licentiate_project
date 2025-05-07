const express = require("express")
const router = express.Router()
const { ensureRole } = require("../middlewares/authMiddleware");

const{
    addTeam,
    getTeam,
    getTeams,
    getAllTeams,
    updateTeam,
    deleteTeam
} = require("../controllers/team")

// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Rector', 'Lab Manager']), 
// ensureRole(['Lab Manager']), 
// ensureRole(['Lab Manager']), 

router.route('/all').get(getAllTeams)
router.route('/').get(getTeams).post(addTeam)
router.route('/:team_id').get(getTeam).put(updateTeam).delete(deleteTeam)

module.exports = router
