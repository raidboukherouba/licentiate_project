const { generateCommunicationExcel, generateCommunicationExcelByLab } = require("../../services/excel/excelCommunication");
const { StatusCodes } = require('http-status-codes');

const exportCommunicationsToExcel = async (req, res) => {
    try {
        const buffer = await generateCommunicationExcel(); // Generate Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=communications.xlsx");
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedCommunication'), error: error.message });
    }
};

// Export communications by lab
const exportCommunicationsByLabToExcel = async (req, res) => {
    try {
        const labId = req.params.labId; // Get labId from the route parameter
        const buffer = await generateCommunicationExcelByLab(labId); // Generate Excel file for the specified lab
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=communications_lab_${labId}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedCommunicationByLab'), error: error.message });
    }
};

module.exports = { exportCommunicationsToExcel, exportCommunicationsByLabToExcel };
