const express = require("express");
const { exportPublicationsToExcel, exportPublicationsByLabToExcel } = require("../../controllers/excel/excelPublication");
const router = express.Router();

// Route to export all publications
router.get("/", exportPublicationsToExcel);

// Route to export publications by lab
router.get("/:labId", exportPublicationsByLabToExcel);

module.exports = router;
