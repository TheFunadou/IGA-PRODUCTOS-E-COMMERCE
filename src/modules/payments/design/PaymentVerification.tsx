import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
    FaBoxOpen,
    FaHourglassHalf,
    FaStore,
    FaPhone,
    FaEnvelope,
    FaClipboardList,
} from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import type { PaymentDetailsI } from "../types";
import { formatOrderStatus } from "../../shopping/utils/ShoppingUtils";
import { PageFrame, InfoRow, SectionCard } from "./paymentResultUi";

const SUPPORT_EMAIL = "atencionaclientes@igaproductos.com";
const SUPPORT_WHATSAPP_URL = "https://wa.me/529211963246";
const SUPPORT_PHONE_DISPLAY = "+52 921 196 3246";
const SUPPORT_PHONE_LINK = "tel:+529211963246";

/* ─────────────────────────────────────────────
   Estado compartido: pago en verificación
   (contingencia de Mercado Pago — status_detail
   pending_contingency). Tono calmado, sin retry
   de pago y sin abandono de la orden.
────────────────────────────────────────────── */

const PaymentVerification = ({
    orderUUID,
    data,
}: {
    orderUUID: string;
    data: PaymentDetailsI;
}) => {
    document.title = "Iga Productos | Pago en verificación";
    const navigate = useNavigate();

    /* Si la contingencia se resuelve mientras se observa,
       redirigir a la pantalla correspondiente */
    useEffect(() => {
        if (data.status === "APPROVED") {
            navigate(`/pagar-productos/pago-exitoso?external_reference=${orderUUID}`);
        } else if (data.status === "REJECTED") {
            navigate(`/pagar-productos/pago-fallido?external_reference=${orderUUID}`);
        }
    }, [data.status, navigate, orderUUID]);

    const order = data.order;
    if (!order) return null;

    const { shipping, items, buyer } = order;
    const destination = shipping[0];

    return (
        <PageFrame>
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">

                {/* ══════════════════════════════════════
                    HERO: verificación (tono calmado)
                ══════════════════════════════════════ */}
                <div className="rounded-2xl p-5 sm:p-8 bg-info text-info-content">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-info-content/20">
                                <FaHourglassHalf className="text-2xl text-info-content" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-info-content/70">
                                    Pago en verificación
                                </p>
                                <h1 className="text-xl sm:text-2xl font-bold leading-tight text-info-content">
                                    Tu pago está siendo verificado
                                </h1>
                                <p className="text-sm mt-0.5 text-info-content/70">
                                    Tu banco aún no confirma el cargo. Esto puede tardar hasta 48
                                    horas y es normal: tu dinero está a salvo y tu pedido quedó
                                    reservado.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-info-content/20 text-info-content">
                                {formatOrderStatus[data.status]}
                            </span>
                            <p className="text-xs font-mono break-all max-w-xs text-right text-info-content/60">
                                Folio: {order.orderUUID}
                            </p>
                        </div>
                    </div>

                    {/* Meta de la orden */}
                    <div className="mt-5 pt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm border-t border-info-content/20">
                        <div>
                            <p className="text-xs uppercase opacity-60">Productos</p>
                            <p className="font-semibold">
                                {items.length} {items.length === 1 ? "artículo" : "artículos"}
                            </p>
                        </div>
                        {destination && (
                            <div>
                                <p className="text-xs uppercase opacity-60">Destino</p>
                                <p className="font-semibold">
                                    {destination.city}, {destination.state}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs uppercase opacity-60">Total de la orden</p>
                            <p className="font-semibold">
                                ${order.totalAmount} {order.exchange}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════
                    GRID PRINCIPAL
                ══════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* ── Columna izquierda: qué sigue + soporte ── */}
                    <div className="space-y-5">
                        <SectionCard
                            icon={<FaClipboardList />}
                            title="¿Qué sigue?"
                            iconBoxClass="bg-info/10 text-info border-info/20"
                            strip="bg-info"
                        >
                            <div className="space-y-3 text-sm text-base-content/70">
                                <p>
                                    <span className="font-bold text-base-content">1.</span> Tu banco
                                    confirmará o rechazará el cargo en un máximo de 48 horas.
                                </p>
                                <p>
                                    <span className="font-bold text-base-content">2.</span> Te
                                    avisaremos por correo en cuanto se resuelva, sin que tengas que
                                    hacer nada.
                                </p>
                                <p>
                                    <span className="font-bold text-base-content">3.</span> Por favor{" "}
                                    <span className="font-bold text-base-content">
                                        no vuelvas a pagar esta orden
                                    </span>{" "}
                                    para evitar un cargo duplicado.
                                </p>
                            </div>
                        </SectionCard>

                        <SectionCard
                            icon={<FaPhone />}
                            title="Atención al cliente"
                            iconBoxClass="bg-info/10 text-info border-info/20"
                            strip="bg-info"
                        >
                            <p className="text-sm text-base-content/60 mb-4">
                                Si tienes dudas sobre tu pago, estamos para ayudarte.
                            </p>
                            <div className="flex flex-col gap-2">
                                <a
                                    href={`mailto:${SUPPORT_EMAIL}`}
                                    className="btn btn-outline btn-sm gap-2 justify-start"
                                >
                                    <FaEnvelope /> {SUPPORT_EMAIL}
                                </a>
                                <a
                                    href={SUPPORT_WHATSAPP_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-outline btn-sm gap-2 justify-start"
                                >
                                    <FaWhatsapp /> WhatsApp {SUPPORT_PHONE_DISPLAY}
                                </a>
                                <a
                                    href={SUPPORT_PHONE_LINK}
                                    className="btn btn-outline btn-sm gap-2 justify-start"
                                >
                                    <FaPhone /> {SUPPORT_PHONE_DISPLAY}
                                </a>
                            </div>
                        </SectionCard>
                    </div>

                    {/* ── Columna derecha: resumen + comprador ── */}
                    <div className="lg:col-span-2 space-y-5">
                        <SectionCard
                            icon={<FaBoxOpen />}
                            title={`Resumen de tu pedido (${items.length})`}
                            iconBoxClass="bg-info/10 text-info border-info/20"
                            strip="bg-info"
                        >
                            <div className="rounded-xl p-3 space-y-3 bg-info/10">
                                <InfoRow label="Folio" value={order.orderUUID} />
                                <InfoRow
                                    label="Comprador"
                                    value={`${buyer.name} ${buyer.surname}`}
                                />
                                <InfoRow label="Correo" value={buyer.email} />
                                {buyer.phone && (
                                    <InfoRow label="Teléfono" value={buyer.phone} />
                                )}
                                <InfoRow
                                    label="Estado"
                                    value={formatOrderStatus[data.status]}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mt-5">
                                <Link
                                    to={`/mis-ordenes/detalle/${order.orderUUID}`}
                                    className="flex-1 btn btn-primary gap-2"
                                >
                                    <FaClipboardList /> Ver mi pedido
                                </Link>
                                <button
                                    className="flex-1 btn btn-ghost gap-2"
                                    onClick={() => navigate("/")}
                                >
                                    <FaStore /> Volver a la tienda
                                </button>
                            </div>
                        </SectionCard>
                    </div>
                </div>
            </div>
        </PageFrame>
    );
};

export default PaymentVerification;
