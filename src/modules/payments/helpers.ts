import type { ShippingStatus } from "../orders/OrdersTypes";

export const formatShippingStatus = (status: ShippingStatus): string => {
    switch (status) {
        case "DELIVERED":
            return "Entregado"
        case "PENDING":
            return "Pendiente"
        case "SHIPPED":
            return "Enviado"
        case "IN_PREPARATION":
            return "En preparación"
        case "CANCELLED":
            return "Cancelado"
        case "IN_PROCESS":
            return "En proceso"
        case "IN_TRANSIT":
            return "En tránsito"
        case "RETURNED":
            return "Devuelto"
        case "RETURNED_IN_PROCESS":
            return "Devolución en proceso"
        case "RETURNED_DELIVERED":
            return "Devolución entregada"
        case "STAND_BY":
            return "En espera de pago"
        default:
            throw Error("Estatus de envío no válido")
    }
};