'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('category', {
      cat_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      cat_name: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('category');
  }
};
