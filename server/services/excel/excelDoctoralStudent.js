const ExcelJS = require("exceljs");
const { DoctoralStudent, Function, Speciality, Team, Laboratory } = require("../../models"); // Import models

const generateDoctoralStudentExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Doctoral students");

    // Define Columns
    worksheet.columns = [
        { header: "Reg Num", key: "reg_num", width: 15 },
        { header: "First Name", key: "doc_stud_fname", width: 20 },
        { header: "Last Name", key: "doc_stud_lname", width: 20 },
        { header: "الاسم", key: "doc_stud_fname_ar", width: 20 },
        { header: "اللقب", key: "doc_stud_lname_ar", width: 20 },
        { header: "Gender", key: "doc_stud_gender", width: 10 },
        { header: "Attachment structure", key: "doc_stud_attach_struc", width: 20 },
        { header: "Birth date", key: "doc_stud_birth_date", width: 20 },
        { header: "Phone", key: "doc_stud_phone", width: 15 },
        { header: "Address", key: "doc_stud_address", width: 40 },
        { header: "Grade", key: "doc_stud_grade", width: 20 },
        { header: "Diploma", key: "doc_stud_diploma", width: 20 },
        { header: "Professional Email", key: "doc_stud_prof_email", width: 30 },
        { header: "Personal Email", key: "doc_stud_pers_email", width: 30 },
        { header: "Google Scholar link", key: "doc_stud_gs_link", width: 30 },
        { header: "ResearchGate link", key: "doc_stud_rg_link", width: 30 },
        { header: "personal page link", key: "doc_stud_page_link", width: 30 },
        { header: "ORCID", key: "doc_stud_orcid", width: 30 },
        { header: "Publications count", key: "doc_stud_pub_count", width: 25 },
        { header: "Citations count", key: "doc_stud_cit_count", width: 25 },
        { header: "Function", key: "function", width: 20 },
        { header: "Speciality", key: "speciality", width: 20 },
        { header: "Team", key: "team", width: 40 },
    ];

    // Fetch doctoral students with Associations
    const doctoralStudents = await DoctoralStudent.findAll({
        include: [
            { model: Function, as: "function", attributes: ["func_name"] },
            { model: Speciality, as: "speciality", attributes: ["spec_name"] },
            { model: Team, as: "team", attributes: ["team_name"] },
            { model: Laboratory, as: "laboratory", attributes: ["lab_name"] },
        ],
        order: [[{ model: Laboratory, as: "laboratory" }, "lab_name", "ASC"]],
    });

    let currentLaboratory = null;

    doctoralStudents.forEach((doc) => {
        // Add a separate row for the lab name if it's a new lab
        if (!currentLaboratory || currentLaboratory !== doc.laboratory.lab_name) {
            worksheet.addRow([doc.laboratory.lab_name]).font = { bold: true, size: 14 };
            currentLaboratory = doc.laboratory.lab_name;
        }

        // Add doctoral students data under the corresponding lab
        worksheet.addRow({
            reg_num: doc.reg_num,
            doc_stud_fname: doc.doc_stud_fname,
            doc_stud_lname: doc.doc_stud_lname,
            doc_stud_fname_ar: doc.doc_stud_fname_ar,
            doc_stud_lname_ar: doc.doc_stud_lname_ar,
            doc_stud_gender: doc.doc_stud_gender,
            doc_stud_attach_struc: doc.doc_stud_attach_struc || "N/A",
            doc_stud_birth_date: doc.doc_stud_birth_date || "N/A",
            doc_stud_phone: doc.doc_stud_phone || "N/A",
            doc_stud_address: doc.doc_stud_address || "N/A",
            doc_stud_grade: doc.doc_stud_grade || "N/A",
            doc_stud_diploma: doc.doc_stud_diploma || "N/A",
            doc_stud_prof_email: doc.doc_stud_prof_email,
            doc_stud_pers_email: doc.doc_stud_pers_email || "N/A",
            doc_stud_gs_link: doc.doc_stud_gs_link || "N/A",
            doc_stud_rg_link: doc.doc_stud_rg_link || "N/A",
            doc_stud_page_link: doc.doc_stud_page_link || "N/A",
            doc_stud_orcid: doc.doc_stud_orcid || "N/A",
            doc_stud_pub_count: doc.doc_stud_pub_count,
            doc_stud_cit_count: doc.doc_stud_cit_count,
            function: doc.function ? doc.function.func_name : "N/A",
            speciality: doc.speciality ? doc.speciality.spec_name : "N/A",
            team: doc.team ? doc.team.team_name : "N/A",
        });
    });

    return workbook.xlsx.writeBuffer();
};

// Function to export doctoral students for a SPECIFIC lab
const generateDoctoralStudentExcelByLab = async (labId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Doctoral students");

    // Define Columns
    worksheet.columns = [
        { header: "Reg Num", key: "reg_num", width: 15 },
        { header: "First Name", key: "doc_stud_fname", width: 20 },
        { header: "Last Name", key: "doc_stud_lname", width: 20 },
        { header: "الاسم", key: "doc_stud_fname_ar", width: 20 },
        { header: "اللقب", key: "doc_stud_lname_ar", width: 20 },
        { header: "Gender", key: "doc_stud_gender", width: 10 },
        { header: "Attachment structure", key: "doc_stud_attach_struc", width: 20 },
        { header: "Birth date", key: "doc_stud_birth_date", width: 20 },
        { header: "Phone", key: "doc_stud_phone", width: 15 },
        { header: "Address", key: "doc_stud_address", width: 40 },
        { header: "Grade", key: "doc_stud_grade", width: 20 },
        { header: "Diploma", key: "doc_stud_diploma", width: 20 },
        { header: "Professional Email", key: "doc_stud_prof_email", width: 30 },
        { header: "Personal Email", key: "doc_stud_pers_email", width: 30 },
        { header: "Google Scholar link", key: "doc_stud_gs_link", width: 30 },
        { header: "ResearchGate link", key: "doc_stud_rg_link", width: 30 },
        { header: "personal page link", key: "doc_stud_page_link", width: 30 },
        { header: "ORCID", key: "doc_stud_orcid", width: 30 },
        { header: "Publications count", key: "doc_stud_pub_count", width: 25 },
        { header: "Citations count", key: "doc_stud_cit_count", width: 25 },
        { header: "Function", key: "function", width: 20 },
        { header: "Speciality", key: "speciality", width: 20 },
        { header: "Team", key: "team", width: 40 },
    ];

    // Fetch doctoral students for the specified lab
    const doctoralStudents = await DoctoralStudent.findAll({
        include: [
            { model: Function, as: "function", attributes: ["func_name"] },
            { model: Speciality, as: "speciality", attributes: ["spec_name"] },
            { model: Team, as: "team", attributes: ["team_name"] },
            { model: Laboratory, as: "laboratory", attributes: ["lab_name"] },
        ],
        where: { lab_code: labId }, // Filter by labId
        order: [[{ model: Laboratory, as: "laboratory" }, "lab_name", "ASC"]],
    });

    // Add the lab name as a header
    if (doctoralStudents.length > 0) {
        const labName = doctoralStudents[0].laboratory.lab_name;
        worksheet.addRow([labName]).font = { bold: true, size: 14 };
    }

    // Add doctoral students data for the specified lab
    doctoralStudents.forEach((doc) => {
        worksheet.addRow({
            reg_num: doc.reg_num,
            doc_stud_fname: doc.doc_stud_fname,
            doc_stud_lname: doc.doc_stud_lname,
            doc_stud_fname_ar: doc.doc_stud_fname_ar,
            doc_stud_lname_ar: doc.doc_stud_lname_ar,
            doc_stud_gender: doc.doc_stud_gender,
            doc_stud_attach_struc: doc.doc_stud_attach_struc || "N/A",
            doc_stud_birth_date: doc.doc_stud_birth_date || "N/A",
            doc_stud_phone: doc.doc_stud_phone || "N/A",
            doc_stud_address: doc.doc_stud_address || "N/A",
            doc_stud_grade: doc.doc_stud_grade || "N/A",
            doc_stud_diploma: doc.doc_stud_diploma || "N/A",
            doc_stud_prof_email: doc.doc_stud_prof_email,
            doc_stud_pers_email: doc.doc_stud_pers_email || "N/A",
            doc_stud_gs_link: doc.doc_stud_gs_link || "N/A",
            doc_stud_rg_link: doc.doc_stud_rg_link || "N/A",
            doc_stud_page_link: doc.doc_stud_page_link || "N/A",
            doc_stud_orcid: doc.doc_stud_orcid || "N/A",
            doc_stud_pub_count: doc.doc_stud_pub_count,
            doc_stud_cit_count: doc.doc_stud_cit_count,
            function: doc.function ? doc.function.func_name : "N/A",
            speciality: doc.speciality ? doc.speciality.spec_name : "N/A",
            team: doc.team ? doc.team.team_name : "N/A",
        });
    });

    return workbook.xlsx.writeBuffer();
};

module.exports = { generateDoctoralStudentExcel, generateDoctoralStudentExcelByLab };
