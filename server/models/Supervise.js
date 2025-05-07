const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Supervise extends Model {
    static associate(models) {
      Supervise.belongsTo(models.Researcher, { foreignKey: "res_code" });
      Supervise.belongsTo(models.DoctoralStudent, { foreignKey: "reg_num" });
    }
  }

  Supervise.init(
    {
      res_code: {
        type: DataTypes.INTEGER,
        references: {
          model: "Researcher",
          key: "res_code",
        },
        primaryKey: true,
      },
      reg_num: {
        type: DataTypes.BIGINT,
        validate: {
          min: 100000000000,
          max: 999999999999,
        },
        references: {
          model: "DoctoralStudent",
          key: "reg_num",
        },
        primaryKey: true,
      },
      super_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      super_end_date:{
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      super_theme:{
        type: DataTypes.STRING(250),
        allowNull: false,
      } 
       
    },
    {
      sequelize,
      modelName: "Supervise",
      tableName: "supervise",
      timestamps: false,
    }
  );

  return Supervise;
};
