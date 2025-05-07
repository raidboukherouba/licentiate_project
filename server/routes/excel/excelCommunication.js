const express = require("express");
const { exportCommunicationsToExcel, exportCommunicationsByLabToExcel } = require("../../controllers/excel/excelCommunication");
const router = express.Router();

// Route to export all communications
router.get("/", exportCommunicationsToExcel);

// Route to export communications by lab
router.get("/:labId", exportCommunicationsByLabToExcel);

module.exports = router;
