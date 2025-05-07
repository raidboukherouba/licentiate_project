'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("category", [
      { cat_name: "A" },
      { cat_name: "B" },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("category", null, {});
  }
};
