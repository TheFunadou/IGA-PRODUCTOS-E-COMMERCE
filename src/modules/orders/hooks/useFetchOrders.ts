

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelOrder, getCheckoutOrder, getOrderDetails, getOrders } from "../../orders/OrdersServices";
import type { GetOrderDetails, GetOrdersType, OrderCheckoutType } from "../OrdersTypes";
import { useAuthStore } from "../../auth/states/authStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";


export const useFetchOrders = (params: { pagination: { page: number, limit: number }, orderBy: "recent" | "oldest" }) => {
    const { authCustomer } = useAuthStore();
    return useQuery<GetOrdersType>({
        queryKey: ["orders", {
            customer: authCustomer?.uuid,
            page: params.pagination.page,
            limit: params.pagination.limit,
            orderBy: params.orderBy
        }],
        queryFn: async () => await getOrders({ page: params.pagination.page, limit: params.pagination.limit, orderBy: params.orderBy }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!authCustomer
    })
};

export const useFetchCheckoutOrder = (params: { orderUUID: string }) => {
    const { authCustomer } = useAuthStore();
    return useQuery<OrderCheckoutType>({
        queryKey: ["order:checkout", { orderUUID: params.orderUUID, customer: authCustomer?.uuid }],
        queryFn: async () => await getCheckoutOrder({ orderUUID: params.orderUUID }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!params.orderUUID && !!authCustomer,
    });
};

export const useFetchOrderDetail = (params: { orderUUID: string }) => {
    const { authCustomer } = useAuthStore();
    return useQuery<GetOrderDetails>({
        queryKey: ["order:details", { orderUUID: params.orderUUID, customer: authCustomer?.uuid }],
        queryFn: async () => await getOrderDetails({ orderUUID: params.orderUUID }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!params.orderUUID && !!authCustomer,
    });
};

export const useCancelOrder = ({ orderUUID }: { orderUUID: string }) => {
    const queryClient = useQueryClient();
    const { showTriggerAlert } = useTriggerAlert();

    return useMutation({
        mutationFn: async () => await cancelOrder({ orderUUID }),
        onSuccess: (data) => {
            showTriggerAlert("Successfull", data, { duration: 3000 });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: () => {
            showTriggerAlert("Error", "Ocurrio un error inesperado al cancelar la orden., intente nuevamente", { duration: 3000 });
        }
    });
};