import type { GuestFormType } from "../customers/CustomerTypes";
import type { ProductVersionCardType } from "../products/ProductTypes";
export type ShoppingCartType = ProductVersionCardType & {
    isChecked: boolean;
    quantity: number;
};
export type PaymentProvidersType = "mercado_pago" | "paypal" | null;
export type PaymentMethodType = "visa" | "mastercard" | "oxxo" | "paycash" | "bancomer" | "clabe";
export type PaymentClassType = "credit_card" | "debit_card" | "ticket" | "transfer";
export type OrderStatusType = "approved" | "pending" | "rejected" | "in_process" | "refounded" | "canceled";
export interface PaymentMethodDetails {
    icon: React.ReactElement;
    description: string;
};


export interface GuestCheckoutForm {
    address: GuestFormType,
    billing_address: GuestFormType;
    policy_and_terms_accepted: boolean;
};