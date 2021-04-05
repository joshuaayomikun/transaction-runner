"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    up: (queryInterface) => {
        return queryInterface.createTable('UserAccounts', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.UUID,
                defaultValue: sequelize_1.UUIDV4
            },
            email: {
                type: sequelize_1.STRING
            },
            password: {
                type: sequelize_1.STRING
            },
            balance: {
                type: sequelize_1.DOUBLE
            },
            otp: {
                type: sequelize_1.STRING(6)
            },
            otpdatestart: {
                type: sequelize_1.DATE
            },
            otpperiod: {
                type: sequelize_1.INTEGER
            },
            firstname: {
                type: sequelize_1.STRING
            },
            lastname: {
                type: sequelize_1.STRING
            },
            phonenumber: {
                type: sequelize_1.STRING(11)
            },
            isverified: {
                type: sequelize_1.BOOLEAN,
                defaultValue: false
            },
            accountnumber: {
                type: sequelize_1.STRING(10)
            },
            openingbalance: {
                type: sequelize_1.DOUBLE
            },
            firsttimelogin: {
                type: sequelize_1.BOOLEAN,
                defaultValue: true
            },
            pin: {
                type: sequelize_1.STRING(4)
            },
            createdAt: {
                allowNull: false,
                type: sequelize_1.DATE
            },
            updatedAt: {
                allowNull: false,
                type: sequelize_1.DATE
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('UserAccounts');
    }
};
