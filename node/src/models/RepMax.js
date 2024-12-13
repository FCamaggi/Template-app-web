// src/models/RepMax.js

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    class RepMax extends Model {
        static associate(models) {
            this.belongsTo(models.User);
            this.belongsTo(models.Exercise);
        }
    }

    RepMax.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        exercise_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rm_value: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        calculation_method: {
            type: DataTypes.STRING,
            defaultValue: 'Brzycki'
        },
        weight_used: DataTypes.FLOAT,
        reps_performed: DataTypes.INTEGER
    }, { sequelize, modelName: 'RepMax' });

    return RepMax;
};