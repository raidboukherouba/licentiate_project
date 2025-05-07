'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      
      Category.belongsToMany(models.Review, {
        through: models.HasCategory,
        foreignKey: "cat_id",
      });
    }
  }

  Category.init({
    cat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cat_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'category',
    timestamps: false,
  });

  return Category;
};