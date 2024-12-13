'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Routine extends Model {
        static associate(models) {
            this.belongsTo(models.User, { as: 'creator' });
            this.hasMany(models.Training);
            this.hasMany(models.Session);
        }
    }

    Routine.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.TEXT,
        creator_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('full_body', 'split', 'upper_lower', 'push_pull_legs'),
            allowNull: false
        },
        difficulty: {
            type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
            allowNull: false
        },
        estimated_time: {
            type: DataTypes.INTEGER, // en minutos
            allowNull: false
        },
        mesocycle_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        microcycle_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        warmup_description: DataTypes.TEXT,
        cooldown_description: DataTypes.TEXT,
        notes: DataTypes.TEXT,
        is_template: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'Routine',
    });

    return Routine;
};
