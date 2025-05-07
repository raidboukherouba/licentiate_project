const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AssignResearcher extends Model {
    static associate(models) {
      AssignResearcher.belongsTo(models.Researcher, { foreignKey: "res_code" });
      AssignResearcher.belongsTo(models.Equipment, { foreignKey: "inventory_num" });
    }
  }

  AssignResearcher.init(
    {
      res_code: {
        type: DataTypes.INTEGER,
        references: {
          model: "Researcher",
          key: "res_code",
        },
        primaryKey: true,
      },
      inventory_num: {
        type: DataTypes.STRING(50),
        references: {
          model: "Equipment",
          key: "inventory_num",
        },
        primaryKey: true,
      },
      res_assign_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      res_return_date:{
        type: DataTypes.DATEONLY,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: "AssignResearcher",
      tableName: "assign_researcher",
      timestamps: false,
    }
  );

  return AssignResearcher;
};
