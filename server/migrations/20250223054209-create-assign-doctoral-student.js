'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('assign_doctoral_student', {
      reg_num: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        validate: {
          min: 100000000000,
          max: 999999999999,
        },
        references: {
          model: 'doctoral_student',
          key: 'reg_num',
        },
      },
      inventory_num: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'equipment',
          key: 'inventory_num',
        },
      },
      doc_stud_assign_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      doc_stud_return_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('assign_doctoral_student');
  }
};
