"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("has_speciality", [
      { review_num: 1, spec_id_review: 1 },
      { review_num: 1, spec_id_review: 2 },
      { review_num: 1, spec_id_review: 3 },
      { review_num: 2, spec_id_review: 1 },
      { review_num: 2, spec_id_review: 4 },
      { review_num: 2, spec_id_review: 5 },
      { review_num: 3, spec_id_review: 1 },
      { review_num: 3, spec_id_review: 6 },
      { review_num: 3, spec_id_review: 9 },
      { review_num: 3, spec_id_review: 10 },
      { review_num: 4, spec_id_review: 1 },
      { review_num: 4, spec_id_review: 10 }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("has_speciality", null, {});
  }
};
