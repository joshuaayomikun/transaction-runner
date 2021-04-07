import { Router } from "express"
import { body } from "express-validator"
import { makePayment, getAllTransactions, getTransactionsByUser, transfertTOAnotherAccount } from "../controllers"
import { validateAmount } from "../customValidations"
import { validateEntries, verifyPin, verifySufficientBalance, verifyToken, verifyAccount, verifyUser } from "../middlewares"

const router = Router()
const Transaction = (app: any) => {

    router.post('/makepayment', [
        body('accountnumber').isLength({ min: 10, max: 10 }),
        body('transactiontype').isIn(["debit", "credit"]),
        body("pin").isLength({ min: 4, max: 4 }),
        body('amount').custom((value, { req, path }) => validateAmount)
    ], validateEntries, verifyToken, verifyAccount,
        verifyPin, verifySufficientBalance, makePayment)

    router.post('/toanotheraccount', [
        body('accountnumber').isLength({ min: 10, max: 10 }),
        body('receiver').isLength({ min: 10, max: 10 }),
        body('transactiontype').isIn(["debit", "credit"]),
        body("pin").isLength({ min: 4, max: 4 }),
        body('amount').custom((value, { req, path }) => validateAmount)
    ], validateEntries, verifyToken, verifyAccount, verifyPin,
        verifySufficientBalance, transfertTOAnotherAccount)

    router.post('/creditaccount', [
        body('accountnumber').isLength({ min: 10, max: 10 }),
        body('transactiontype').isIn(["debit", "credit"]),
        body('amount').custom(validateAmount)
    ], validateEntries, verifyToken, verifyAccount, makePayment)

    router.get('/getalltransactions', verifyToken, getAllTransactions)

    router.get('/gettransactionbyuser/:userId', verifyToken, verifyUser, getTransactionsByUser)

    app.use('/api/transaction', router)
}

export default Transaction