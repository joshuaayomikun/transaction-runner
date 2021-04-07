import { Request, Response } from "express";
import { getUserbyEmailOrPhone, authenticateUser, generateAccountNumber, hashedPassword } from "../utils";
import Models from '../models'
import { UserAccountAttributes, UserAccountInstance } from "../models/useraccount";
import sendMail from "../mail";
import { Model, Op } from "sequelize";
import { sign } from 'jsonwebtoken'
const { UserAccount, Transaction } = Models

export const createUser = async (req: Request, res: Response) => {
    try {
        // console.log({Models})
        const userInput: UserAccountAttributes = req.body
        const existingUser = await getUserbyEmailOrPhone(userInput)
        if (existingUser) {
            return res.status(400).send({
                message: "This number exists"
            })

        }
        let otp = String(Math.floor(100000 + Math.random() * 900000))
        userInput.otp = await hashedPassword(otp)
        userInput.otpperiod = 20
        userInput.otpdatestart = new Date()
        userInput.password = await hashedPassword(userInput.password as string)
        const newUser: UserAccountInstance = await UserAccount.create(userInput)
        // newUser.save()
        if (typeof newUser !== "undefined") {
            await sendMail({
                to: userInput.email as string,
                subject: "Account Creation",
                text: `Congratutions on your account opening, your otp is ${otp} copy your otp to your confirmation page to continue. Take note your otp expires after ${userInput.otpperiod} minues. use api/user/${newUser.id}/confirmtoken, send token as the body`
            })
            return res.status(201).send({ message: 'Account opening successful, check your mail or spam for OTP' })

        } else {
            res.status(400).send({
                message: "Something went wrong when creating account please try later"
            })
        }
    } catch (err) {
        return res.status(500).send({
            message: 'Oops! '+err.message || "Some error occurred while creating account"
        })

    }

}

export const confirmOTP = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId
        const user = await UserAccount.findOne({
            where: {
                [Op.and]: [{
                    id: userId
                }, {
                    firsttimelogin: true
                }]
            }
        })
        if (user === null) {
            return res.status(404).send({
                message: "User not found"
            })

        }
        else if (user.isverified) {
            return res.status(400).send({
                message: "Oops! You can't verify because your account has been verified"
            })

        }
        else {
            const verifiedUser: [number, Model[]] = await UserAccount.update({ isverified: true }, {
                where: {
                    id: userId
                }
            })
            // console.log({verifiedUser})
            if (verifiedUser[0] === 1) {
                return res.status(201).send({
                    message: "Congrats! your account has been verified, go to api/user/login and input your name and password"
                })

            } else {
                return res.status(400).send({
                    message: `Cannot verify user with userId=${userId}`
                })

            }
        }
    } catch (err) {
        return res.status(400).send({
            message: 'Oops! '+err.message || "Some error occurres while confirming the account"
        })

    }
}

export const resendOTP = async (req: Request, res: Response) => {
    try {
        const userInput: UserAccountAttributes = req.body
        const confirmUser: UserAccountInstance = await getUserbyEmailOrPhone(userInput)
        if (confirmUser === null) {
            return res.status(400).send({
                message: "Invalid email or password"
            })

        }
        const confPass: boolean = await authenticateUser(userInput.password as string, confirmUser.password)
        if (confPass) {
            if (!confirmUser.isverified) {
                const otp = String(Math.floor(100000 + Math.random() * 900000))
                const otpperiod = 20
                const user: [number, Model[]] = await UserAccount.update({
                    otp: await hashedPassword(otp),
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
                        to: userInput.email as string,
                        subject: "Resent Token",
                        text: `Congratutions on your account opening, your otp is ${otp} copy your otp to your confirmation page to continue. Take note your otp expires after ${otpperiod} minues. use api/user/${confirmUser.id}/confirmtoken, send token as the body`
                    })
                    return res.status(201).send({
                        message: "check your mail for verification code"
                    })
                }
            } else {
                return res.status(400).send({
                    message: "Oops! You cannot resend verification because your account has been verified"
                })

            }
        } else {
            return res.status(400).send({
                message: "Oops! Invalid email or password"
            })

        }
    } catch (err) {
        return res.status(500).send({
            message: 'Oops! '+err.message || "Some error occurred in resending verification"
        })

    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const userInput: UserAccountAttributes = req.body
        const confirmUser: UserAccountInstance = await getUserbyEmailOrPhone(userInput)
        // console.log({ confirmUser, userInput })
        if (confirmUser !== null) {
            const confPass: boolean = await authenticateUser(userInput.password as string, confirmUser.password)
            let message: string = ""
            if (confPass) {
                if (confirmUser.isverified) {
                    if (confirmUser.firsttimelogin) {
                        message = `For first time login call api/user/${confirmUser.id}/continueregistration send openingbalance, four digit pin, email and password as the body`
                    }
                    const payload = {
                        userId: confirmUser.id,
                        email: confirmUser.email,
                        firstname: confirmUser.firstname,
                        lastname: confirmUser.lastname
                    }
                    const token = sign(payload, process.env.TOKEN_SECRET as string, {
                        expiresIn: 20000
                    })
                    return res.status(200).send({
                        ...payload,
                        token, message
                    })

                } else {
                    return res.status(400).send({
                        message: `Oops! Your account is not verified, input the verification code sent to you as token on sign up via api/user/${confirmUser.id}/confirmtoken or call api/user/resendverification and enter your email and password to resend the verification code `
                    })

                }
            }
        }
        return res.status(400).send({
            message: "Oops! Wrong email or password"
        })

    } catch (err) {
        return res.status(500).send({
            message: 'Oops! '+err.message || "Some error occurred in loging in"
        })

    }
}

export const changepassword = async (req: Request, res: Response) => {
    try {
        const { email, password, newpassword } = req.body
        const user: UserAccountInstance = await getUserbyEmailOrPhone({ email })
        if (user !== null) {
            const confPass = await authenticateUser(password, user.password)
            const confPass2 = await authenticateUser(newpassword, user.password)
            if (confPass2) {
                return res.status(400).send({
                    message: "You can't use old password as your new password"
                })

            } else if (confPass) {
                const newpword = await hashedPassword(newpassword)
                UserAccount.update({ password: newpword }, {
                    where: {
                        email
                    }
                })
            }
        }
        return res.status(400).send({
            message: "Can't change password"
        })

    } catch (err) {
        return res.status(500).send({
            message: 'Oops! '+err.message || "Some error occurred in loging in"
        })

    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const userInput: UserAccountAttributes = req.body
        userInput.otp = String(Math.floor(100000 + Math.random() * 900000))
        userInput.otpperiod = 20
        const confirmUser: UserAccountInstance = await getUserbyEmailOrPhone(userInput)

        // console.log({confirmUser})
        if (confirmUser !== null) {
            if (confirmUser.isverified) {
                const updateOtp: [number, Model[]] = await UserAccount.update({
                    otp: await hashedPassword(userInput.otp),
                    otpdatestart: new Date(),
                    otpperiod: userInput.otpperiod,
                }, {
                    where: {
                        email: userInput.email
                    }
                })
                // console.log({updateOtp})
                if (updateOtp[0] === 1) {
                    sendMail({
                        to: userInput.email as string,
                        subject: "Forgot Password",
                        text: `your authorization code is ${userInput.otp} with expires after ${userInput.otpperiod} minutes, call api/user/resetpassword send email, token, password as the body`
                    })
                }
            }
        }

        return res.send({
            message: "If you have an account with us, you will receive a mail containing authorization codes"
        })


    } catch (err) {
        return res.status(500).send({
            message: 'Oops! '+err.message || "Some error occurred send verification"
        })

    }
}

export const resetpassword = async (req: Request, res: Response) => {
    try {
        const userInput: UserAccountAttributes = req.body
        const user = await getUserbyEmailOrPhone(userInput)

        if (typeof user !== "undefined") {
            const password = await hashedPassword(userInput.password as string);
            const updateAccount: [number, Model[]] = await UserAccount.update({ password, otpperiod: 0 }, {
                where: {
                    email: userInput.email
                }
            })
            if (updateAccount[0] === 1) {
                return res.status(201).send({
                    message: "Password changed successfully go to api/user/login to login with your credentials!"
                })

            }
        }
        return res.status(400).send({
            message: "An error occurred in reseting passwording"
        })

    } catch (err) {
        return res.status(500).send({
            message: 'Oops! '+err.message || "Some error occurred send verification"
        })

    }

}

export const firstTimeLogin = async (req: Request, res: Response) => {
    try {

        const userInput: UserAccountAttributes = req.body
        const user: UserAccountInstance = await getUserbyEmailOrPhone(userInput)
        const confPass = authenticateUser(userInput.password as string, user.password)
        if (!user.isverified) {
            return res.status(400).send({
                message: "oops! You have not been verified yet"
            })

        }
        else if (!user.firsttimelogin) {
            return res.status(400).send({
                message: "this API is just for first time users who haven't update their credentials"
            })

        }
        else if (confPass) {
            userInput.accountnumber = await generateAccountNumber()
            const openingbalance = userInput.openingbalance as number
            const balance = openingbalance
            const updatedUser: [number, Model[]] = await UserAccount.update({
                firsttimelogin: false,
                accountnumber: userInput.accountnumber,
                pin: await hashedPassword(userInput.pin as string),
                balance: +balance,
                openingbalance: +openingbalance
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
                        balanceAsAtTransfer: userInput.balance,
                        transactiontype: 'credit'
                    })
                }
                await sendMail({
                    to: user.email,
                    subject: "Account number created",
                    text: `${user.email} congratulations your account number is ${userInput.accountnumber}`
                })
                return res.status(201).send({
                    message: `Congrats check your mail for your account number `
                })

            }
            return res.status(400).send({
                message: "An error occurred"
            })

        }
    } catch (err) {
        return res.status(500).send({
            message: 'Oops! '+err.message || "An error occurred"
        })

    }
}