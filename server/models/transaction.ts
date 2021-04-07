import { Sequelize, ModelCtor } from 'sequelize-typescript';
import { DOUBLE, STRING } from 'sequelize';
import { IModel } from '../interfaces';
import { UUID } from 'sequelize';
import { UUIDV4 } from 'sequelize';
import { DATE } from 'sequelize';

export interface TransactionsAttributes {
    amount ? : number;
    description ? : string;
    balanceAfterTransaction ? : number;
    transactiontype ? : string;

}

export interface TransactionsInstance {
    id: string;
    createdAt: Date;
    updatedAt: Date;

    balanceAfterTransaction: number;
    amount: number;
    description: string;
    transactiontype:string

}

type Diff<T extends keyof any, U extends keyof any> = 
  ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
export type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

  interface AppModel extends Overwrite<ModelCtor, any> {};
const TransactionFactory = (sequelize: Sequelize) => {
    var Transaction: AppModel = sequelize.define('Transaction', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: UUID,
            defaultValue: UUIDV4
        },
        amount: DOUBLE,
        description: STRING,
        balanceAfterTransaction: DOUBLE,
        transactiontype: STRING(6),
        createdAt: {
            allowNull: false,
            type: DATE
        },

        updatedAt: {
            allowNull: false,
            type: DATE
        }
    });

    Transaction.associate = function(models: IModel) {
        // associations can be defined here
        Transaction.belongsTo(models.UserAccount, {
            foreignKey: "userId",
            onDelete: "CASCADED",
            as: 'user'
        })

    };

    return Transaction;
};

export default TransactionFactory
