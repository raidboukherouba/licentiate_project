'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("team", {
      team_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      team_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
      },
      team_abbr: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      team_desc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("team");
  }
};
