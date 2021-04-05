import { Request, Response } from "express";
import { getUserbyEmailOrPhone, authenticateUser, generateAccountNumber } from "../utils";
import Models from '../models'
import { UserAccountAttributes, UserAccountInstance } from "../models/useraccount";
import bcrypt from 'bcrypt'
import sendMail from "../mail";
import { Model, ModelCtor, Op } from "sequelize";
import { IRequest } from "../interfaces";
import { sign } from 'jsonwebtoken'
const { UserAccount, Transaction } = Models

export const createUser = async (req: Request, res: Response) => {
    try {
        // console.log({Models})
        const userInput: UserAccountAttributes = req.body || {}
        const existingUser = await getUserbyEmailOrPhone(userInput)
        if (existingUser) {
            res.status(400).send({
                message: "This number exists"
            })
            return
        }
        userInput.otp = String(Math.floor(100000 + Math.random() * 900000))
        userInput.otpperiod = 20
        userInput.otpdatestart = new Date()
        const salt = await bcrypt.genSalt(10);
        userInput.password = await bcrypt.hash(userInput.password, salt);
        const newUser: UserAccountInstance = await UserAccount.create(userInput)
        // newUser.save()
        if (typeof newUser !== "undefined") {
            await sendMail({
                to: userInput.email || "",
                subject: "Account Creation",
                text: `Congratutions on your account opening, your otp is ${userInput.otp} copy your otp to your confirmation page to continue. Take note your otp expires after ${userInput.otpperiod} minues. use api/user/${newUser.id}/confirmtoken, send token as the body`
            })
            res.status(201).send({ message: 'Account opening successful, check your mail or spam for OTP' })
            return
        } else {
            res.status(400).send({
                message: "Something went wrong when creating account please try later"
            })
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating account"
        })
        return
    }

}

export const confirmOTP = async (req: Request, res: Response) => {
    try {
        const token = req.body.token
        const userId = req.params.userId
        const user = await UserAccount.findOne({
            where: {
                [Op.and]: [{
                    id: userId
                }, {
                    otp: token
                }, {
                    firsttimelogin: true
                }]
            }
        })
        const date = new Date
        const timeDiff = (date.getTime() - user.otpdatestart.getTime()) / (60 * 1000)
        if (typeof user === "undefined") {
            res.status(404).send({
                message: "User not found"
            })
            return
        }
        else if (user.isverified) {
            res.status(400).send({
                message: "Oops! You can't verify because your account has been verified"
            })
            return
        }
        else if (timeDiff > user.otpperiod) {

            res.status(400).send({
                message: "Oops! This token has expired, call api/user/resendverification and enter your email and password"
            })
            return
        } else {
            const verifiedUser: [number, Model[]] = await UserAccount.update({ isverified: true }, {
                where: {
                    id: userId
                }
            })
            // console.log({verifiedUser})
            if (verifiedUser[0] === 1) {
                res.status(201).send({
                    message: "Congrats! your account has been verified, go to api/user/login and input your name and password"
                })
                return
            } else {
                res.status(400).send({
                    message: `Cannot verify user with userId=${userId}`
                })
                return
            }
        }
    } catch (err) {
        res.status(400).send({
            message: err.message || "Some error occurres while confirming the account"
        })
        return
    }
}

export const resendOTP = async (req: Request, res: Response) => {
    try {
        const userInput: UserAccountAttributes = req.body
        const confirmUser: UserAccountInstance = await getUserbyEmailOrPhone(userInput)
        if (typeof confirmUser === "undefined") {
            res.status(400).send({
                message: "Invalid email or password"
            })
            return
        }
        const confPass: boolean = await authenticateUser(userInput.password || "", confirmUser.password)
        if (confPass) {
            if (!confirmUser.isverified) {
                const otp = String(Math.floor(100000 + Math.random() * 900000))
                const otpperiod = 20
                const user: [number, Model[]] = await UserAccount.update({
                    otp,
                    otpperiod,
                    otpdatestart: new Date()
                }, {
                    where: {
                        [Op.and]: [{
                            email: userInput.email
                        }, {
                            isverified: false
                        }, {
                            firsttimelogin: true
                        }]
                    }
                })
                if (user[0] === 1) {
                    await sendMail({
                        to: userInput.email || "",
                        subject: "Resent Token",
                        text: `Congratutions on your account opening, your otp is ${otp} copy your otp to your confirmation page to continue. Take note your otp expires after ${otpperiod} minues. use api/user/${confirmUser.id}/confirmtoken, send token as the body`
                    })
                    res.status(201).send({
                        message: "check your mail for verification code"
                    })
                }
            } else {
                res.status(400).send({
                    message: "Oops! You cannot resend verification because your account has been verified"
                })
                return
            }
        } else {
            res.status(400).send({
                message: "Oops! Invalid email or password"
            })
            return
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred in resending verification"
        })
        return
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const userInput: UserAccountAttributes = req.body
        const confirmUser: UserAccountInstance = await getUserbyEmailOrPhone(userInput)
        console.log({ confirmUser, userInput })
        if (confirmUser !== null) {
            const confPass: boolean = await authenticateUser(userInput.password || "", confirmUser.password)
            let message: string = ""
            if (confPass) {
                if (confirmUser.isverified) {
                    if (confirmUser.firsttimelogin) {
                        message = `For first time login call api/user/${confirmUser.id}/continueregistration send openingbalance, four digit pin, email and password as the body`
                    }
                    const payload = {
                        email: confirmUser.email,
                        firstname: confirmUser.firstname,
                        lastname: confirmUser.lastname
                    }
                    const token = sign(payload, process.env.LOGIN_SECRET || "", {
                        expiresIn: 20000
                    })
                    res.status(200).send({
                        ...payload,
                        token, message
                    })
                    return
                } else {
                    res.status(400).send({
                        message: `Oops! Your account is not verified, input the verification code sent to you as token on sign up via api/user/${confirmUser.id}/confirmtoken or call api/user/resendverification and enter your email and password to resend the verification code `
                    })
                    return
                }
            }
        }
        res.status(400).send({
            message: "Oops! Wrong email or password"
        })
        return
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred in loging in"
        })
        return
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const userInput: UserAccountAttributes = req.body
        userInput.otp = String(Math.floor(100000 + Math.random() * 900000))
        userInput.otpperiod = 20
        const confirmUser: UserAccountInstance = UserAccount.findOne({
            where: {
                email: userInput.email
            }
        })

        if (typeof confirmUser !== "undefined") {
            if (confirmUser.isverified) {
                const updateOtp: [number, Model] = UserAccount.update({
                    otp: userInput.otp,
                    otpdatestart: new Date(),
                    otpperiod: userInput.otpperiod
                })
                if (updateOtp[0] === 1) {
                    sendMail({
                        to: userInput.email || "",
                        subject: "Forgot Password",
                        text: `your authorization code is ${userInput.otp} with expires after ${userInput.otpperiod} minutes, call api/user/resetpassword send email, token, password as the body`
                    })
                }
            }
        }

        res.send({
            message: "If you have an account with us, you will receive a mail containing authorization codes"
        })
        return

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred send verification"
        })
        return
    }
}

export const resetpassword = async (req: Request, res: Response) => {
    try {
        const userInput: UserAccountAttributes = req.body
        const user = await getUserbyEmailOrPhone(userInput)

        const date = new Date
        if (typeof user !== "undefined") {
            const timeDiff = (date.getTime() - user.otpdatestart.getTime()) / (60 * 1000)
            if (timeDiff <= user.otpperiod) {
                const salt = await bcrypt.genSalt(10);
                const password = await bcrypt.hash(userInput.password, salt);
                const updateAccount: [number, Model[]] = await UserAccount.update({ password, otpperiod: 0 }, {
                    where: {
                        email: userInput.email
                    }
                })
                if (updateAccount[0] === 1) {
                    res.status(201).send({
                        message: "Password changed successfully go to api/user/login to login with your credentials!"
                    })
                    return
                }
            }
        }
        res.status(400).send({
            message: "An error occurred in reseting passwording"
        })
        return
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred send verification"
        })
        return
    }

}

export const firstTimeLogin = async (req: Request, res: Response) => {
    try {

        const userInput: UserAccountAttributes = req.body
        const user: UserAccountInstance = await getUserbyEmailOrPhone(userInput)
        const confPass = authenticateUser(userInput.password || "", user.password)
        if (!user.isverified) {
            res.status(400).send({
                message: "oops! You have not been verified yet"
            })
            return
        }
        else if (!user.firstname) {
            res.status(400).send({
                message: "this API is just for first time users who haven;t update their credentials"
            })
            return
        }
        else if (confPass) {
            userInput.accountnumber = await generateAccountNumber()
            const balance = userInput.balance || ""
            const updatedUser: [number, Model[]] = await UserAccount.update({
                firsttimelogin: false,
                accountnumber: userInput.accountnumber,
                pin: userInput.pin,
                balance: +balance
            }, {
                where: {
                    email: userInput.email
                }
            })

            if (updatedUser[0] === 1) {
                if (balance > 0) {
                    await Transaction.create({
                        amount: balance,
                        userId: user.id,
                        desscription: 'Opening account',
                        transactiotype: 'credit',
                        balanceAsAtTransfer: user.balance
                    })
                }
                await sendMail({
                    to: user.email,
                    subject: "Account number created",
                    text: `${user.email} congratulations your account number is ${userInput.accountnumber}`
                })
                res.status(201).send({
                    message: `Congrats check your mail for your account number `
                })
                return
            }
            res.status(400).send({
                message: "An error occurred"
            })
            return
        }


    } catch (err) {
        res.status(500).send({
            message: err.message || "An error occurred"
        })
        return
    }
}