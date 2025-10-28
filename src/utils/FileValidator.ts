import { Request } from "express";
import { FilesConfigProps } from "../types/MiddlewareTypes";
import { BYTE } from "./FilesHelpers";

/**
 * Valida si un archivo cumple con las restricciones de tipo MIME
 * @param file - Archivo a validar
 * @param allowedTypes - Tipos permitidos ('image', 'pdf', etc.)
 * @param fileName - Nombre del archivo para mensajes de error
 */
export const validateFileType = (file: any, allowedTypes: string[], fileName: string): void => {
    if (!allowedTypes || allowedTypes.length === 0) return;

    const mime = file.mimetype;
    const isImage = mime.startsWith("image/");
    const isPdf = mime === "application/pdf";

    const isValidType = (allowedTypes.includes("image") && isImage) || 
                       (allowedTypes.includes("pdf") && isPdf);

    if (!isValidType) {
        throw new Error(`El archivo [${fileName}] tiene un formato no permitido. Solo se aceptan: ${allowedTypes.join(', ')}.`);
    }
};

/**
 * Valida el tamaño de un archivo individual
 * @param file - Archivo a validar
 * @param config - Configuración con minSize y maxSize
 */
export const validateFileSize = (file: any, config: Pick<FilesConfigProps, 'minSize' | 'maxSize'>): void => {
    const { minSize, maxSize } = config;
    const fileName = file.name;

    if (minSize && file.size < BYTE(minSize)) {
        throw new Error(`El archivo [${fileName}] es muy pequeño. Tamaño mínimo: ${minSize} MB.`);
    }

    if (maxSize && file.size > BYTE(maxSize)) {
        throw new Error(`El archivo [${fileName}] es demasiado grande. Tamaño máximo: ${maxSize} MB.`);
    }
};

/**
 * Valida la cantidad de archivos según configuración
 * @param files - Array de archivos
 * @param config - Configuración con minFiles y maxFiles
 */
export const validateFileCount = (files: any[], config: Pick<FilesConfigProps, 'minFiles' | 'maxFiles'>): void => {
    const { minFiles, maxFiles } = config;

    if (minFiles && files.length < minFiles) {
        throw new Error(`Debes subir al menos ${minFiles} archivo(s). Subidos: ${files.length}.`);
    }

    if (maxFiles && files.length > maxFiles) {
        throw new Error(`Solo puedes subir un máximo de ${maxFiles} archivo(s). Intentaste subir: ${files.length}.`);
    }
};

/**
 * Obtiene los archivos de la request de forma normalizada
 * @param req - Request object
 * @param fieldName - Nombre del campo de formulario
 * @returns Array de archivos (puede estar vacío)
 */
export const getFilesFromRequest = (req: Request, fieldName: string): any[] => {
    const fileEntry = (req?.files ?? {})[fieldName] ?? null;
    return Array.isArray(fileEntry) ? fileEntry : fileEntry ? [fileEntry] : [];
};

/**
 * Valida un conjunto de archivos según la configuración completa
 * @param req - Request object
 * @param config - Configuración completa del archivo
 */
export const validateFileConfig = (req: Request, config: FilesConfigProps): void => {
    const { nameFormData, required = false } = config;
    const files = getFilesFromRequest(req, nameFormData);
    const hasFiles = files.length > 0;

    // Validar si el campo es requerido
    if (required && !hasFiles) {
        throw new Error(`El campo [${nameFormData}] es obligatorio.`);
    }

    // Si no es requerido y no hay archivos, salir
    if (!required && !hasFiles) return;

    // Validar cantidad de archivos
    validateFileCount(files, config);

    // Validar cada archivo individualmente
    files.forEach((file) => {
        validateFileSize(file, config);
        validateFileType(file, config.allowedTypes || [], file.name);
    });
};

/**
 * Valida todos los archivos según las configuraciones proporcionadas
 * @param req - Request object
 * @param configFiles - Array de configuraciones de archivos
 */
export const validateFiles = (req: Request, configFiles: FilesConfigProps[]): void => {
    configFiles.forEach(config => validateFileConfig(req, config));
};