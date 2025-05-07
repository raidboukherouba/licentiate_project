'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("has_speciality", {
      review_num: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "review",
          key: "review_num",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      spec_id_review: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "review_speciality",
          key: "spec_id_review",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("has_speciality");
  }
};
