'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('doctoral_student', {
      reg_num: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        validate: {
          min: 100000000000,
          max: 999999999999,
        },
      },
      doc_stud_fname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      doc_stud_lname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      doc_stud_fname_ar: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      doc_stud_lname_ar: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      doc_stud_gender: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      doc_stud_attach_struc: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      doc_stud_birth_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      doc_stud_phone: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      doc_stud_address: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      doc_stud_grade: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      doc_stud_diploma: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      doc_stud_prof_email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      doc_stud_pers_email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      doc_stud_gs_link: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      doc_stud_rg_link: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      doc_stud_page_link: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      doc_stud_orcid: {
        type: Sequelize.STRING(39),
        allowNull: true,
        unique: true,
      },
      doc_stud_pub_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      doc_stud_cit_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable('doctoral_student');
  }
};
