const express = require("express");
const { exportLaboratoriesToExcel, exportLaboratoriesByFacToExcel } = require("../../controllers/excel/excelLaboratory");
const router = express.Router();

// Route to export ALL labs
router.get("/", exportLaboratoriesToExcel);

// Route to export labs by fac
router.get("/:facId", exportLaboratoriesByFacToExcel);

module.exports = router;
