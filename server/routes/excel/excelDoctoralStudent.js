const express = require("express");
const { exportDoctoralStudentsToExcel, exportDoctoralStudentsByLabToExcel } = require("../../controllers/excel/excelDoctoralStudent");
const router = express.Router();

// Route to export all doctoral students
router.get("/", exportDoctoralStudentsToExcel);

// Route to export doctoral students by lab
router.get("/:labId", exportDoctoralStudentsByLabToExcel);

module.exports = router;
