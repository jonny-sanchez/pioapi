import { Request, Response, NextFunction } from "express" 

const errorHandlerMiddleware = (err:any, req:Request, res:Response, next:NextFunction) => {
    
    //validar headers
    if(res.headersSent) return next(err)

    //obtener mensaje y si no tiene el stack del error
    const message = err.message || err.stack || "Internal Server Error"

    const status = err.status || 500;

    res.status(status).json({
        message,
        status: false,
        errors: err.errors || [message],
        data: null
    })
}

export default errorHandlerMiddleware