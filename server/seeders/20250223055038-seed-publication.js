'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('publication', [
      {
        doi: 'https://doi.org/10.1234/example1',
        article_title: 'Advanced Research in AI',
        submission_date: '2024-01-15',
        acceptance_date: '2024-02-10',
        pub_pages: '10-20',
        review_num: 1, 
        type_id: 1, 
      },
      {
        doi: 'https://doi.org/10.1234/example2',
        article_title: 'Quantum Computing Innovations',
        submission_date: '2024-02-01',
        acceptance_date: '2024-02-20',
        pub_pages: '21-30',
        review_num: 2,
        type_id: 2,
      },
      {
        doi: 'https://doi.org/10.1234/example3',
        article_title: 'Hybrid Analytic Method for Missing Data',
        submission_date: '2023-12-10',
        acceptance_date: '2024-01-05',
        pub_pages: '5-15',
        review_num: 3,
        type_id: 2,
      },
      {
        doi: 'https://doi.org/10.1234/example4',
        article_title: 'A new approach for assessing the quality of online courses',
        submission_date: '2023-12-10',
        acceptance_date: '2024-01-05',
        pub_pages: '5-15',
        review_num: 4,
        type_id: 1,
      },
      {
        doi: 'https://doi.org/10.1234/example5',
        article_title: 'A comprehensive Framework-based',
        submission_date: '2023-12-10',
        acceptance_date: '2024-01-05',
        pub_pages: '5-15',
        review_num: 1,
        type_id: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('publication', null, {});
  },
};
