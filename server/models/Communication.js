'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Communication extends Model {
    static associate(models) {
      // Define association with ProductionType
      Communication.belongsTo(models.ProductionType, {
        foreignKey: 'type_id',
        as: 'production_type',
      });

      Communication.belongsToMany(models.Researcher, {
        through: models.PublishResearcherComm,
        foreignKey: "id_comm",
      });

      Communication.belongsToMany(models.DoctoralStudent, {
        through: models.PublishDoctoralStudentComm,
        foreignKey: "id_comm",
      });
    }
  }

  Communication.init(
    {
      id_comm: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title_comm: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
      event_title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      year_comm: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url_comm: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'ProductionType', key: 'type_id' },
      },
    },
    {
      sequelize,
      modelName: 'Communication',
      tableName: 'communication',
      timestamps: false,
    }
  );

  return Communication;
};
