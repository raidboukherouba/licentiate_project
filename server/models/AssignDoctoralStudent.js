const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AssignDoctoralStudent extends Model {
    static associate(models) {
      AssignDoctoralStudent.belongsTo(models.DoctoralStudent, { foreignKey: "reg_num" });
      AssignDoctoralStudent.belongsTo(models.Equipment, { foreignKey: "inventory_num" });
    }
  }

  AssignDoctoralStudent.init(
    {
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
      inventory_num: {
        type: DataTypes.STRING(50),
        references: {
          model: "Equipment",
          key: "inventory_num",
        },
        primaryKey: true,
      },
      doc_stud_assign_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      doc_stud_return_date:{
        type: DataTypes.DATEONLY,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: "AssignDoctoralStudent",
      tableName: "assign_doctoral_student",
      timestamps: false,
    }
  );

  return AssignDoctoralStudent;
};
