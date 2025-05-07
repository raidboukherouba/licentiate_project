'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DoctoralStudent extends Model {
    static associate(models) {
      DoctoralStudent.belongsTo(models.Team, {
        foreignKey: 'team_id',
        as: 'team',
      });

      DoctoralStudent.belongsTo(models.Function, {
        foreignKey: 'func_code',
        as: 'function',
      });

      DoctoralStudent.belongsTo(models.Speciality, {
        foreignKey: 'spec_code',
        as: 'speciality',
      });

      DoctoralStudent.belongsTo(models.Laboratory, {
        foreignKey: 'lab_code',
        as: 'laboratory',
      });

      DoctoralStudent.belongsToMany(models.Researcher, {
        through: models.Supervise,
        foreignKey: "reg_num",
      });

      DoctoralStudent.belongsToMany(models.Equipment, {
        through: models.AssignDoctoralStudent,
        foreignKey: "reg_num",
      });

      DoctoralStudent.belongsToMany(models.Publication, {
        through: models.PublishDoctoralStudentPub,
        foreignKey: "reg_num",
      });

      DoctoralStudent.belongsToMany(models.Communication, {
        through: models.PublishDoctoralStudentComm,
        foreignKey: "reg_num",
      });

    }
  }

  DoctoralStudent.init(
    {
      reg_num: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        validate: {
          min: 100000000000,
          max: 999999999999,
        },
      },
      doc_stud_fname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      doc_stud_lname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      doc_stud_fname_ar: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      doc_stud_lname_ar: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      doc_stud_gender: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      doc_stud_attach_struc: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      doc_stud_birth_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      doc_stud_phone: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      doc_stud_address: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      doc_stud_grade: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      doc_stud_diploma: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      doc_stud_prof_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      doc_stud_pers_email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      doc_stud_gs_link: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      doc_stud_rg_link: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      doc_stud_page_link: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      doc_stud_orcid: {
        type: DataTypes.STRING(39),
        allowNull: true,
        unique: true,
      },
      doc_stud_pub_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      doc_stud_cit_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Team',
          key: 'team_id',
        },
      },
      func_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Function',
          key: 'func_code',
        },
      },
      spec_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Speciality',
          key: 'spec_code',
        },
      },
      lab_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Laboratory', 
          key: 'lab_code'
        },
      }
    },
    {
      sequelize,
      modelName: 'DoctoralStudent',
      tableName: 'doctoral_student',
      timestamps: false,
    }
  );

  return DoctoralStudent;
};
