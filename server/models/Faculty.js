'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Faculty extends Model {
    static associate(models) {
      // Define the association with Laboratory
      Faculty.hasMany(models.Laboratory, {
        foreignKey: 'faculty_id',
        as: 'laboratory', 
      });
    }
  }

  Faculty.init({
    faculty_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    faculty_name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Faculty',
    tableName: 'faculty',
    timestamps: false,
  });

  return Faculty;
};