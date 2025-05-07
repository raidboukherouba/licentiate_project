'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('supervise', [
      {
        res_code: 1,
        reg_num: 201936033733,
        super_start_date: '2012-10-01',
        super_end_date: '2015-06-15',
        super_theme: 'Localisation des stations d’arrêt de lignes d’autobus urbains',
      },
      {
        res_code: 2, 
        reg_num: 201936033732,
        super_start_date: '2012-09-15',
        super_end_date: '2015-06-20',
        super_theme: 'Interprétation des traces dans les environnements d’apprentissage collaboratif',
      },
      {
        res_code: 3,
        reg_num: 201836033733,
        super_start_date: '2012-09-10',
        super_end_date: '2015-07-01',
        super_theme: "Conception d'un système multi-agents adaptatif pour la résolution de problème",
      },
      {
        res_code: 4,
        reg_num: 201936033123,
        super_start_date: '2013-10-01',
        super_end_date: '2016-06-15',
        super_theme: 'Utilisation des techniques de data mining pour la Modélisation des tuteur',
      },
      {
        res_code: 5,
        reg_num: 201736033743,
        super_start_date: '2013-10-05',
        super_end_date: '2016-07-01',
        super_theme: 'Multimédia mining - Reconnaissance des formes dans une vidéo',
      },
      {
        res_code: 6, 
        reg_num: 201936032730,
        super_start_date: '2013-11-01',
        super_end_date: '2016-07-15',
        super_theme: 'Collaboration, dimensions sociales et communautés.',
      },
      {
        res_code: 7,
        reg_num: 201936043739,
        super_start_date: '2013-11-10',
        super_end_date: '2016-07-20',
        super_theme: 'Adaptation Contextuelle pour les systèmes d\'information ubiquitaires',
      },
      {
        res_code: 7,
        reg_num: 201936033835,
        super_start_date: '2014-09-01',
        super_end_date: '2017-06-30',
        super_theme: 'Vers une approche déclarative pour l’analyse de l’impact de l’évolution dynamique des protocoles des services web',
      },
      {
        res_code: 9, 
        reg_num: 202036033721,
        super_start_date: '2014-10-01',
        super_end_date: '2017-06-30',
        super_theme: 'Extraction des connaissances pour la segmentation d\'images mammographique',
      },
      {
        res_code: 10, 
        reg_num: 201836033031,
        super_start_date: '2014-11-01',
        super_end_date: '2017-07-15',
        super_theme: 'Traitement de l’hétérogénéité sémantique en recherche d’information multimédia',
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('supervise', null, {});
  }
};