import { formatDate, formatPrice } from "../../products/Helpers";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
    FaBoxOpen,
    FaShippingFast,
    FaCreditCard,
    FaHome,
    FaPhone,
    FaMapMarkerAlt,
    FaReceipt,
    FaTag,
    FaStore,
    FaDownload,
    FaRedo,
    FaExclamationTriangle,
    FaTimesCircle,
    FaUser,
} from "react-icons/fa";
import { MdOutlinePending } from "react-icons/md";
import { usePollingPaymentPendingDetailV2 } from "../usePayment";
import {
    formatOrderStatus,
    getPaymentMethodDetails,
    paymentProvider,
} from "../../shopping/utils/ShoppingUtils";
import { formatAxiosError } from "../../../api/helpers";
import { usePaymentStore as usePaymentStoreV2 } from "../../shopping/states/paymentStore";
import clsx from "clsx";
import { useAuthStore } from "../../auth/states/authStore";
import { useThemeStore } from "../../../layouts/states/themeStore";
import { useQueryClient } from "@tanstack/react-query";
import { shoppingCartQueryKeys } from "../../shopping/hooks/useFetchShoppingCart";
import CheckoutOrderItemV2 from "../../shopping/components/CheckoutOrderItem";
import { getOrderPaymentTotals, parseFmt } from "../../orders/utils/paymentSummary";
import { orderStatusBadgeClass } from "../../orders/utils/orderStatus";
import FolioCopyButton from "../../orders/components/FolioCopyButton";
import { PageFrame, InfoRow, SectionCard, SummaryLine } from "./paymentResultUi";
import { cardToneClass } from "../utils/paymentTone";
import PaymentVerification from "./PaymentVerification";

/* ─────────────────────────────────────────────
   Constantes de polling
 ───────────────────────────────────────────── */

const MAX_POLL_ATTEMPTS = 10;

/* ─────────────────────────────────────────────
   Skeleton loader
 ───────────────────────────────────────────── */

const SkeletonLoader = ({ attempts, maxAttempts }: { attempts: number; maxAttempts: number }) => (
    <PageFrame>
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="rounded-3xl bg-base-100 border border-base-300 p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MdOutlinePending className="text-warning text-2xl" />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-base-content text-lg">
                        Verificando el estado de tu orden...
                    </p>
                    <p className="text-base-content/60 text-sm mt-0.5">
                        Esto puede tomar unos momentos. No cierres esta ventana.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="loading loading-dots loading-md text-primary" />
                    <p className="text-xs text-base-content/40">
                        Intento {attempts} de {maxAttempts}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="h-64 bg-base-200 rounded-2xl animate-pulse" />
                <div className="lg:col-span-2 space-y-4">
                    <div className="h-40 bg-base-200 rounded-2xl animate-pulse" />
                    <div className="h-48 bg-base-200 rounded-2xl animate-pulse" />
                </div>
            </div>
        </div>
    </PageFrame>
);

/* ─────────────────────────────────────────────
   Pantalla de timeout
 ───────────────────────────────────────────── */

const PollingTimeoutScreen = ({
    orderUUID,
    onRetry,
}: {
    orderUUID: string;
    onRetry: () => void;
}) => (
    <PageFrame>
        <div className="max-w-md mx-auto flex flex-col items-center text-center gap-6 py-8 px-4 rounded-3xl bg-base-100 border border-base-300">
            <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-warning text-3xl" />
            </div>
            <div className="space-y-2">
                <h1 className="text-xl font-bold text-base-content">
                    No pudimos confirmar tu orden
                </h1>
                <p className="text-base-content/60 text-sm">
                    Excedimos el número de intentos de verificación. Tu pago puede estar
                    siendo procesado. Te recomendamos revisar tu correo de confirmación o
                    intentar de nuevo en unos minutos.
                </p>
                <p className="text-xs font-mono text-base-content/40 mt-2">
                    Folio: {orderUUID}
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button className="flex-1 btn btn-primary gap-2" onClick={onRetry}>
                    <FaRedo /> Reintentar verificación
                </button>
                <button
                    className="flex-1 btn btn-ghost gap-2"
                    onClick={() => window.location.assign("/")}
                >
                    <FaStore /> Ir a la tienda
                </button>
            </div>
        </div>
    </PageFrame>
);

/* ─────────────────────────────────────────────
   Main component
 ───────────────────────────────────────────── */

const PaymentPendingV2 = () => {
    document.title = "Iga Productos | Pago pendiente";

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { order: orderStore, success } = usePaymentStoreV2();
    const { authCustomer } = useAuthStore();
    const { theme } = useThemeStore();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const orderUUID = query.get("external_reference");

    const pollAttemptsRef = useRef(0);
    const [pollTimedOut, setPollTimedOut] = useState(false);
    const [pollAttempts, setPollAttempts] = useState(0);

    /* ── Guard: sin UUID ── */
    if (!orderUUID) {
        return (
            <PageFrame>
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="rounded-3xl bg-base-100 border border-error/20 p-8 max-w-md w-full text-center space-y-4">
                        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                            <FaTimesCircle className="text-error text-2xl" />
                        </div>
                        <h1 className="text-xl font-bold text-base-content">
                            Referencia de pago inválida
                        </h1>
                        <p className="text-base-content/60 text-sm">
                            No pudimos encontrar la referencia de pago. Por favor verifica tu
                            correo de confirmación o contacta a soporte.
                        </p>
                        <button className="btn btn-primary w-full" onClick={() => navigate("/")}>
                            <FaStore className="mr-2" />
                            Regresar a la tienda
                        </button>
                    </div>
                </div>
            </PageFrame>
        );
    }

    const { data, error, isLoading, refetch } = usePollingPaymentPendingDetailV2({ orderUUID });

    useEffect(() => {
        if (!data?.order) return;

        // Si ya está como PENDING (o SUCCESS/APPROVED), limpiamos el store
        if (
            (data.status === "PENDING" ||
                data.status === "APPROVED" ||
                data.status === "PENDING_CONFIRMATION") &&
            data.order.orderUUID === orderStore?.orderUUID
        ) {
            success();
            if (authCustomer?.uuid) {
                queryClient.invalidateQueries({
                    queryKey: shoppingCartQueryKeys.shoppingCart(authCustomer.uuid),
                });
            }
        }
    }, [data?.order]);

    useEffect(() => {
        if (isLoading && !data) return;
        if (!data) return;
        if (data.status === "PENDING" || data.status === "APPROVED") return;

        pollAttemptsRef.current += 1;
        setPollAttempts(pollAttemptsRef.current);

        if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
            setPollTimedOut(true);
        }
    }, [data]);

    const handleRetry = () => {
        pollAttemptsRef.current = 0;
        setPollAttempts(0);
        setPollTimedOut(false);
        refetch();
    };

    /* ── Guard: error HTTP ── */
    if (error) {
        const is404 = (error as { response?: { status?: number } }).response?.status === 404;

        return (
            <PageFrame>
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="rounded-3xl bg-base-100 border border-error/20 p-8 max-w-md w-full text-center space-y-4">
                        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                            <FaTimesCircle className="text-error text-2xl" />
                        </div>
                        <h2 className="text-xl font-bold text-base-content">
                            {is404 ? "Orden no encontrada" : "Error al verificar el pago"}
                        </h2>
                        <p className="text-base-content/60 text-sm">
                            {is404
                                ? "No existe ninguna orden asociada a esta referencia de pago. Verifica tu correo de confirmación o contacta a soporte."
                                : "Ocurrió un error inesperado al consultar el estado de tu orden."}
                        </p>
                        {!is404 && (
                            <p className="text-xs text-error bg-error/10 px-3 py-2 rounded-xl text-left font-mono break-all">
                                {formatAxiosError(error)}
                            </p>
                        )}
                        <p className="text-xs font-mono text-base-content/40">
                            Folio: {orderUUID}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {!is404 && (
                                <button className="flex-1 btn btn-primary gap-2" onClick={handleRetry}>
                                    <FaRedo /> Reintentar
                                </button>
                            )}
                            <button
                                className={clsx("btn btn-ghost gap-2", is404 ? "w-full" : "flex-1")}
                                onClick={() => navigate("/")}
                            >
                                <FaStore /> Ir a la tienda
                            </button>
                        </div>
                    </div>
                </div>
            </PageFrame>
        );
    }

    /* ── Guard: timeout ── */
    if (pollTimedOut) {
        if (data?.status === "PENDING_CONFIRMATION" && data?.order) {
            return <PaymentVerification orderUUID={orderUUID} data={data} />;
        }
        return <PollingTimeoutScreen orderUUID={orderUUID} onRetry={handleRetry} />;
    }

    /* ── Guard: cargando / polling ── */
    if (isLoading || !data || !data.order) {
        return <SkeletonLoader attempts={pollAttempts} maxAttempts={MAX_POLL_ATTEMPTS} />;
    }

    // Aquí permitimos PENDING o APPROVED para mostrar información
    if (data.status === "PENDING_CONFIRMATION") {
        return <PaymentVerification orderUUID={orderUUID} data={data} />;
    }
    if (data.status !== "PENDING" && data.status !== "APPROVED") throw new Error("Error al obtener el estatus de la orden de compra");

    const { order } = data;
    const { shipping, items, paymentResume, buyer, paymentDetails } = order;

    const fmt = (n: number) => formatPrice(n.toString(), "es-MX");

    const { orderTotal, totalPaid, hasFinancing, interest } = getOrderPaymentTotals(order);

    const cardTone = cardToneClass("warning");

    return (
        <PageFrame>
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">

                {/* ══════════════════════════════════════
                    HERO: bg-warning
                ══════════════════════════════════════ */}
                <div className="bg-warning rounded-2xl p-5 sm:p-8 text-warning-content">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-warning-content/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <MdOutlinePending className="text-2xl text-warning-content" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-warning-content/70">
                                    Orden pendiente de pago
                                </p>
                                <h1 className="text-xl sm:text-2xl font-bold leading-tight text-warning-content">
                                    Acércate a pagar tu orden
                                </h1>
                                <p className="text-warning-content/70 text-sm mt-0.5">
                                    {buyer.name} {buyer.surname} · {buyer.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-warning-content/20 text-warning-content">
                                {formatOrderStatus[data.status]}
                            </span>
                            <div className="flex items-center gap-2 justify-end w-full">
                                <p className="text-warning-content/60 text-xs font-mono break-all max-w-xs text-right select-all">
                                    Folio: {order.orderUUID}
                                </p>
                                <FolioCopyButton uuid={order.orderUUID} tone="warning" />
                            </div>
                            <p className="text-warning-content/60 text-xs">
                                {formatDate(order.createdAt, "es-MX")}
                            </p>
                        </div>
                    </div>

                    {/* Meta de la orden */}
                    <div className="mt-5 pt-5 border-t border-warning-content/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-warning-content/60 text-xs uppercase">Total a pagar</p>
                            <p className="font-bold text-xl text-warning-content">${fmt(orderTotal)}</p>
                        </div>
                        <div>
                            <p className="text-warning-content/60 text-xs uppercase">Proveedor</p>
                            <p className="font-semibold text-warning-content">
                                {paymentProvider[order.paymentProvider].description}
                            </p>
                        </div>
                        <div>
                            <p className="text-warning-content/60 text-xs uppercase">Productos</p>
                            <p className="font-semibold text-warning-content">
                                {items.length} {items.length === 1 ? "artículo" : "artículos"}
                            </p>
                        </div>
                        <div>
                            <p className="text-warning-content/60 text-xs uppercase">Tipo de orden</p>
                            <p className="font-semibold text-warning-content">
                                {order.isGuestOrder ? "Invitado" : "Cliente registrado"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════
                    GRID PRINCIPAL
                ══════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* ── Columna izquierda: Comprador + Envío + Resumen ── */}
                    <div className="space-y-5">
                        <SectionCard
                            icon={<FaUser />}
                            title="Información del comprador"
                            {...cardTone}
                        >
                            <p className="text-xs text-base-content/40 mb-3 leading-relaxed">
                                Quién realizó el pago · puede diferir del destinatario del envío
                            </p>
                            <div className={clsx("rounded-xl p-3 space-y-3", cardTone.boxClass)}>
                                <InfoRow
                                    label="Nombre completo"
                                    value={`${buyer.name} ${buyer.surname}`}
                                />
                                <InfoRow label="Correo" value={buyer.email} />
                                {buyer.phone && (
                                    <InfoRow label="Teléfono" value={buyer.phone} icon={<FaPhone />} />
                                )}
                            </div>
                        </SectionCard>

                        {shipping.map((shipping, i) => (
                            <SectionCard
                                key={`${i}-${shipping.number}`}
                                icon={<FaShippingFast />}
                                title="Información de envío"
                                {...cardTone}
                            >
                                <div className="space-y-4">
                                    <div className={clsx("rounded-xl p-3 space-y-3", cardTone.boxClass)}>
                                        <p className={clsx("text-xs font-bold uppercase", cardTone.labelClass)}>
                                            Destinatario
                                        </p>
                                        <InfoRow
                                            label="Nombre completo"
                                            value={`${shipping.recipientName} ${shipping.recipientLastName}`}
                                        />
                                        <InfoRow
                                            label="Contacto"
                                            value={`${shipping.countryPhoneCode} ${shipping.contactNumber}`}
                                            icon={<FaPhone />}
                                        />
                                    </div>

                                    <div className="bg-base-200 rounded-xl p-3 space-y-3">
                                        <p className="text-xs font-bold uppercase text-base-content/40">
                                            Domicilio
                                        </p>
                                        <InfoRow
                                            label="Calle y número"
                                            value={`${shipping.streetName} #${shipping.number}${shipping.aditionalNumber ? ` int. ${shipping.aditionalNumber}` : ""}`}
                                            icon={<FaHome />}
                                        />
                                        {shipping.floor && <InfoRow label="Piso" value={shipping.floor} />}
                                        <InfoRow label="Colonia / Fracc." value={shipping.neighborhood} />
                                        <InfoRow
                                            label="Ciudad y Estado"
                                            value={`${shipping.city}, ${shipping.state}`}
                                            icon={<FaMapMarkerAlt />}
                                        />
                                        <InfoRow label="Localidad" value={shipping.locality} />
                                        <InfoRow
                                            label="País"
                                            value={`${shipping.country} · CP ${shipping.zipCode}`}
                                        />
                                        <InfoRow label="Tipo de dirección" value={shipping.addressType} />
                                    </div>

                                    {shipping.referencesOrComments && (
                                        <div className="bg-warning/10 rounded-xl p-3 space-y-2">
                                            <p className="text-xs font-bold uppercase text-warning">
                                                Comentarios / Referencias
                                            </p>
                                            <p className="text-sm text-base-content">
                                                {shipping.referencesOrComments}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </SectionCard>
                        ))}

                        <SectionCard
                            icon={<FaReceipt />}
                            title="Resumen de pago"
                            {...cardTone}
                        >
                            <div className="space-y-3">
                                <SummaryLine
                                    label="Subtotal"
                                    value={`$${fmt(parseFmt(paymentResume.itemsSubtotalBeforeTaxes))}`}
                                    sub="Precio base de productos"
                                />
                                <SummaryLine label="IVA (16%)" value={`$${fmt(parseFmt(paymentResume.iva))}`} />
                                {parseFloat(paymentResume.discount) > 0 && (
                                    <SummaryLine
                                        label="Descuentos aplicados"
                                        value={`$${fmt(parseFmt(paymentResume.discount))}`}
                                        highlight
                                        minus
                                    />
                                )}
                                {parseFloat(paymentResume.shippingCostBeforeTaxes) > 0 && (
                                    <SummaryLine
                                        label={`Envío (${paymentResume.boxesCount > 1 ? `${paymentResume.boxesCount} cajas` : `${paymentResume.boxesCount} caja`})`}
                                        value={`$${fmt(parseFmt(paymentResume.shippingCostBeforeTaxes))}`}
                                    />
                                )}
                                <div className="mt-4 pt-4 border-t-2 border-dashed border-base-300 space-y-3">
                                    {hasFinancing && (
                                        <SummaryLine
                                            label="Interés de financiamiento"
                                            value={`$${fmt(interest)}`}
                                            sub="Comisión por pagar a meses"
                                        />
                                    )}
                                    <SummaryLine
                                        label="Total a pagar"
                                        value={`$${fmt(orderTotal)}`}
                                        large
                                        isTotalCollected
                                        tone="warning"
                                    />
                                    {hasFinancing && (
                                        <SummaryLine
                                            label="Total cobrado"
                                            value={`$${fmt(totalPaid)}`}
                                            sub="Monto total que se cobra a tu tarjeta"
                                            large
                                            isTotalCollected
                                            tone="warning"
                                        />
                                    )}
                                </div>
                            </div>

                            {order.couponCode && (
                                <div className="mt-4 flex items-center gap-2 bg-success/10 text-success text-xs font-semibold px-3 py-2 rounded-xl">
                                    <FaTag />
                                    Cupón aplicado: <span className="font-mono">{order.couponCode}</span>
                                </div>
                            )}

                            {order.aditionalResourceUrl && (
                                <a
                                    href={order.aditionalResourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-sm w-full mt-4 gap-2"
                                >
                                    <FaDownload /> Ver ticket para pago en sitio
                                </a>
                            )}
                        </SectionCard>
                    </div>

                    {/* ── Columna derecha: Productos + Detalles ── */}
                    <div className="lg:col-span-2 space-y-5">
                        <SectionCard
                            icon={<FaBoxOpen />}
                            title={`Productos del pedido (${items.length})`}
                            {...cardTone}
                        >
                            <div className="flex flex-col gap-4">
                                {items.map((item, idx) => (
                                    <CheckoutOrderItemV2 key={`${item.sku}-${idx}`} data={item} />
                                ))}
                            </div>
                        </SectionCard>

                        <SectionCard
                            icon={<FaCreditCard />}
                            title="Detalle de pago"
                            {...cardTone}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <figure className="h-8 bg-base-200 p-1 rounded-lg border border-base-300">
                                    <img
                                        className="h-full object-contain"
                                        src={paymentProvider[order.paymentProvider]?.image_url}
                                        alt={order.paymentProvider}
                                    />
                                </figure>
                                <div className="text-xs text-base-content/40 space-y-0.5">
                                    <p>
                                        Folio de orden:{" "}
                                        <span className="font-mono text-base-content/70">
                                            {order.orderUUID}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {paymentDetails.map((det, idx) => {
                                    const method = getPaymentMethodDetails(det.paymentMethod);
                                    return (
                                        <div
                                            key={idx}
                                            className="rounded-xl border border-base-200 overflow-hidden"
                                        >
                                            <div className="bg-base-200 px-4 py-2 flex justify-between items-center">
                                                <span className="text-xs font-bold uppercase text-base-content/50">
                                                    Transacción #{idx + 1}
                                                </span>
                                                <span className="text-xs font-mono text-base-content/40">
                                                    {formatDate(det.createdAt, "es-MX")}
                                                </span>
                                            </div>
                                            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                    <p className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">Método</p>
                                                    <div className="flex items-center gap-2 min-w-0 mt-0.5">
                                                        <figure className={clsx("h-8 flex items-center justify-center px-1.5 rounded-lg overflow-hidden ring-1 ring-base-300/60", theme === "dark" ? "bg-white/15" : "bg-white")}>
                                                            <img
                                                                className="h-5 w-auto object-contain"
                                                                src={method.image_url}
                                                                alt={method.description}
                                                                loading="lazy"
                                                            />
                                                        </figure>
                                                        <span className="text-sm font-extrabold text-base-content truncate">
                                                            {method.description}
                                                        </span>
                                                    </div>
                                                </div>
                                                <InfoRow
                                                    label="Monto"
                                                    value={`$${fmt(parseFloat(det.paidAmount))}`}
                                                />
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">Estado</p>
                                                    <span
                                                        className={clsx(
                                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase border w-fit",
                                                            orderStatusBadgeClass(det.paymentStatus),
                                                        )}
                                                    >
                                                        {formatOrderStatus[det.paymentStatus]}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </SectionCard>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                className="flex-1 btn btn-primary gap-2"
                                onClick={() => navigate("/")}
                            >
                                <FaStore /> Ir a la tienda
                            </button>
                            <button
                                className="flex-1 btn btn-ghost gap-2"
                                onClick={() => navigate("/mis-ordenes")}
                            >
                                <FaBoxOpen /> Ver mis pedidos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageFrame>
    );
};

export default PaymentPendingV2;
