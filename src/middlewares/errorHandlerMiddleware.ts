import { Request, Response, NextFunction } from "express" 
import logger from "../logs/logger";
import HandleLogData from "../types/Logs/HandleLogData";

const errorHandlerMiddleware = (err:any, req:Request, res:Response, next:NextFunction) => {
    
    //validar headers
    if(res.headersSent) return next(err)

    //obtener mensaje y si no tiene el stack del error
    const message = err.message || err.stack || "Internal Server Error"

    const status = err.status || 500;

    logger.error("", {
        type: 'global',
        message: '',
        stack: err?.stack,
        name: err?.name,
        isWithRollBack: false,
        connection: null,
        commitController: false,
        errorRaw: err
    } as HandleLogData)

    res.status(status).json({
        message,
        status: false,
        errors: err.errors || [message],
        data: null
    })
}

export default errorHandlerMiddleware