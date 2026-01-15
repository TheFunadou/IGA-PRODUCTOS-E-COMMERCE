import { MercadoPagoCreateOrder, type PaymentMethodStrategy } from "./PaymentStrategy";
import type { PaymentProvidersType } from "./ShoppingTypes";


export class PaymentFactory {
    static create(method: PaymentProvidersType): PaymentMethodStrategy {
        switch (method) {
            case "mercado_pago":
                return new MercadoPagoCreateOrder();
            default:
                throw new Error("Payment method not supported");
        };
    };
};