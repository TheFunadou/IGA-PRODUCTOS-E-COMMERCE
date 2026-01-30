import type { CustomerAddressType, CustomerAttributes, GetCustomerAddressPaymentType } from "../customers/CustomerTypes";
import type { OrderItems, OrderPaidShipping } from "../payments/types";
import type { PaymentProviders } from "../shopping/PaymentTypes";
import type { OrderStatusType, PaymentClassType, PaymentMethodType, PaymentProvidersType, ShoppingCartType } from "../shopping/ShoppingTypes";

export type PaymentShoppingCart = {
    product: string;
    quantity: number;
};

export type ShippingStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "IN_PROCESS" | "IN_TRANSIT" | "RETURNED" | "RETURNED_IN_PROCESS" | "RETURNED_DELIVERED" | "IN_PREPARATION" | "STAND_BY";

export type Order = {
    uuid: string;
    is_guest_order: boolean;
    payment_provider: PaymentProviders;
    status: OrderStatusType;
    total_amount: string;
    exchange: string;
    aditional_resource_url?: string | null;
    coupon_code?: string | null;
    created_at: Date;
    updated_at: Date;
};

export type OrderItemsDetails = {
    quantity: number;
    unit_price: string;
    discount: string;
    subtotal: string;
};


export type OrderPaymentDetails = {
    last_four_digits: string;
    payment_class: PaymentClassType;
    payment_method: PaymentMethodType;
    customer_paid_amount: string;
    customer_installment_amount: string;
    installments: number;
    payment_status: OrderStatusType;
    created_at: Date;
    updated_at: Date;
};


export type CreateOrderType = {
    payment_method: PaymentProvidersType;
    shopping_cart: PaymentShoppingCart[];
    address: string;
    coupon_code?: string;
};

export type Shipping = {
    shipping_status: ShippingStatus;
    tracking_number?: string | null;
    carrier?: string | null;
    shipping_amount: string;
    boxes_count: number;
    created_at: Date;
    updated_at: Date
};

export type ProcessOrderType = Omit<CreateOrderType, "payment_method">;

export type OrderCreatedResume = {
    shippingCost: number;
    boxesQty: number;
    subtotalBeforeIVA: number;
    subtotalWithDiscount: number;
    total: number;
    discount: number;
    iva: number;
};

export type OrderCreatedType = {
    folio: string;
    payment_method: Exclude<PaymentProvidersType, null>;
};

export type LightGetOrders = Omit<Order, "is_guest_order" | "exchange" | "payment_provider" | "coupon_code">;
export type SafeOrder = Omit<Order, "id" | "external_order_id" | "customer_id" | "customer_address_id">;

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

export type OrderCheckoutType = {
    uuid: string;
    items: OrderItems[];
    resume: OrderCreatedResume;
    external_id: string;
    address: GetCustomerAddressPaymentType;
};

export type GetLightOrderExtended = {
    order: LightGetOrders;
    shippingStatus?: ShippingStatus;
    orderItemImages: string[];
    totalOrderItems: number;
};


export type GetOrdersType = {
    data: GetLightOrderExtended[];
    totalPages: number;
    totalRecords: number;
};


export type OrderMoreDetails = {
    order: SafeOrder;
    payments_details: OrderPaymentDetails[];
    shipping?: Shipping | null;
    resume: OrderCreatedResume;
};

export type OrderDetails = {
    address: GetCustomerAddressPaymentType;
    items: OrderItems[];
    customer?: CustomerAttributes;
    details: OrderMoreDetails;
};

export type GetOrderDetails = {
    status: OrderStatusType;
    order?: OrderDetails;
};