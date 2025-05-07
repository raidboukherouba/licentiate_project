const ExcelJS = require("exceljs");
const { Laboratory, Faculty, Domain, Department } = require("../../models"); // Import models

const generateLaboratoryExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laboratories");

    // Define Columns
    worksheet.columns = [
        { header: "ID", key: "lab_code", width: 5 },
        { header: "Lab Name", key: "lab_name", width: 50 },
        { header: "Lab Abbreviation", key: "lab_abbr", width: 20 },
        { header: "Lab Description", key: "lab_desc", width: 50 },
        { header: "Address", key: "lab_address", width: 40 },
        { header: "Phone Number", key: "lab_phone", width: 30 },
        { header: "Domain", key: "domain", width: 40 },
        { header: "Department", key: "department", width: 40 },
    ];

    // Fetch laboratories with associations and order by faculty
    const laboratories = await Laboratory.findAll({
        include: [
            { model: Faculty, as: "faculty", attributes: ["faculty_name"] },
            { model: Domain, as: "domain", attributes: ["domain_name"] },
            { model: Department, as: "department", attributes: ["dept_name"] },
        ],
        order: [[{ model: Faculty, as: "faculty" }, "faculty_name", "ASC"]],
    });

    let currentFaculty = null;

    laboratories.forEach((lab) => {
        // Add a separate row for the faculty name if it's a new faculty
        if (!currentFaculty || currentFaculty !== lab.faculty.faculty_name) {
            worksheet.addRow([lab.faculty.faculty_name]).font = { bold: true, size: 14 };
            currentFaculty = lab.faculty.faculty_name;
        }

        // Add laboratory data under the corresponding faculty
        worksheet.addRow({
            lab_code: lab.lab_code,
            lab_name: lab.lab_name,
            lab_abbr: lab.lab_abbr || "N/A",
            lab_desc: lab.lab_desc || "N/A",
            lab_address: lab.lab_address || "N/A",
            lab_phone: lab.lab_phone || "N/A",
            domain: lab.domain ? lab.domain.domain_name : "N/A",
            department: lab.department ? lab.department.dept_name : "N/A",
        });
    });

    return workbook.xlsx.writeBuffer();
};

// Function to export laboratories for a SPECIFIC fac
const generateLaboratoryExcelByFac = async (facId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laboratories");

    // Define Columns
    worksheet.columns = [
        { header: "ID", key: "lab_code", width: 5 },
        { header: "Lab Name", key: "lab_name", width: 50 },
        { header: "Lab Abbreviation", key: "lab_abbr", width: 20 },
        { header: "Lab Description", key: "lab_desc", width: 50 },
        { header: "Address", key: "lab_address", width: 40 },
        { header: "Phone Number", key: "lab_phone", width: 30 },
        { header: "Domain", key: "domain", width: 40 },
        { header: "Department", key: "department", width: 40 },
    ];

    // Fetch laboratories for the specified faculty
    const laboratories = await Laboratory.findAll({
        include: [
            { model: Faculty, as: "faculty", attributes: ["faculty_name", "faculty_id"] },
            { model: Domain, as: "domain", attributes: ["domain_name"] },
            { model: Department, as: "department", attributes: ["dept_name"] },
        ],
        where: { faculty_id: facId }, // Filter by facId
        order: [[{ model: Faculty, as: "faculty" }, "faculty_name", "ASC"]],
    });

    // Add the faculty name as a header
    if (laboratories.length > 0) {
        const facName = laboratories[0].faculty.faculty_name;
        worksheet.addRow([facName]).font = { bold: true, size: 14 };
    }

    // Add equipment data for the specified lab
    laboratories.forEach((lab) => {
        worksheet.addRow({
            lab_code: lab.lab_code,
            lab_name: lab.lab_name,
            lab_abbr: lab.lab_abbr || "N/A",
            lab_desc: lab.lab_desc || "N/A",
            lab_address: lab.lab_address || "N/A",
            lab_phone: lab.lab_phone || "N/A",
            domain: lab.domain ? lab.domain.domain_name : "N/A",
            department: lab.department ? lab.department.dept_name : "N/A",
        });
    });

    return workbook.xlsx.writeBuffer();
};

module.exports = { generateLaboratoryExcel, generateLaboratoryExcelByFac };
