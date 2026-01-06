

import { useQuery } from "@tanstack/react-query";
import { getOrderDetail, getOrders } from "../../orders/OrdersServices";
import type { OrderDetailResponse, OrdersType } from "../OrdersTypes";
import { useAuthStore } from "../../auth/states/authStore";



export const useFetchOrderDetail = (id?: string) => {
    const { authCustomer } = useAuthStore();
    return useQuery<OrderDetailResponse>({
        queryKey: ["order:detail", { id, customer: authCustomer?.uuid }],
        queryFn: async () => await getOrderDetail(id!),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!id && !!authCustomer,
    });
};

export const useFetchOrders = (params: { orderby: "asc" | "desc" }) => {
    const { authCustomer } = useAuthStore();
    return useQuery<OrdersType[]>({
        queryKey: ["orders", { customer: authCustomer?.uuid }],
        queryFn: async () => await getOrders(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!authCustomer
    })
};
