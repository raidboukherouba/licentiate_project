const { generatePublicationExcel, generatePublicationExcelByLab } = require("../../services/excel/excelPublication");
const { StatusCodes } = require('http-status-codes');

const exportPublicationsToExcel = async (req, res) => {
    try {
        const buffer = await generatePublicationExcel(); // Generate Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=publications.xlsx");
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedPublications'), error: error.message });
    }
};

// Export publications by lab
const exportPublicationsByLabToExcel = async (req, res) => {
    try {
        const labId = req.params.labId; // Get labId from the route parameter
        const buffer = await generatePublicationExcelByLab(labId); // Generate Excel file for the specified lab
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=publications_lab_${labId}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedPublicationsByLab'), error: error.message });
    }
};

module.exports = { exportPublicationsToExcel, exportPublicationsByLabToExcel };
