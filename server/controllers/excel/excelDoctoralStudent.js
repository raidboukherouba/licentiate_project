const { generateDoctoralStudentExcel, generateDoctoralStudentExcelByLab } = require("../../services/excel/excelDoctoralStudent");
const { StatusCodes } = require('http-status-codes');

const exportDoctoralStudentsToExcel = async (req, res) => {
    try {
        const buffer = await generateDoctoralStudentExcel(); // Generate Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=doctoral-students.xlsx");
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedDoctoralStudents'), error: error.message });
    }
};

// Export doctoral students by lab
const exportDoctoralStudentsByLabToExcel = async (req, res) => {
    try {
        const labId = req.params.labId; // Get labId from the route parameter
        const buffer = await generateDoctoralStudentExcelByLab(labId); // Generate Excel file for the specified lab
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=doctoral_students_lab_${labId}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedDoctoralStudentsByLab'), error: error.message });
    }
};

module.exports = { exportDoctoralStudentsToExcel, exportDoctoralStudentsByLabToExcel };
