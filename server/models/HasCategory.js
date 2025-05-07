const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HasCategory extends Model {
    static associate(models) {
      HasCategory.belongsTo(models.Review, { foreignKey: "review_num" });
      HasCategory.belongsTo(models.Category, { foreignKey: "cat_id" });
    }
  }

  HasCategory.init(
    {
      review_num: {
        type: DataTypes.INTEGER,
        references: {
          model: "Review",
          key: "review_num",
        },
        primaryKey: true,
      },
      cat_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Category",
          key: "cat_id",
        },
        primaryKey: true,
      } 
       
    },
    {
      sequelize,
      modelName: "HasCategory",
      tableName: "has_category",
      timestamps: false,
    }
  );

  return HasCategory;
};
