'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('review', [
      {
        review_title: 'Journal of Materials and Environmental Sciences',
        issn: '2028-2508',
        e_issn: null,
        review_vol: null,
        publisher_id: 1, 
      },
      {
        review_title: 'Construction and Building Materials',
        issn: '0950-0618',
        e_issn: '1879-0526',
        review_vol: null,
        publisher_id: 2, 
      },
      {
        review_title: 'Environmental Earth Sciences',
        issn: '1866-6288',
        e_issn: '1866-6293',
        review_vol: null,
        publisher_id: 3, 
      },
      {
        review_title: 'Arabian Journal of Geosciences',
        issn: '1866-7511',
        e_issn: '1866-7538',
        review_vol: null,
        publisher_id: 4, 
      },
      {
        review_title: 'International Journal of River Basin Management',
        issn: '1571-5124',
        e_issn: '1814-2060',
        review_vol: null,
        publisher_id: 5, 
      },
      {
        review_title: 'Journal of Building Engineering',
        issn: '2352-7102',
        e_issn: null,
        review_vol: null,
        publisher_id: 6,
      },
      {
        review_title: 'Environ Earth Sci',
        issn: '1866-6281', 
        e_issn: '1866-6299',
        review_vol: null,
        publisher_id: 7, 
      },
      {
        review_title: 'International Journal of Environment and Waste Management',
        issn: '1478-9876',
        e_issn: null,
        review_vol: null,
        publisher_id: 8, 
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('review', null, {});
  }
};
