'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Define association with Publisher
      Review.belongsTo(models.Publisher, {
        foreignKey: 'publisher_id',
        as: 'publisher',
      });

      // Define the association with publication
      Review.hasMany(models.Publication, {
        foreignKey: 'review_num',
        as: 'publication', 
      });

      Review.belongsToMany(models.Category, {
        through: models.HasCategory,
        foreignKey: "review_num",
      });

      Review.belongsToMany(models.ReviewSpeciality, {
        through: models.HasSpeciality,
        foreignKey: "review_num",
      });
    }
  }

  Review.init(
    {
      review_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      review_title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      issn: {
        type: DataTypes.STRING(9),
        allowNull: false,
        unique: true,
      },
      e_issn: {
        type: DataTypes.STRING(9),
        allowNull: true,
        unique: true,
      },
      review_vol: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      publisher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Publisher', key: 'publisher_id' },
      },
    },
    {
      sequelize,
      modelName: 'Review',
      tableName: 'review',
      timestamps: false,
    }
  );

  return Review;
};
