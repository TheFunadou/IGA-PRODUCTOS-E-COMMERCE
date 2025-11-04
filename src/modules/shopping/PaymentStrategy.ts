import type { PaymentOrder, ProcessOrderType } from "./PaymentTypes";
import { createMercadoPagoOrder } from "./services/PaymentServices";
import type { ShoppingCartType } from "./ShoppingTypes";

export interface PaymentMethodStrategy {
    createOrder: (data: ProcessOrderType) => Promise<PaymentOrder>;
};

export class MercadoPagoPayment implements PaymentMethodStrategy {
    async createOrder(data: ProcessOrderType): Promise<PaymentOrder> {
        return createMercadoPagoOrder(data);
    };
};

// export class PaypalPayment implements PaymentMethodStrategy {
//     async createOrder(items: ShoppingCartType[]): Promise<PaymentOrder> {
//         return {}
//     };
// };
