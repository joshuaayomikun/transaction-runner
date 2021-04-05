import {
    BOOLEAN,
    DATE,
    DOUBLE,
    QueryInterface, STRING, UUID, UUIDV4,
} from 'sequelize';

export default {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable('Transactions', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: UUID,
                defaultValue: UUIDV4
            },

            amount: {
                type: DOUBLE
            },

            balanceAfterTransaction: {
                type: DOUBLE
            },

            description: {
                type: STRING
            },

            transactiontype: {
                type: STRING(6)
            },

            createdAt: {
                allowNull: false,
                type: DATE
            },

            updatedAt: {
                allowNull: false,
                type: DATE
            },

            userId: {
                type: UUID,
                onDelete: 'CASCADE',
                references: {
                    model: 'UserAccounts',
                    key:'id'
                }
            }
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable('Transactions');
    }
};
