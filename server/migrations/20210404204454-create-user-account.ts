import {
    BOOLEAN,
    DATE,
    DOUBLE,
    INTEGER,
    QueryInterface, STRING, UUID, UUIDV4
} from 'sequelize';
export default {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable('UserAccounts', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: UUID,
                defaultValue: UUIDV4
            },

            email: {
                type: STRING
            },

            password: {
                type: STRING
            },

            balance: {
                type: DOUBLE
            },

            otp: {
                type: STRING
            },

            otpdatestart: {
                type: DATE
            },

            otpperiod: {
                type: INTEGER
            },

            firstname: {
                type: STRING
            },

            lastname: {
                type: STRING
            },

            phonenumber: {
                type: STRING(11)
            },

            isverified: {
                type: BOOLEAN,
                defaultValue: false
            },

            accountnumber: {
                type: STRING(10)
            },

            openingbalance: {
                type: DOUBLE
            },

            firsttimelogin:{
                type: BOOLEAN,
                defaultValue: true
            }, 

            pin: {
                type: STRING
            },

            createdAt: {
                allowNull: false,
                type: DATE
            },

            updatedAt: {
                allowNull: false,
                type: DATE
            }
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable('UserAccounts');
    }
};
