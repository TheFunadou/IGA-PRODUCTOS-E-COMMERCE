import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { formatAxiosError, getCookie } from "./helpers";

// ── Constantes ───────────────────────────────────────────────────────────────
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'x-csrf-token';
const AUTH_STORAGE_KEY = 'auth-customer-storage';

const nodeEnv = import.meta.env.VITE_NODE_ENV;
if (!nodeEnv) throw new Error("VITE_NODE_ENV no está definido");

const baseURL =
    nodeEnv === 'production' || nodeEnv === 'testing'
        ? import.meta.env.VITE_BACKEND_URL
        : 'http://localhost:3000';

if (!baseURL) throw new Error("VITE_BACKEND_URL no está definido en este entorno");

const handleUnauthenticated = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Evita redirigir si ya estás en login (previene loops)
    if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
    }
};

const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const method = config.method?.toUpperCase() ?? '';

        if (!SAFE_METHODS.includes(method)) {
            const csrf = getCookie(CSRF_COOKIE);
            if (csrf) {
                config.headers[CSRF_HEADER] = csrf;
            } else {
                if (nodeEnv === 'development') {
                    console.warn(`[axios] CSRF token no encontrado para ${method} ${config.url}`);
                }
            }
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            const { status, data } = error.response;

            if (nodeEnv === 'development') {
                console.error('[axios] Error de respuesta:', {
                    status,
                    data,
                    message: formatAxiosError(error),
                });
            }

            switch (status) {
                case 401:
                    handleUnauthenticated();
                    break;
                case 403: {
                    const responseData = data as { message?: string };
                    const isCsrfError = responseData?.message?.toLowerCase().includes('csrf');

                    if (isCsrfError) {
                        if (nodeEnv === 'development') {
                            console.warn('[axios] 403 CSRF expirado — recargando sesión');
                        }
                        window.location.reload();
                    }
                    break;
                }
                case 503:
                    if (nodeEnv === 'development') {
                        console.error('[axios] Servicio no disponible');
                    }
                    break;
            }
        } else if (error.request) {
            if (nodeEnv === 'development') {
                console.error('[axios] Sin respuesta del servidor — verifica la conexión');
            }
        } else {
            if (nodeEnv === 'development') {
                console.error('[axios] Error al configurar la petición:', error.message);
            }
        }

        return Promise.reject(error);
    }
);

export default api;