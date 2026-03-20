import { persist } from "zustand/middleware";
import { create } from "zustand";
import type { CreateOrderType, OrderCreatedType } from "../../orders/OrdersTypes";
import { formatAxiosError } from "../../../api/helpers";
import { createProviderOrder } from "../services/PaymentServices";

interface PaymentStoreState {
    buyNow: { sku: string, quantity: number } | null;
    order: OrderCreatedType | null;
    isLoading: boolean;
    error: string | null;
    createOrder: (data: CreateOrderType) => Promise<void>;
    cancelOrder: () => Promise<void>;
    success: () => void;
    setBuyNow: (args: { sku: string, quantity: number }) => void;
    clearError: () => void;
};

export const usePaymentStore = create<PaymentStoreState>()(
    persist(
        (set) => ({
            order: null,
            isLoading: false,
            error: null,
            buyNow: null,

            createOrder: async (data: CreateOrderType): Promise<void> => {
                try {
                    set({ isLoading: true });
                    console.log(data);
                    const order = await createProviderOrder({ dto: data });
                    set({ order });
                } catch (error) {
                    set({ error: formatAxiosError(error) });
                } finally {
                    set({ isLoading: false });
                }

            },
            cancelOrder: async () => {
                set({ order: null, isLoading: false });
            },
            success() {
                usePaymentStore.persist.clearStorage();
                usePaymentStore.setState({ order: null, isLoading: false, buyNow: null })
            },
            setBuyNow(args: { sku: string, quantity: number }) {
                set({ buyNow: args });
            },
            clearError() {
                set({ error: null });
            }
        }),
        {
            name: "order",
        }
    )
);
