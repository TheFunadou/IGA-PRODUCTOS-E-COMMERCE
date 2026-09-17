import type { ShippingStatus } from "../OrdersTypes";

const SHIPPING_STATUS_TRANSLATIONS: Record<ShippingStatus, string> = {
    PENDING: "Pendiente",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
    IN_PROCESS: "En proceso",
    IN_TRANSIT: "En tránsito",
    RETURNED: "Devuelto",
    RETURNED_IN_PROCESS: "Devolución en proceso",
    RETURNED_DELIVERED: "Devolución entregada",
    IN_PREPARATION: "En preparación",
    STAND_BY: "En espera de pago",
};

export const formatShippingStatus = (status: ShippingStatus): string =>
    SHIPPING_STATUS_TRANSLATIONS[status] ?? status.replaceAll("_", " ").toLowerCase();