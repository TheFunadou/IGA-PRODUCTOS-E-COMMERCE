import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getCustomerProfile, login, logout } from "../services/authServices";
import type { AuthCustomerCredentialsType, CustomerPayloadType } from "../AuthTypes";
import { getErrorMessage } from "../../../global/GlobalUtils";

type AuthenticationState = {
    authCustomer: CustomerPayloadType | null;
    csrfToken: string | null;
    isAuth: boolean;
    isLoading: boolean;
    error: string | null;
    login: (dto: AuthCustomerCredentialsType) => Promise<void>;
    logout: () => Promise<string>;
    getProfile: () => Promise<void>;
};
export const AUTH_CUSTOMER_KEY = "auth-customer-storage";

export const useAuthStore = create<AuthenticationState>()(
    persist(
        (set, get) => ({
            authCustomer: null,
            isAuth: false,
            isLoading: false,
            error: null,
            csrfToken: null,

            login: async (data: AuthCustomerCredentialsType) => {
                try {
                    const response = await login(data);
                    set({ authCustomer: response.payload, isAuth: true, csrfToken: response.csrfToken });
                } catch (error) {
                    set({ authCustomer: null, isAuth: false, error: getErrorMessage(error), });
                }
            },

            logout: async () => {
                try {
                    const response: string = await logout();
                    set({
                        authCustomer: null,
                        isAuth: false,
                        csrfToken: null,
                    });
                    await localStorage.removeItem(AUTH_CUSTOMER_KEY);
                    return response;
                } catch (error) {
                    set({ error: getErrorMessage(error), });
                    return "Cierre de sesión fallido";
                }
            },

            getProfile: async () => {
                try {
                    if (get().authCustomer === null) {
                        const response = await getCustomerProfile();
                        if (response) {
                            set({
                                authCustomer: response.payload,
                                csrfToken: response.csrfToken,
                                isAuth: true,
                                error: ""
                            })
                        }
                    };
                } catch (error) {
                    set({
                        authCustomer: null,
                        csrfToken: null,
                        isAuth: false,
                        error: ""
                    })
                }
            },

        }),
        {
            name: AUTH_CUSTOMER_KEY,
            storage: createJSONStorage(() => localStorage),
            // ⭐ CRÍTICO: Solo persiste estos campos
            partialize: (state) => ({
                authCustomer: state.authCustomer,
                csrfToken: state.csrfToken,
                isAuth: state.isAuth,
            }),
            version: 1,
            migrate: (persistedState: any, version: number) => {
                // Limpia el campo viejo 'authUser' si existe
                if (persistedState.authUser) {
                    delete persistedState.authUser;
                }
                return persistedState as AuthenticationState;
            },
        }
    )
);
