import { Sequelize, ModelCtor } from 'sequelize-typescript';
import { DOUBLE, STRING } from 'sequelize';
import { IModel } from '../interfaces';

export interface TransactionsAttributes {
    amount ? : number;
    description ? : string;
    balanceAfterTransaction ? : number;
    transactiontype ? : string;

}

export interface TransactionsInstance {
    id: number;
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
        amount: DOUBLE,
        description: STRING,
        balanceAfterTransaction: DOUBLE,
        transactiontype: STRING(6)
    });

    Transaction.associate = function(models: IModel) {
        // associations can be defined here
        Transaction.belongsTo(models.UserAccount, {
            foreignKey: "userId",
            onDelete: "CASCADED"
        })

    };

    return Transaction;
};

export default TransactionFactory
