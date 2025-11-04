
/**
 * Handle Axios Error
 */

import { AxiosError } from "axios";

const ERROR_MESSAGES = {
    NETWORK: "Error de red: No se recibió respuesta del servidor.",
    UNEXPECTED: "Ocurrió un error inesperado.",
    SERVER: (status: number, message: string) => `Error ${status}: ${message}`
} as const;

export const getErrorMessage = (error: unknown): string => {
    if (!(error instanceof AxiosError)) {
        return ERROR_MESSAGES.UNEXPECTED;
    }

    if (error.response) {
        const { data, status } = error.response;
        let message = error.message;
        
        // Manejar diferentes estructuras de mensaje
        if (data?.message) {
            if (Array.isArray(data.message)) {
                // Múltiples errores de validación: unir con comas
                message = data.message.join(', ');
            } else {
                // Mensaje único
                message = data.message;
            }
        }
        
        return ERROR_MESSAGES.SERVER(status, message);
    }

    return error.request ? ERROR_MESSAGES.NETWORK : ERROR_MESSAGES.UNEXPECTED;
};