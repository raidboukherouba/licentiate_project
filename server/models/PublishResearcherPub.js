const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PublishResearcherPub extends Model {
    static associate(models) {
      PublishResearcherPub.belongsTo(models.Researcher, { foreignKey: "res_code" });
      PublishResearcherPub.belongsTo(models.Publication, { foreignKey: "doi" });
    }
  }

  PublishResearcherPub.init(
    {
      res_code: {
        type: DataTypes.INTEGER,
        references: {
          model: "Researcher",
          key: "res_code",
        },
        primaryKey: true,
      },
      doi: {
        type: DataTypes.STRING(50),
        references: {
          model: "Publication",
          key: "doi",
        },
        primaryKey: true,
      }   
    },
    {
      sequelize,
      modelName: "PublishResearcherPub",
      tableName: "publish_researcher_pub",
      timestamps: false,
    }
  );

  return PublishResearcherPub;
};
