import { Request, Response } from "express";
import { read } from "node:fs";
import { TransactionsAttributes, TransactionsInstance } from "../models/transaction";

import Models from "../models";
import { UserAccountInstance } from "../models/useraccount";
import { Model } from "sequelize/types";
import { getUserByAccount } from "../utils";

const { Transaction, UserAccount } = Models
export const transfertTOAnotherAccount = async (req: Request, res: Response) => {
    try {
        const { amount, user, description, transactiontype, accountnumber, receiver } = req.body

        const confUser: UserAccountInstance = await getUserByAccount(accountnumber)
        if (confUser.balance >= amount) {
            const transction: TransactionsInstance = await Transaction.create({
                transactiontype,
                description,
                userId: confUser.id,
                amount,
                balanceAfterTransaction: transactiontype.toLowerCase() === 'debit' ? confUser.balance - amount : confUser.balance + amount
            })
            if (transction !== null) {
                const transactionUser: [number, Model[]] = await UserAccount.update(
                    { balance: transction.balanceAfterTransaction },
                    {
                        where: {
                            id: confUser.id
                        }
                    }
                )
                if (transactionUser[0] === 1) {
                    const status = transactiontype === "credit" ? "debit" : 'credit'
                    const receiverConfUser: UserAccountInstance = await getUserByAccount(receiver)
                    const receiverTransction: TransactionsInstance = await Transaction.create({
                        transactiontype: status,
                        description,
                        userId: receiverConfUser.id,
                        amount,
                        balanceAfterTransaction: transactiontype.toLowerCase() === 'debit' ? receiverConfUser.balance + amount : receiverConfUser.balance - amount
                    })
                    if (receiverTransction !== null) {
                        const receiverTransactionUser: [number, Model[]] = await UserAccount.update(
                            { balance: receiverTransction.balanceAfterTransaction },
                            {
                                where: {
                                    id: receiverConfUser.id
                                }
                            }
                        )
                        if(receiverTransactionUser[0] === 1)
                        return res.status(200).send({
                            message: "Congrats Transaction successful"
                        })
                        else {
                            const reversalReceiverTransction: TransactionsInstance = await Transaction.create({
                                transactiontype: status === "credit" ? "debit" : 'credit',
                                description,
                                userId: receiverConfUser.id,
                                amount,
                                balanceAfterTransaction: receiverConfUser.balance
                            })
                        }
                    }
                } else {
                    const status = transactiontype === "credit" ? "debit" : 'credit'
                    const transction: TransactionsInstance = await Transaction.create({
                        transactiontype: status,
                        description: "reversal",
                        userId: confUser.id,
                        amount,
                        balanceAfterTransaction: confUser.balance
                    })
                }
            }

        } else {
            return res.status(400).send({
                message: "Oops! You have insufficient funds to complete this transaction"
            })

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
        const transction: TransactionsInstance = await Transaction.create({
            transactiontype,
            description,
            userId: confUser.id,
            amount,
            balanceAfterTransaction: transactiontype.toLowerCase() === 'debit' ? confUser.balance - amount : confUser.balance + amount
        })
        if (transction !== null) {
            const transactionUser = await UserAccount.update(
                { balance: transction.balanceAfterTransaction },
                {
                    where: {
                        id: confUser.id
                    }
                }
            )
            if (transactionUser[0] === 1) {
                return res.status(201).send({
                    message: "Congrats Transaction successful"
                })

            } else {
                const status = transactiontype === "credit" ? "debit" : 'credit'
                const reversalTransction: TransactionsInstance = Transaction.create({
                    transactiontype: status,
                    description: "reversal",
                    userId: confUser.id,
                    amount,
                    balanceAfterTransaction: confUser.balance
                })
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
        if( allTransactions !== null) {
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
        const {userId} = req.params
        const userTransaction = await UserAccount.findAll({
            where: {id:userId},
            include: ['transactions']

        }) 
        // console.log({userTransaction})
        if( userTransaction !== null) {
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