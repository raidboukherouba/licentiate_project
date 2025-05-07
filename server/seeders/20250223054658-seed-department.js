'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("department", [
      { dept_name: "ST Ingénieur" },
      { dept_name: "Département ST1" },
      { dept_name: "Département ST2" },
      { dept_name: "Département d’Architecture" },
      { dept_name: "Département Génie Civil et Hydraulique" },
      { dept_name: "Département Electronique" },
      { dept_name: "Département de Génie Electrotechnique et Automatique" },
      { dept_name: "Département Génie des procédés" },
      { dept_name: "Département Génie Mécanique" },
      { dept_name: "Département d’informatique" },
      { dept_name: "Département de Mathématiques" },
      { dept_name: "Département des Sciences de la matière" },
      { dept_name: "Département de Sciences Naturelles" },
      { dept_name: "Département de Biologie" },
      { dept_name: "Département d’Ecologie" },
      { dept_name: "Département des sciences commerciales" },
      { dept_name: "Département de Sciences Economiques" },
      { dept_name: "Département de Science de Gestion" },
      { dept_name: "Tronc commun de première année" },
      { dept_name: "Sciences de l’Information et de la Communication et Bibliothéconomie" },
      { dept_name: "Département d’Histoire" },
      { dept_name: "Département d’Archéologie" },
      { dept_name: "Département de Sociologie" },
      { dept_name: "Département de psychologie" },
      { dept_name: "Département de Philosophie" },
      { dept_name: "Branche des Sciences Humaines" },
      { dept_name: "Département de langue et littérature Arabe" },
      { dept_name: "Département des Lettres et Langue Anglaise" },
      { dept_name: "Département des lettres et langue Française" },
      { dept_name: "Département de droit" },
      { dept_name: "Département des sciences politiques" },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("department", null, {});
  }
};
