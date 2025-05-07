'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('publication', {
      doi: {
        type: Sequelize.STRING(50),
        primaryKey: true,
      },
      article_title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      submission_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      acceptance_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      pub_pages: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      review_num: {
        type: Sequelize.INTEGER,
        references: {
          model: 'review',
          key: 'review_num',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'production_type',
          key: 'type_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('publication');
  }
};
