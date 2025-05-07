'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("publisher", {
      publisher_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      publisher_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      country: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("publisher");
  }
};
