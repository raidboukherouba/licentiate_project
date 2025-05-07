'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("laboratory", {
      lab_code: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      lab_name: {
        type: Sequelize.STRING(250),
        allowNull: false,
        unique: true,
      },
      lab_abbr: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      lab_desc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      lab_address: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      lab_phone: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      faculty_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "faculty", 
          key: "faculty_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      domain_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "domain",
          key: "domain_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      dept_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "department",
          key: "dept_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("laboratory");
  }
};
