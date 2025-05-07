'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("review_speciality", [
      { spec_name_review: "Artificial Intelligence" },
      { spec_name_review: "Computer Vision" },
      { spec_name_review: "Machine Learning" },
      { spec_name_review: "Intelligent Transportation Systems (ITS)" },
      { spec_name_review: "Pattern Recognition" },
      { spec_name_review: "Control Systems Engineering" },
      { spec_name_review: "Renewable Energy Systems" },
      { spec_name_review: "Electrical Engineering" },
      { spec_name_review: "Applied Mathematics" },
      { spec_name_review: "Power Systems and Smart Grids" },
      { spec_name_review: "GENIE CIVIL ET HYDRAULIQUE" },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("review_speciality", null, {});
  }
};
