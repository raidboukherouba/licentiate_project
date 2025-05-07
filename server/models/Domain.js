'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Domain extends Model {
    static associate(models) {
      // Define the association with Laboratory
      Domain.hasMany(models.Laboratory, {
        foreignKey: 'domain_id',
        as: 'laboratory', // Optional: Alias for the association
      });
    }
  }

  Domain.init({
    domain_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    domain_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
    },
    domain_abbr: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Domain',
    tableName: 'domain',
    timestamps: false,
  });

  return Domain;
};
