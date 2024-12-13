'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trainings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      routine_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Routines',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      exercise_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Exercises',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      training_type: {
        type: Sequelize.ENUM('strength', 'hypertrophy', 'endurance', 'power'),
        allowNull: false
      },
      notes: Sequelize.TEXT,
      tempo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      unilateral: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      superset_with: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
    });
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Trainings');
  }
};
