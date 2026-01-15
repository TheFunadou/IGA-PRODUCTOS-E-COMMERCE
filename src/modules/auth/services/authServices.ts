import type { AuthCustomerCredentialsType, AuthenticatedCustomerType, NewCustomerType } from "../AuthTypes";
import api from "../../../api/api.config";


export const login = async (credentials: AuthCustomerCredentialsType): Promise<AuthenticatedCustomerType> => {
    const { data } = await api.post<AuthenticatedCustomerType>("/customer-auth/login", credentials);
    return data;
};


export const logout = async () => {
    const { data } = await api.post<string>("/customer-auth/logout", {});
    return data;
};


export const registerCustomer = async (dto: NewCustomerType): Promise<string> => {
    const { data } = await api.post<string>("/customer", dto);
    return data;
};


export const getCustomerProfile = async (): Promise<AuthenticatedCustomerType> => {
    const { data } = await api.get<AuthenticatedCustomerType>("/customer-auth/profile");
    return data;
};
