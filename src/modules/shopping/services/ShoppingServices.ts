import type { ShoppingCartType } from "../ShoppingTypes";
import api from "../../../api/api.config";

export const getShoppingCartService = async (): Promise<ShoppingCartType[] | null> => {
    const { data } = await api.get<ShoppingCartType[]>(`/shopping-cart`);
    return data;
};

export const shoppingCartAddItemService = async (args: { sku: string, quantity: number }): Promise<ShoppingCartType[]> => {
    const { data } = await api.post<ShoppingCartType[]>(`/shopping-cart`, { sku: args.sku, quantity: args.quantity });
    return data;
};

export const shoppingCartClearCartService = async (): Promise<boolean> => {
    const { data } = await api.delete<boolean>(`/shopping-cart`);
    return data;
};

export const shoppingCartUpdateItemQty = async (args: { sku: string, newQuantity: number }): Promise<boolean> => {
    const { data } = await api.patch<boolean>(`/shopping-cart/quantity`, { sku: args.sku, newQuantity: args.newQuantity });
    return data;
};

export const shoppingCartRemoveItemService = async (args: { sku: string }): Promise<boolean> => {
    const { data } = await api.delete<boolean>(`/shopping-cart/${args.sku}`);
    return data;
};

export const shoppingCartToggleCheckService = async (args: { sku: string }): Promise<boolean> => {
    const { data } = await api.put<boolean>(`/shopping-cart/check/toggle`, { sku: args.sku });
    return data;
};

export const shoppingCartCheckAllService = async (): Promise<boolean> => {
    const { data } = await api.put<boolean>(`/shopping-cart/check/all`, {});
    return data;
};
export const shoppingCartUncheckAllService = async (): Promise<boolean> => {
    const { data } = await api.put<boolean>(`/shopping-cart/uncheck/all`, {});
    return data;
};
