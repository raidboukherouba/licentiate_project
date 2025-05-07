const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HasSpeciality extends Model {
    static associate(models) {
      HasSpeciality.belongsTo(models.Review, { foreignKey: "review_num" });
      HasSpeciality.belongsTo(models.ReviewSpeciality, { foreignKey: "spec_id_review" });
    }
  }

  HasSpeciality.init(
    {
      review_num: {
        type: DataTypes.INTEGER,
        references: {
          model: "Review",
          key: "review_num",
        },
        primaryKey: true,
      },
      spec_id_review: {
        type: DataTypes.INTEGER,
        references: {
          model: "ReviewSpeciality",
          key: "spec_id_review",
        },
        primaryKey: true,
      } 
       
    },
    {
      sequelize,
      modelName: "HasSpeciality",
      tableName: "has_speciality",
      timestamps: false,
    }
  );

  return HasSpeciality;
};
