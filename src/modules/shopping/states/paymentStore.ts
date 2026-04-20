import { persist } from "zustand/middleware";
import { create } from "zustand";
import type { CreateOrderI, OrderCreatedType } from "../../orders/OrdersTypes";
import { formatAxiosError } from "../../../api/helpers";
import { createProviderOrderV2 } from "../services/PaymentServices";

interface PaymentStoreState {
    order: OrderCreatedType | null;
    isLoading: boolean;
    error: string | null;
    createOrder: (data: CreateOrderI) => Promise<void>;
    cancelOrder: () => Promise<void>;
    success: () => void;
    clearError: () => void;
};

export const usePaymentStore = create<PaymentStoreState>()(
    persist(
        (set) => ({
            order: null,
            isLoading: false,
            error: null,

            createOrder: async (data: CreateOrderI): Promise<void> => {
                try {
                    set({ isLoading: true });
                    const order = await createProviderOrderV2({ dto: data });
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
                usePaymentStore.setState({ order: null, isLoading: false })
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
