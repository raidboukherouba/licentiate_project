const { generateAssignResearcherExcel, generateAssignResearcherExcelByLab } = require("../../services/excel/excelAssignResearcher");
const { StatusCodes } = require('http-status-codes');

const exportAssignResearchersToExcel = async (req, res) => {
    try {
        const buffer = await generateAssignResearcherExcel(); // Generate Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=researchers_assignments.xlsx");
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedResearchersAssignments'), error: error.message });
    }
};

// Export researchers assignments by lab
const exportAssignResearchersByLabToExcel = async (req, res) => {
    try {
        const labId = req.params.labId; // Get labId from the route parameter
        const buffer = await generateAssignResearcherExcelByLab(labId); // Generate Excel file for the specified lab
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=researchers_assignments_lab_${labId}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedResearchersAssignmentsByLab'), error: error.message });
    }
};

module.exports = { exportAssignResearchersToExcel, exportAssignResearchersByLabToExcel };
