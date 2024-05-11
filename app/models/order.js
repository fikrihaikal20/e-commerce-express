'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'user_id' });
            Order.belongsTo(models.Product, { foreignKey: 'product_id' });
        }
    }
    Order.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        quantity: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        total_price: {
            allowNull: false,
            type: DataTypes.DECIMAL(10, 2)
        },
        product_id: {
            type: DataTypes.UUID,
        },
        user_id: {
            type: DataTypes.UUID,
        }
    }, {
        sequelize,
        timestamps: true,
        underscored: true,
        paranoid: true,
        modelName: 'Order',
        tableName: 'Orders',
    });
    return Order;
};
