import { persist } from "zustand/middleware";
import { create } from "zustand";
import type { CreateOrderI, OrderCreatedType } from "../../orders/OrdersTypes";
import { formatAxiosError } from "../../../api/helpers";
import { createProviderOrderV2 } from "../services/PaymentServices";

interface PaymentStoreState {
    order: OrderCreatedType | null;
    isLoading: boolean;
    error: string | null;
    duplicateGuestEmail: string | null;
    createOrder: (data: CreateOrderI) => Promise<boolean>;
    cancelOrder: () => Promise<void>;
    success: () => void;
    clearError: () => void;
    clearErrorBadge: () => void;
};

export const usePaymentStore = create<PaymentStoreState>()(
    persist(
        (set) => ({
            order: null,
            isLoading: false,
            error: null,
            duplicateGuestEmail: null,

            createOrder: async (data: CreateOrderI): Promise<boolean> => {
                try {
                    set({ isLoading: true });
                    const order = await createProviderOrderV2({ dto: data });
                    set({ order });
                    return true;
                } catch (error) {
                    const msg = formatAxiosError(error);
                    set({
                        error: msg,
                        duplicateGuestEmail:
                            data.guestForm?.email && /ya tiene una cuenta activa/i.test(msg)
                                ? data.guestForm.email
                                : null,
                    });
                    return false;
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
                set({ error: null, duplicateGuestEmail: null });
            },
            clearErrorBadge() {
                set({ error: null });
            }
        }),
        {
            name: "order",
            partialize: (state) => ({ order: state.order }),
        }
    )
);
