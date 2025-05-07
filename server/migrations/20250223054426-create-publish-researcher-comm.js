'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("publish_researcher_comm", {
      res_code: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "researcher",
          key: "res_code",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_comm: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "communication",
          key: "id_comm",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("publish_researcher_comm");
  }
};
