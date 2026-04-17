import api from "../../../api/api.config";
import type { LoadShoppingCartI, SetItemDTO, ShoppingCartI } from "../ShoppingTypes";

export const getShoppingCart = async (): Promise<ShoppingCartI[]> => {
    const { data } = await api.get<ShoppingCartI[]>(`/shopping-cart/v2`);
    return data;
};

export const setItem = async ({ item }: { item: SetItemDTO }): Promise<ShoppingCartI[]> => {
    const { data } = await api.post<ShoppingCartI[]>(`/shopping-cart/v2/item`, item);
    return data;
};

export const clearCart = async (): Promise<ShoppingCartI[]> => {
    const { data } = await api.delete<ShoppingCartI[]>(`/shopping-cart/v2/clear-cart`);
    return data;
};


export const removeItem = async ({ sku }: { sku: string }): Promise<ShoppingCartI[]> => {
    const { data } = await api.delete<ShoppingCartI[]>(`/shopping-cart/v2/${sku}`);
    return data;
};

export const toggleCheck = async ({ sku }: { sku: string }): Promise<ShoppingCartI[]> => {
    const { data } = await api.put<ShoppingCartI[]>(`/shopping-cart/v2/check/toggle`, { sku });
    return data;
};

export const checkAll = async (): Promise<ShoppingCartI[]> => {
    const { data } = await api.put<ShoppingCartI[]>(`/shopping-cart/v2/check/all`, {});
    return data;
};
export const uncheckAll = async (): Promise<ShoppingCartI[]> => {
    const { data } = await api.put<ShoppingCartI[]>(`/shopping-cart/v2/uncheck/all`, {});
    return data;
};

export const createShoppingCart = async (): Promise<ShoppingCartI[]> => {
    const { data } = await api.post<ShoppingCartI[]>(`/shopping-cart/v2`, {});
    return data;
};

export const mergeShoppingCart = async (): Promise<ShoppingCartI[]> => {
    const { data } = await api.post<ShoppingCartI[]>(`/shopping-cart/v2/merge`, {});
    return data;
};

export const saveShoppingCart = async (): Promise<ShoppingCartI[]> => {
    const { data } = await api.post<ShoppingCartI[]>(`/shopping-cart/v2/save`, {});
    return data;
};


export const loadShoppingCart = async (): Promise<LoadShoppingCartI> => {
    const { data } = await api.get<LoadShoppingCartI>(`/shopping-cart/v2/load`);
    return data;
};