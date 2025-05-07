'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("laboratory", [
      {
        lab_name: "Laboratoire d’automatique et informatique de Guelma",
        lab_abbr: "LAIG",
        faculty_id: 1,
        domain_id: 1,
        dept_id: 2,
      },
      {
        lab_name: "Laboratoire de génie civil et d’hydraulique",
        lab_abbr: "LGCH",
        faculty_id: 1,
        domain_id: 1,
        dept_id: 3,
      },
      {
        lab_name: "Laboratoire d’analyse industrielle et de génie des matériaux",
        lab_abbr: "LAIGM",
        faculty_id: 1,
        domain_id: 4,
        dept_id: 2,
      },
      {
        lab_name: "Laboratoire de mécanique et de structures",
        lab_abbr: "LMS",
        faculty_id: 1,
        domain_id: 2,
        dept_id: 3,
      },
      {
        lab_name: "Laboratoire de génie électrique de Guelma",
        lab_abbr: "LGEG",
        faculty_id: 1,
        domain_id: 1,
        dept_id: 4,
      },
      {
        lab_name: "Laboratoire des Télécommunications",
        lab_abbr: "LT",
        faculty_id: 1,
        domain_id: 2,
        dept_id: 4,
      },
      {
        lab_name: "Problèmes Inverses : Modélisation, Information et Systèmes",
        lab_abbr: "PI: MIS",
        faculty_id: 1,
        domain_id: 3,
        dept_id: 5,
      },
      {
        lab_name: "Laboratoire des Silicates, Polymères et des Nanocomposites",
        lab_abbr: "LSPN",
        faculty_id: 1,
        domain_id: 6,
        dept_id: 7,
      },
      {
        lab_name: "Laboratoire de contrôle avancé",
        lab_abbr: "LABCAV",
        faculty_id: 1,
        domain_id: 1,
        dept_id: 1,
      },
      {
        lab_name: "Laboratoire de Mécanique Appliquée des Nouveaux Matériaux",
        lab_abbr: "LMANM",
        faculty_id: 1,
        domain_id: 4,
        dept_id: 3,
      },
      {
        lab_name: "Laboratoire de Mathématiques Appliquées et de Modélisation",
        lab_abbr: "LMAM",
        faculty_id: 2,
        domain_id: 2,
        dept_id: 2,
      },
      {
        lab_name: "Laboratoire de physique de Guelma",
        lab_abbr: "GPL",
        faculty_id: 2,
        domain_id: 1,
        dept_id: 3,
      },
      {
        lab_name: "Laboratoire de chimie appliquée",
        lab_abbr: "LCA",
        faculty_id: 2,
        domain_id: 2,
        dept_id: 4,
      },
      {
        lab_name: "Laboratoire des Sciences et Technologie de l’Information et de la Communication",
        lab_abbr: "LabSTIC",
        faculty_id: 2,
        domain_id: 4,
        dept_id: 3,
      },
      {
        lab_name: "Laboratoire de physique des matériaux",
        lab_abbr: "L2PM",
        faculty_id: 2,
        domain_id: 1,
        dept_id: 4,
      },
      {
        lab_name: "Laboratoire de chimie computationnelle et nanostructure",
        lab_abbr: "LCCN",
        faculty_id: 2,
        domain_id: 1,
        dept_id: 4,
      },
      {
        lab_name: "Laboratoire de chimie physique",
        lab_abbr: "LCP",
        faculty_id: 2,
        domain_id: 1,
        dept_id: 4,
      },
      {
        lab_name: "Laboratoire de Recherche : Biologie, Eau et Environnement",
        lab_abbr: "LBEE",
        faculty_id: 3,
        domain_id: 1,
        dept_id: 4,
      },
      {
        lab_name: "Laboratoire de Conservation des Zones Humides",
        lab_abbr: "LCZH",
        faculty_id: 3,
        domain_id: 1,
        dept_id: 4,
      },
      {
        lab_name: "Laboratoire d’Auto Développement et Bonne Gouvernance",
        lab_abbr: "LADBG",
        faculty_id: 4,
        domain_id: 1,
        dept_id: 4,
      },
      {
        lab_name: "Laboratoire d’Histoire sur les Recherches et Etudes Maghrébines",
        lab_abbr: "LHREM",
        faculty_id: 5,
        domain_id: 1,
        dept_id: 4,
      },
      {
        lab_name: "مخبر الدراسات اللغوية والأدبية",
        faculty_id: 6,
        domain_id: 1,
        dept_id: 4,
      },
      {
        lab_name: "Laboratoire des Etudes Juridiques Environnementaux",
        faculty_id: 7,
        domain_id: 1,
        dept_id: 4,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("laboratory", null, {});
  }
};
