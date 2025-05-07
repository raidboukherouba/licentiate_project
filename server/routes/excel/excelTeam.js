const express = require("express");
const { exportTeamsToExcel } = require("../../controllers/excel/excelTeam");
const router = express.Router();

router.get("/", exportTeamsToExcel);

module.exports = router;
