'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('communication', [
      {
        title_comm: 'AI and Machine Learning Trends',
        event_title: 'International Conference on AI 2024',
        year_comm: 2024,
        url_comm: 'https://conference-ai.com/paper1',
        type_id: 1, 
      },
      {
        title_comm: 'Cybersecurity in the Digital Age',
        event_title: 'Global Cybersecurity Forum 2023',
        year_comm: 2023,
        url_comm: 'https://cybersecforum.com/session2',
        type_id: 2,
      },
      {
        title_comm: 'Advancements in Quantum Computing',
        event_title: 'Quantum Tech Expo 2025',
        year_comm: 2025,
        url_comm: 'https://quantumexpo.com/research3',
        type_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('communication', null, {});
  },
};
