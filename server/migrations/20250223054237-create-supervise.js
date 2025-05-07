'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("supervise", {
      res_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "researcher",
          key: "res_code",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reg_num: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        validate: {
          min: 100000000000,
          max: 999999999999,
        },
        references: {
          model: "doctoral_student",
          key: "reg_num",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      super_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      super_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      super_theme: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("supervise");
  }
};
