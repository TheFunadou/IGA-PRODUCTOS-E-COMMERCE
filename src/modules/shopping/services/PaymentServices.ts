import api from "../../../api/api.config";
import type { CreateOrderType, OrderCreatedType } from "../../orders/OrdersTypes";

export const createProviderOrder = async ({ dto, csrfToken }: { dto: CreateOrderType, csrfToken: string }): Promise<OrderCreatedType> => {
    const { data } = await api.post<OrderCreatedType>("/orders", dto, { headers: { "X-CSRF-TOKEN": csrfToken } });
    return data;
};