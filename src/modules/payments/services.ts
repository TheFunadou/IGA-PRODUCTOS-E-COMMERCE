import api from "../../api/api.config";
import type { OrderStatusType } from "../shopping/ShoppingTypes";
import type { GetPaidOrderDetails, PaymentDetailsI } from "./types";

export const getOrderStatusWithDetails = async (args: { orderUUID: string, requiredStatus: OrderStatusType[] }) => {
    const { requiredStatus, orderUUID } = args;
    const queryString = requiredStatus.map(status => `status=${status}`).join('&');
    const { data } = await api.get<GetPaidOrderDetails>(
        `/payment/order/status/${orderUUID}?${queryString}`
    );
    return data;
};

export const getPaymentDetails = async (args: { orderUUID: string, requiredStatus: OrderStatusType[] }) => {
    const { requiredStatus, orderUUID } = args;
    const queryString = requiredStatus.map(status => `status=${status}`).join('&');
    const { data } = await api.get<PaymentDetailsI>(
        `/payment/order/details/${orderUUID}?${queryString}`
    );
    return data;
};