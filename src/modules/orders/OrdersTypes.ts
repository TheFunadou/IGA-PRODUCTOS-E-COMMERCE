import type { CustomerAddressType } from "../customers/CustomerTypes";
import type { OrderStatusType, PaymentClassType, PaymentMethodType, PaymentProvidersType, ShoppingCartType } from "../shopping/ShoppingTypes";

export type PaymentShoppingCart = {
    product: string;
    quantity: number;
};

export type CreateOrderType = {
    payment_method: PaymentProvidersType;
    shopping_cart: PaymentShoppingCart[];
    address: string;
};

export type ProcessOrderType = Omit<CreateOrderType, "payment_method">;

export type PaymentOrder = {
    folio: string;
    items: ShoppingCartType[];
    order_id: string;
    receiver_address: CustomerAddressType;
    payment_method: Exclude<PaymentProvidersType, null>;
};

export type ItemsOrderType = ShoppingCartType & {
    subtotal: string
};

export type OrderDetailResponse = {
    id: string;
    items: ItemsOrderType[];
    aditional_source_url: string;
    shipping_address: CustomerAddressType;
    payment_provider: Exclude<PaymentProvidersType, null>;
    last_four_digits: string | null,
    payment_class: PaymentClassType,
    payment_method: PaymentMethodType,
    installments: number,
    status: OrderStatusType;
    total_amount: string;
    exchange: string;
    date: Date;
};

export type OrdersType = {
    id: string;
    created_at: Date;
    payment_provider: Exclude<PaymentProvidersType, null>;
    status: OrderStatusType;
    total_amount: string;
    exchange: string;
    payment_class: PaymentClassType | null;
    installments: number | null;
    order_detail: {
        product_version: {
            product_images: {
                image_url: string;
            }[];
        };
    }[];
};
