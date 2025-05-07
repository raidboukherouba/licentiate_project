const express = require("express");
const { exportEquipmentsToExcel, exportEquipmentsByLabToExcel } = require("../../controllers/excel/excelEquipment");
const router = express.Router();

// Route to export ALL equipment
router.get("/", exportEquipmentsToExcel);

// Route to export equipments by lab
router.get("/:labId", exportEquipmentsByLabToExcel);

module.exports = router;