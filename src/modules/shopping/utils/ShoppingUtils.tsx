import type { OrderStatusType, PaymentClassType, PaymentMethodDetails, PaymentMethodType, PaymentProviderDetails, PaymentProvidersType } from "../ShoppingTypes";

export const paymentProvider: Record<Exclude<PaymentProvidersType, null>, PaymentMethodDetails> = {
    paypal: {
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png",
        description: "PayPal"
    },
    mercado_pago: {
        image_url: "https://web.telmov.mx/images/Logo-mercadopago.svg",
        description: "Mercado Pago"
    }
};

export const paymentMethod: Record<PaymentMethodType, PaymentMethodDetails> = {
    visa: {
        image_url: "https://cdn.worldvectorlogo.com/logos/visa-10.svg",
        description: "Visa"
    },
    mastercard: {
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png",
        description: "Mastercard"
    },
    oxxo: {
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Oxxo_Logo.svg/2560px-Oxxo_Logo.svg.png",
        description: "OXXO"
    },
    paycash: {
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYnm51TwY4R0HrCNAZB4Isk0JgrEKdBYvp-qEf-YP4OGfGgkHOgZbNybMxEpaY4kx0tg&usqp=CAU",
        description: "Santander"
    },
    bancomer: {
        image_url: "https://bmv.com.mx/docs-pub/GESTOR/IMAGENES_EMISORAS/5114.png",
        description: "BBVA"
    },
    clabe: {
        image_url: "https://cdn2.downdetector.com/static/uploads/logo/spei.png",
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
    REFUNDED: "Rembolsada"
};

