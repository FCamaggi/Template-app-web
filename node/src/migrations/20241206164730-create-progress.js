'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Progresses', {
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
      exercise_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Exercises',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      session_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Sessions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      weight_used: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      reps_performed: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      borg_rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 10 }
      },
      notes: Sequelize.TEXT,
      technique_rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 5 }
      },
      perceived_difficulty: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 10 }
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
