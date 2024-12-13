'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    class Progress extends Model {
        static associate(models) {
            this.belongsTo(models.User);
            this.belongsTo(models.Exercise);
            this.belongsTo(models.Session);
        }
    }

    Progress.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        exercise_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        session_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        weight_used: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        reps_performed: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        borg_rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 1, max: 10 }
        },
        notes: DataTypes.TEXT,
        technique_rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 1, max: 5 }
        },
        perceived_difficulty: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 1, max: 10 }
        }
    }, { sequelize, modelName: 'Progress' });

    return Progress;
}
