import axios from "axios";
import type { ShoppingCartType } from "../ShoppingTypes";
import { BASE_URL } from "../../../global/GlobalTypes";

export const getShoppingCartService = async (): Promise<ShoppingCartType[] | null> => {
    const response = await axios.get<ShoppingCartType[]>(`${BASE_URL}/shopping-cart`, { withCredentials: true });
    return response.data;
};

export const syncShoppingCartService = async (items: ShoppingCartType[]): Promise<ShoppingCartType[]> => {
    const response = await axios.put<ShoppingCartType[]>(`${BASE_URL}/shopping-cart/sync`, items, { withCredentials: true });
    return response.data;
};

export const updateItemQty = async (values: { sku: string, newQuantity: number }): Promise<ShoppingCartType[]> => {
    const response = await axios.put<ShoppingCartType[]>(`${BASE_URL}/shopping-cart/quantity`, values, { withCredentials: true });
    return response.data;
};

export const addItemService = async (product: ShoppingCartType): Promise<ShoppingCartType[]> => {
    const response = await axios.post<ShoppingCartType[]>(`${BASE_URL}/shopping-cart`, product, { withCredentials: true });
    return response.data;
};

export const tooggleCheckService = async (sku: string): Promise<ShoppingCartType[]> => {
    const response = await axios.put<ShoppingCartType[]>(`${BASE_URL}/shopping-cart/check/toggle`, { sku }, { withCredentials: true });
    return response.data;
};

export const checkAllService = async (): Promise<ShoppingCartType[]> => {
    const response = await axios.put<ShoppingCartType[]>(`${BASE_URL}/shopping-cart/check/all`, {}, { withCredentials: true });
    return response.data;
};
export const uncheckAllService = async (): Promise<ShoppingCartType[]> => {
    const response = await axios.put<ShoppingCartType[]>(`${BASE_URL}/shopping-cart/uncheck/all`, {}, { withCredentials: true });
    return response.data;
};

export const removeItemService = async (sku: string): Promise<ShoppingCartType[]> => {
    const response = await axios.delete<ShoppingCartType[]>(`${BASE_URL}/shopping-cart/${sku}`, { withCredentials: true });
    return response.data;
};

export const clearCartService = async (): Promise<boolean> => {
    const response = await axios.delete<boolean>(`${BASE_URL}/shopping-cart`, { withCredentials: true });
    return response.data;
};




export const shoppingCartUpdateItemQty = async (values: { sku: string, newQuantity: number }): Promise<boolean> => {
    const response = await axios.put<boolean>(`${BASE_URL}/shopping-cart/item/quantity`, values, { withCredentials: true });
    return response.data;
};

export const shoppingCartAddItemService = async (item: ShoppingCartType): Promise<boolean> => {
    const response = await axios.post<boolean>(`${BASE_URL}/shopping-cart/item/add`, item, { withCredentials: true });
    return response.data;
};

export const shoppingCartToggleCheckService = async (sku: string): Promise<boolean> => {
    const response = await axios.put<boolean>(`${BASE_URL}/shopping-cart/item/check/toggle`, { sku }, { withCredentials: true });
    return response.data;
};

export const shoppingCartCheckAllService = async (): Promise<boolean> => {
    const response = await axios.put<boolean>(`${BASE_URL}/shopping-cart/item/check/all`, {}, { withCredentials: true });
    return response.data;
};
export const shoppingCartUncheckAllService = async (): Promise<boolean> => {
    const response = await axios.put<boolean>(`${BASE_URL}/shopping-cart/item/uncheck/all`, {}, { withCredentials: true });
    return response.data;
};

export const shoppingCartRemoveItemService = async (sku: string): Promise<boolean> => {
    const response = await axios.delete<boolean>(`${BASE_URL}/shopping-cart/item/${sku}`, { withCredentials: true });
    return response.data;
};

export const shoppingCartClearCartService = async (): Promise<boolean> => {
    const response = await axios.delete<boolean>(`${BASE_URL}/shopping-cart/clear`, { withCredentials: true });
    return response.data;
};
