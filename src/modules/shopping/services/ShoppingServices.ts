import type { ShoppingCartType } from "../ShoppingTypes";
import api from "../../../api/api.config";

export const getShoppingCartService = async (): Promise<ShoppingCartType[] | null> => {
    const { data } = await api.get<ShoppingCartType[]>(`/shopping-cart`, { withCredentials: true });
    return data;
};

export const shoppingCartAddItemService = async (args: { sku: string, quantity: number, csrfToken: string }): Promise<ShoppingCartType[]> => {
    const { data } = await api.post<ShoppingCartType[]>(`/shopping-cart`, { sku: args.sku, quantity: args.quantity }, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return data;
};

export const shoppingCartClearCartService = async (args: { csrfToken: string }): Promise<boolean> => {
    const { data } = await api.delete<boolean>(`/shopping-cart`, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return data;
};

export const shoppingCartUpdateItemQty = async (args: { sku: string, newQuantity: number, csrfToken: string }): Promise<boolean> => {
    const { data } = await api.patch<boolean>(`/shopping-cart/quantity`, { sku: args.sku, newQuantity: args.newQuantity }, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return data;
};

export const shoppingCartRemoveItemService = async (args: { sku: string, csrfToken: string }): Promise<boolean> => {
    const { data } = await api.delete<boolean>(`/shopping-cart/${args.sku}`, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return data;
};

export const shoppingCartToggleCheckService = async (args: { sku: string, csrfToken: string }): Promise<boolean> => {
    const { data } = await api.put<boolean>(`/shopping-cart/check/toggle`, { sku: args.sku }, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return data;
};

export const shoppingCartCheckAllService = async (args: { csrfToken: string }): Promise<boolean> => {
    const { data } = await api.put<boolean>(`/shopping-cart/check/all`, {}, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return data;
};
export const shoppingCartUncheckAllService = async (args: { csrfToken: string }): Promise<boolean> => {
    const { data } = await api.put<boolean>(`/shopping-cart/uncheck/all`, {}, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return data;
};
