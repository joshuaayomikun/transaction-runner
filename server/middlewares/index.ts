import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"



export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        const user = await verify(token, process.env.TOKEN_SECRET as string)

        req.body.user = user
    } catch (err) {
        res.sendStatus(401)
        return;
    }

}