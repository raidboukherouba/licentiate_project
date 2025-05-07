'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReviewSpeciality extends Model {
    static associate(models) {
      
      ReviewSpeciality.belongsToMany(models.Review, {
        through: models.HasSpeciality,
        foreignKey: "spec_id_review",
      });
    }
  }

  ReviewSpeciality.init({
    spec_id_review: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    spec_name_review: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
  }, {
    sequelize,
    modelName: 'ReviewSpeciality',
    tableName: 'review_speciality',
    timestamps: false,
  });

  return ReviewSpeciality;
};