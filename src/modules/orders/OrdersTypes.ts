import type { CustomerAddressType, CustomerAttributes, GetCustomerAddressOrderType, GuestCreateOrderFormType, NewAddressType } from "../customers/CustomerTypes";
import type { OrderItems } from "../payments/types";
import type { PaymentProviders } from "../shopping/PaymentTypes";
import type { OrderStatusType, PaymentClassType, PaymentMethodType, PaymentProvidersType, ShoppingCartI, ShoppingCartResumeI, ShoppingCartType } from "../shopping/ShoppingTypes";

export type PaymentShoppingCart = {
    sku: string;
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


export type Shipping = {
    shipping_status: ShippingStatus;
    tracking_number?: string | null;
    carrier?: string | null;
    shipping_amount: string;
    boxes_count: number;
    created_at: Date;
    updated_at: Date
};

export type OrderResume = {
    shippingCost: number;
    boxesQty: number;
    subtotalBeforeIVA: number;
    subtotalWithDiscount: number;
    total: number;
    discount: number;
    iva: number;
};

export type OrderCreatedType = {
    orderUUID: string;
    paymentProvider: Exclude<PaymentProvidersType, null>;
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


export interface OrderCheckoutItemI {
    name: string;
    category: string;
    subcategories: { uuid: string, name: string }[];
    sku: string;
    color: { line: string, name: string, code: string };
    unitPrice: string;
    finalPrice: string;
    quantity: number;
    offer: { isOffer: boolean, discount: number };
    subtotal: string;
    images: { url: string, mainImage: boolean }[];
};


export interface CheckoutOrderI {
    orderUUID: string;
    items: OrderCheckoutItemI[];
    resume: ShoppingCartResumeI;
    couponCode: string | null;
    externalId: string;
    shippingAddress: NewAddressType[];
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
    resume: OrderResume;
};

export type OrderDetails = {
    address: GetCustomerAddressOrderType;
    items: OrderItems[];
    customer?: CustomerAttributes;
    details: OrderMoreDetails;
};

export type GetOrderDetails = {
    status: OrderStatusType;
    order?: OrderDetails;
};

export type CreateOrderType = {
    orderItems: PaymentShoppingCart[];
    addressUUID?: string;
    couponCode?: string;
    paymentProvider: PaymentProviders;
    guestForm?: GuestCreateOrderFormType;
}

export interface CreateOrderI {
    addressUUID?: string;
    couponCode?: string;
    paymentProvider: PaymentProviders;
    guestForm?: GuestCreateOrderFormType;
    buyNowItem?: ShoppingCartI
}

export interface CustomerOrdersSummaryI {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    status: OrderStatusType;
    paymentProvider: "mercado_pago" | "paypal";
    totalAmount: string;
    items: OrderCheckoutItemI[];
};


export interface GetOrdersSummaryI {
    data: CustomerOrdersSummaryI[];
    totalPages: number;
    totalRecords: number;
    currentPage: number;
};