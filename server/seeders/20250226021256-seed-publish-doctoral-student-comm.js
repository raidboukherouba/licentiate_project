"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("publish_doctoral_student_comm", [
      { reg_num: 202136533789, id_comm: 1 },
      { reg_num: 201936233533, id_comm: 1 },
      { reg_num: 202036033231, id_comm: 1 },
      { reg_num: 202136013722, id_comm: 2 },
      { reg_num: 201536023731, id_comm: 2 },
      { reg_num: 201836033031, id_comm: 3 },
      { reg_num: 202036033721, id_comm: 3 }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("publish_doctoral_student_comm", null, {});
  }
};
