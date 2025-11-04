import type { CustomerAddressType } from "../customers/CustomerTypes";
import type { PaymentMethodsType, ShoppingCartType } from "./ShoppingTypes";


export type PaymentShoppingCart = {
    product: string;
    quantity: number;
};

export type CreateOrderType = {
    payment_method: PaymentMethodsType;
    shopping_cart: PaymentShoppingCart[];
    address: string;
};

export type ProcessOrderType = Omit<CreateOrderType, "payment_method">;

export type PaymentOrder = {
    folio: string;
    items: ShoppingCartType[];
    order_id: string;
    receiver_address: CustomerAddressType;
    payment_method: Exclude<PaymentMethodsType, null>;
};