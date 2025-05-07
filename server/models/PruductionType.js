'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductionType extends Model {
    static associate(models) {
      // Define the association with publication
      ProductionType.hasMany(models.Publication, {
        foreignKey: 'type_id',
        as: 'publication', 
      });

      // Define the association with communication
      ProductionType.hasMany(models.Communication, {
        foreignKey: 'type_id',
        as: 'communication', 
      });
    }
  }

  ProductionType.init({
    type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
  }, {
    sequelize,
    modelName: 'ProductionType',
    tableName: 'production_type',
    timestamps: false,
  });

  return ProductionType;
};