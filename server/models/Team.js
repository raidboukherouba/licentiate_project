'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      // Define the association with researcher
      Team.hasMany(models.Researcher, {
        foreignKey: 'team_id',
        as: 'researcher', 
      });

      // Define the association with doctoral student
      Team.hasMany(models.DoctoralStudent, {
        foreignKey: 'team_id',
        as: 'doctoral_student', 
      });
    }
  }

  Team.init({
    team_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    team_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
    },
    team_abbr: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    team_desc: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Team',
    tableName: 'team',
    timestamps: false,
  });

  return Team;
};