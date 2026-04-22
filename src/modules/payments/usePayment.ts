import { useQuery } from "@tanstack/react-query";
import type { GetPaidOrderDetails, PaymentDetailsI } from "./types";
import { useAuthStore } from "../auth/states/authStore";
import { getOrderStatusWithDetails, getPaymentDetails } from "./services";
import { buildKey } from "../../global/GlobalHelpers";

export const paymentQueryKeys = {
    getPaymentDetails: (params: { orderUUID: string, customerUUID?: string }) => buildKey("payment:detail", { params }),
};

export const usePollingPaymentApprovedDetail = (args: { orderUUID: string }) => {
    const { orderUUID } = args;
    const { authCustomer } = useAuthStore();

    const queryKey = authCustomer
        ? { id: orderUUID, customer: authCustomer.uuid }
        : { id: orderUUID };

    return useQuery<GetPaidOrderDetails>({
        queryKey: ["payment:detail", queryKey],
        queryFn: () => getOrderStatusWithDetails({ orderUUID, requiredStatus: ["APPROVED"] }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!orderUUID,
        refetchInterval: (query) => {
            if (query.state.error) return false;
            const status = query.state.data?.status;
            if (!status) return 3000;
            return status === "APPROVED" ? false : 3000;
        },
        retry: false,
    });
};

export const usePollingPaymentPendingDetail = (args: { orderUUID: string }) => {
    const { orderUUID } = args;
    const { authCustomer } = useAuthStore();

    const queryKey = authCustomer
        ? { id: orderUUID, customer: authCustomer.uuid }
        : { id: orderUUID };

    return useQuery<GetPaidOrderDetails>({
        queryKey: ["payment:pending-detail", queryKey],
        queryFn: () => getOrderStatusWithDetails({ orderUUID, requiredStatus: ["PENDING"] }),
        enabled: !!orderUUID,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchInterval: (query) => {
            if (query.state.error) return false;
            const status = query.state.data?.status;
            if (!status) return 3000;
            return (status === "PENDING" || status === "APPROVED") ? false : 3000;
        },

        retry: false,
    });
};

export const usePollingPaymentRejected = (args: { orderUUID: string }) => {
    const { orderUUID } = args;
    const { authCustomer } = useAuthStore();

    const queryKey = authCustomer
        ? { id: orderUUID, customer: authCustomer.uuid }
        : { id: orderUUID };

    return useQuery<GetPaidOrderDetails>({
        queryKey: ["payment:pending-detail", queryKey],
        queryFn: () => getOrderStatusWithDetails({ orderUUID, requiredStatus: ["REJECTED", "IN_PROCESS"] }),
        enabled: !!orderUUID,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchInterval: (query) => {
            if (query.state.error) return false;

            const status = query.state.data?.status;
            if (!status) return 3000;
            return (status === "IN_PROCESS" || status === "REJECTED") ? false : 3000;
        },
        retry: false,
    });
};


export const usePollingPaymentApprovedDetailV2 = (args: { orderUUID: string }) => {
    const { orderUUID } = args;

    return useQuery<PaymentDetailsI>({
        queryKey: paymentQueryKeys.getPaymentDetails({ orderUUID }),
        queryFn: () => getPaymentDetails({ orderUUID, query: { enablePolling: true, requiredStatus: ["APPROVED"] } }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!orderUUID,
        refetchInterval: (query) => {
            if (query.state.error) return false;
            const status = query.state.data?.status;
            if (!status) return 3000;
            return status === "APPROVED" ? false : 3000;
        },
        retry: false,
    });
};

export const usePollingPaymentPendingDetailV2 = (args: { orderUUID: string }) => {
    const { orderUUID } = args;

    return useQuery<PaymentDetailsI>({
        queryKey: paymentQueryKeys.getPaymentDetails({ orderUUID }),
        queryFn: () => getPaymentDetails({ orderUUID, query: { enablePolling: true, requiredStatus: ["PENDING"] } }),
        enabled: !!orderUUID,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchInterval: (query) => {
            if (query.state.error) return false;
            const status = query.state.data?.status;
            if (!status) return 3000;
            return (status === "PENDING" || status === "APPROVED") ? false : 3000;
        },

        retry: false,
    });
};

export const usePollingPaymentRejectedV2 = (args: { orderUUID: string }) => {
    const { orderUUID } = args;

    return useQuery<PaymentDetailsI>({
        queryKey: paymentQueryKeys.getPaymentDetails({ orderUUID }),
        queryFn: () => getPaymentDetails({ orderUUID, query: { enablePolling: true, requiredStatus: ["REJECTED", "IN_PROCESS"] } }),
        enabled: !!orderUUID,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchInterval: (query) => {
            if (query.state.error) return false;

            const status = query.state.data?.status;
            if (!status) return 3000;
            return (status === "IN_PROCESS" || status === "REJECTED") ? false : 3000;
        },
        retry: false,
    });
};