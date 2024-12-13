// src/seeders/YYYYMMDDHHMMSS-seed-tracker.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SeedTracker', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      seed_name: {
        type: Sequelize.STRING,
        unique: true
      },
      executed_at: {
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SeedTracker');
  }
};