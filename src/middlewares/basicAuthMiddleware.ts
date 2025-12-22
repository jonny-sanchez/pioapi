// basicAuthMiddleware
import { Request, Response, NextFunction } from "express";
import logger from "../logs/logger";
import HandleLogData from "../types/Logs/HandleLogData";

const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || 'admin';
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS || 'password';

const basicAuthMiddleware = (req:Request, res:Response, next:NextFunction) => {
    try {
        const basicHeader:string = req?.headers?.authorization || ''

        const [type, credentials] = basicHeader.split(' ');

        if(type !== 'Basic') throw new Error("Auth method invalid.")
        if(!credentials) throw new Error("Not credentials send.")

        //{ususario} y {password} del basic header auth
        const [login, password] = Buffer.from(credentials, 'base64').toString('utf-8').split(':')

        if(login !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASS) throw new Error(`Credenciales incorrectas.`);

        return next()

    } catch (error:any) {

        logger.error('Error en middleware de autenticacion basic.', {
            type: 'auth',
            message: '',
            stack: error?.stack,
            name: error?.name,
            isWithRollBack: false,
            connection: null,
            commitController: false,
            errorRaw: error
        } as HandleLogData)
        
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        return res.status(401).json({ message: error?.message || 'Unauthorized', status: false, data: null })
        
    }
}

export default basicAuthMiddleware