"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("publish_doctoral_student_pub", [
      { 
        reg_num: "201736033743", 
        doi: "https://doi.org/10.1234/example4"
      },
      { 
        reg_num: "201936032730", 
        doi: "https://doi.org/10.1234/example4"
      },
      { 
        reg_num: "201936033835", 
        doi: "https://doi.org/10.1234/example1"
      },
      { 
        reg_num: "201936043739", 
        doi: "https://doi.org/10.1234/example2"
      },
      { 
        reg_num: "202036033721", 
        doi: "https://doi.org/10.1234/example1"
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("publish_doctoral_student_pub", null, {});
  }
};
