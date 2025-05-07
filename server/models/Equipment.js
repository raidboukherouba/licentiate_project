'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Equipment extends Model {
    static associate(models) {
      Equipment.belongsTo(models.Laboratory, {
        foreignKey: 'lab_code',
        as: 'laboratory',
      });

      Equipment.belongsToMany(models.Researcher, {
        through: models.AssignResearcher,
        foreignKey: "inventory_num",
      });

      Equipment.belongsToMany(models.DoctoralStudent, {
        through: models.AssignDoctoralStudent,
        foreignKey: "inventory_num",
      });
    }
  }

  Equipment.init(
    {
      inventory_num: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      equip_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      equip_desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      acq_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      purchase_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      equip_status: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      equip_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      lab_code: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Laboratory',
          key: 'lab_code',
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Equipment',
      tableName: 'equipment',
      timestamps: false,
    }
  );

  return Equipment;
};
