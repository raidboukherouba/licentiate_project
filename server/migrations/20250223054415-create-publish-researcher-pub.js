'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("publish_researcher_pub", {
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
      doi: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        references: {
          model: "publication",
          key: "doi",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("publish_researcher_pub");
  }
};
