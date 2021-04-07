import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { verify } from "jsonwebtoken"
import { Op } from "sequelize"
import Models from '../models'
import { UserAccountInstance } from "../models/useraccount"
import { authenticateUser, getUserByAccount, getUserbyEmailOrPhone } from "../utils"

const { UserAccount, Transaction } = Models

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        // console.log({ token })
        if (token == null) return res.sendStatus(401)

        const user = verify(token, process.env.TOKEN_SECRET as string)

        req.body.user = user
        next()
    } catch (err) {
        return res.sendStatus(403);
    }

}

export const validateEntries = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}

export const verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accountnumber, receiver } = req.body
        // console.log({accountnumber, receiver})
        const userInfo: UserAccountInstance = await getUserByAccount(accountnumber)
        if (typeof receiver === "undefined") {
            if (userInfo !== null) next()
        } else if (typeof receiver !== "undefined") {
            const receiverUserInfo: UserAccountInstance = await getUserByAccount(receiver)
            if (receiverUserInfo === null && userInfo !== null) {
                return res.status(404).send({
                    message: "Oops! The receiver account does not exist"
                })
            } else if (receiverUserInfo !== null && userInfo === null) {
                return res.status(404).send({
                    message: "Oops! your account does not exist"
                })
            } else if(receiverUserInfo === null && userInfo === null) {
                return res.status(404).send({
                    message: "Oops! both accounts do not exist"
                })
            } else {
                next()
            }
        }
        else return res.status(404).send({
            message: "Oops! This account does not exist"
        })

    } catch (err) {
        return res.status(500).send({
            message: 'Oops! ' + err.message || "An error occurred"
        })
    }

}

export const verifySufficientBalance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, user, accountnumber } = req.body

        const userInfo: UserAccountInstance = await getUserByAccount(accountnumber)

        if (amount <= userInfo.balance) {
            next()
        } else {
            return res.status(400).send({
                message: "Oop! you have an insufficient balance"
            })
        }
    } catch (err) {
        return res.status(500).send({
            message: 'Oops! ' + err.message || "An error occurred"
        })
    }

}

export const verifyPin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accountnumber, pin } = req.body

        const userInfo: UserAccountInstance = await getUserByAccount(accountnumber)

        if (userInfo !== null) {
            const confPass = await authenticateUser(pin, userInfo.pin)
            if (confPass) next()
            else 
            return res.status(400).send({
                message: "Oops! Invalid pin"
            })

        } else {
            return res.status(400).send({
                message: "Oops! Invalid pin"
            })
        }
    } catch (err) {
        return res.status(500).send({
            message: 'Oops! ' + err.message || "Oops! An error occurred"
        })
    }
}

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { userId } = req.params
        const { user, token } = req.body
        if (typeof userId === "undefined") {
            userId = user.userId
        }
        const confUser: UserAccountInstance = UserAccount.findByPk(userId)
        const confOTP = await authenticateUser(token, confUser.otp)
        if (confOTP) {
            const date = (new Date()).getTime()
            const dateDiff = (date - confUser.otpdatestart.getTime()) / (60 * 1000)
            // console.log({ dateDiff })
            if (dateDiff <= confUser.otpperiod) next()
            else return res.status(400).send({
                message: "Oops! OTP has expired"
            })
        } else return res.status(400).send({
            message: "Oops! OTP has expired"
        })

    } catch (err) {
        return res.status(500).send({
            message: 'Oops! ' + err.message || "Oops! An error occurred"
        })
    }
}

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        let { userId } = req.params
        const { user } = req.body
        if (typeof userId === "undefined") {
            userId = user.userId
        }
        const confUser = await UserAccount.findByPk(userId)
        if(confUser == null) {
            return res.status(400).send({
                message: "Oops! User does not exist"
            })
        }
        next()
    } catch (err) {
        return res.status(500).send({
            message: 'Oops! ' + err.message || "Oops! An error occurred"
        })
    }
}