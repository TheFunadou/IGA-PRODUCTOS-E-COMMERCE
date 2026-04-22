

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelOrder, getBuyNowItem, getCheckoutOrderV2, getOrders } from "../../orders/OrdersServices";
import type { CheckoutOrderI, GetOrdersSummaryI } from "../OrdersTypes";
import { useAuthStore } from "../../auth/states/authStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import type { LoadShoppingCartI, ShoppingCartI } from "../../shopping/ShoppingTypes";
import type { PaymentDetailsI } from "../../payments/types";
import { getPaymentDetails } from "../../payments/services";
import { buildKey } from "../../../global/GlobalHelpers";
import { paymentQueryKeys } from "../../payments/usePayment";

export const customerQueryKeys = {
    getOrders: (params: { pagination: { page: number, limit: number }, orderBy: "recent" | "oldest" }) => buildKey("customer:orders", { params }),
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

export const useFetchOrderDetails = (args: { orderUUID: string }) => {
    const { orderUUID } = args;

    return useQuery<PaymentDetailsI>({
        queryKey: paymentQueryKeys.getPaymentDetails({ orderUUID }),
        queryFn: () => getPaymentDetails({ orderUUID, query: { enablePolling: false } }),
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
        },
        onError: () => {
            showTriggerAlert("Error", "Ocurrio un error inesperado al cancelar la orden., intente nuevamente", { duration: 3000 });
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