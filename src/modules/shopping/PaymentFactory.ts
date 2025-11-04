import type { PaymentMethodsType } from "./ShoppingTypes";
import { MercadoPagoPayment, type PaymentMethodStrategy } from "./PaymentStrategy";


export class PaymentFactory {
    static create(method: PaymentMethodsType): PaymentMethodStrategy {
        switch (method) {
            case "mercado_pago":
                return new MercadoPagoPayment();
            // case "paypal":
            //     return new PaypalPayment();
            default:
                throw new Error("Payment method not supported");
        };
    };
};