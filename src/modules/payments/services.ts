import api from "../../api/api.config";
import type { OrderStatusType } from "../shopping/ShoppingTypes";
import type { GetPaidOrderDetails } from "./types";

export const getOrderStatusWithDetails = async (args: { orderUUID: string, requiredStatus: OrderStatusType[] }) => {
    const { requiredStatus, orderUUID } = args;
    const queryString = requiredStatus.map(status => `status=${status}`).join('&');
    const { data } = await api.get<GetPaidOrderDetails>(
        `/payment/order/status/${orderUUID}?${queryString}`
    );
    return data;
};