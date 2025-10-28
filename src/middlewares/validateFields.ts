import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { FilesConfigProps } from "../types/MiddlewareTypes";
import { injectParamsToBody } from "../utils/ParamsInjector";
import { validateFiles } from "../utils/FileValidator";
import { formatErrorResponse } from "../utils/ErrorFormatter";

/**
 * Middleware principal para validar campos DTO y archivos
 */
const validateFields = (
    dto: yup.AnySchema, 
    configFiles: FilesConfigProps[] | null = null, 
    injectParams: boolean = false
) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Inyectar params en el body si está habilitado
        if (injectParams) {
            injectParamsToBody(req);
        }

        // Validar campos del DTO
        await dto.validate(req.body, { abortEarly: false });

        // Validar archivos si hay configuración
        if (configFiles) {
            validateFiles(req, configFiles);
        }

        next();
    } catch (error: any) {
        const errorResponse = formatErrorResponse(error);
        return res.status(400).json(errorResponse);
    }
};

export default validateFields