import type { GetOrderDetails, GetOrdersType, OrderCheckoutType } from "./OrdersTypes";
import api from "../../api/api.config";

export const getOrders = async (params: { page: number, limit: number, orderBy: "recent" | "oldest" }) => {
    const { data } = await api.get<GetOrdersType>(`/orders`, { params })
    return data;
};

export const getCheckoutOrder = async ({ orderUUID }: { orderUUID: string }): Promise<OrderCheckoutType> => {
    const { data } = await api.get<OrderCheckoutType>(`/orders/checkout/${orderUUID}`);
    return data;
};

export const getOrderDetails = async ({ orderUUID }: { orderUUID: string }): Promise<GetOrderDetails> => {
    const { data } = await api.get<GetOrderDetails>(`/orders/details/${orderUUID}`);
    return data;
};


export const cancelOrder = async ({ orderUUID }: { orderUUID: string }): Promise<string> => {
    const { data } = await api.post<string>(`/orders/cancel/${orderUUID}`);
    return data;
};