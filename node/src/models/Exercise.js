'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Exercise extends Model {
        static associate(models) {
            this.hasMany(models.Set);
        }
    }

    Exercise.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        exercise_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        main_muscle_group: {
            type: DataTypes.STRING,
            allowNull: false
        },
        required_equipment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tutorial_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        technical_instructions: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        observations: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        measurement_type: {
            type: DataTypes.ENUM('RM', 'Borg', 'both'),
            defaultValue: 'Borg'
        },
        is_rm_exercise: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, { sequelize, modelName: 'Exercise' });

    return Exercise;
};
