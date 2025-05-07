const express = require("express");
const { exportAssignResearchersToExcel, exportAssignResearchersByLabToExcel } = require("../../controllers/excel/excelAssignResearcher");
const router = express.Router();

// Route to export all researchers assignments
router.get("/", exportAssignResearchersToExcel);

// Route to export researchers assignments by lab
router.get("/:labId", exportAssignResearchersByLabToExcel);

module.exports = router;
