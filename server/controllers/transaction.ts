import { Request, Response } from "express";
import { read } from "node:fs";
import { TransactionsAttributes, TransactionsInstance } from "../models/transaction";

import Models from "../models";
import { UserAccountInstance } from "../models/useraccount";
import { Model } from "sequelize/types";
import { getUserByAccount, makeNewTransaction, updateUserTransaction, reverseTransaction } from "../utils";
import sendMail from "../mail";

const { Transaction, UserAccount } = Models
export const transfertTOAnotherAccount = async (req: Request, res: Response) => {
    try {
        const { amount, user, description, transactiontype, accountnumber, receiver } = req.body
        const transaction: TransactionsInstance = await makeNewTransaction(transactiontype, accountnumber, description, amount)
        if (transaction !== null) {
            const transactionUser: [number, Model[]] = await updateUserTransaction(accountnumber, transaction.balanceAfterTransaction)
            if (transactionUser[0] === 1) {
                const status = transactiontype === "credit" ? "debit" : 'credit'
                const receivertransaction = await makeNewTransaction(status, receiver, description, amount)
                if (receivertransaction !== null) {
                    const receiverTransactionUser: [number, Model[]] = await updateUserTransaction(receiver, receivertransaction.balanceAfterTransaction)
                    if (receiverTransactionUser[0] === 1){
                        return res.status(200).send({
                            message: "Congrats Transaction successful"
                        })
                    }
                    else {
                        await reverseTransaction(status, receiver, description, amount)
                    }
                }
            } else {
                await reverseTransaction(transactiontype, accountnumber, description, amount)
            }
        }
        return res.status(400).send({
            message: "Oops! Unable to complete this transaction"
        })

    } catch (err) {
        return res.status(500).send({
            message: 'Oops! ' + err.message || "Something went wrong"
        })

    }
}

export const makePayment = async (req: Request, res: Response) => {
    try {
        const { amount, user, description, transactiontype, accountnumber } = req.body

        const confUser: UserAccountInstance = await getUserByAccount(accountnumber)
        const transaction: TransactionsInstance = await makeNewTransaction(transactiontype, accountnumber, description, amount)
        if (transaction !== null) {
            const transactionUser = await updateUserTransaction(accountnumber, transaction.balanceAfterTransaction)
            if (transactionUser[0] === 1) {
                return res.status(201).send({
                    message: "Congrats Transaction successful"
                })

            } else {
                const reversaltransaction: TransactionsInstance = await reverseTransaction(transactiontype,accountnumber, description, amount)
            }
        }

        return res.status(400).send({
            message: "Oops! Unable to complete this transaction"
        })

    } catch (err) {
        return res.status(500).send({
            message: 'Oops! ' + err.message || "Something went wrong"
        })

    }
}

export const getAllTransactions = async (req: Request, res: Response) => {
    try {
        const allTransactions = await Transaction.findAll({
            include: ['user']
        })
        // console.log({allTransactions})
        if (allTransactions !== null) {
            res.status(200).json(
                allTransactions
            )
        } else {
            return res.status(400).send({
                message: "Oops! no data"
            })
        }
    } catch (err) {
        return res.status(500).send({
            message: 'Oops! ' + err.message || "Something went wrong"
        })

    }
}

export const getTransactionsByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const userTransaction = await UserAccount.findAll({
            where: { id: userId },
            include: ['transactions']

        })
        // console.log({userTransaction})
        if (userTransaction !== null) {
            res.status(200).json(
                userTransaction
            )
        } else {
            return res.status(400).send({
                message: "Oops! no data"
            })
        }
    } catch (err) {
        return res.status(500).send({
            message: 'Oops! ' + err.message || "Something went wrong"
        })

    }
}