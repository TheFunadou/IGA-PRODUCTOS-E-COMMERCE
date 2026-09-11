import type { CheckoutOrderI, CheckoutOrderIV3, CustomerOrdersDashboardInputI, GetCustomerOrdersDashboardI, GetOrdersSummaryI } from "./OrdersTypes";
import api from "../../api/api.config";
import type { LoadShoppingCartI, LoadShoppingCartV3I, ShoppingCartI } from "../shopping/ShoppingTypes";

export const getOrders = async (params: { page: number, limit: number, orderBy: "recent" | "oldest" }) => {
    const { data } = await api.get<GetOrdersSummaryI>(`/orders`, { params })
    return data;
};

export const getOrdersDashboardV3 = async (dto: CustomerOrdersDashboardInputI): Promise<GetCustomerOrdersDashboardI> => {
    const { data } = await api.post<GetCustomerOrdersDashboardI>(`/orders/dashboard-v3`, dto);
    return data;
};

export const getCheckoutOrderV2 = async ({ orderUUID }: { orderUUID: string }): Promise<CheckoutOrderI> => {
    const { data } = await api.get<CheckoutOrderI>(`/orders/checkout/v2/${orderUUID}`);
    return data;
};

export const getCheckoutOrderV3 = async ({ orderUUID }: { orderUUID: string }): Promise<CheckoutOrderIV3> => {
    const { data } = await api.get<CheckoutOrderIV3>(`/orders/checkout/v3/${orderUUID}`);
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

export const getBuyNowItemV3 = async ({ item, destination, city, state }: { item: ShoppingCartI, destination?: string, city?: string, state?: string }): Promise<LoadShoppingCartV3I> => {
    const params: Record<string, string> = {
        sku: item.item.sku,
        productUUID: item.item.productUUID,
        quantity: item.quantity.toString(),
    };
    if (destination) params.destinationPc = destination;
    if (city) params.city = city;
    if (state) params.state = state;
    const { data } = await api.get<LoadShoppingCartV3I>(`/orders/buy-now/v3`, { params });
    return data;
};

export const cancelOrder = async ({ orderUUID, type }: { orderUUID: string, type: "CANCELLED" | "ABANDONED" }): Promise<string> => {
    const { data } = await api.post<string>(`/orders/cancel`, { orderUUID, type });
    return data;
};

export const cancelGuestOrder = async ({ orderUUID }: { orderUUID: string }): Promise<string> => {
    const { data } = await api.post<string>(`/orders/cancel-guest`, { orderUUID });
    return data;
};

export const linkOrderToCustomer = async ({ orderUUID }: { orderUUID: string }): Promise<string> => {
    const { data } = await api.post<string>(`/orders/link-to-customer`, { orderUUID });
    return data;
};

