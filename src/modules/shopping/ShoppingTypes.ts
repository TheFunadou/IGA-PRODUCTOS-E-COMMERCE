import type { JSX } from "react";
import type { GuestFormType } from "../customers/CustomerTypes";
import type { ProductVersionCardI, ProductVersionCardType } from "../products/ProductTypes";
export type ShoppingCartType = ProductVersionCardType & {
    isChecked: boolean;
    quantity: number;
};

export interface CartItemI {
    productUUID: string;
    sku: string;
}

export interface ShoppingCartI {
    item: CartItemI;
    quantity: number;
    isChecked: boolean;
};

export interface ShoppingCartResumeI {
    itemsSubtotal: string;
    itemsSubtotalBeforeTaxes: string;
    shippingCostBeforeTaxes: string;
    boxesCount: number;
    iva: string;
    subtotal: string;
    discount: string;
    total: string;
};

export interface LoadShoppingCartI {
    cards: ProductVersionCardI[],
    shoppingCart: ShoppingCartI[],
    resume?: ShoppingCartResumeI
};

export interface SetItemDTO {
    type: "add" | "set";
    item: ShoppingCartI;
}

export type PaymentProvidersType = "mercado_pago" | "paypal" | null;
export type PaymentProviders = "mercado_pago" | "paypal";
export type PaymentMethodType = "visa" | "mastercard" | "oxxo" | "paycash" | "bancomer" | "clabe";
export type PaymentClassType = "credit_card" | "debit_card" | "ticket" | "transfer";
export type OrderStatusType = "APPROVED" | "PENDING" | "REJECTED" | "IN_PROCESS" | "REFUNDED" | "CANCELLED" | "AUTHORIZED" | "ABANDONED";

export interface PaymentProviderDetails {
    icon: JSX.Element;
    description: string;
}

export interface PaymentMethodDetails {
    image_url: string;
    description: string;
};

export interface GuestCheckoutForm {
    address: GuestFormType,
    billing_address: GuestFormType;
    policy_and_terms_accepted: boolean;
};