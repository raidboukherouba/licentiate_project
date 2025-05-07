'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("faculty", {
      faculty_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      faculty_name: {
        type: Sequelize.STRING(250),
        allowNull: false,
        unique: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("faculty");
  }
};
