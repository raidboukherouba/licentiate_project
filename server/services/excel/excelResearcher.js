const ExcelJS = require("exceljs");
const { Researcher, Function, Speciality, Team, Laboratory } = require("../../models"); // Import models

const generateResearcherExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Researchers");

    // Define Columns
    worksheet.columns = [
        { header: "ID", key: "res_code", width: 10 },
        { header: "First Name", key: "res_fname", width: 20 },
        { header: "Last Name", key: "res_lname", width: 20 },
        { header: "الاسم", key: "res_fname_ar", width: 20 },
        { header: "اللقب", key: "res_lname_ar", width: 20 },
        { header: "Gender", key: "res_gender", width: 10 },
        { header: "Attachment structure", key: "res_attach_struc", width: 20 },
        { header: "Birth date", key: "res_birth_date", width: 20 },
        { header: "Phone", key: "res_phone", width: 15 },
        { header: "Address", key: "res_address", width: 40 },
        { header: "Grade", key: "res_grade", width: 20 },
        { header: "Diploma", key: "res_diploma", width: 20 },
        { header: "Professional Email", key: "res_prof_email", width: 30 },
        { header: "Personal Email", key: "res_pers_email", width: 30 },
        { header: "Google Scholar link", key: "res_gs_link", width: 30 },
        { header: "ResearchGate link", key: "res_rg_link", width: 30 },
        { header: "personal page link", key: "res_page_link", width: 30 },
        { header: "ORCID", key: "res_orcid", width: 30 },
        { header: "Publications count", key: "res_pub_count", width: 25 },
        { header: "Citations count", key: "res_cit_count", width: 25 },
        { header: "is director", key: "is_director", width: 20 },
        { header: "Function", key: "function", width: 20 },
        { header: "Speciality", key: "speciality", width: 20 },
        { header: "Team", key: "team", width: 40 },
    ];

    // Fetch Researchers with Associations
    const researchers = await Researcher.findAll({
        include: [
            { model: Function, as: "function", attributes: ["func_name"] },
            { model: Speciality, as: "speciality", attributes: ["spec_name"] },
            { model: Team, as: "team", attributes: ["team_name"] },
            { model: Laboratory, as: "laboratory", attributes: ["lab_name"] },
        ],
        order: [[{ model: Laboratory, as: "laboratory" }, "lab_name", "ASC"]],
    });

    let currentLaboratory = null;

    researchers.forEach((res) => {
        // Add a separate row for the lab name if it's a new lab
        if (!currentLaboratory || currentLaboratory !== res.laboratory.lab_name) {
            worksheet.addRow([res.laboratory.lab_name]).font = { bold: true, size: 14 };
            currentLaboratory = res.laboratory.lab_name;
        }

        // Add researchers data under the corresponding lab
        worksheet.addRow({
            res_code: res.res_code,
            res_fname: res.res_fname,
            res_lname: res.res_lname,
            res_fname_ar: res.res_fname_ar,
            res_lname_ar: res.res_lname_ar,
            res_gender: res.res_gender,
            res_attach_struc: res.res_attach_struc || "N/A",
            res_birth_date: res.res_birth_date || "N/A",
            res_phone: res.res_phone || "N/A",
            res_address: res.res_address || "N/A",
            res_grade: res.res_grade || "N/A",
            res_diploma: res.res_diploma || "N/A",
            res_prof_email: res.res_prof_email,
            res_pers_email: res.res_pers_email || "N/A",
            res_gs_link: res.res_gs_link || "N/A",
            res_rg_link: res.res_rg_link || "N/A",
            res_page_link: res.res_page_link || "N/A",
            res_orcid: res.res_orcid || "N/A",
            res_pub_count: res.res_pub_count,
            res_cit_count: res.res_cit_count,
            is_director: res.is_director,
            function: res.function ? res.function.func_name : "N/A",
            speciality: res.speciality ? res.speciality.spec_name : "N/A",
            team: res.team ? res.team.team_name : "N/A",
        });
    });

    return workbook.xlsx.writeBuffer();
};

// Function to export researchers for a SPECIFIC lab
const generateResearcherExcelByLab = async (labId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reseachers");

    // Define Columns
    worksheet.columns = [
        { header: "ID", key: "res_code", width: 10 },
        { header: "First Name", key: "res_fname", width: 20 },
        { header: "Last Name", key: "res_lname", width: 20 },
        { header: "الاسم", key: "res_fname_ar", width: 20 },
        { header: "اللقب", key: "res_lname_ar", width: 20 },
        { header: "Gender", key: "res_gender", width: 10 },
        { header: "Attachment structure", key: "res_attach_struc", width: 20 },
        { header: "Birth date", key: "res_birth_date", width: 20 },
        { header: "Phone", key: "res_phone", width: 15 },
        { header: "Address", key: "res_address", width: 40 },
        { header: "Grade", key: "res_grade", width: 20 },
        { header: "Diploma", key: "res_diploma", width: 20 },
        { header: "Professional Email", key: "res_prof_email", width: 30 },
        { header: "Personal Email", key: "res_pers_email", width: 30 },
        { header: "Google Scholar link", key: "res_gs_link", width: 30 },
        { header: "ResearchGate link", key: "res_rg_link", width: 30 },
        { header: "personal page link", key: "res_page_link", width: 30 },
        { header: "ORCID", key: "res_orcid", width: 30 },
        { header: "Publications count", key: "res_pub_count", width: 25 },
        { header: "Citations count", key: "res_cit_count", width: 25 },
        { header: "is director", key: "is_director", width: 20 },
        { header: "Function", key: "function", width: 20 },
        { header: "Speciality", key: "speciality", width: 20 },
        { header: "Team", key: "team", width: 40 },
    ];

    // Fetch researchers for the specified lab
    const researchers = await Researcher.findAll({
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
    if (researchers.length > 0) {
        const labName = researchers[0].laboratory.lab_name;
        worksheet.addRow([labName]).font = { bold: true, size: 14 };
    }

    // Add researcher data for the specified lab
    researchers.forEach((res) => {
        worksheet.addRow({
            res_code: res.res_code,
            res_fname: res.res_fname,
            res_lname: res.res_lname,
            res_fname_ar: res.res_fname_ar,
            res_lname_ar: res.res_lname_ar,
            res_gender: res.res_gender,
            res_attach_struc: res.res_attach_struc || "N/A",
            res_birth_date: res.res_birth_date || "N/A",
            res_phone: res.res_phone || "N/A",
            res_address: res.res_address || "N/A",
            res_grade: res.res_grade || "N/A",
            res_diploma: res.res_diploma || "N/A",
            res_prof_email: res.res_prof_email,
            res_pers_email: res.res_pers_email || "N/A",
            res_gs_link: res.res_gs_link || "N/A",
            res_rg_link: res.res_rg_link || "N/A",
            res_page_link: res.res_page_link || "N/A",
            res_orcid: res.res_orcid || "N/A",
            res_pub_count: res.res_pub_count,
            res_cit_count: res.res_cit_count,
            is_director: res.is_director,
            function: res.function ? res.function.func_name : "N/A",
            speciality: res.speciality ? res.speciality.spec_name : "N/A",
            team: res.team ? res.team.team_name : "N/A",
        });
    });

    return workbook.xlsx.writeBuffer();
};

module.exports = { generateResearcherExcel, generateResearcherExcelByLab };
