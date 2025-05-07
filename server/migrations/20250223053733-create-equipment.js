'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('equipment', {
      inventory_num: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      equip_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      equip_desc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      acq_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      purchase_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      equip_status: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      equip_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      lab_code: {
        type: Sequelize.INTEGER,
        references: {
          model: 'laboratory',
          key: 'lab_code',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
    });

    // Add unique constraint to prevent duplicate equipment names in the same lab
    await queryInterface.addIndex('equipment', ['equip_name', 'lab_code'], {
      unique: true,
      name: 'unique_equipment_per_lab',
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('equipment', 'unique_equipment_per_lab')
    await queryInterface.dropTable('equipment');
  }
};
