'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    static associate(models) {
      // Define association with Review
      Publication.belongsTo(models.Review, {
        foreignKey: 'review_num',
        as: 'review',
      });

      // Define association with ProductionType
      Publication.belongsTo(models.ProductionType, {
        foreignKey: 'type_id',
        as: 'production_type',
      });

      Publication.belongsToMany(models.Researcher, {
        through: models.PublishResearcherPub,
        foreignKey: "doi",
      });

      Publication.belongsToMany(models.DoctoralStudent, {
        through: models.PublishDoctoralStudentPub,
        foreignKey: "doi",
      });
    }
  }

  Publication.init(
    {
      doi: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      article_title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      submission_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      acceptance_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      pub_pages: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      review_num: {
        type: DataTypes.INTEGER,
        references: { model: 'Review', key: 'review_num' },
      },
      type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'ProductionType', key: 'type_id' },
      },
    },
    {
      sequelize,
      modelName: 'Publication',
      tableName: 'publication',
      timestamps: false,
    }
  );

  return Publication;
};
