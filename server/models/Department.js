'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      // Define the association with Laboratory
      Department.hasMany(models.Laboratory, {
        foreignKey: 'dept_id',
        as: 'laboratory', 
      });
    }
  }

  Department.init({
    dept_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dept_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Department',
    tableName: 'department',
    timestamps: false,
  });

  return Department;
};
