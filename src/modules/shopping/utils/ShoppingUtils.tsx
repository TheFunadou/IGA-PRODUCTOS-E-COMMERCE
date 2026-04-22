import MercadoPagoLogo from "../../../assets/providers/mercadopago.webp"
import PayPalLogo from "../../../assets/providers/paypal.webp"
import OxxoLogo from "../../../assets/providers/oxxo.webp"
import SantanderLogo from "../../../assets/providers/santander.webp"
import BBVALogo from "../../../assets/providers/bbva.webp"
import SPEILogo from "../../../assets/providers/spei.webp"
import VisaLogo from "../../../assets/providers/visa.webp"
import MastercardLogo from "../../../assets/providers/mastercard.webp"

import type { OrderStatusType, PaymentClassType, PaymentMethodDetails, PaymentMethodType, PaymentProvidersType } from "../ShoppingTypes";

export const paymentProvider: Record<Exclude<PaymentProvidersType, null>, PaymentMethodDetails> = {
    paypal: {
        image_url: PayPalLogo,
        description: "PayPal"
    },
    mercado_pago: {
        image_url: MercadoPagoLogo,
        description: "Mercado Pago"
    }
};

export const paymentMethod: Record<PaymentMethodType, PaymentMethodDetails> = {
    visa: {
        image_url: VisaLogo,
        description: "Visa"
    },
    mastercard: {
        image_url: MastercardLogo,
        description: "Mastercard"
    },
    oxxo: {
        image_url: OxxoLogo,
        description: "OXXO"
    },
    paycash: {
        image_url: SantanderLogo,
        description: "Santander"
    },
    bancomer: {
        image_url: BBVALogo,
        description: "BBVA"
    },
    clabe: {
        image_url: SPEILogo,
        description: "Transferencia SPEI"
    }
};

export const formatPaymentClass: Record<PaymentClassType, string> = {
    credit_card: "Tarjeta de credito",
    debit_card: "Tarjeta de debito",
    ticket: "Efectivo",
    transfer: "Transferencia interbancaria"
};

export const formatOrderStatus: Record<OrderStatusType, string> = {
    APPROVED: "Aprobada",
    IN_PROCESS: "En proceso",
    PENDING: "Pendiente",
    REJECTED: "Rechazada",
    CANCELLED: "Cancelada",
    AUTHORIZED: "Autorizada",
    REFUNDED: "Rembolsada",
    ABANDONED: "Abandonada"
};

