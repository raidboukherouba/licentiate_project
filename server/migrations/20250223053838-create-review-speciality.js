'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("review_speciality", {
      spec_id_review: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      spec_name_review: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("review_speciality");
  }
};
