"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("has_category", [
      { review_num: 1, cat_id: 1 },
      { review_num: 2, cat_id: 1 },
      { review_num: 3, cat_id: 1 },
      { review_num: 3, cat_id: 2 },
      { review_num: 4, cat_id: 2 }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("has_category", null, {});
  }
};
