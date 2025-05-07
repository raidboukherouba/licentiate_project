'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("publish_doctoral_student_pub", {
      reg_num: {
        type: Sequelize.BIGINT,
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
    await queryInterface.dropTable("publish_doctoral_student_pub");
  }
};
