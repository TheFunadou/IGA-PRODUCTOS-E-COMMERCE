import { useQuery } from "@tanstack/react-query";
import type { GetPaidOrderDetails } from "./types";
import { useAuthStore } from "../auth/states/authStore";
import { getOrderStatusWithDetails } from "./services";

export const usePollingPaymentApprovedDetail = (args: { orderUUID: string }) => {
    const { orderUUID } = args;
    const { authCustomer } = useAuthStore();

    const queryKey = authCustomer
        ? { id: orderUUID, customer: authCustomer.uuid }
        : { id: orderUUID };

    return useQuery<GetPaidOrderDetails>({
        queryKey: ["payment:detail", queryKey],
        queryFn: () => getOrderStatusWithDetails({ orderUUID, requiredStatus: "APPROVED" }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!orderUUID,
        refetchInterval: (query) => {
            const status = query.state.data?.status;

            if (!status) return 3000;              // aún no hay data
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
        queryFn: () => getOrderStatusWithDetails({ orderUUID, requiredStatus: "PENDING" }),
        enabled: !!orderUUID,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchInterval: (query) => {
            const status = query.state.data?.status;

            if (!status) return 3000;              // aún no hay data
            return status === "PENDING" ? false : 3000;
        },
        retry: false,
    });
};

