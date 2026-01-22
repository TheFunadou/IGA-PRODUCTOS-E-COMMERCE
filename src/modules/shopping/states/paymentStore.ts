import { persist } from "zustand/middleware";
import { useAuthStore } from "../../auth/states/authStore";
import { create } from "zustand";
import { PaymentFactory } from "../PaymentFactory";
import type { CreateOrderType, OrderCreatedType } from "../../orders/OrdersTypes";
import { formatAxiosError } from "../../../api/helpers";

interface PaymentStoreState {
    order: OrderCreatedType | null;
    isLoading: boolean;
    error: string | null;
    createOrder: (data: CreateOrderType) => Promise<void>;
    cancelOrder: () => Promise<void>;
    refoundOrder: () => Promise<void>;
    success: () => void;
};

export const usePaymentStore = create<PaymentStoreState>()(
    persist(
        (set) => ({
            order: null,
            isLoading: false,
            error: null,

            createOrder: async (data: CreateOrderType): Promise<void> => {
                if (!data.payment_method) throw new Error("Selecciona un método de pago");
                const { isAuth, csrfToken } = useAuthStore.getState();

                if (isAuth) {
                    try {
                        set({ isLoading: true });
                        const strategy = PaymentFactory.create(data.payment_method);
                        const order = await strategy.createOrder({ data: { shopping_cart: data.shopping_cart, address: data.address }, csrfToken: csrfToken!, isAuth });
                        console.log(JSON.stringify(order, null, 2));
                        set({ order });
                    } catch (error) {
                        set({ error: formatAxiosError(error) });
                    } finally {
                        set({ isLoading: false });
                    }
                }

            },
            cancelOrder: async () => {
                set({ order: null, isLoading: false });
            },
            refoundOrder: async () => {

            },
            success() {
                usePaymentStore.persist.clearStorage();
                usePaymentStore.setState({ order: null, isLoading: false })
            },
        }),
        {
            name: "order",
        }
    )
);
