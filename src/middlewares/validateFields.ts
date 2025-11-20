import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { FilesConfigProps } from "../types/MiddlewareTypes";
import { injectParamsToBody } from "../utils/ParamsInjector";
import { validateFiles } from "../utils/FileValidator";
import { formatErrorResponse } from "../utils/ErrorFormatter";
import logger from "../logs/logger";
import HandleLogData from "../types/Logs/HandleLogData";

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

        logger.error("Error en middleware de validacion de entrada de datos.", {
            type: 'fields',
            message: '',
            stack: error?.stack,
            name: error?.name,
            isWithRollBack: false,
            connection: null,
            commitController: false,
            errorRaw: error
        } as HandleLogData)

        const errorResponse = formatErrorResponse(error);
        return res.status(400).json(errorResponse);
    }
};

export default validateFields