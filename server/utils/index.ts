import { Model, Op } from 'sequelize'
import Models from '../models'
import { UserAccountAttributes, UserAccountInstance } from '../models/useraccount'
import bcrypt from 'bcrypt'
import { TransactionsInstance } from '../models/transaction'
import sendMail from '../mail'
const { UserAccount, Transaction } = Models

export const getUserbyEmailOrPhone = async (userInput: UserAccountAttributes) => {
    // console.log({userInput})
    if (typeof userInput.phonenumber !== "undefined") {
        const confUser = await UserAccount.findOne({
            where: {
                [Op.or]: [
                    { email: userInput.email },
                    { phonenumber: userInput.phonenumber }
                ]
            }
        })

        return confUser
    }
    else {
        const confUser = await UserAccount.findOne({
            where:
            {
                email: userInput.email

            }
        })
        console.log({ userInput })
        return confUser
    }
}

export const authenticateUser = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    const confPass = await bcrypt.compare(plainPassword, hashedPassword)
    return confPass
}

export const generateAccountNumber = async () => {

    let newnumber = "0000000001"
    let a = true
    while (a) {
        const user = await UserAccount.findOne({
            attributes: ["accountnumber"],
            where: {
                accountnumber: newnumber
            }
        })
        if (user === null) {
            a = false
        } else {
            const smallnumber = +newnumber + 1
            let smallnumberString = String(smallnumber)
            while (smallnumberString.length < 10) {
                smallnumberString = `0${smallnumberString}`
            }
            newnumber = smallnumberString
        }
    }
    return newnumber

}

export const hashedPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(password, salt);

    return newpassword
}

export const getUserByAccount = async (accountnumber: string) => {
    // console.log({accountnumber})
    const user: UserAccountInstance = await UserAccount.findOne({
        where: {
            accountnumber
        }
    })

    return user

}

export const makeNewTransaction = async (transactiontype: string, accountnumber: string, description: string = "", amount: number) => {
    const user: UserAccountInstance = await getUserByAccount(accountnumber)
    let balanceAfterTransaction: number = 0;
    if (transactiontype.toLowerCase() === "debit")
        balanceAfterTransaction = user.balance - amount
    else if (transactiontype.toLowerCase() === "credit")
        balanceAfterTransaction = user.balance + amount
    const transaction: TransactionsInstance = await Transaction.create({
        transactiontype,
        description,
        userId: user.id,
        amount,
        balanceAfterTransaction
    })
    if(transaction !== null) {
        await sendMail({
            to: user.email,
            text: `A ${transactiontype} transaction of ${amount} was made on your account your new balance is ${balanceAfterTransaction}`,
            subject: "Transactin notification"
        })
    }
    return transaction
}

export const reverseTransaction = async (transactiontype: string, accountnumber: string, description: string = "", amount: number) => {
    const user: UserAccountInstance = await getUserByAccount(accountnumber)
    const transaction: TransactionsInstance = await Transaction.create({
        transactiontype: transactiontype.toLowerCase() === "debit" ? 'credit' : 'debit',
        description: description + ' reversal',
        userId: user.id,
        amount,
        balanceAfterTransaction: user.balance
    })
    if(transaction !== null) {
        await sendMail({
            to: user.email,
            text: `A ${transactiontype.toLowerCase() === "debit" ? 'credit' : 'debit'} reversal of ${amount} was made on your account`,
            subject: "Transactin notification"
        })
    } 
    return transaction
}

export const updateUserTransaction = async (accountnumber: string, balance: number) => {

    const updateUser: [number, Model[]] = await UserAccount.update({
        balance
    }, {
        where: {
            accountnumber
        }
    })
    return updateUser
}