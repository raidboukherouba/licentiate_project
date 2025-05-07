'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Publisher extends Model {
    // static associate(models) {
    //   // Define the association with Laboratory
    //   Faculty.hasMany(models.Laboratory, {
    //     foreignKey: 'faculty_id',
    //     as: 'laboratory', 
    //   });
    // }
  }

  Publisher.init({
    publisher_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    publisher_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    country: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Publisher',
    tableName: 'publisher',
    timestamps: false,
  });

  return Publisher;
};