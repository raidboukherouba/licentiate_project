const ExcelJS = require("exceljs");
const { Laboratory, Equipment } = require("../../models"); // Import models

// Function to export ALL equipment (grouped by lab)
const generateEquipmentExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Equipments");

    // Define Columns
    worksheet.columns = [
        { header: "Inventory N°", key: "inventory_num", width: 20 },
        { header: "Equipment Name", key: "equip_name", width: 60 },
        { header: "Equipment Description", key: "equip_desc", width: 100 },
        { header: "Acquisition Date", key: "acq_date", width: 20 },
        { header: "Purchase Price", key: "purchase_price", width: 20 },
        { header: "Equipment Status", key: "equip_status", width: 20 },
        { header: "Equipment Quantity", key: "equip_quantity", width: 20 },
    ];

    // Fetch all equipments with associations and order by lab name
    const equipments = await Equipment.findAll({
        include: [
            { model: Laboratory, as: "laboratory", attributes: ["lab_name"] },
        ],
        order: [[{ model: Laboratory, as: "laboratory" }, "lab_name", "ASC"]],
    });

    let currentLaboratory = null;

    equipments.forEach((equip) => {
        // Add a separate row for the lab name if it's a new lab
        if (!currentLaboratory || currentLaboratory !== equip.laboratory.lab_name) {
            worksheet.addRow([equip.laboratory.lab_name]).font = { bold: true, size: 14 };
            currentLaboratory = equip.laboratory.lab_name;
        }

        // Add equipment data under the corresponding lab
        worksheet.addRow({
            inventory_num: equip.inventory_num,
            equip_name: equip.equip_name,
            equip_desc: equip.equip_desc || "N/A",
            acq_date: equip.acq_date || "N/A",
            purchase_price: equip.purchase_price || "N/A",
            equip_status: equip.equip_status || "N/A",
            equip_quantity: equip.equip_quantity || "N/A",
        });
    });

    return workbook.xlsx.writeBuffer();
};

// Function to export equipment for a SPECIFIC lab
const generateEquipmentExcelByLab = async (labId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Equipments");

    // Define Columns
    worksheet.columns = [
        { header: "Inventory N°", key: "inventory_num", width: 20 },
        { header: "Equipment Name", key: "equip_name", width: 60 },
        { header: "Equipment Description", key: "equip_desc", width: 100 },
        { header: "Acquisition Date", key: "acq_date", width: 20 },
        { header: "Purchase Price", key: "purchase_price", width: 20 },
        { header: "Equipment Status", key: "equip_status", width: 20 },
        { header: "Equipment Quantity", key: "equip_quantity", width: 20 },
    ];

    // Fetch equipment for the specified lab
    const equipments = await Equipment.findAll({
        include: [
            { model: Laboratory, as: "laboratory", attributes: ["lab_name"] },
        ],
        where: { lab_code: labId }, // Filter by labId
        order: [[{ model: Laboratory, as: "laboratory" }, "lab_name", "ASC"]],
    });

    // Add the lab name as a header
    if (equipments.length > 0) {
        const labName = equipments[0].laboratory.lab_name;
        worksheet.addRow([labName]).font = { bold: true, size: 14 };
    }

    // Add equipment data for the specified lab
    equipments.forEach((equip) => {
        worksheet.addRow({
            inventory_num: equip.inventory_num,
            equip_name: equip.equip_name,
            equip_desc: equip.equip_desc || "N/A",
            acq_date: equip.acq_date || "N/A",
            purchase_price: equip.purchase_price || "N/A",
            equip_status: equip.equip_status || "N/A",
            equip_quantity: equip.equip_quantity || "N/A",
        });
    });

    return workbook.xlsx.writeBuffer();
};

module.exports = { generateEquipmentExcel, generateEquipmentExcelByLab };