import { persist } from "zustand/middleware";
import { useAuthStore } from "../../auth/states/authStore";
import { create } from "zustand";
import { PaymentFactory } from "../PaymentFactory";
import type { CreateOrderType, PaymentOrder } from "../PaymentTypes";

interface PaymentStoreState {
    order: PaymentOrder | null;
    isLoading: boolean;
    createOrder: (data: CreateOrderType) => Promise<void>;
    cancelOrder: () => Promise<void>;
    refoundOrder: () => Promise<void>;
};

export const usePaymentStore = create<PaymentStoreState>()(
    persist(
        (set) => ({
            order: null,
            orderProducts: [],
            paymentMethod: null,
            isLoading: false,

            createOrder: async (data: CreateOrderType): Promise<void> => {
                if (!data.payment_method) throw new Error("Selecciona un método de pago");
                const { isAuth } = useAuthStore.getState();
                if (!isAuth) {
                    // Guest customer

                };
                try {
                    set({ isLoading: true });
                    const strategy = PaymentFactory.create(data.payment_method);
                    const order = await strategy.createOrder({ shopping_cart: data.shopping_cart, address: data.address });
                    set({ order });
                } catch (error) {
                    console.error("Error al crear la orden: ", error);
                } finally {
                    set({ isLoading: false });
                }
            },
            cancelOrder: async () => {
                set({ order: null, isLoading: false, });
            },
            refoundOrder: async () => {

            }
        }),
        {
            name: "order",
        }
    )
);
