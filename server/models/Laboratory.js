'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Laboratory extends Model {
    static associate(models) {
      // Define the associations
      Laboratory.belongsTo(models.Faculty, {
        foreignKey: 'faculty_id',
        as: 'faculty', // Optional: Alias for the association
      });

      Laboratory.belongsTo(models.Domain, {
        foreignKey: 'domain_id',
        as: 'domain', // Optional: Alias for the association
      });

      Laboratory.belongsTo(models.Department, {
        foreignKey: 'dept_id',
        as: 'department', // Optional: Alias for the association
      });

      // Define the association with equipment
      Laboratory.hasMany(models.Equipment, {
        foreignKey: 'lab_code',
        as: 'equipment', 
      });

      Laboratory.hasMany(models.Researcher, {
        foreignKey: 'res_code',
        as: 'reseracher', // Optional: Alias for the association
      });

      Laboratory.hasMany(models.DoctoralStudent, {
        foreignKey: 'reg_num',
        as: 'doctoral_student', // Optional: Alias for the association
      });
    }
  }

  Laboratory.init({
    lab_code: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lab_name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },
    lab_abbr: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    lab_desc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lab_address: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    lab_phone: {
      type: DataTypes.STRING(9),
      allowNull: true,
    },
    faculty_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Faculty", key: "faculty_id" },
    },
    domain_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Domain", key: "domain_id" },
    },
    dept_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Department", key: "dept_id" },
    },
  }, {
    sequelize,
    modelName: 'Laboratory',
    tableName: 'laboratory',
    timestamps: false,
  });

  return Laboratory;
};