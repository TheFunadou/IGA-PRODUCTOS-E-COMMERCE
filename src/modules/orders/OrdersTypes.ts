import type { CustomerAddressType, CustomerAttributes, GetCustomerAddressOrderType, GuestCreateOrderFormType, NewAddressType } from "../customers/CustomerTypes";
import type { OrderDescriptionI, OrderItems } from "../payments/types";
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
    offer: {
        isOffer: boolean;
        discount: number;
        applicableOffers: { discount: number, type: "PERCENTAGE" | "COUPON", appliedCouponCode: string | null }[];
    };
    subtotal: string;
    images: { url: string, mainImage: boolean }[];
};

export interface OrderCheckoutItemIV3 {
    name: string;
    category: string;
    tags: string[];
    sku: string;
    color: { line: string, name: string, code: string };
    unitPrice: string;
    finalPrice: string;
    quantity: number;
    offer: {
        isOffer: boolean;
        discount: number;
        applicableOffers: { discount: number, type: "PERCENTAGE" | "COUPON", appliedCouponCode: string | null }[];
    };
    subtotal: string;
    images: { url: string, mainImage: boolean }[];
    automaticDiscount?: { applied: boolean; percentage: number };
};


export interface CheckoutOrderI {
    orderUUID: string;
    status: string;
    items: OrderCheckoutItemI[];
    resume: ShoppingCartResumeI;
    couponCode: string | null;
    externalId: string;
    shippingAddress: NewAddressType[];
};

export type ShippingAddressV3 = NewAddressType & { id: string };

export interface CheckoutOrderIV3 {
    orderUUID: string;
    status: string;
    items: OrderCheckoutItemIV3[];
    resume: ShoppingCartResumeI;
    couponCode: string | null;
    externalId: string;
    buyer?: { name: string; surname: string; email: string; phone?: string | null };
    shippingAddress: ShippingAddressV3[];
};

export type PendingOrderI = {
    orderUUID: string;
    paymentProvider: Exclude<PaymentProvidersType, null>;
    status: "IN_PROCESS";
    createdAt: string;
    expiresAt: string | null;
};

export type PendingOrderResponseI = {
    order: PendingOrderI | null;
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

export type OrderDashboardView = "list" | "grid";
export type OrderDashboardSortField = "folio" | "status" | "purchaseDate" | "lastUpdate";

export interface CustomerOrdersDashboardFilterI {
    folio?: string;
    status?: OrderStatusType;
    dateRange?: { gte?: string; lte?: string };
};

export interface CustomerOrdersDashboardSortI {
    folio?: "asc" | "desc";
    status?: "asc" | "desc";
    purchaseDate?: "asc" | "desc";
    lastUpdate?: "asc" | "desc";
};

export interface CustomerOrdersDashboardInputI {
    pagination: { page: number; limit: number };
    filters?: CustomerOrdersDashboardFilterI;
    sort?: CustomerOrdersDashboardSortI;
};

export interface CustomerOrdersDashboardCardI {
    uuid: string;
    status: OrderStatusType;
    paymentProvider: Exclude<PaymentProvidersType, null>;
    totalAmount: string;
    couponCode: string | null;
    buyer: { name: string; surname: string; email: string; phone: string | null };
    createdAt: Date;
    updatedAt: Date;
    shippingStatus: ShippingStatus | null;
    itemsCount: number;
    items: OrderCheckoutItemIV3[];
    productThumbnails: string[];
    remainingItems: number;
};

export interface GetCustomerOrdersDashboardI {
    data: CustomerOrdersDashboardCardI[];
    totalPages: number;
    totalRecords: number;
    currentPage: number;
};

export const ORDER_DASHBOARD_SORT_FIELDS: { value: OrderDashboardSortField, label: string }[] = [
    { value: "purchaseDate", label: "Fecha de compra" },
    { value: "lastUpdate", label: "Última actualización" },
    { value: "folio", label: "Folio" },
    { value: "status", label: "Estatus" },
];

export interface OrdersDashboardQueryState {
    page: number;
    view: OrderDashboardView;
    sortField: OrderDashboardSortField;
    sortDir: "asc" | "desc";
    folio: string;
    status: OrderStatusType | "ALL";
    from: string;
    to: string;
};

export const ORDERS_DASHBOARD_DEFAULT_STATE: OrdersDashboardQueryState = {
    page: 1,
    view: "list",
    sortField: "purchaseDate",
    sortDir: "desc",
    folio: "",
    status: "ALL",
    from: "",
    to: "",
};


//----------------------


export interface ShippingInfoI {
    id: string;
    recipientName: string;
    recipientLastName: string;
    country: string;
    state: string;
    city: string;
    locality: string;
    streetName: string;
    neighborhood: string;
    zipCode: string;
    addressType: string;
    floor?: string | null;
    number: string;
    aditionalNumber?: string | null;
    referencesOrComments?: string | null;
    countryPhoneCode: string;
    contactNumber: string;
};


export interface ShippingI {
    uuid: string;
    orderUUID: string;
    shippingStatus: ShippingStatus;
    concept: string;
    carrier?: string | null;
    trackingNumber?: string | null;
    shippingAmount: string;
    insuranceAmount?: string | null;
    boxesCount: number;
    shippedAt?: Date | null;
    deliveredAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export interface ExtendedShippingI extends ShippingI {
    shippingInfoId: string;
};

export interface PaymentDetailsExtendedI {
    order: OrderDescriptionI;
    shippings: ExtendedShippingI[];
};

export interface OrderDescriptionIV3 extends Omit<OrderDescriptionI, "items"> {
    items: OrderCheckoutItemIV3[];
};

export interface PaymentShippingV3I {
    shippingInfoId: string;
    trackingNumber: string | null;
};

export interface PaymentDetailsExtendedV3I {
    order: OrderDescriptionIV3;
    shippings: PaymentShippingV3I[];
};

