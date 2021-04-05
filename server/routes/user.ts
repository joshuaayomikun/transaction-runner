import { NextFunction, Request, Response, Router } from "express"
import { confirmOTP, createUser, firstTimeLogin, forgotPassword, login, resendOTP, resetpassword } from "../controllers"
import { body, validationResult } from 'express-validator'
import { token } from "morgan"
const router = Router()
const User = (app: any) => {
    router.post('/createuser',
        body('email').isEmail(),
        body('password').isLength({ min: 5 }),
        body("phonenumber").isMobilePhone("en-NG"),
        body("firstname").isString().isLength({ min: 1 }),
        body("lastname").isString().isLength({ min: 1 }),
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next()
        },
        createUser)
    router.post("/:userId/confirmtoken", body('token').isLength({ min: 6, max: 6 }),
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next()
        }, confirmOTP)
    router.post("/resendverification", resendOTP)
    router.post("/login",
        body("email").isEmail(),
        body("passowrd").isLength({ min: 5 }),
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next()
        },
        login)
    router.post("/forgotpassword", forgotPassword)
    router.post("/resetpassowrd", resetpassword)
    router.put("/:userId/continueregistration", firstTimeLogin)

    app.use('/api/user', router)
}

export default User