const ExcelJS = require("exceljs");
const { Supervise, DoctoralStudent, Researcher, Laboratory } = require("../../models"); // Import models
const { Op } = require("sequelize");

const generateSupervisionExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Supervisions");

    // Define Columns
    worksheet.columns = [
        { header: "Thesis Director", key: "researcher", width: 25 },
        { header: "Doctoral Student", key: "doctoral_student", width: 25 },
        { header: "Start Date", key: "super_start_date", width: 20 },
        { header: "End Date", key: "super_end_date", width: 20 },
        { header: "Thesis Title", key: "super_theme", width: 80 },
    ];

    // Fetch supervisions with nested includes
    const supervisions = await Supervise.findAll({
        include: [
            { 
                model: Researcher,
                as: "Researcher",
                attributes: ["res_fname", "res_lname"],
                include: [
                    { model: Laboratory, as: "laboratory", attributes: ["lab_name"] }
                ],
            },
            { 
                model: DoctoralStudent, 
                as: "DoctoralStudent", 
                attributes: ["doc_stud_fname", "doc_stud_lname"] 
            },
        ],
        order: [[{ model: Researcher, as: "Researcher" }, { model: Laboratory, as: "laboratory" }, "lab_name", "ASC"]],
    });

    let currentLaboratory = null;

    supervisions.forEach((sup) => {
        const laboratoryName = sup.Researcher && sup.Researcher.laboratory
            ? sup.Researcher.laboratory.lab_name
            : "Unknown Laboratory";

        // Add a separate row for the lab name if it's a new lab
        if (!currentLaboratory || currentLaboratory !== laboratoryName) {
            worksheet.addRow([laboratoryName]).font = { bold: true, size: 14 };
            currentLaboratory = laboratoryName;
        }

        // Add supervision data under the corresponding lab
        worksheet.addRow({
            researcher: sup.Researcher
            ? `${sup.Researcher.res_fname} ${sup.Researcher.res_lname}`
            : "N/A",
            doctoral_student: sup.DoctoralStudent
            ? `${sup.DoctoralStudent.doc_stud_fname} ${sup.DoctoralStudent.doc_stud_lname}`
            : "N/A",
            super_start_date: sup.super_start_date,
            super_end_date: sup.super_end_date || "N/A",
            super_theme: sup.super_theme,
        });
    });

    return workbook.xlsx.writeBuffer();
};

// Function to export supervisions for a SPECIFIC lab
const generateSupervisionExcelByLab = async (labId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Supervisions");

    // Define Columns
    worksheet.columns = [
        { header: "Thesis Director", key: "researcher", width: 25 },
        { header: "Doctoral Student", key: "doctoral_student", width: 25 },
        { header: "Start Date", key: "super_start_date", width: 20 },
        { header: "End Date", key: "super_end_date", width: 20 },
        { header: "Thesis Title", key: "super_theme", width: 80 },
    ];

    // Fetch equipment for the specified lab
    const supervisions = await Supervise.findAll({
        include: [
            { 
                model: Researcher,
                as: "Researcher",
                attributes: ["res_fname", "res_lname"],
                include: [
                    { model: Laboratory, as: "laboratory", attributes: ["lab_name"] }
                ],
            },
            { 
                model: DoctoralStudent, 
                as: "DoctoralStudent", 
                attributes: ["doc_stud_fname", "doc_stud_lname"],
                include: [
                    { model: Laboratory, as: "laboratory", attributes: ["lab_name"] },
                ], 
            },
        ],
        where:{
            [Op.or]: [ 
                { "$Researcher.laboratory.lab_code$": labId }, 
                { "$DoctoralStudent.laboratory.lab_code$": labId }
            ],
        },
        order: [[{ model: Researcher, as: "Researcher" }, { model: Laboratory, as: "laboratory" }, "lab_name", "ASC"]],
    });

    if (supervisions.length === 0) {
        worksheet.addRow(["No Supervisions Found"]).font = { bold: true, size: 14 };
    }

    // Add the lab name as a header
    if (supervisions.length > 0) {
        const labName = 
        supervisions[0].Researcher?.laboratory?.lab_name ||
        supervisions[0].DoctoralStudent?.laboratory?.lab_name ||
        "Unknown Laboratory";
        worksheet.addRow([labName]).font = { bold: true, size: 14 };
    }

    // Add supervisions data for the specified lab
    supervisions.forEach((sup) => {
        worksheet.addRow({
            researcher: sup.Researcher
            ? `${sup.Researcher.res_fname} ${sup.Researcher.res_lname}`
            : "N/A",
            doctoral_student: sup.DoctoralStudent
            ? `${sup.DoctoralStudent.doc_stud_fname} ${sup.DoctoralStudent.doc_stud_lname}`
            : "N/A",
            super_start_date: sup.super_start_date,
            super_end_date: sup.super_end_date || "N/A",
            super_theme: sup.super_theme,
        });
    });

    return workbook.xlsx.writeBuffer();
};

module.exports = { generateSupervisionExcel, generateSupervisionExcelByLab };
