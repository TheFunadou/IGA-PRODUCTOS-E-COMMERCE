import api from "../../../api/api.config";
import type { CreateOrderType, OrderCreatedType } from "../../orders/OrdersTypes";

export const createProviderOrder = async ({ dto }: { dto: CreateOrderType }): Promise<OrderCreatedType> => {
    const { data } = await api.post<OrderCreatedType>("/orders", dto);
    return data;
};