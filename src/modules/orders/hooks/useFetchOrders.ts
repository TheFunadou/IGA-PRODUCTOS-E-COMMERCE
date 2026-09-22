

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatAxiosError } from "../../../api/helpers";
import { cancelOrder, cancelGuestOrder, getBuyNowItem, getBuyNowItemV3, getCheckoutOrderV2, getCheckoutOrderV3, getOrders, getOrdersDashboardV3 } from "../../orders/OrdersServices";
import type { CheckoutOrderI, CheckoutOrderIV3, CustomerOrdersDashboardInputI, GetCustomerOrdersDashboardI, GetOrdersSummaryI, PaymentDetailsExtendedI, PaymentDetailsExtendedV3I } from "../OrdersTypes";
import { useAuthStore } from "../../auth/states/authStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import type { LoadShoppingCartI, LoadShoppingCartV3I, ShoppingCartI } from "../../shopping/ShoppingTypes";
import { getPaymentDetailsExtended, getPaymentDetailsExtendedV3 } from "../../payments/services";
import { buildKey } from "../../../global/GlobalHelpers";
import { paymentQueryKeys } from "../../payments/usePayment";

export const customerQueryKeys = {
    getOrders: (params: { pagination: { page: number, limit: number }, orderBy: "recent" | "oldest" }) => buildKey("customer:orders", { params }),
    getOrdersDashboardV3: (dto: CustomerOrdersDashboardInputI) => buildKey("customer:orders:dashboard:v3", dto),
};

export const useFetchOrders = (params: { pagination: { page: number, limit: number }, orderBy: "recent" | "oldest" }) => {
    const { authCustomer } = useAuthStore();
    return useQuery<GetOrdersSummaryI>({
        queryKey: customerQueryKeys.getOrders(params),
        queryFn: async () => await getOrders({ page: params.pagination.page, limit: params.pagination.limit, orderBy: params.orderBy }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!authCustomer
    })
};

export const useCustomerOrdersDashboard = (dto: CustomerOrdersDashboardInputI) => {
    const { authCustomer } = useAuthStore();
    return useQuery<GetCustomerOrdersDashboardI>({
        queryKey: customerQueryKeys.getOrdersDashboardV3(dto),
        queryFn: async () => await getOrdersDashboardV3(dto),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!authCustomer,
    });
};


export const useFetchCheckoutOrderV2 = (params: { orderUUID: string }) => {
    return useQuery<CheckoutOrderI>({
        queryKey: ["order:checkout", { orderUUID: params.orderUUID }],
        queryFn: async () => await getCheckoutOrderV2({ orderUUID: params.orderUUID }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!params.orderUUID,
    });
};

export const useFetchCheckoutOrderV3 = (params: { orderUUID: string }) => {
    return useQuery<CheckoutOrderIV3>({
        queryKey: ["order:checkout:v3", { orderUUID: params.orderUUID }],
        queryFn: async () => await getCheckoutOrderV3({ orderUUID: params.orderUUID }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!params.orderUUID,
    });
};

export const useFetchOrderDetails = (args: { orderUUID: string }) => {
    const { orderUUID } = args;

    return useQuery<PaymentDetailsExtendedI>({
        queryKey: paymentQueryKeys.getPaymentDetails({ orderUUID }),
        queryFn: () => getPaymentDetailsExtended({ orderUUID }),
        staleTime: 8 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useFetchOrderDetailsV3 = (args: { orderUUID: string }) => {
    const { orderUUID } = args;

    return useQuery<PaymentDetailsExtendedV3I>({
        queryKey: [...paymentQueryKeys.getPaymentDetails({ orderUUID }), "v3"],
        queryFn: () => getPaymentDetailsExtendedV3({ orderUUID }),
        staleTime: 8 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};


export const useCancelOrder = ({ orderUUID, type }: { orderUUID: string, type: "CANCELLED" | "ABANDONED" }) => {
    const queryClient = useQueryClient();
    const { showTriggerAlert } = useTriggerAlert();

    return useMutation({
        mutationFn: async () => await cancelOrder({ orderUUID, type }),
        onSuccess: (data) => {
            showTriggerAlert("Successfull", data, { duration: 3000 });
            queryClient.invalidateQueries({ queryKey: customerQueryKeys.getOrders({ pagination: { page: 1, limit: 10 }, orderBy: "recent" }) });
            queryClient.invalidateQueries({ queryKey: ["customer:orders:dashboard:v3"] });
        },
        onError: (error) => {
            showTriggerAlert("Error", formatAxiosError(error), { duration: 4000 });
        }
    });
};

export const useCancelGuestOrder = ({ orderUUID }: { orderUUID: string }) => {
    const queryClient = useQueryClient();
    const { showTriggerAlert } = useTriggerAlert();

    return useMutation({
        mutationFn: async () => await cancelGuestOrder({ orderUUID }),
        onSuccess: (data) => {
            showTriggerAlert("Successfull", data, { duration: 3000 });
            queryClient.invalidateQueries({ queryKey: customerQueryKeys.getOrders({ pagination: { page: 1, limit: 10 }, orderBy: "recent" }) });
            queryClient.invalidateQueries({ queryKey: ["customer:orders:dashboard:v3"] });
        },
        onError: (error) => {
            showTriggerAlert("Error", formatAxiosError(error), { duration: 4000 });
        }
    });
};


export const useFetchBuyNowItem = ({ item }: { item: ShoppingCartI }) => {
    return useQuery<LoadShoppingCartI>({
        queryKey: ["buy-now:item", { item }],
        queryFn: async () => await getBuyNowItem({ item }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!item,
    });
}

export const useFetchBuyNowItemV3 = ({ item, destination, city, state }: { item: ShoppingCartI, destination?: string, city?: string, state?: string }) => {
    return useQuery<LoadShoppingCartV3I>({
        queryKey: ["buy-now:item:v3", { item, destination, city, state }],
        queryFn: async () => await getBuyNowItemV3({ item, destination, city, state }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!item,
    });
}