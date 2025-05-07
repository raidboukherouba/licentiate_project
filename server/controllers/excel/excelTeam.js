const { generateTeamExcel } = require("../../services/excel/excelTeam");
const { StatusCodes } = require('http-status-codes');

const exportTeamsToExcel = async (req, res) => {
    try {
        const buffer = await generateTeamExcel(); // Generate Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=teams.xlsx");
        res.send(buffer);
    } catch (error) {
        console.error("Excel export error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: req.t('excel.FailedTeams'), error: error.message });
    }
};

module.exports = { exportTeamsToExcel };
