const ExcelJS = require("exceljs");
const { AssignResearcher, Researcher, Equipment, Laboratory } = require("../../models");

const generateAssignResearcherExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Researchers Assignments");

    // Define Columns
    worksheet.columns = [
        { header: "Researcher", key: "researcher", width: 25 },
        { header: "Equipment Name", key: "equip_name", width: 30 },
        { header: "Equipment Description", key: "equip_desc", width: 40 },
        { header: "Acquisition Date", key: "acq_date", width: 20 },
        { header: "Purchase Price", key: "purchase_price", width: 15 },
        { header: "Status", key: "equip_status", width: 15 },
        { header: "Assignment Date", key: "res_assign_date", width: 20 },
        { header: "Return Date", key: "res_return_date", width: 20 },
    ];

    // Fetch assignments with nested includes
    const assignments = await AssignResearcher.findAll({
        include: [
            { 
                model: Researcher,
                as: "Researcher",
                attributes: ["res_fname", "res_lname"],
                include: [{ model: Laboratory, as: "laboratory", attributes: ["lab_name"] }]
            },
            { model: Equipment, as: "Equipment", attributes: ["inventory_num", "equip_name", "equip_desc", "acq_date", "purchase_price", "equip_status"] }
        ],
        order: [[{ model: Researcher, as: "Researcher" }, { model: Laboratory, as: "laboratory" }, "lab_name", "ASC"]],
    });

    let currentLaboratory = null;

    assignments.forEach((assignment) => {
        const laboratoryName = assignment.Researcher && assignment.Researcher.laboratory ? assignment.Researcher.laboratory.lab_name : "Unknown Laboratory";

        // Add a bold row for the laboratory name if it's new
        if (!currentLaboratory || currentLaboratory !== laboratoryName) {
            worksheet.addRow([laboratoryName]).font = { bold: true, size: 14 };
            currentLaboratory = laboratoryName;
        }

        // Add assignment data under the corresponding lab
        worksheet.addRow({
            researcher: `${assignment.Researcher.res_fname} ${assignment.Researcher.res_lname}`,
            equip_name: assignment.Equipment.equip_name,
            equip_desc: assignment.Equipment.equip_desc || "N/A",
            acq_date: assignment.Equipment.acq_date || "N/A",
            purchase_price: assignment.Equipment.purchase_price || "N/A",
            equip_status: assignment.Equipment.equip_status || "N/A",
            res_assign_date: assignment.res_assign_date,
            res_return_date: assignment.res_return_date || "N/A",
        });
    });

    return workbook.xlsx.writeBuffer();
};

// Function to export researchers assignments for a SPECIFIC lab
const generateAssignResearcherExcelByLab = async (labId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Researchers Assignments");

    // Define Columns
    worksheet.columns = [
        { header: "Researcher", key: "researcher", width: 25 },
        { header: "Equipment Name", key: "equip_name", width: 30 },
        { header: "Equipment Description", key: "equip_desc", width: 40 },
        { header: "Acquisition Date", key: "acq_date", width: 20 },
        { header: "Purchase Price", key: "purchase_price", width: 15 },
        { header: "Status", key: "equip_status", width: 15 },
        { header: "Assignment Date", key: "res_assign_date", width: 20 },
        { header: "Return Date", key: "res_return_date", width: 20 },
    ];

    // Fetch assignments for the specified lab
    const assignments = await AssignResearcher.findAll({
        include: [
            { 
                model: Researcher,
                as: "Researcher",
                attributes: ["res_fname", "res_lname"],
                include: [{ model: Laboratory, as: "laboratory", attributes: ["lab_name"] }]
            },
            { model: Equipment, as: "Equipment", attributes: ["inventory_num", "equip_name", "equip_desc", "acq_date", "purchase_price", "equip_status"] }
        ],
        where:{
            "$Researcher.laboratory.lab_code$": labId 
        },
        order: [[{ model: Researcher, as: "Researcher" }, { model: Laboratory, as: "laboratory" }, "lab_name", "ASC"]],
    });

    if (assignments.length === 0) {
        worksheet.addRow(["No Researchers Assignments Found"]).font = { bold: true, size: 14 };
    }

    // Add the lab name as a header
    if (assignments.length > 0) {
        const labName = 
        assignments[0].Researcher?.laboratory?.lab_name ||
        "Unknown Laboratory";
        worksheet.addRow([labName]).font = { bold: true, size: 14 };
    }

    // Add assignments data for the specified lab
    assignments.forEach((assignment) => {
        worksheet.addRow({
            researcher: `${assignment.Researcher.res_fname} ${assignment.Researcher.res_lname}`,
            equip_name: assignment.Equipment.equip_name,
            equip_desc: assignment.Equipment.equip_desc || "N/A",
            acq_date: assignment.Equipment.acq_date || "N/A",
            purchase_price: assignment.Equipment.purchase_price || "N/A",
            equip_status: assignment.Equipment.equip_status || "N/A",
            res_assign_date: assignment.res_assign_date,
            res_return_date: assignment.res_return_date || "N/A",
        });
    });

    return workbook.xlsx.writeBuffer();
};

module.exports = { generateAssignResearcherExcel, generateAssignResearcherExcelByLab };
