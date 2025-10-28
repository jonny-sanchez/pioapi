/**
 * Interfaz para la respuesta de error estándar
 */
export interface ErrorResponse {
    message: string;
    status: boolean;
    errors: any[];
    data: null;
}

/**
 * Formatea el error para la respuesta HTTP
 * @param error - Error capturado
 * @returns Objeto formateado para respuesta JSON
 */
export const formatErrorResponse = (error: any): ErrorResponse => {
    const errores: any[] = error?.errors || [];
    const textError = errores.join(', ') || 
                     error?.message || 
                     error?.stack || 
                     'Error middleware validate Fields (message not found.)';
    
    return {
        message: textError,
        status: false,
        errors: errores,
        data: null
    };
};

/**
 * Extrae mensajes de error de diferentes tipos de errores
 * @param error - Error a procesar
 * @returns Array de mensajes de error
 */
export const extractErrorMessages = (error: any): string[] => {
    if (error?.errors && Array.isArray(error.errors)) {
        return error.errors;
    }
    
    if (error?.message) {
        return [error.message];
    }
    
    if (typeof error === 'string') {
        return [error];
    }
    
    return ['Error desconocido'];
};

/**
 * Crea una respuesta de error personalizada
 * @param message - Mensaje principal del error
 * @param errors - Array de errores específicos
 * @param statusCode - Código de estado HTTP (opcional)
 * @returns Respuesta de error formateada
 */
export const createErrorResponse = (
    message: string, 
    errors: string[] = [], 
    statusCode: number = 400
): ErrorResponse & { statusCode: number } => {
    return {
        message,
        status: false,
        errors,
        data: null,
        statusCode
    };
};