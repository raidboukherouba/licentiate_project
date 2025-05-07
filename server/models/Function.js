'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Function extends Model {
    static associate(models) {
      // Define the association with researcher
      Function.hasMany(models.Researcher, {
        foreignKey: 'func_code',
        as: 'researcher', 
      });

      // Define the association with doctoral student
      Function.hasMany(models.DoctoralStudent, {
        foreignKey: 'func_code',
        as: 'doctoral_student', 
      });
    }
  }

  Function.init({
    func_code: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    func_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
  }, {
    sequelize,
    modelName: 'Function',
    tableName: 'function',
    timestamps: false,
  });

  return Function;
};