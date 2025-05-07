'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("function", [
      { func_name: "Membre d’équipe" },
      { func_name: "Chef d’équipe" },
      { func_name: "Cheffe d’équipe" },
      { func_name: "Chercheur associé" },
      { func_name: "Chercheuse associée" },
      { func_name: "Chercheur" },
      { func_name: "Chercheuse" },
      { func_name: "PG" },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("function", null, {});
  }
};
