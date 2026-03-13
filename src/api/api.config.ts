import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { formatAxiosError } from "./helpers";

const nodeEnv: string = import.meta.env.VITE_NODE_ENV;
if (!nodeEnv) throw new Error("Error al crear la configuracion de axios");

const api = axios.create({
    baseURL: nodeEnv === "production" || nodeEnv === "testing" ? import.meta.env.VITE_BACKEND_URL : "http://localhost:3000",
    timeout: 10000,
    headers: { "Content-Type": "application/json", },
    withCredentials: true
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => { return config; },
    (error: AxiosError) => { return Promise.reject(error); }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            console.error('Error de respuesta:', {
                status: error.response.status,
                data: error.response.data,
                message: formatAxiosError(error)
            });

            if (error.response.status === 401) {
                localStorage.removeItem("auth-customer-storage");
                window.location.href = '/iniciar-sesion';
            }
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor');
        } else {
            console.error('Error al configurar la petición:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;