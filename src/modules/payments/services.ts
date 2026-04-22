import api from "../../api/api.config";
import type { OrderStatusType } from "../shopping/ShoppingTypes";
import type { GetPaidOrderDetails, GetPaymentDetailsQueryDTO, PaymentDetailsI } from "./types";

export const getOrderStatusWithDetails = async (args: { orderUUID: string, requiredStatus: OrderStatusType[] }) => {
    const { requiredStatus, orderUUID } = args;
    const queryString = requiredStatus.map(status => `status=${status}`).join('&');
    const { data } = await api.get<GetPaidOrderDetails>(
        `/payment/order/status/${orderUUID}?${queryString}`
    );
    return data;
};

export const getPaymentDetails = async (args: { orderUUID: string, query: GetPaymentDetailsQueryDTO }) => {
    const { query, orderUUID } = args;
    const params = new URLSearchParams();
    params.append('enablePolling', String(query.enablePolling));
    if (query.requiredStatus && query.requiredStatus.length > 0) {
        params.append('requiredStatus', query.requiredStatus.join(','));
    }
    const { data } = await api.get<PaymentDetailsI>(
        `/payment/order/details/${orderUUID}?${params.toString()}`
    );
    return data;
};
