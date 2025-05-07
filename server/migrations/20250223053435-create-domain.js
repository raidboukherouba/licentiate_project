'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("domain", {
      domain_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      domain_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
      },
      domain_abbr: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("domain");
  }
};
