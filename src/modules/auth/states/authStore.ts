import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getCustomerProfileService, loginService, logoutService } from "../services/authServices";
import type { AuthCustomerCredentialsType, AuthCustomerType } from "../AuthTypes";
import { getErrorMessage } from "../../../global/GlobalUtils";
import type { ProductVersionCardType } from "../../products/ProductTypes";
import { getCustomerFavorites } from "../../customers/services/CustomerService";

type AuthState = {
    authCustomer: AuthCustomerType | null;
    favorites: ProductVersionCardType[] | null,
    isAuth: boolean;
    isLoading: boolean;
    error: string;
    login: (dto: AuthCustomerCredentialsType) => Promise<void>;
    getFavorites: () => Promise<void>;
    logout: () => Promise<string>;
    getProfile: () => Promise<void>;

};

export const AUTH_CUSTOMER_KEY = "auth-customer-storage";

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            authCustomer: null,
            isAuth: false,
            isLoading: false,
            error: "",
            favorites: null,

            login: async (data: AuthCustomerCredentialsType) => {
                try {
                    const response: AuthCustomerType = await loginService(data);
                    set({
                        authCustomer: response,
                        isAuth: true,
                        error: "",
                    });
                } catch (error) {
                    set({
                        authCustomer: null,
                        isAuth: false,
                        error: getErrorMessage(error),
                    });
                }
            },

            logout: async () => {
                try {
                    const response: string = await logoutService();
                    set({
                        authCustomer: null,
                        isAuth: false,
                        error: "",
                    });
                    await localStorage.removeItem(AUTH_CUSTOMER_KEY);
                    return response;
                } catch (error) {
                    set({
                        error: getErrorMessage(error),
                    });
                    return "Cierre de sesión fallido";
                }
            },

            getProfile: async () => {
                try {
                    if (get().authCustomer === null) {
                        console.log("La información del usuario es nula")
                        const customer: AuthCustomerType | null = await getCustomerProfileService();
                        console.log("información del cliente obtenida: ", customer);
                        if (customer) {
                            set({
                                authCustomer: customer,
                                isAuth: true,
                                error: ""
                            })
                        }
                    };

                    console.log("La información del cliente ya esta cargada")
                } catch (error) {
                    console.log("La información del usuario no se pudo recuperar o el cliente no esta autenticado");
                    set({
                        authCustomer: null,
                        isAuth: false,
                        error: ""
                    })
                }
            },
            getFavorites: async () => {
                try {
                    set({ isLoading: true });
                    const favorites: ProductVersionCardType[] | null = await getCustomerFavorites();
                    console.log("Informacion obtenida: ", favorites);
                    if (favorites) set({ favorites });
                } catch (error) {
                    console.error("Error al obtener los favoritos del cliente", error);
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: AUTH_CUSTOMER_KEY,
            storage: createJSONStorage(() => localStorage),
            // ⭐ CRÍTICO: Solo persiste estos campos
            partialize: (state) => ({
                authCustomer: state.authCustomer,
                isAuth: state.isAuth,
                favorites: state.favorites,
            }),
            version: 1,
            migrate: (persistedState: any, version: number) => {
                // Limpia el campo viejo 'authUser' si existe
                if (persistedState.authUser) {
                    delete persistedState.authUser;
                }
                return persistedState as AuthState;
            },
        }
    )
);
