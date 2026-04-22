import type { CustomerAttributes, GetCustomerAddressPaymentType } from "../customers/CustomerTypes";
import type { Order, OrderResume, OrderPaymentDetails, OrderCheckoutItemI } from "../orders/OrdersTypes";
import type { PaymentProviders } from "../shopping/PaymentTypes";
import type { OrderStatusType, PaymentClassType, PaymentMethodType, ShoppingCartResumeI, ShoppingCartType } from "../shopping/ShoppingTypes";

export type OrderItems = ShoppingCartType & { subtotal: string };
export type OrderPaidShipping = { boxesQty?: number; shippingCost?: string }

export type OrderDetails = {
    order: Order;
    payments_details: OrderPaymentDetails[];
    shipping?: OrderPaidShipping;
    resume: OrderResume;
};

export type PaymentProcessed = {
    address: GetCustomerAddressPaymentType;
    items: OrderItems[];
    customer: CustomerAttributes;
    details: OrderDetails;
};


export type GetPaidOrderDetails = {
    status: OrderStatusType;
    order?: PaymentProcessed;
};

export interface PaymentDescriptionI {
    createdAt: Date;
    updatedAt: Date;
    lastFourDigits: string;
    paymentClass: PaymentClassType;
    paymentMethod: PaymentMethodType;
    paidAmount: string;
    installments: number;
    paymentStatus: OrderStatusType
};

export interface OrderDescriptionI {
    orderUUID: string;
    status: OrderStatusType;
    isGuestOrder: boolean;
    paymentProvider: PaymentProviders;
    buyer: { name: string, surname: string, email: string, phone?: string | null };
    totalAmount: string;
    exchange: "MXN" | "USD";
    aditionalResourceUrl?: string | null;
    couponCode?: string | null;
    createdAt: Date;
    updatedAt: Date;
    paymentDetails: PaymentDescriptionI[];
    items: OrderCheckoutItemI[];
    paymentResume: ShoppingCartResumeI;
    shipping: GetCustomerAddressPaymentType;
};

export interface PaymentDetailsI {
    status: OrderStatusType;
    order?: OrderDescriptionI;
}


export interface GetPaymentDetailsQueryDTO {
    enablePolling: boolean,
    requiredStatus?: OrderStatusType[],
}