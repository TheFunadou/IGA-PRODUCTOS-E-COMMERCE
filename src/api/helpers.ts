import type { AxiosError } from "axios";
import axios from "axios";

export const formatAxiosError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string | string[]; error?: string }>;

        // Si el backend envió un mensaje de error
        if (axiosError.response?.data?.message) {
            const message = axiosError.response.data.message;

            // Si es un array de mensajes (validación de NestJS)
            if (Array.isArray(message)) {
                return message.join(', ');
            }

            // Si es un string
            return message;
        }

        // Si hay un error genérico del backend
        if (axiosError.response?.data?.error) {
            return axiosError.response.data.error;
        }

        // Mensajes por código de estado
        switch (axiosError.response?.status) {
            case 400:
                return 'Solicitud inválida. Verifica los datos enviados.';
            case 401:
                return 'No autorizado. Por favor inicia sesión.';
            case 403:
                return 'No tienes permisos para realizar esta acción.';
            case 404:
                return 'Recurso no encontrado.';
            case 409:
                return 'Conflicto. El recurso ya existe.';
            case 422:
                return 'Datos no procesables. Verifica la información.';
            case 500:
                return 'Error del servidor. Intenta más tarde.';
            case 503:
                return 'Servicio no disponible. Intenta más tarde.';
            default:
                return axiosError.message || 'Error desconocido';
        }
    }

    // Si es un error genérico de JavaScript
    if (error instanceof Error) {
        return error.message;
    }

    // Fallback
    return 'Ha ocurrido un error inesperado';
};