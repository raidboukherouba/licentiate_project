const express = require("express");
const { exportAssignDoctoralStudentsToExcel, exportAssignDoctoralStudentsByLabToExcel } = require("../../controllers/excel/excelAssignDoctoralStudent");
const router = express.Router();

// Route to export all doctoral students assignments
router.get("/", exportAssignDoctoralStudentsToExcel);

// Route to export doctoral students assignments by lab
router.get("/:labId", exportAssignDoctoralStudentsByLabToExcel);

module.exports = router;
