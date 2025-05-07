'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("domain", [
      { domain_name: "Sciences et Techniques", domain_abbr: "ST" },
      { domain_name: "Sciences de la Matière", domain_abbr: "SM" },
      { domain_name: "Mathématiques et Informatique", domain_abbr: "MI" },
      { domain_name: "Science de la Nature et de la Vie", domain_abbr: "SNV" },
      { domain_name: "Sciences de la Terre et de l’Univers", domain_abbr: "STU" },
      { domain_name: "Sciences Economiques, de Gestion et Commerciales", domain_abbr: "SEGC" },
      { domain_name: "Droit", domain_abbr: "Droit" },
      { domain_name: "Lettres et Langue Arabe", domain_abbr: "LLA" },
      { domain_name: "Lettres et langues Etrangères", domain_abbr: "LLE" },
      { domain_name: "Sciences Humaines et Sociales", domain_abbr: "SHS" },
      { domain_name: "Sciences et Techniques des Activités Physiques et Sportives", domain_abbr: "STAPS" },
      { domain_name: "les Arts", domain_abbr: "Arts" },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("domain", null, {});
  }
};
