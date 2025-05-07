'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Speciality extends Model {
    static associate(models) {
      // Define the association with researcher
      Speciality.hasMany(models.Researcher, {
        foreignKey: 'spec_code',
        as: 'researcher', 
      });

      // Define the association with doctoral student
      Speciality.hasMany(models.DoctoralStudent, {
        foreignKey: 'spec_code',
        as: 'doctoral_student', 
      });
    }
  }

  Speciality.init({
    spec_code: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    spec_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
  }, {
    sequelize,
    modelName: 'Speciality',
    tableName: 'speciality',
    timestamps: false,
  });

  return Speciality;
};