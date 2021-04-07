import { Router } from "express"
import { changepassword, confirmOTP, createUser, firstTimeLogin, forgotPassword, login, resendOTP, resetpassword } from "../controllers"
import { body} from 'express-validator'
import { validateEntries, verifyOTP, verifyToken } from "../middlewares"
const router = Router()
const User = (app: any) => {
    router.post('/createuser',
        [
            body('email').isEmail(),
            body('password').isLength({ min: 5 }),
            body("phonenumber").isMobilePhone("en-NG"),
            body("firstname").not().isEmpty(),
            body("lastname").not().isEmpty()
        ], validateEntries, createUser)
    router.post("/:userId/confirmtoken",
        body('token').isLength({ min: 6, max: 6 }),
        validateEntries, confirmOTP)
    router.post("/resendverification",
        [
            body("email").isEmail(), 
            body("password").isLength({min:5})
        ], validateEntries, resendOTP)
    router.post("/login",
        [
            body("email").isEmail(),
            body("password").isLength({ min: 5 })
        ], validateEntries, login)
    router.put("/changepassword",
        [
            body("email").isEmail(),
            body("password").isLength({ min: 5 }),
            body("newpassword").isLength({ min: 5 })
        ], validateEntries, verifyToken, changepassword)
    router.post("/forgotpassword", body("email").isEmail(),
        validateEntries, forgotPassword)
    router.put("/resetpassword",
        [
            body("email").isEmail(),
            body("token").isLength({ min: 6, max: 6 }),
            body("password").isLength({ min: 5 }),
        ], validateEntries, verifyOTP, resetpassword)
    router.put("/:userId/continueregistration",
        [
            body("openingbalance").isNumeric(),
            body("email").isEmail(),
            body("pin").isLength({ min: 4, max: 4 }),
            body("password").isLength({ min: 5 }),
            body("balance").custom((value, { req, path }) => {
                if (value !== req.body.openingbalance) {
                    throw new Error("Balance is not same as opening balance");

                } else {
                    return value
                }
            }),
        ],
        validateEntries,
        verifyToken,
        firstTimeLogin)

    app.use('/api/user', router)
}

export default User