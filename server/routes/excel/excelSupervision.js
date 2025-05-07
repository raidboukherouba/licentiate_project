const express = require("express");
const { exportSupervisionsToExcel, exportSupervisionsByLabToExcel } = require("../../controllers/excel/excelSupervision");
const router = express.Router();

// Route to export all supervisions
router.get("/", exportSupervisionsToExcel);

// Route to export supervisions by lab
router.get("/:labId", exportSupervisionsByLabToExcel);

module.exports = router;
