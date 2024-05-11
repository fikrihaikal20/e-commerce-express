'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.hasMany(models.Order, { foreignKey: 'product_id' });
        }
    }
    Product.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        price: {
            allowNull: false,
            type: DataTypes.DECIMAL(10, 2)
        },
        description: {
            type: DataTypes.TEXT
        },
    }, {
        sequelize,
        timestamps: true,
        underscored: true,
        paranoid: true,
        modelName: 'Product',
        tableName: 'Products',
    });
    return Product;
};
