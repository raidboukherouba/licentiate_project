"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("assign_doctoral_student", [
      { 
        reg_num: "201836033031", 
        inventory_num: "LAB01-f1800-2110", 
        doc_stud_assign_date: "2022-01-01", 
        doc_stud_return_date: null 
      },
      { 
        reg_num: "201936033835", 
        inventory_num: "LAB01-sir-2110", 
        doc_stud_assign_date: "2022-01-01", 
        doc_stud_return_date: null 
      },
      { 
        reg_num: "202036033721", 
        inventory_num: "LAB01-b111-2110", 
        doc_stud_assign_date: "2022-01-01", 
        doc_stud_return_date: null 
      },
      { 
        reg_num: "202036033721", 
        inventory_num: "LAB01-lyp-2110", 
        doc_stud_assign_date: "2022-01-01", 
        doc_stud_return_date: null 
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("assign_doctoral_student", null, {});
  }
};
