import { SiMercadopago } from "react-icons/si";
import type { OrderStatusType, PaymentClassType, PaymentMethodDetails, PaymentMethodType, PaymentProvidersType } from "../ShoppingTypes";
import { FaCcMastercard, FaCcPaypal, FaCcVisa } from "react-icons/fa6";

export const paymentProvider: Record<Exclude<PaymentProvidersType, null>, PaymentMethodDetails> = {
    paypal: {
        icon: <FaCcPaypal />,
        description: "PayPal"
    },
    mercado_pago: {
        icon: <SiMercadopago />,
        description: "Mercado Pago"
    }
};

export const paymentMethod: Record<PaymentMethodType, PaymentMethodDetails> = {
    visa: {
        icon: <FaCcVisa className="text-5xl text-primary" />,
        description: "Visa"
    },
    mastercard: {
        icon: <FaCcMastercard className="text-5xl text-warning" />,
        description: "Mastercard"
    },
    oxxo: {
        icon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Oxxo_Logo.svg/2560px-Oxxo_Logo.svg.png" alt="Oxxo" />,
        description: "OXXO"
    },
    paycash: {
        icon: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYnm51TwY4R0HrCNAZB4Isk0JgrEKdBYvp-qEf-YP4OGfGgkHOgZbNybMxEpaY4kx0tg&usqp=CAU" alt="Santander" />,
        description: "Santander"
    },
    bancomer: {
        icon: <img src="https://bmv.com.mx/docs-pub/GESTOR/IMAGENES_EMISORAS/5114.png" alt="BBVA" />,
        description: "BBVA"
    },
    clabe: {
        icon: <img src="https://cdn2.downdetector.com/static/uploads/logo/spei.png" alt="SPEI" />,
        description: "Transferencia SPEI"
    }
};

export const formatPaymentClass: Record<PaymentClassType, string> = {
    credit_card: "Tarjeta de credito",
    debit_card: "Tarjeta de debito",
    ticket: "Efectivo",
    transfer: "Transferencia"
};

export const formatOrderStatus: Record<OrderStatusType, string> = {
    approved: "Aprobada",
    in_process: "En proceso",
    pending: "Pendiente",
    rejected: "Rechazada",
    canceled: "Cancelada",
    refounded: "Rembolsada"
};

