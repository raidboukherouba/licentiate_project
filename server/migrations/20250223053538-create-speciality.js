'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("speciality", {
      spec_code: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      spec_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("speciality");
  }
};
