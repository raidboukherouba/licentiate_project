const { generateResearcherExcel, generateResearcherExcelByLab } = require("../../services/excel/excelResearcher");
const { StatusCodes } = require('http-status-codes');

const exportResearchersToExcel = async (req, res) => {
    try {
        const buffer = await generateResearcherExcel(); // Generate Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=researchers.xlsx");
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedResearchers'), error: error.message });
    }
};

// Export researcher by lab
const exportResearchersByLabToExcel = async (req, res) => {
    try {
        const labId = req.params.labId; // Get labId from the route parameter
        const buffer = await generateResearcherExcelByLab(labId); // Generate Excel file for the specified lab
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=researchers_lab_${labId}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedResearchersByLab'), error: error.message });
    }
};

module.exports = { exportResearchersToExcel, exportResearchersByLabToExcel };
