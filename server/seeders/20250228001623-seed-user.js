'use strict';
const bcrypt = require('bcrypt'); // To hash the password

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin1234', 10); // Default admin password

    await queryInterface.bulkInsert('user', [
      {
        user_id: 1,
        username: 'admin',
        password: hashedPassword,
        full_name: 'Admin',
        email: 'raidboukherouba@gmail.com',
        role_id: 1,
        created_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', { username: 'admin' }, {});
  }
};
