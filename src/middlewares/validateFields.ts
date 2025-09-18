import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

const validateFields = (dto:yup.AnySchema) => async(req:Request, res:Response, next:NextFunction) =>{
    try {
        await dto.validate(req.body, { abortEarly: false })
        next()
    } catch (error:any) {
        // console.log(error)
        const errores:any[] = error?.errors || []
        const textError = errores.join(', ')
        return res.status(400).json({ message: textError, status: false, errors: errores, data: null })
    }
}

export default validateFields