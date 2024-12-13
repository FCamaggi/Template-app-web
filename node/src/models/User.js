'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {
        static associate(models) {
            this.hasMany(models.Progress);
            this.hasMany(models.Routine, { as: 'createdRoutines' });
            this.belongsToMany(models.Routine, { through: 'UserRoutines', as: 'routines' });
        }
    }

    User.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: DataTypes.STRING,
        role: {
            type: DataTypes.ENUM('admin', 'user', 'guest'),
            defaultValue: 'user'
        },
        preferred_measurement: {
            type: DataTypes.ENUM('RM', 'Borg'),
            defaultValue: 'Borg'
        },
        experience_level: {
            type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
            defaultValue: 'beginner'
        }
    }, { sequelize, modelName: 'User' });

    return User;
}