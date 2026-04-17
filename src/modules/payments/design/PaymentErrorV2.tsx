import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
    FaBoxOpen,
    FaShippingFast,
    FaHome,
    FaPhone,
    FaMapMarkerAlt,
    FaStore,
    FaRedo,
    FaExclamationTriangle,
    FaTimesCircle,
} from "react-icons/fa";
import { MdOutlinePending } from "react-icons/md";
import { usePollingPaymentRejectedV2 } from "../usePayment";
import {
    formatOrderStatus,
} from "../../shopping/utils/ShoppingUtils";
import { formatAxiosError } from "../../../api/helpers";
import clsx from "clsx";
import CheckoutOrderItemV2 from "../../shopping/components/CheckoutOrderItemV2";

/* ─────────────────────────────────────────────
   Constantes de polling
 ───────────────────────────────────────────── */

const MAX_POLL_ATTEMPTS = 10;

/* ─────────────────────────────────────────────
   Helpers de UI
 ───────────────────────────────────────────── */

const InfoRow = ({
    label,
    value,
    icon,
}: {
    label: string;
    value?: string | null;
    icon?: React.ReactNode;
}) => (
    <div className="flex flex-col gap-0.5">
        <p className="text-xs font-semibold uppercase text-base-content/40 flex items-center gap-1">
            {icon && <span className="opacity-70">{icon}</span>}
            {label}
        </p>
        <p className="text-sm text-base-content break-words leading-snug">
            {value || <span className="italic text-base-content/30">—</span>}
        </p>
    </div>
);

const SectionCard = ({
    icon,
    title,
    children,
    accent,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    accent?: string;
}) => (
    <div
        className={clsx(
            "bg-base-100 rounded-2xl border border-base-200 overflow-hidden",
            accent && `border-l-4 ${accent}`,
        )}
    >
        <div className="px-5 py-4 border-b border-base-200 flex items-center gap-3">
            <span className="text-primary text-lg">{icon}</span>
            <h2 className="font-bold text-base-content text-base">{title}</h2>
        </div>
        <div className="px-5 py-5">{children}</div>
    </div>
);

/* ─────────────────────────────────────────────
   Skeleton loader
 ───────────────────────────────────────────── */

const SkeletonLoader = ({ attempts, maxAttempts }: { attempts: number; maxAttempts: number }) => (
    <div className="bg-base-300 rounded-3xl p-4 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-base-100 rounded-2xl border border-base-200 p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                    <div className="h-24 bg-base-200 rounded-2xl animate-pulse" />
                </div>
            </div>
        </div>
    </div>
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
    <div className="bg-base-300 rounded-3xl p-4 sm:p-8">
        <div className="max-w-md mx-auto flex flex-col items-center text-center gap-6 py-8">
            <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-warning text-3xl" />
            </div>
            <div className="space-y-2">
                <h1 className="text-xl font-bold text-base-content">
                    No pudimos confirmar tu orden
                </h1>
                <p className="text-base-content/60 text-sm">
                    Excedimos el número de intentos de verificación. Tu pago puede estar
                    siendo procesado por el banco o fue rechazado. Te recomendamos revisar tu
                    correo o intentar de nuevo en unos minutos.
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
    </div>
);

/* ─────────────────────────────────────────────
   Main component
 ───────────────────────────────────────────── */

const PaymentErrorV2 = () => {
    document.title = "Iga Productos | Error en el pago";

    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const orderUUID = query.get("external_reference");

    const pollAttemptsRef = useRef(0);
    const [pollTimedOut, setPollTimedOut] = useState(false);
    const [pollAttempts, setPollAttempts] = useState(0);

    /* ── Guard: sin UUID ── */
    if (!orderUUID) {
        return (
            <div className="bg-base-300 rounded-3xl p-4 sm:p-8">
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="bg-base-100 rounded-2xl border border-error/20 p-8 max-w-md w-full text-center space-y-4">
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
            </div>
        );
    }

    const { data, error, isLoading, refetch } = usePollingPaymentRejectedV2({ orderUUID });

    useEffect(() => {
        if (isLoading && !data) return;
        if (!data) return;

        const isResolved = data.status === "REJECTED" || data.status === "IN_PROCESS";
        if (isResolved) return;

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
        const is404 = (error as any)?.response?.status === 404;

        return (
            <div className="bg-base-300 rounded-3xl p-4 sm:p-8">
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="bg-base-100 rounded-2xl border border-error/20 p-8 max-w-md w-full text-center space-y-4">
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
            </div>
        );
    }

    /* ── Guard: timeout ── */
    if (pollTimedOut) {
        return <PollingTimeoutScreen orderUUID={orderUUID} onRetry={handleRetry} />;
    }

    /* ── Guard: cargando / polling ── */
    if (isLoading || !data || !data.order) {
        return <SkeletonLoader attempts={pollAttempts} maxAttempts={MAX_POLL_ATTEMPTS} />;
    }

    if (data.status !== "REJECTED" && data.status !== "IN_PROCESS") throw new Error("Error al obtener el estatus de la orden de compra");

    const { order } = data;
    const { shipping, items } = order;
    const isRejected = data.status === "REJECTED";
    const isInProcess = data.status === "IN_PROCESS";

    return (
        <div className="bg-base-300 rounded-3xl py-6 px-3 sm:px-6 animate-fade-in-up">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* ══════════════════════════════════════
                    HERO: error/warning según status
                ══════════════════════════════════════ */}
                <div
                    className={clsx(
                        "rounded-2xl p-5 sm:p-8",
                        isRejected && "bg-error text-error-content",
                        isInProcess && "bg-warning text-warning-content",
                    )}
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div
                                className={clsx(
                                    "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                                    isRejected && "bg-error-content/20",
                                    isInProcess && "bg-warning-content/20",
                                )}
                            >
                                {isRejected
                                    ? <FaTimesCircle className="text-2xl text-error-content" />
                                    : <MdOutlinePending className="text-2xl text-warning-content" />
                                }
                            </div>
                            <div>
                                <p
                                    className={clsx(
                                        "text-xs font-semibold uppercase",
                                        isRejected && "text-error-content/70",
                                        isInProcess && "text-warning-content/70",
                                    )}
                                >
                                    {isRejected ? "Pago rechazado" : "Orden en proceso"}
                                </p>
                                <h1
                                    className={clsx(
                                        "text-xl sm:text-2xl font-bold leading-tight",
                                        isRejected && "text-error-content",
                                        isInProcess && "text-warning-content",
                                    )}
                                >
                                    {isRejected
                                        ? "Ocurrió un error al procesar tu pago"
                                        : "Tu orden aún está en espera de tu pago"}
                                </h1>
                                <p
                                    className={clsx(
                                        "text-sm mt-0.5",
                                        isRejected && "text-error-content/70",
                                        isInProcess && "text-warning-content/70",
                                    )}
                                >
                                    {isRejected
                                        ? "Puedes intentar realizar tu pago nuevamente."
                                        : "Puedes volver a finalizar tu pago en el carrito de compras."}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span
                                className={clsx(
                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase",
                                    isRejected && "bg-error-content/20 text-error-content",
                                    isInProcess && "bg-warning-content/20 text-warning-content",
                                )}
                            >
                                {formatOrderStatus[data.status]}
                            </span>
                            <p
                                className={clsx(
                                    "text-xs font-mono break-all max-w-xs text-right",
                                    isRejected && "text-error-content/60",
                                    isInProcess && "text-warning-content/60",
                                )}
                            >
                                Folio: {order.orderUUID}
                            </p>
                        </div>
                    </div>

                    {/* Meta de la orden */}
                    <div
                        className={clsx(
                            "mt-5 pt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm border-t",
                            isRejected && "border-error-content/20",
                            isInProcess && "border-warning-content/20",
                        )}
                    >
                        <div>
                            <p className={clsx("text-xs uppercase opacity-60")}>Productos</p>
                            <p className="font-semibold">
                                {items.length} {items.length === 1 ? "artículo" : "artículos"}
                            </p>
                        </div>
                        <div>
                            <p className={clsx("text-xs uppercase opacity-60")}>Destino</p>
                            <p className="font-semibold">
                                {shipping.city}, {shipping.state}
                            </p>
                        </div>
                        <div>
                            <p className={clsx("text-xs uppercase opacity-60")}>Destinatario</p>
                            <p className="font-semibold">
                                {shipping.recipient_name} {shipping.recipient_last_name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════
                    GRID PRINCIPAL
                ══════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* ── Columna izquierda: Envío ── */}
                    <div className="space-y-5">
                        <SectionCard
                            icon={<FaShippingFast />}
                            title="Información de envío"
                            accent="border-primary"
                        >
                            <div className="space-y-4">
                                <div className="bg-primary/5 rounded-xl p-3 space-y-3">
                                    <p className="text-xs font-bold uppercase text-primary/70">
                                        Destinatario
                                    </p>
                                    <InfoRow
                                        label="Nombre completo"
                                        value={`${shipping.recipient_name} ${shipping.recipient_last_name}`}
                                    />
                                    <InfoRow
                                        label="Contacto"
                                        value={`${shipping.country_phone_code} ${shipping.contact_number}`}
                                        icon={<FaPhone />}
                                    />
                                </div>

                                <div className="bg-base-200 rounded-xl p-3 space-y-3">
                                    <p className="text-xs font-bold uppercase text-base-content/40">
                                        Domicilio
                                    </p>
                                    <InfoRow
                                        label="Calle y número"
                                        value={`${shipping.street_name} #${shipping.number}${shipping.aditional_number ? ` int. ${shipping.aditional_number}` : ""}`}
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
                                        value={`${shipping.country} · CP ${shipping.zip_code}`}
                                    />
                                    <InfoRow label="Tipo de dirección" value={shipping.address_type} />
                                </div>
                            </div>
                        </SectionCard>
                    </div>

                    {/* ── Columna derecha: Productos + CTA ── */}
                    <div className="lg:col-span-2 space-y-5">
                        <SectionCard
                            icon={<FaBoxOpen />}
                            title={`Productos del pedido (${items.length})`}
                            accent="border-primary"
                        >
                            <div className="flex flex-col gap-4">
                                {items.map((item, idx) => (
                                    <CheckoutOrderItemV2 key={`${item.sku}-${idx}`} data={item} />
                                ))}
                            </div>
                        </SectionCard>

                        <div
                            className={clsx(
                                "bg-base-100 rounded-2xl border overflow-hidden",
                                isRejected && "border-error/30",
                                isInProcess && "border-warning/30",
                            )}
                        >
                            <div
                                className={clsx(
                                    "px-5 py-4 border-b flex items-center gap-3",
                                    isRejected && "border-error/20 bg-error/5",
                                    isInProcess && "border-warning/20 bg-warning/5",
                                )}
                            >
                                {isRejected
                                    ? <FaTimesCircle className="text-error text-lg flex-shrink-0" />
                                    : <MdOutlinePending className="text-warning text-lg flex-shrink-0" />
                                }
                                <h2 className="font-bold text-base-content text-base">
                                    {isRejected
                                        ? "Tu pago no se pudo completar"
                                        : "Tu pago está en proceso"}
                                </h2>
                            </div>
                            <div className="px-5 py-5 space-y-3">
                                <p className="text-sm text-base-content/60 text-balance">
                                    {isRejected
                                        ? "El pago fue rechazado por el proveedor. Verifica los datos de tu tarjeta o utiliza otro método de pago."
                                        : "Tu transacción está siendo revisada. Recibirás una confirmación por correo electrónico en cuanto el pago sea aprobado."}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {isRejected && (
                                        <Link
                                            to="/pagar-productos"
                                            className="flex-1 btn btn-primary gap-2"
                                        >
                                            <FaRedo /> Intentar pagar nuevamente
                                        </Link>
                                    )}
                                    <button
                                        className="flex-1 btn btn-ghost gap-2"
                                        onClick={() => navigate("/")}
                                    >
                                        <FaStore /> Volver a la tienda
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentErrorV2;
