const ExcelJS = require("exceljs");
const { Publication, Review, ProductionType, Publisher, Category, ReviewSpeciality, Researcher, DoctoralStudent, Laboratory } = require("../../models"); // Import models
const { Op } = require("sequelize");

const generatePublicationExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Publications");

    // Define Columns
    worksheet.columns = [
        { header: "Doi", key: "doi", width: 30 },
        { header: "Title", key: "article_title", width: 60 },
        { header: "Authors (researchers)", key: "researchers", width: 60 },
        { header: "Authors (doctoral students)", key: "doctoral_students", width: 60 },
        { header: "Submission Date", key: "submission_date", width: 20 },
        { header: "Acceptance Date", key: "acceptance_date", width: 20 },
        { header: "Pub Pages", key: "pub_pages", width: 15 },
        { header: "Review", key: "review", width: 60 },
        { header: "Review Publisher", key: "publisher", width: 40 },
        { header: "Review Categories", key: "categories", width: 50 },
        { header: "Review Specialities", key: "specialities", width: 100 },
    ];

    // Fetch publicatons with associations and order by production type
    const publications = await Publication.findAll({
        include: [
            { 
                model: Review,
                as: "review",
                attributes: ["review_title"],
                include: [
                    { model: Publisher, as: "publisher", attributes: ["publisher_name"] },
                    { model: Category, as: "Categories", through: { attributes: [] }, attributes: ["cat_name"] },
                    { model: ReviewSpeciality, as: "ReviewSpecialities", through: { attributes: [] }, attributes: ["spec_name_review"] },
                ],
            },
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
        order: [
            [{ model: Researcher, as: "Researchers" }, { model: Laboratory, as: "laboratory" }, "lab_name", "ASC"],
            [{ model: ProductionType, as: "production_type" }, "type_name", "ASC"]
        ],
    });

    let currentLab = null;
    let currentProductionType = null;

    publications.forEach((pub) => {
        const labName = pub.Researchers[0]?.laboratory?.lab_name || pub.DoctoralStudents[0]?.laboratory?.lab_name || "Unknown Laboratory";
        
        // Add a separate row for the lab name if it's a new lab
        if (!currentLab || currentLab !== labName) {
            worksheet.addRow([`Laboratory: ${labName}`]).font = { bold: true, size: 14 };
            currentLab = labName;
            currentProductionType = null; // Reset production type grouping when changing labs
        }

        // Add a separate row for the production name if it's a new production within the same lab
        if (!currentProductionType || currentProductionType !== pub.production_type.type_name) {
            worksheet.addRow([`Publication: ${pub.production_type.type_name}`]).font = { bold: true, size: 14 };
            currentProductionType = pub.production_type.type_name;
        }

        // Add publication data under the corresponding lab and production type
        worksheet.addRow({
            doi: pub.doi,
            article_title: pub.article_title,
            researchers: pub.Researchers && pub.Researchers.length 
            ? pub.Researchers.map((res) => `${res.res_fname} ${res.res_lname}`).join(", ") 
            : "N/A",
            doctoral_students: pub.DoctoralStudents && pub.DoctoralStudents.length 
            ? pub.DoctoralStudents.map((doc) => `${doc.doc_stud_fname} ${doc.doc_stud_lname}`).join(", ") 
            : "N/A",
            submission_date: pub.submission_date,
            acceptance_date: pub.acceptance_date,
            pub_pages: pub.pub_pages || "N/A",
            review: pub.review ? pub.review.review_title : "N/A",
            publisher: pub.review && pub.review.publisher
            ? pub.review.publisher.publisher_name
            : "N/A",
            categories: pub.review && pub.review.Categories.length
            ? pub.review.Categories.map((cat) => cat.cat_name).join(", ")
            : "N/A",
            specialities: pub.review && pub.review.ReviewSpecialities.length
            ? pub.review.ReviewSpecialities.map((spec) => spec.spec_name_review).join(", ")
            : "N/A",
        });
    });

    return workbook.xlsx.writeBuffer();
};

// Function to export publications for a SPECIFIC lab
const generatePublicationExcelByLab = async (labId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Publications");

    // Define Columns
    worksheet.columns = [
        { header: "Doi", key: "doi", width: 30 },
        { header: "Title", key: "article_title", width: 60 },
        { header: "Authors (researchers)", key: "researchers", width: 60 },
        { header: "Authors (doctoral students)", key: "doctoral_students", width: 60 },
        { header: "Submission Date", key: "submission_date", width: 20 },
        { header: "Acceptance Date", key: "acceptance_date", width: 20 },
        { header: "Pub Pages", key: "pub_pages", width: 15 },
        { header: "Review", key: "review", width: 60 },
        { header: "Review Publisher", key: "publisher", width: 40 },
        { header: "Review Categories", key: "categories", width: 50 },
        { header: "Review Specialities", key: "specialities", width: 100 },
    ];

    // Fetch publications for the specified lab
    const publications = await Publication.findAll({
        include: [
            { 
                model: Review,
                as: "review",
                attributes: ["review_title"],
                include: [
                    { model: Publisher, as: "publisher", attributes: ["publisher_name"] },
                    { model: Category, as: "Categories", through: { attributes: [] }, attributes: ["cat_name"] },
                    { model: ReviewSpeciality, as: "ReviewSpecialities", through: { attributes: [] }, attributes: ["spec_name_review"] },
                ],
            },
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

    if (publications.length === 0) {
        worksheet.addRow(["No Publications Found"]).font = { bold: true, size: 14 };
    }
    
    // Add the lab name as a header
    if (publications.length > 0) {
        const labName = publications[0]?.Researchers[0]?.laboratory?.lab_name || "Unknown Laboratory";
        worksheet.addRow([labName]).font = { bold: true, size: 14 };
    }
    
    let currentProductionType = null;

    publications.forEach((pub) => {
        // Add a separate row for the production name if it's a new production
        if (!currentProductionType || currentProductionType !== pub.production_type.type_name) {
            worksheet.addRow([`Publication: ${pub.production_type.type_name}`]).font = { bold: true, size: 14 };
            currentProductionType = pub.production_type.type_name;
        }

        // Add publication data under the corresponding production type
        worksheet.addRow({
            doi: pub.doi,
            article_title: pub.article_title,
            researchers: pub.Researchers && pub.Researchers.length 
            ? pub.Researchers.map((res) => `${res.res_fname} ${res.res_lname}`).join(", ") 
            : "N/A",
            doctoral_students: pub.DoctoralStudents && pub.DoctoralStudents.length 
            ? pub.DoctoralStudents.map((doc) => `${doc.doc_stud_fname} ${doc.doc_stud_lname}`).join(", ") 
            : "N/A",
            submission_date: pub.submission_date,
            acceptance_date: pub.acceptance_date,
            pub_pages: pub.pub_pages || "N/A",
            review: pub.review ? pub.review.review_title : "N/A",
            publisher: pub.review && pub.review.publisher
            ? pub.review.publisher.publisher_name
            : "N/A",
            categories: pub.review && pub.review.Categories.length
            ? pub.review.Categories.map((cat) => cat.cat_name).join(", ")
            : "N/A",
            specialities: pub.review && pub.review.ReviewSpecialities.length
            ? pub.review.ReviewSpecialities.map((spec) => spec.spec_name_review).join(", ")
            : "N/A",
        });
    });
    
    return workbook.xlsx.writeBuffer();
};

module.exports = { generatePublicationExcel, generatePublicationExcelByLab };