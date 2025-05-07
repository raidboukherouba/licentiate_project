'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('role', [
      { role_id: 1, role_name: 'Admin' },
      { role_id: 2, role_name: 'Rector' },
      { role_id: 3, role_name: 'Lab Manager' },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role', null, {});
  }
};
