import type { CheckoutOrderI, GetOrderDetails, GetOrdersSummaryI, OrderCheckoutType } from "./OrdersTypes";
import api from "../../api/api.config";
import type { LoadShoppingCartI, ShoppingCartI } from "../shopping/ShoppingTypes";

export const getOrders = async (params: { page: number, limit: number, orderBy: "recent" | "oldest" }) => {
    const { data } = await api.get<GetOrdersSummaryI>(`/orders`, { params })
    return data;
};

export const getCheckoutOrder = async ({ orderUUID }: { orderUUID: string }): Promise<OrderCheckoutType> => {
    const { data } = await api.get<OrderCheckoutType>(`/orders/checkout/${orderUUID}`);
    return data;
};

export const getCheckoutOrderV2 = async ({ orderUUID }: { orderUUID: string }): Promise<CheckoutOrderI> => {
    const { data } = await api.get<CheckoutOrderI>(`/orders/checkout/v2/${orderUUID}`);
    return data;
};


export const getOrderDetails = async ({ orderUUID }: { orderUUID: string }): Promise<GetOrderDetails> => {
    const { data } = await api.get<GetOrderDetails>(`/orders/details/${orderUUID}`);
    return data;
};

export const getBuyNowItem = async ({ item }: { item: ShoppingCartI }): Promise<LoadShoppingCartI> => {
    const { data } = await api.get<LoadShoppingCartI>(`/orders/buy-now`, {
        params: {
            sku: item.item.sku,
            productUUID: item.item.productUUID,
            quantity: item.quantity,
        }
    });
    return data;
};

export const cancelOrder = async ({ orderUUID, type }: { orderUUID: string, type: "CANCELLED" | "ABANDONED" }): Promise<string> => {
    const { data } = await api.post<string>(`/orders/cancel`, { orderUUID, type });
    return data;
};

export const linkOrderToCustomer = async ({ orderUUID }: { orderUUID: string }): Promise<string> => {
    const { data } = await api.post<string>(`/orders/link-to-customer`, { orderUUID });
    return data;
};

