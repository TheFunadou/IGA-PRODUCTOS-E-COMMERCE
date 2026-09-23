import api from "../../api/api.config";
import type { PaymentDetailsExtendedI, PaymentDetailsExtendedV3I } from "../orders/OrdersTypes";
import type { GetPaymentDetailsQueryDTO, PaymentDetailsI } from "./types";

export const getPaymentDetails = async (args: { orderUUID: string, query: GetPaymentDetailsQueryDTO }) => {
    const { query, orderUUID } = args;
    const params = new URLSearchParams();
    params.append('enablePolling', String(query.enablePolling));
    if (query.requiredStatus && query.requiredStatus.length > 0) {
        params.append('requiredStatus', query.requiredStatus.join(','));
    }
    const { data } = await api.get<PaymentDetailsI>(
        `/payment/details/${orderUUID}?${params.toString()}`
    );
    return data;
};


export const getPaymentDetailsExtended = async ({ orderUUID }: { orderUUID: string }): Promise<PaymentDetailsExtendedI> => {
    const { data } = await api.get<PaymentDetailsExtendedI>(`/payment/details/client/extended/${orderUUID}?enablePolling=false`);
    return data;
};

export const getPaymentDetailsExtendedV3 = async ({ orderUUID }: { orderUUID: string }): Promise<PaymentDetailsExtendedV3I> => {
    const { data } = await api.get<PaymentDetailsExtendedV3I>(`/payment/details/client/extended-v3/${orderUUID}?enablePolling=false`);
    return data;
};
