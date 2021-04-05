import { Model, Op } from 'sequelize'
import Models from '../models'
import { UserAccountAttributes, UserAccountInstance } from '../models/useraccount'
import bcrypt from 'bcrypt'
const { UserAccount } = Models

export const getUserbyEmailOrPhone = async (userInput: UserAccountAttributes) => {

    if (typeof userInput.phonenumber !== "undefined") {
        const user = await UserAccount.findOne({
            where: {
                [Op.or]: [
                    { email: userInput.email },
                    { phonenumber: userInput.phonenumber }
                ]
            }
        })

        return user
    }
    else {
        const user = await UserAccount.findOne({
            where:
            {
                email: userInput.email

            }
        })
        return user
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
        const { accountnumber } = await UserAccount.findOne({
            attributes: ["accountnumber"],
            where: {
                accountnumber: newnumber
            }
        })
        if (typeof accountnumber === "undefined") {
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