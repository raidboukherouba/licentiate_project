'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("publisher", [
      { publisher_name: "Springer Nature", country: "Germany" },
      { publisher_name: "Elsevier", country: "Netherlands" },
      { publisher_name: "Wiley", country: "United States" },
      { publisher_name: "Taylor & Francis", country: "United Kingdom" },
      { publisher_name: "IEEE", country: "United States" },
      { publisher_name: "Oxford University Press", country: "United Kingdom" },
      { publisher_name: "Cambridge University Press", country: "United Kingdom" },
      { publisher_name: "SAGE Publications", country: "United States" },
      { publisher_name: "Emerald Group Publishing", country: "United Kingdom" },
      { publisher_name: "American Chemical Society", country: "United States" },
      { publisher_name: "Royal Society of Chemistry", country: "United Kingdom" },
      { publisher_name: "Hindawi", country: "Egypt" },
      { publisher_name: "MDPI", country: "Switzerland" },
      { publisher_name: "PLOS", country: "United States" },
      { publisher_name: "BioMed Central", country: "United Kingdom" },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("publisher", null, {});
  }
};
