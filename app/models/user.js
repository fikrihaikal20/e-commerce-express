'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Order, { foreignKey: 'user_id' });
        }
    }
    User.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        username: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        contact: {
            type: DataTypes.STRING
        },
        email: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING
        },
        birth_date: {
            type: DataTypes.DATE
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'else')
        },
        address: {
            type: DataTypes.STRING
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        banned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        sequelize,
        timestamps: true,
        underscored: true,
        paranoid: true,
        modelName: 'User',
        tableName: 'Users',
    });
    return User;
};
