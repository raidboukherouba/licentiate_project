const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PublishDoctoralStudentPub extends Model {
    static associate(models) {
      PublishDoctoralStudentPub.belongsTo(models.DoctoralStudent, { foreignKey: "reg_num" });
      PublishDoctoralStudentPub.belongsTo(models.Publication, { foreignKey: "doi" });
    }
  }

  PublishDoctoralStudentPub.init(
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
      modelName: "PublishDoctoralStudentPub",
      tableName: "publish_doctoral_student_pub",
      timestamps: false,
    }
  );

  return PublishDoctoralStudentPub;
};
