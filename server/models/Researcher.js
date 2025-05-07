'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Researcher extends Model {
    static associate(models) {
      Researcher.belongsTo(models.Function, {
        foreignKey: 'func_code',
        as: 'function',
      });

      Researcher.belongsTo(models.Speciality, {
        foreignKey: 'spec_code',
        as: 'speciality',
      });

      Researcher.belongsTo(models.Team, {
        foreignKey: 'team_id',
        as: 'team',
      });

      Researcher.belongsTo(models.Laboratory, {
        foreignKey: 'lab_code',
        as: 'laboratory',
      });

      Researcher.belongsToMany(models.DoctoralStudent, {
        through: models.Supervise,
        foreignKey: "res_code",
      });

      Researcher.belongsToMany(models.Equipment, {
        through: models.AssignResearcher,
        foreignKey: "res_code",
      });

      Researcher.belongsToMany(models.Publication, {
        through: models.PublishResearcherPub,
        foreignKey: "res_code",
      });

      Researcher.belongsToMany(models.Communication, {
        through: models.PublishResearcherComm,
        foreignKey: "res_code",
      });
    }
  }

  Researcher.init(
    {
      res_code: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      res_fname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      res_lname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      res_fname_ar: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      res_lname_ar: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      res_gender: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      res_attach_struc: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      res_birth_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      res_phone: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      res_address: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      res_grade: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      res_diploma: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      res_prof_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      res_pers_email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      res_gs_link: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      res_rg_link: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      res_page_link: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      res_orcid: {
        type: DataTypes.STRING(39),
        allowNull: true,
        unique: true,
      },
      res_pub_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      res_cit_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_director: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Team',
          key: 'team_id',
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
      modelName: 'Researcher',
      tableName: 'researcher',
      timestamps: false,
    }
  );

  return Researcher;
};
