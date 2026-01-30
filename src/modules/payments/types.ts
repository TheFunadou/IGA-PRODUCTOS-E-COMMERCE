import type { CustomerAttributes, GetCustomerAddressPaymentType } from "../customers/CustomerTypes";
import type { Order, OrderPaymentDetails } from "../orders/OrdersTypes";
import type { OrderStatusType, ShoppingCartType } from "../shopping/ShoppingTypes";

export type OrderItems = ShoppingCartType & { subtotal: string };
export type OrderPaidShipping = { boxesQty?: number; shippingCost?: string }

export type OrderDetails = {
    order: Order;
    payments_details: OrderPaymentDetails[];
    shipping?: OrderPaidShipping;
};

export type PaymentProcessed = {
    address: GetCustomerAddressPaymentType;
    items: OrderItems[];
    customer?: CustomerAttributes;
    details: OrderDetails;
};


export type GetPaidOrderDetails = {
    status: OrderStatusType;
    order?: PaymentProcessed;
};