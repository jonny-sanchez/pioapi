import { Request, Response, NextFunction } from "express";
import { generateToken, verifyToken } from "../utils/Jwt";
import { RequestAuth } from "../types/ResponseTypes";
import logger from "../logs/logger";
import HandleLogData from "../types/Logs/HandleLogData";

const authMiddleware = (req:RequestAuth, res:Response, next:NextFunction) => {
    try {

        const bearerToken:string = req?.headers?.authorization || ''
        const objectAuth:any[] = bearerToken.split(' ')

        // const token = generateToken({ user: 'fdsf' })

        if((objectAuth[0] || '') !== 'Bearer') throw new Error("Auth method invalid.")

        const token:string | any = objectAuth[1] || ''

        if(!token) throw new Error("No token provided.") 

        const user = verifyToken(token)

        if(!user) throw new Error("Unauthorized")

        req.user = user

        next()

    } catch (error:any) {
        // console.log(error)
        logger.error('Error en middleware de autenticacion.', {
            type: 'auth',
            message: '',
            stack: error?.stack,
            name: error?.name,
            isWithRollBack: false,
            connection: null,
            commitController: false,
            errorRaw: error
        } as HandleLogData)

        return res.status(401).json({ message: error?.message || 'Unauthorized', status: false, data: null })

    }
}

export default authMiddleware