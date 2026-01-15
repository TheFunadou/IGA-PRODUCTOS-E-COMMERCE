
import type { OrderCreatedType, ProcessOrderType } from "../orders/OrdersTypes";
import { createMercadoPagoOrderAuthCustomer } from "./services/PaymentServices";

export interface PaymentMethodStrategy {
    createOrder: (args: { data: ProcessOrderType, csrfToken: string, isAuth: boolean }) => Promise<OrderCreatedType>;
};

export class MercadoPagoCreateOrder implements PaymentMethodStrategy {
    async createOrder(args: { data: ProcessOrderType, csrfToken: string, isAuth: boolean }): Promise<OrderCreatedType> {
        return args.isAuth ? createMercadoPagoOrderAuthCustomer(args) : createMercadoPagoOrderAuthCustomer(args);
    };
};


// export class MercadoPagoPaymentGuest implements PaymentMethodStrategy {
//     async createOrder(data: ProcessOrderType): Promise<PaymentOrder> {
//         return createMercadoPagoOrder(data);
//     };
// };

// export class PaypalPayment implements PaymentMethodStrategy {
//     async createOrder(items: ShoppingCartType[]): Promise<PaymentOrder> {
//         return {}
//     };
// };
