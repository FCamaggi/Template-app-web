'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      training_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Trainings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('warmup', 'work'),
        defaultValue: 'work'
      },
      reps: {
        type: Sequelize.STRING,
        allowNull: false
      },
      weight_type: {
        type: Sequelize.ENUM('RM_percentage', 'direct_weight', 'Borg'),
        allowNull: false
      },
      weight_value: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      rm_percentage: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      borg_target: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 10 }
      },
      rest_time: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      actual_reps: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      actual_weight: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      actual_borg: {
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
    await queryInterface.dropTable('Sets');
  }

};
