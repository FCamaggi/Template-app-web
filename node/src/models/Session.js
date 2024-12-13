'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Session extends Model {
        static associate(models) {
            this.belongsTo(models.User);
            this.belongsTo(models.Routine);
            this.hasMany(models.Progress);
        }
    }

    Session.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        routine_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('in_progress', 'completed', 'cancelled'),
            defaultValue: 'in_progress'
        },
        overall_difficulty: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 1, max: 10 }
        },
        energy_level: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 1, max: 10 }
        },
        notes: DataTypes.TEXT,
        completed_exercises: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        calories_burned: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Session',
    });

    return Session;
};
