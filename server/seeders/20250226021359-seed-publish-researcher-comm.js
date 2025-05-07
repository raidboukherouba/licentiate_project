"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("publish_researcher_comm", [
      { res_code: 2, id_comm: 1 },
      { res_code: 8, id_comm: 1 },
      { res_code: 9, id_comm: 1 },
      { res_code: 12, id_comm: 2 },
      { res_code: 17, id_comm: 2 },
      { res_code: 20, id_comm: 3 },
      { res_code: 30, id_comm: 3 }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("publish_researcher_comm", null, {});
  }
};
