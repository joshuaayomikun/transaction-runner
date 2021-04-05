import { Sequelize, ModelCtor } from 'sequelize-typescript';
import { BOOLEAN, DATE, DOUBLE, INTEGER, STRING } from 'sequelize';
import { IModel } from '../interfaces';
import { UUID } from 'sequelize';
import { UUIDV4 } from 'sequelize';

export interface UserAccountAttributes {
    email ? : string;
    password ? : string;
    balance ? : number;
    otp ? : string;
    otpdatestart ? : Date;
    otpperiod ? : number;
    firstname ? : string;
    lastname ? : string;
    phonenumber ? : string;
    openingbalance ? : number;
    isverified ? : boolean;
    accountnumber ? : string;
    firsttimelogin ? : boolean;
    pin ? : string;

}

export interface UserAccountInstance {
    id: string;
    createdAt: Date;
    updatedAt: Date;

    email: string;
    password: string;
    balance: number;
    otp: string;
    otpdatestart: Date;
    otpperiod: number;
    firstname: string;
    lastname: string;
    phonenumber: string;
    openingbalance: number;
    isverified: boolean;
    accountnumber: string;
    firsttimelogin: boolean;
    pin: string;
}

type Diff<T extends keyof any, U extends keyof any> = 
  ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
export type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

  interface AppModel extends Overwrite<ModelCtor, any> {};

const UserAccountFactory = (sequelize: Sequelize) => {
    var UserAccount: AppModel = sequelize.define('UserAccount', {
        id: {
            type: UUID,
            defaultValue:UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        email: STRING,
        password: STRING,
        balance: DOUBLE,
        otp: STRING(5),
        otpdatestart: DATE,
        otpperiod: INTEGER,
        firstname: STRING,
        lastname: STRING,
        phonenumber: STRING(11),
        openingbalance: DOUBLE,
        isverified: BOOLEAN,
        accountnumber: STRING(10),
        firsttimelogin: BOOLEAN,
        pin: STRING(4),
        createdAt: {
            type:DATE,
            allowNull: false
        },
        updatedAt: {
            type:DATE,
            allowNull: false
        }
    });

    UserAccount.associate = function(models: IModel) {
        // associations can be defined here
        UserAccount.hasMany(models.Transaction, {
            foreignKey: 'userId',
            as: 'transactions'
        })
    };

    return UserAccount;
};


export default UserAccountFactory