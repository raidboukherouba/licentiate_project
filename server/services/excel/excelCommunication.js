const ExcelJS = require("exceljs");
const { Communication, ProductionType, Researcher, DoctoralStudent, Laboratory } = require("../../models"); // Import models
const { Op } = require("sequelize");

const generateCommunicationExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Communications");

    // Define Columns
    worksheet.columns = [
        { header: "Id", key: "id_comm", width: 10 },
        { header: "Title", key: "title_comm", width: 60 },
        { header: "Authors (researchers)", key: "researchers", width: 60 },
        { header: "Authors (doctoral students)", key: "doctoral_students", width: 60 },
        { header: "Event Title", key: "event_title", width: 40 },
        { header: "Year", key: "year_comm", width: 10 },
        { header: "Url", key: "url_comm", width: 40 },
    ];

    // Fetch communications with associations and order by production type
    const communications = await Communication.findAll({
        include: [
            { model: ProductionType, as: "production_type", attributes: ["type_name"] },
            { model: Researcher, as: "Researchers", attributes: ["res_fname", "res_lname"], include: [{ model: Laboratory, as: "laboratory", attributes: ["lab_name"] }] },
            { model: DoctoralStudent, as: "DoctoralStudents", attributes: ["doc_stud_fname", "doc_stud_lname"], include: [{ model: Laboratory, as: "laboratory", attributes: ["lab_name"] }] },
        ],
        order: [
            [{ model: Researcher, as: "Researchers" }, { model: Laboratory, as: "laboratory" }, "lab_name", "ASC"], // Order by lab name
            [{ model: ProductionType, as: "production_type" }, "type_name", "ASC"],  // Order by production type    
        ],
    });

    let currentProductionType = null;
    let currentLab = null;

    communications.forEach((comm) => {
        const labName = comm.Researchers[0]?.laboratory?.lab_name || comm.DoctoralStudents[0]?.laboratory?.lab_name || "Unknown Laboratory";

        // Add a separate row for the lab name if it's a new lab
        if (!currentLab || currentLab !== labName) {
            worksheet.addRow([`Laboratory: ${labName}`]).font = { bold: true, size: 14 };
            currentLab = labName;
            currentProductionType = null; // Reset production type grouping when changing labs
        }

        // Add a separate row for the production name if it's a new production within the same lab
        if (!currentProductionType || currentProductionType !== comm.production_type.type_name) {
            worksheet.addRow([`Publication: ${comm.production_type.type_name}`]).font = { bold: true, size: 14 };
            currentProductionType = comm.production_type.type_name;
        }

        worksheet.addRow({
            id_comm: comm.id_comm,
            title_comm: comm.title_comm,
            researchers: comm.Researchers?.length ? comm.Researchers.map(res => `${res.res_fname} ${res.res_lname}`).join(", ") : "N/A",
            doctoral_students: comm.DoctoralStudents?.length ? comm.DoctoralStudents.map(doc => `${doc.doc_stud_fname} ${doc.doc_stud_lname}`).join(", ") : "N/A",
            event_title: comm.event_title,
            year_comm: comm.year_comm,
            url_comm: comm.url_comm || "N/A",
        });
    });

    return workbook.xlsx.writeBuffer();
};

// Function to export communications for a SPECIFIC lab
const generateCommunicationExcelByLab = async (labId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Communications");

    // Define Columns
    worksheet.columns = [
        { header: "Id", key: "id_comm", width: 10 },
        { header: "Title", key: "title_comm", width: 60 },
        { header: "Authors (researchers)", key: "researchers", width: 60 },
        { header: "Authors (doctoral students)", key: "doctoral_students", width: 60 },
        { header: "Event Title", key: "event_title", width: 40 },
        { header: "Year", key: "year_comm", width: 10 },
        { header: "Url", key: "url_comm", width: 40 },
    ];

    // Fetch communications for the specified lab
    const communications = await Communication.findAll({
        include: [
            { model: ProductionType, as: "production_type", attributes: ["type_name"] },
            {
                model: Researcher,
                as: "Researchers",
                attributes: ["res_fname", "res_lname"],
                include: [
                    { model: Laboratory, as: "laboratory", attributes: ["lab_name"] },
                ],
            },
            { 
                model: DoctoralStudent,
                as: "DoctoralStudents",
                attributes: ["doc_stud_fname", "doc_stud_lname"],
                include: [
                    { model: Laboratory, as: "laboratory", attributes: ["lab_name"] },
                ],
            },
        ],
        where: {
            [Op.or]: [ 
                { "$Researchers.laboratory.lab_code$": labId }, 
                { "$DoctoralStudents.laboratory.lab_code$": labId }
            ],
        },
        order: [[{ model: ProductionType, as: "production_type" }, "type_name", "ASC"]],
    });

    if (communications.length === 0) {
        worksheet.addRow(["No communications Found"]).font = { bold: true, size: 14 };
    }
    
    // Add the lab name as a header
    if (communications.length > 0) {
        const labName = communications[0]?.Researchers[0]?.laboratory?.lab_name || "Unknown Laboratory";
        worksheet.addRow([labName]).font = { bold: true, size: 14 };
    }
    
    let currentProductionType = null;

    communications.forEach((comm) => {
        // Add a separate row for the production name if it's a new production
        if (!currentProductionType || currentProductionType !== comm.production_type.type_name) {
            worksheet.addRow([`Communication: ${comm.production_type.type_name}`]).font = { bold: true, size: 14 };
            currentProductionType = comm.production_type.type_name;
        }

        // Add communication data under the corresponding production type
        worksheet.addRow({
            id_comm: comm.id_comm,
            title_comm: comm.title_comm,
            researchers: comm.Researchers && comm.Researchers.length 
            ? comm.Researchers.map((res) => `${res.res_fname} ${res.res_lname}`).join(", ") 
            : "N/A",
            doctoral_students: comm.DoctoralStudents && comm.DoctoralStudents.length 
            ? comm.DoctoralStudents.map((doc) => `${doc.doc_stud_fname} ${doc.doc_stud_lname}`).join(", ") 
            : "N/A",
            event_title: comm.event_title,
            year_comm: comm.year_comm,
            url_comm: comm.url_comm || "N/A",
        });
    });
    
    return workbook.xlsx.writeBuffer();
};

module.exports = { generateCommunicationExcel, generateCommunicationExcelByLab };
