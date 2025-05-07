'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("assign_researcher", {
      res_code: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "researcher",
          key: "res_code",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      inventory_num: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        references: {
          model: "equipment",
          key: "inventory_num",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      res_assign_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      res_return_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("assign_researcher");
  }
};
