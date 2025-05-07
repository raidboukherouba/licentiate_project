'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("faculty", [
      { faculty_name: "faculté des sciences et de la technologie" },
      {
        faculty_name:
          "faculté des mathématiques, de l’informatique et des sciences de la matière",
      },
      {
        faculty_name:
          "faculté des sciences de la nature, de la vie et des sciences de la terre et de l’univers",
      },
      {
        faculty_name:
          "faculté des sciences économiques, commerciales et sciences de gestion",
      },
      { faculty_name: "faculté des sciences humaines et sociales" },
      { faculty_name: "faculté des lettres et des langues" },
      { faculty_name: "faculté de droit et des sciences politiques" },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("faculty", null, {});
  }
};
