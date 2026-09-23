import { useQuery } from "@tanstack/react-query";
import type { PaymentDetailsI } from "./types";
import { getPaymentDetails } from "./services";
import { buildKey } from "../../global/GlobalHelpers";

export const paymentQueryKeys = {
    getPaymentDetails: (params: { orderUUID: string, customerUUID?: string }) => buildKey("payment:detail", { params }),
};

export const usePollingPaymentApprovedDetailV2 = (args: { orderUUID: string }) => {
    const { orderUUID } = args;

    return useQuery<PaymentDetailsI>({
        queryKey: [...paymentQueryKeys.getPaymentDetails({ orderUUID }), "approved"],
        queryFn: () => getPaymentDetails({ orderUUID, query: { enablePolling: true, requiredStatus: ["APPROVED", "PENDING_CONFIRMATION"] } }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!orderUUID,
        refetchInterval: (query) => {
            // Si hay error (distinto de 404), paramos. Si es 404, React Query reintentará según la config de 'retry'
            if (query.state.error && (query.state.error as any)?.response?.status !== 404) return false;
            
            const status = query.state.data?.status;
            // Si el estado es PENDING o no hay datos (pero no hay error fatal), seguimos polleando
            if (!status || status === "PENDING" || status === "IN_PROCESS") return 3000;
            
            return status === "APPROVED" ? false : 3000;
        },
        retry: (failureCount, error) => {
            // Reintentamos hasta 5 veces si es un 404 (orden aún no creada)
            if ((error as any)?.response?.status === 404 && failureCount < 5) return true;
            return false;
        },
        retryDelay: 2000,
    });
};

export const usePollingPaymentPendingDetailV2 = (args: { orderUUID: string }) => {
    const { orderUUID } = args;

    return useQuery<PaymentDetailsI>({
        queryKey: [...paymentQueryKeys.getPaymentDetails({ orderUUID }), "pending"],
        queryFn: () => getPaymentDetails({ orderUUID, query: { enablePolling: true, requiredStatus: ["PENDING", "PENDING_CONFIRMATION"] } }),
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
        queryKey: [...paymentQueryKeys.getPaymentDetails({ orderUUID }), "rejected"],
        queryFn: () => getPaymentDetails({ orderUUID, query: { enablePolling: true, requiredStatus: ["REJECTED", "IN_PROCESS", "PENDING_CONFIRMATION"] } }),
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