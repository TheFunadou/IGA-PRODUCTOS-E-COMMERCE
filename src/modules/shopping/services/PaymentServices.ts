import api from "../../../api/api.config";
import type { CreateOrderI, CreateOrderType, OrderCreatedType } from "../../orders/OrdersTypes";

export const createProviderOrder = async ({ dto }: { dto: CreateOrderType }): Promise<OrderCreatedType> => {
    const { data } = await api.post<OrderCreatedType>("/orders", dto);
    return data;
};


export const createProviderOrderV2 = async ({ dto }: { dto: CreateOrderI }): Promise<OrderCreatedType> => {
    const { data } = await api.post<OrderCreatedType>("/orders/v2", dto);
    return data;
};