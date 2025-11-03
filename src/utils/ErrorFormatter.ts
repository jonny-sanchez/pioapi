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
