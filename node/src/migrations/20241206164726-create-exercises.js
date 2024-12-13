'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Exercises', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      exercise_type: {
        type: Sequelize.STRING
      },
      main_muscle_group: {
        type: Sequelize.STRING
      },
      required_equipment: {
        type: Sequelize.STRING
      },
      tutorial_url: {
        type: Sequelize.STRING
      },
      technical_instructions: {
        type: Sequelize.TEXT
      },
      observations: {
        type: Sequelize.TEXT
      },
      measurement_type: {
        type: Sequelize.ENUM('RM', 'Borg', 'both'),
        defaultValue: 'Borg'
      },
      is_rm_exercise: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('Exercises');
  }
};