'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Training extends Model {
        static associate(models) {
            // Definir asociaciones aquí
            this.belongsTo(models.Routine);
            this.belongsTo(models.Exercise);
            this.hasMany(models.Set);
            this.belongsTo(models.Training, { as: 'supersetTraining', foreignKey: 'superset_with' });
        }
    }

    Training.init({
        routine_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        exercise_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        training_type: {
            type: DataTypes.ENUM('strength', 'hypertrophy', 'endurance', 'power'),
            allowNull: false
        },
        notes: DataTypes.TEXT,
        tempo: {
            type: DataTypes.STRING, // Formato: "3-1-2-0"
            allowNull: true
        },
        unilateral: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        superset_with: {
            type: DataTypes.INTEGER, // ID de otro Training
            allowNull: true
        }
    }, { sequelize, modelName: 'Training' });

    return Training;
};
