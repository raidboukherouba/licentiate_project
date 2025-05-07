'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('researcher', {
      res_code: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      res_fname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      res_lname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      res_fname_ar: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      res_lname_ar: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      res_gender: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      res_attach_struc: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      res_birth_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      res_phone: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      res_address: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      res_grade: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      res_diploma: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      res_prof_email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      res_pers_email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      res_gs_link: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      res_rg_link: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      res_page_link: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      res_orcid: {
        type: Sequelize.STRING(39),
        allowNull: true,
        unique: true,
      },
      res_pub_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      res_cit_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_director: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      func_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'function',
          key: 'func_code',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      spec_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'speciality',
          key: 'spec_code',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'team',
          key: 'team_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      lab_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'laboratory', 
          key: 'lab_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('researcher');
  }
};
