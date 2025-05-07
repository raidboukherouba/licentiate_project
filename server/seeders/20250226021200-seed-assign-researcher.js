"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("assign_researcher", [
      { 
        res_code: 1, 
        inventory_num: "LAB01-race-2110", 
        res_assign_date: "2022-01-01", 
        res_return_date: null 
      },
      { 
        res_code: 7, 
        inventory_num: "LAB01-l6666-2110", 
        res_assign_date: "2022-01-01", 
        res_return_date: null 
      },
      { 
        res_code: 9, 
        inventory_num: "LAB01-ghplc-2110", 
        res_assign_date: "2022-01-01", 
        res_return_date: null 
      },
      { 
        res_code: 10, 
        inventory_num: "LAB01-phmre-2110", 
        res_assign_date: "2022-01-01", 
        res_return_date: null 
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("assign_researcher", null, {});
  }
};
