"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("publish_researcher_pub", [
      { res_code: 1, doi: "https://doi.org/10.1234/example4" },
      { res_code: 2, doi: "https://doi.org/10.1234/example4" },
      { res_code: 5, doi: "https://doi.org/10.1234/example3" },
      { res_code: 6, doi: "https://doi.org/10.1234/example5" },
      { res_code: 7, doi: "https://doi.org/10.1234/example3" },
      { res_code: 8, doi: "https://doi.org/10.1234/example5" },
      { res_code: 9, doi: "https://doi.org/10.1234/example3" },
      { res_code: 12, doi: "https://doi.org/10.1234/example1" },
      { res_code: 15, doi: "https://doi.org/10.1234/example2" },
      { res_code: 16, doi: "https://doi.org/10.1234/example2" },
      { res_code: 19, doi: "https://doi.org/10.1234/example2" }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("publish_researcher_pub", null, {});
  }
};
