const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PublishResearcherComm extends Model {
    static associate(models) {
      PublishResearcherComm.belongsTo(models.Researcher, { foreignKey: "res_code" });
      PublishResearcherComm.belongsTo(models.Communication, { foreignKey: "id_comm" });
    }
  }

  PublishResearcherComm.init(
    {
      res_code: {
        type: DataTypes.INTEGER,
        references: {
          model: "Researcher",
          key: "res_code",
        },
        primaryKey: true,
      },
      id_comm: {
        type: DataTypes.INTEGER,
        references: {
          model: "Communication",
          key: "id_comm",
        },
        primaryKey: true,
      }   
    },
    {
      sequelize,
      modelName: "PublishResearcherComm",
      tableName: "publish_researcher_comm",
      timestamps: false,
    }
  );

  return PublishResearcherComm;
};
