'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      routine_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Routines',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('in_progress', 'completed', 'cancelled'),
        defaultValue: 'in_progress'
      },
      overall_difficulty: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 10 }
      },
      energy_level: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 10 }
      },
      notes: Sequelize.TEXT,
      completed_exercises: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      calories_burned: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sessions');
  }
};
