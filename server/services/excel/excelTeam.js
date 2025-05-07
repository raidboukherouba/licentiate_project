const ExcelJS = require("exceljs");
const { Team } = require("../../models"); // Import models

const generateTeamExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Teams");

    // Define Columns
    worksheet.columns = [
        { header: "ID", key: "team_id", width: 10 },
        { header: "Team Name", key: "team_name", width: 40 },
        { header: "Team Abbreviation", key: "team_abbr", width: 20 },
        { header: "Team Description", key: "team_desc", width: 50 },
    ];

    // Fetch teams with Associations
    const teams = await Team.findAll();

    // Convert Data to Rows
    const teamData = teams.map((res) => ({
        team_id: res.team_id,
        team_name: res.team_name,
        team_abbr: res.team_abbr || "N/A",
        team_desc: res.team_desc || "N/A",
    }));
    

    worksheet.addRows(teamData);

    return workbook.xlsx.writeBuffer();
};

module.exports = { generateTeamExcel };
