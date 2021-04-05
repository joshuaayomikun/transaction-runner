"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    up: (queryInterface) => {
        return queryInterface.createTable('Transactions', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.UUID,
                defaultValue: sequelize_1.UUIDV4
            },
            amount: {
                type: sequelize_1.DOUBLE
            },
            balanceAfterTransaction: {
                type: sequelize_1.DOUBLE
            },
            description: {
                type: sequelize_1.STRING
            },
            transactiontype: {
                type: sequelize_1.STRING(6)
            },
            createdAt: {
                allowNull: false,
                type: sequelize_1.DATE
            },
            updatedAt: {
                allowNull: false,
                type: sequelize_1.DATE
            },
            userId: {
                type: sequelize_1.UUID,
                onDelete: 'CASCADE',
                references: {
                    model: 'UserAccounts',
                    key: 'id'
                }
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('Transactions');
    }
};
