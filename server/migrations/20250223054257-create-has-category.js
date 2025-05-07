'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("has_category", {
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
      cat_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "category",
          key: "cat_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("has_category");
  }
};
