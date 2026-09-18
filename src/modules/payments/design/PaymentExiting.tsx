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
import { MdOutlinePending, MdVerified } from "react-icons/md";
import { usePollingPaymentApprovedDetailV2 } from "../usePayment";
import {
    formatOrderStatus,
    formatPaymentClass,
    getPaymentMethodDetails,
    getPaymentProviderDetails,
    paymentProvider,
} from "../../shopping/utils/ShoppingUtils";
import { formatAxiosError } from "../../../api/helpers";
import { usePaymentStore as usePaymentStoreV2 } from "../../shopping/states/paymentStore";
import clsx from "clsx";
import { useAuthStore } from "../../auth/states/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { shoppingCartQueryKeys } from "../../shopping/hooks/useFetchShoppingCart";
import CheckoutOrderItemV3 from "../../shopping/components/CheckoutOrderItemV3";
import RecentlyViewed from "../../shopping/components/RecentlyViewed";
import FavoritesSectionV3 from "../../shopping/components/FavoritesSectionV3";
import { trackPurchase } from "../../analytics/MetaEvents";
import { getOrderPaymentTotals, parseFmt } from "../../orders/utils/paymentSummary";
import { orderStatusBadgeClass } from "../../orders/utils/orderStatus";
import type { OrderCheckoutItemIV3 } from "../../orders/OrdersTypes";
import { useThemeStore } from "../../../layouts/states/themeStore";
import FolioCopyButton from "../../orders/components/FolioCopyButton";
import { PageFrame, Badge, InfoRow, SectionCard, SummaryLine } from "./paymentResultUi";
import { cardToneClass } from "../utils/paymentTone";

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
            <div className="rounded-2xl bg-base-100 border border-base-300 p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
        <div className="max-w-md mx-auto flex flex-col items-center text-center gap-6 py-8 px-4 rounded-2xl bg-base-100 border border-base-300">
            <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-warning text-3xl" />
            </div>
            <div className="space-y-2">
                <h1 className="text-xl font-bold text-base-content">
                    No pudimos confirmar tu orden
                </h1>
                <p className="text-base-content/60 text-sm">
                    Excedimos el número de intentos de verificación. Tu pago puede estar
                    siendo procesado por el banco. Te recomendamos revisar tu correo de
                    confirmación o intentar de nuevo en unos minutos.
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

const PaymentExitingV2 = () => {
    document.title = "Iga Productos | ¡Gracias por tu compra!";

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { order: orderStore, success } = usePaymentStoreV2();
    const { authCustomer, isAuth } = useAuthStore();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const orderUUID = query.get("external_reference");

    const pollAttemptsRef = useRef(0);
    const hasTrackedPurchaseRef = useRef(false);
    const [pollTimedOut, setPollTimedOut] = useState(false);
    const [pollAttempts, setPollAttempts] = useState(0);
    const { theme } = useThemeStore();

    /* ── Guard: sin UUID ── */
    if (!orderUUID) {
        return (
            <PageFrame>
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="rounded-2xl bg-base-100 border border-base-300 p-8 max-w-md w-full text-center space-y-4">
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

    const { data, error, isLoading, refetch } = usePollingPaymentApprovedDetailV2({ orderUUID });

    useEffect(() => {
        if (!data?.order) return;

        if (data.status === "APPROVED" && !hasTrackedPurchaseRef.current) {
            trackPurchase(data.order);
            hasTrackedPurchaseRef.current = true;
        }

        if (
            data.status === "APPROVED" &&
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
        if (data.status === "APPROVED") return;

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
                    <div className="rounded-2xl bg-base-100 border border-base-300 p-8 max-w-md w-full text-center space-y-4">
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
        return <PollingTimeoutScreen orderUUID={orderUUID} onRetry={handleRetry} />;
    }

    /* ── Guard: cargando / polling ── */
    if (isLoading || !data || data.status === "PENDING" || !data.order) {
        return <SkeletonLoader attempts={pollAttempts} maxAttempts={MAX_POLL_ATTEMPTS} />;
    }

    if (data.status !== "APPROVED") {
        return <SkeletonLoader attempts={pollAttempts} maxAttempts={MAX_POLL_ATTEMPTS} />;
    }

    const { order } = data;
    const { shipping, items, paymentResume, buyer, paymentDetails } = order;

    const v3Items: OrderCheckoutItemIV3[] = items.map((item) => ({ ...item, tags: [] }));

    const fmt = (n: number) => formatPrice(n.toString(), "es-MX");

    const { orderTotal, totalPaid, hasFinancing, interest } =
        getOrderPaymentTotals(order);

    const purchasedSkus = items.map((item) => item.sku);

    const cardTone = cardToneClass("success");

    return (
        <PageFrame>
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">

                {/* ══════════════════════════════════════
                    HEADER V3
                ══════════════════════════════════════ */}
                <header className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                            <MdVerified className="text-success text-lg sm:text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                                ¡Gracias por tu compra, {buyer.name}!
                            </h1>
                            <p className="text-xs sm:text-sm text-base-content/50 mt-1.5">
                                Hemos enviado un correo a{" "}
                                <span className="font-semibold text-base-content/70">{buyer.email}</span>{" "}
                                con los detalles de tu pedido.
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                        <Badge label={formatOrderStatus[data.status]} color="success" />
                        <div className="flex items-center gap-2 justify-end w-full">
                            <p className="text-xs font-mono text-base-content/40 break-all max-w-xs text-right select-all">
                                Número de pedido: {order.orderUUID}
                            </p>
                            <FolioCopyButton uuid={order.orderUUID} />
                        </div>
                        <p className="text-xs text-base-content/40">
                            {formatDate(order.createdAt, "es-MX")}
                        </p>
                    </div>
                </header>

                {/* ══════════════════════════════════════
                    HERO: confirmación (bg-success)
                ══════════════════════════════════════ */}
                <div className="bg-success rounded-2xl p-5 sm:p-7 text-success-content relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                        <MdVerified className="text-[10rem] -rotate-12" />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-success-content/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <MdVerified className="text-xl text-success-content" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-success-content/70">
                                    ¡Pago confirmado!
                                </p>
                                <p className="text-success-content/70 text-sm mt-0.5">
                                    Tu pedido ya está en preparación. Te notificaremos cuando salga.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Meta de la orden */}
                    <div className="mt-5 pt-5 border-t border-success-content/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm relative z-10">
                        <div>
                            <p className="text-success-content/60 text-xs uppercase">Total Pagado</p>
                            <p className="font-bold text-xl text-success-content">
                                ${fmt(hasFinancing ? totalPaid : orderTotal)}
                            </p>
                            {hasFinancing && (
                                <p className="text-sm font-semibold text-success-content/70 mt-0.5">
                                    (Total de la orden: ${fmt(orderTotal)})
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-success-content/60 text-xs uppercase">Proveedor</p>
                            <p className="font-semibold text-success-content">
                                {paymentProvider[order.paymentProvider].description}
                            </p>
                        </div>
                        <div>
                            <p className="text-success-content/60 text-xs uppercase">Productos</p>
                            <p className="font-semibold text-success-content">
                                {items.length} {items.length === 1 ? "artículo" : "artículos"}
                            </p>
                        </div>
                        <div>
                            <p className="text-success-content/60 text-xs uppercase">Tipo de orden</p>
                            <p className="font-semibold text-success-content">
                                {order.isGuestOrder ? "Invitado" : "Cliente registrado"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════
                    GRID PRINCIPAL: Main + Rail
                ══════════════════════════════════════ */}
                <section className="w-full flex flex-col lg:flex-row gap-5">

                    {/* ── Main: Comprador + Envío + Artículos ── */}
                    <div className="flex-1 min-w-0 flex flex-col gap-5">
                        <SectionCard icon={<FaUser />} title="Información del comprador" {...cardTone}>
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
                                    <InfoRow
                                        label="Teléfono"
                                        value={buyer.phone}
                                        icon={<FaPhone />}
                                    />
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
                                    </div>

                                    {shipping.referencesOrComments && (
                                        <div className="bg-warning/10 rounded-xl p-3 space-y-2">
                                            <p className="text-xs font-bold uppercase text-warning">
                                                Comentarios / Referencias
                                            </p>
                                            <p className="text-sm text-base-content italic text-balance">
                                                "{shipping.referencesOrComments}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </SectionCard>
                        ))}

                        <SectionCard
                            icon={<FaBoxOpen />}
                            title={`Artículos de tu compra (${items.length})`}
                            {...cardTone}
                        >
                            <div className="flex flex-col gap-4">
                                {v3Items.map((item, idx) => (
                                    <CheckoutOrderItemV3 key={`${item.sku}-${idx}`} data={item} />
                                ))}
                            </div>
                        </SectionCard>
                    </div>

                    {/* ── Rail: Resumen + Transacción + Acciones ── */}
                    <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4">
                        <SectionCard
                            icon={<FaReceipt />}
                            title="Resumen de tu compra"
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
                                        label="Total"
                                        value={`$${fmt(orderTotal)}`}
                                        large={!hasFinancing}
                                        tone="success"
                                    />
                                    {hasFinancing && (
                                        <SummaryLine
                                            label="Total cobrado"
                                            value={`$${fmt(totalPaid)}`}
                                            sub="Monto total que se cobra a tu tarjeta"
                                            large
                                            isTotalCollected
                                            tone="success"
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
                                    <FaDownload /> Descargar comprobante
                                </a>
                            )}
                        </SectionCard>

                        <SectionCard
                            icon={<FaCreditCard />}
                            title="Pago"
                            {...cardTone}
                        >
                            <div className="flex items-center gap-4 mb-5">
                                <figure className="h-10 bg-base-200 p-1 rounded-lg border border-base-300">
                                    <img
                                        className="h-full object-contain"
                                        src={getPaymentProviderDetails(order.paymentProvider).image_url}
                                        alt={order.paymentProvider}
                                    />
                                </figure>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-base-content">
                                        {getPaymentProviderDetails(order.paymentProvider).description}
                                    </p>
                                    <p className="text-xs text-base-content/50">
                                        Pago procesado de forma segura
                                    </p>
                                </div>
                            </div>

                            {hasFinancing && (
                                <p className="text-xs text-warning bg-warning/10 rounded-xl px-3 py-2 mb-4 flex items-center gap-1.5">
                                    <FaExclamationTriangle className="text-warning flex-shrink-0" />
                                    El pago incluye intereses de financiamiento por ${fmt(interest)}.
                                </p>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {paymentDetails.map((det, idx) => {
                                    const monthly =
                                        det.installments > 1
                                            ? parseFmt(det.customerInstallmentAmount) ||
                                              parseFmt(det.paidAmount) / det.installments
                                            : parseFmt(det.paidAmount);
                                    const method = getPaymentMethodDetails(det.paymentMethod);
                                    return (
                                        <div
                                            key={idx}
                                            className="bg-base-200 rounded-xl p-4 space-y-3 border border-base-300"
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <figure
                                                        className={clsx(
                                                            "h-8 flex items-center justify-center px-1.5 rounded-lg overflow-hidden ring-1 ring-base-300/60",
                                                            theme === "dark" ? "bg-white/15" : "bg-white",
                                                        )}
                                                    >
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
                                                <p className="text-lg font-bold text-base-content tabular-nums">${fmt(parseFmt(det.paidAmount))}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <InfoRow label="Tarjeta" value={`**** ${det.lastFourDigits}`} />
                                                <InfoRow label="Tipo" value={formatPaymentClass[det.paymentClass] ?? det.paymentClass} />
                                                <InfoRow
                                                    label="Pagos"
                                                    value={
                                                        det.installments > 1
                                                            ? `${det.installments} mensualidades de $${fmt(monthly)}`
                                                            : `${det.installments} pago`
                                                    }
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

                        {/* Botones de acción final */}
                        <div className="flex flex-col gap-3">
                            <button
                                className="w-full btn btn-primary gap-2"
                                onClick={() => navigate("/")}
                            >
                                <FaStore /> Seguir comprando
                            </button>
                            <button
                                className="w-full btn btn-ghost gap-2"
                                onClick={() => navigate("/mis-ordenes")}
                            >
                                <FaBoxOpen /> Ver mis pedidos
                            </button>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════
                    ENGAGEMENT: Recientes + Favoritos
                ══════════════════════════════════════ */}
                <div className="flex flex-col gap-6">
                    <RecentlyViewed excludeSkus={purchasedSkus} />
                    {isAuth && <FavoritesSectionV3 />}
                </div>
            </div>
        </PageFrame>
    );
};

export default PaymentExitingV2;