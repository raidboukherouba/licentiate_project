'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('communication', {
      id_comm: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title_comm: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      event_title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      year_comm: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      url_comm: {
        type: Sequelize.STRING(250),
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
    await queryInterface.dropTable('communication');
  }
};
