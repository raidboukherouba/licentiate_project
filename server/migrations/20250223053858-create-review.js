'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('review', {
      review_num: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      review_title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      issn: {
        type: Sequelize.STRING(9),
        allowNull: false,
        unique: true,
      },
      e_issn: {
        type: Sequelize.STRING(9),
        allowNull: true,
        unique: true,
      },
      review_vol: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      publisher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'publisher',
          key: 'publisher_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('review');
  }
};
