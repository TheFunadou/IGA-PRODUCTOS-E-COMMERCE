import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getCustomerProfile, login as loginService, logout, loginWithGoogle as loginWithGoogleService } from "../services/authServices";
import type { AuthCustomerCredentialsType, CustomerPayloadType } from "../AuthTypes";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { formatAxiosError } from "../../../api/helpers";

type AuthenticationState = {
    authCustomer: CustomerPayloadType | null;
    isAuth: boolean;
    isLoading: boolean;
    error: string | null;
    login: (dto: AuthCustomerCredentialsType) => Promise<void>;
    loginWithGoogle: (id_token: string) => Promise<void>;
    logout: () => Promise<string>;
    getProfile: () => Promise<void>;
    clearError: () => void;
    updateName: (data: { first_name?: string, last_name?: string }) => Promise<void>;
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
                    // Usamos el alias loginService
                    const response = await loginService(data);
                    set({ authCustomer: response.payload, isAuth: true, error: null });
                } catch (error) {
                    set({ authCustomer: null, isAuth: false, error: formatAxiosError(error), });
                }
            },

            loginWithGoogle: async (id_token: string) => {
                try {
                    // Usamos el alias loginWithGoogleService
                    const response = await loginWithGoogleService({ id_token });
                    set({ authCustomer: response.payload, isAuth: true, error: null });
                } catch (error) {
                    set({ authCustomer: null, isAuth: false, error: formatAxiosError(error), });
                }
            },

            logout: async () => {
                try {
                    const response: string = await logout();
                    set({
                        authCustomer: null,
                        isAuth: false,
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
                                isAuth: true,
                                error: ""
                            })
                        }
                    };
                } catch (error) {
                    set({
                        authCustomer: null,
                        isAuth: false,
                        error: ""
                    })
                }
            },
            clearError: async () => {
                set({ error: null })
            },
            updateName: async (data: { first_name?: string, last_name?: string }) => {
                const { authCustomer } = get();
                if (!authCustomer) return;
                set({
                    authCustomer: {
                        ...authCustomer,
                        name: data.first_name ? data.first_name : authCustomer.name,
                        last_name: data.last_name ? data.last_name : authCustomer.last_name
                    }
                })
            }
        }),
        {
            name: AUTH_CUSTOMER_KEY,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                authCustomer: state.authCustomer,
                isAuth: state.isAuth,
            }),
            version: 1,
            migrate: (persistedState: any, _version: number) => {
                if (persistedState.authUser) {
                    delete persistedState.authUser;
                }
                return persistedState as AuthenticationState;
            },
        }
    )
);
