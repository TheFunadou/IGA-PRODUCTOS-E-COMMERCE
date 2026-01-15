import type { CustomerAddressType, GetCustomerAddressesType, NewAddressType, onToogleFavoriteType, UpdateAddressType } from "../CustomerTypes";
import type { PVCardsResponseType } from "../../products/ProductTypes";
import api from "../../../api/api.config";

export const getCustomerAddressesService = async (params: { page: number, limit: number }): Promise<GetCustomerAddressesType> => {
    const { data } = await api.get<GetCustomerAddressesType>(`/customer-addresses`, { params });
    return data;
};

export const createAddressService = async (args: { data: NewAddressType, csrfToken: string }): Promise<CustomerAddressType> => {
    const { data } = await api.post<CustomerAddressType>(`/customer-addresses`, args.data, { headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return data;
};

export const updateAddressService = async (args: { addressUUID: string, data: UpdateAddressType, csrfToken: string }): Promise<string> => {
    const { data } = await api.patch<string>(`/customer-addresses`, { ...args.data, uuid: args.addressUUID }, { headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return data;
};

export const deleteAddressService = async (args: { addressUUID: string, csrfToken: string }): Promise<string> => {
    const { data } = await api.delete<string>(`/customer-addresses/${args.addressUUID}`, { headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return data;
};

export const getCustomerFavorites = async (params: { page: number, limit: number }): Promise<PVCardsResponseType | null> => {
    const { data } = await api.get<PVCardsResponseType | null>(`/favorites`, { params });
    return data;
};


export const toggleFavoriteService = async (args: { sku: string, csrfToken: string }): Promise<onToogleFavoriteType> => {
    const { data } = await api.post<onToogleFavoriteType>(`/favorites`, { sku: args.sku }, { headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return data;
};