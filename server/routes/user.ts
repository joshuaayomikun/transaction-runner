import { NextFunction, Request, Response, Router } from "express"
import { changePassowrd, confirmOTP, createUser, firstTimeLogin, forgotPassword, login, resendOTP, resetpassword } from "../controllers"
import { body, check, validationResult } from 'express-validator'
const router = Router()
const User = (app: any) => {
    router.post('/createuser',
        [
            body('email').isEmail(),
            body('password').isLength({ min: 5 }),
            body("phonenumber").isMobilePhone("en-NG"),
            body("firstname").not().isEmpty(),
            body("lastname").not().isEmpty()
        ],
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
    router.post("/resendverification",
        body("email").isEmail(),
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next()
        },
        resendOTP)
    router.post("/login",
        [
            body("email").isEmail(),
            body("passowrd").isLength({ min: 5 })
        ],
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next()
        },
        login)
    router.post("/changePassowrd",
        [
            body("email").isEmail(),
            body("password").isLength({ min: 5 }),
            body("newpassword").isLength({ min: 5 })
        ],
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next()
        },
        changePassowrd)
    router.post("/forgotpassword", body("email").isEmail(),
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next()
        }, forgotPassword)
    router.post("/resetpassowrd",
        [
            body("email").isEmail(),
            body("password").isLength({ min: 5 }),
        ],
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next()
        }, resetpassword)
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
            })
        ],
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next()
        },

        firstTimeLogin)

    app.use('/api/user', router)
}

export default User