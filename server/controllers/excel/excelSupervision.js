const { generateSupervisionExcel, generateSupervisionExcelByLab } = require("../../services/excel/excelSupervision");
const { StatusCodes } = require('http-status-codes');

const exportSupervisionsToExcel = async (req, res) => {
    try {
        const buffer = await generateSupervisionExcel(); // Generate Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=supervisions.xlsx");
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedSupervisions'), error: error.message });
    }
};

// Export supervisions by lab
const exportSupervisionsByLabToExcel = async (req, res) => {
    try {
        const labId = req.params.labId; // Get labId from the route parameter
        const buffer = await generateSupervisionExcelByLab(labId); // Generate Excel file for the specified lab
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=supervisions_lab_${labId}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedSupervisionsByLab'), error: error.message });
    }
};

module.exports = { exportSupervisionsToExcel, exportSupervisionsByLabToExcel };
