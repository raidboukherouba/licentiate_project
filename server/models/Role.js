'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Role has many Users
      Role.hasMany(models.User, {
        foreignKey: 'role_id',
        as: 'user'
      });
    }
  }

  Role.init({
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'role',
    timestamps: false,
  });

  return Role;
};
