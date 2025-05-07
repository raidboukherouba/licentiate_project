const { generateAssignDoctoralStudentExcel, generateAssignDoctoralStudentExcelByLab } = require("../../services/excel/excelAssignDoctoralStudent");
const { StatusCodes } = require('http-status-codes');

const exportAssignDoctoralStudentsToExcel = async (req, res) => {
    try {
        const buffer = await generateAssignDoctoralStudentExcel(); // Generate Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=doctoral_students_assignments.xlsx");
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedDoctoralStudentsAssignments'), error: error.message });
    }
};

// Export doctoral students assignments by lab
const exportAssignDoctoralStudentsByLabToExcel = async (req, res) => {
    try {
        const labId = req.params.labId; // Get labId from the route parameter
        const buffer = await generateAssignDoctoralStudentExcelByLab(labId); // Generate Excel file for the specified lab
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=doctoral_students_assignments_lab_${labId}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedDoctoralStudentsAssignmentsByLab'), error: error.message });
    }
};

module.exports = { exportAssignDoctoralStudentsToExcel, exportAssignDoctoralStudentsByLabToExcel };
