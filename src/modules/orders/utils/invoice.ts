import { formatDate } from "../../products/Helpers";

export const SUPPORT_EMAIL = "atencionaclientes@igaproductos.com";

type OrderContactInfo = {
    uuid: string;
    createdAt: Date;
    buyerName: string;
};

export const buildInvoiceMailto = ({ uuid, createdAt, buyerName }: OrderContactInfo): string => {
    const subject = `Solicitud de factura - Folio ${uuid}`;
    const body = [
        "Solicitud de factura",
        "",
        `Folio: ${uuid}`,
        `Fecha de compra: ${formatDate(createdAt, "es-MX")}`,
        `Nombre del comprador: ${buyerName}`,
        "",
        "Adjunto mi Constancia de Situación Fiscal.",
        "Uso de CFDI: G03 - Gastos en general.",
    ].join("\n");
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const buildIssueMailto = ({
    uuid,
    createdAt,
    buyerName,
    motive,
}: OrderContactInfo & { motive: string }): string => {
    const subject = `${motive} - Folio ${uuid}`;
    const body = [
        "Problema con mi pedido",
        "",
        `Motivo: ${motive}`,
        `Folio: ${uuid}`,
        `Fecha de compra: ${formatDate(createdAt, "es-MX")}`,
        `Nombre del comprador: ${buyerName}`,
        "",
        "Descripción del problema:",
    ].join("\n");
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};