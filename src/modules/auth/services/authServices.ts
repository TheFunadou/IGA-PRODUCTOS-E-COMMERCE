import axios from "axios";
import type { AuthCustomerCredentialsType, AuthCustomerType, NewCustomerType } from "../AuthTypes";
import { BASE_URL } from "../../../global/GlobalTypes";


export const loginService = async (dto: AuthCustomerCredentialsType): Promise<AuthCustomerType> => {
    const response = await axios.post<AuthCustomerType>(`${BASE_URL}/customer/login`, dto, { withCredentials: true });
    return response.data;
};

export const logoutService = async () => {
    const response = await axios.post<string>(`${BASE_URL}/customer/logout`, {}, { withCredentials: true });
    return response.data;
};

export const createCustomerService = async (data: NewCustomerType): Promise<string> => {
    const response = await axios.post<string>(`${BASE_URL}/customer`, data);
    return response.data;
};

export const getCustomerProfileService = async (): Promise<AuthCustomerType> => {
    const response = await axios.get<AuthCustomerType>(`${BASE_URL}/customer`,{withCredentials:true});
    return response.data;
}