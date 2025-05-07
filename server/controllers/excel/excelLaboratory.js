const { generateLaboratoryExcel, generateLaboratoryExcelByFac } = require("../../services/excel/excelLaboratory");
const { StatusCodes } = require('http-status-codes');

const exportLaboratoriesToExcel = async (req, res) => {
    try {
        const buffer = await generateLaboratoryExcel(); // Generate Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=laboratories.xlsx");
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('FailedLaboratories'), error: error.message });
    }
};

// Export labs by faculty
const exportLaboratoriesByFacToExcel = async (req, res) => {
    try {
        const facId = req.params.facId; // Get facId from the route parameter
        const buffer = await generateLaboratoryExcelByFac(facId); // Generate Excel file for the specified fac
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=laboratories_fac_${facId}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('FailedLaboratoriesByFac'), error: error.message });
    }
};

module.exports = { exportLaboratoriesToExcel, exportLaboratoriesByFacToExcel };
