const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PublishDoctoralStudentComm extends Model {
    static associate(models) {
      PublishDoctoralStudentComm.belongsTo(models.DoctoralStudent, { foreignKey: "reg_num" });
      PublishDoctoralStudentComm.belongsTo(models.Communication, { foreignKey: "id_comm" });
    }
  }

  PublishDoctoralStudentComm.init(
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
      modelName: "PublishDoctoralStudentComm",
      tableName: "publish_doctoral_student_comm",
      timestamps: false,
    }
  );

  return PublishDoctoralStudentComm;
};
