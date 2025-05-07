const express = require("express");
const { exportResearchersToExcel, exportResearchersByLabToExcel } = require("../../controllers/excel/excelResearcher");
const router = express.Router();

// Route to export researchers 
router.get("/", exportResearchersToExcel);

// Route to export researchers by lab
router.get("/:labId", exportResearchersByLabToExcel);

module.exports = router;
