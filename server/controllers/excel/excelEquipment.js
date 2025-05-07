const { generateEquipmentExcel, generateEquipmentExcelByLab } = require("../../services/excel/excelEquipment");
const { StatusCodes } = require('http-status-codes');

// Export ALL equipment
const exportEquipmentsToExcel = async (req, res) => {
    try {
        const buffer = await generateEquipmentExcel(); // Generate Excel file for all equipment
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=equipments.xlsx");
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedEquipments'), error: error.message });
    }
};

// Export equipment by lab
const exportEquipmentsByLabToExcel = async (req, res) => {
    try {
        const labId = req.params.labId; // Get labId from the route parameter
        const buffer = await generateEquipmentExcelByLab(labId); // Generate Excel file for the specified lab
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=equipments_lab_${labId}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedEquipmentsByLab'), error: error.message });
    }
};

module.exports = { exportEquipmentsToExcel, exportEquipmentsByLabToExcel };