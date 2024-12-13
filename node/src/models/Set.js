'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Set extends Model {
        static associate(models) {
            // Definir asociaciones aquí
            this.belongsTo(models.Training);
        }
    }

    Set.init({
        training_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('warmup', 'work'),
            defaultValue: 'work'
        },
        reps: {
            type: DataTypes.STRING,
            allowNull: false
        },
        weight_type: {
            type: DataTypes.ENUM('RM_percentage', 'direct_weight', 'Borg'),
            allowNull: false
        },
        weight_value: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        rm_percentage: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        borg_target: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 1, max: 10 }
        },
        rest_time: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 60
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        actual_reps: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        actual_weight: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        actual_borg: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Set',
    });

    return Set;
};