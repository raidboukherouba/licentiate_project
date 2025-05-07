'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("production_type", [
      { type_name: "internationale" },
      { type_name: "nationale" },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("production_type", null, {});
  }
};
