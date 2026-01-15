import type { ShoppingCartType } from "../ShoppingTypes";
import api from "../../../api/api.config";

export const getShoppingCartService = async (): Promise<ShoppingCartType[] | null> => {
    const response = await api.get<ShoppingCartType[]>(`/shopping-cart`, { withCredentials: true });
    return response.data;
};

export const shoppingCartAddItemService = async (args: { item: ShoppingCartType, csrfToken: string }): Promise<boolean> => {
    const response = await api.post<boolean>(`/shopping-cart`, args.item, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return response.data;
};

export const shoppingCartClearCartService = async (args: { csrfToken: string }): Promise<boolean> => {
    const response = await api.delete<boolean>(`/shopping-cart`, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return response.data;
};

export const shoppingCartUpdateItemQty = async (args: { sku: string, newQuantity: number, csrfToken: string }): Promise<boolean> => {
    const response = await api.patch<boolean>(`/shopping-cart/quantity`, { sku: args.sku, newQuantity: args.newQuantity }, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return response.data;
};

export const shoppingCartRemoveItemService = async (args: { sku: string, csrfToken: string }): Promise<boolean> => {
    const response = await api.delete<boolean>(`/shopping-cart/${args.sku}`, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return response.data;
};

export const shoppingCartToggleCheckService = async (args: { sku: string, csrfToken: string }): Promise<boolean> => {
    const response = await api.put<boolean>(`/shopping-cart/check/toggle`, { sku: args.sku }, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return response.data;
};

export const shoppingCartCheckAllService = async (args: { csrfToken: string }): Promise<boolean> => {
    const response = await api.put<boolean>(`/shopping-cart/check/all`, {}, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return response.data;
};
export const shoppingCartUncheckAllService = async (args: { csrfToken: string }): Promise<boolean> => {
    const response = await api.put<boolean>(`/shopping-cart/uncheck/all`, {}, { withCredentials: true, headers: { "X-CSRF-TOKEN": args.csrfToken } });
    return response.data;
};
