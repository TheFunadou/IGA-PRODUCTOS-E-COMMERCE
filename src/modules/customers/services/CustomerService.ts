import axios from "axios";
import type { CustomerAddressType, NewAddressType, onToogleFavoriteType, UpdateAddressType } from "../CustomerTypes";
import { BASE_URL } from "../../../global/GlobalTypes";
import type { ProductVersionCardType } from "../../products/ProductTypes";


export const getCustomerAddressesService = async (): Promise<CustomerAddressType[]> => {
    const response = await axios.get<CustomerAddressType[]>(`${BASE_URL}/customer/addresses`, { withCredentials: true });
    return response.data;
};

export const createAddressService = async (data: NewAddressType): Promise<CustomerAddressType> => {
    const response = await axios.post<CustomerAddressType>(`${BASE_URL}/customer/addresses`, data, { withCredentials: true });
    return response.data;
};

export const updateAddressService = async (address: string, data: UpdateAddressType): Promise<string> => {
    const response = await axios.put<string>(`${BASE_URL}/customer/addresses/${address}`, data, { withCredentials: true });
    return response.data;
};

export const deleteAddressService = async (address: string): Promise<string> => {
    const response = await axios.delete<string>(`${BASE_URL}/customer/addresses/${address}`, { withCredentials: true });
    return response.data;
};

export const getCustomerFavorites = async (): Promise<ProductVersionCardType[] | null> => {
    const response = await axios.get<ProductVersionCardType[]>(`${BASE_URL}/customer/favorites/all`, { withCredentials: true });
    return response.data;
};


export const toggleFavoriteService = async (sku: string): Promise<onToogleFavoriteType> => {
    const response = await axios.post<onToogleFavoriteType>(`${BASE_URL}/customer/favorites`, { sku }, { withCredentials: true });
    return response.data;
};