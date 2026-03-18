import { formatPrice } from "../../products/Helpers";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
    FaBoxOpen,
    FaShippingFast,
    FaHome,
    FaPhone,
    FaMapMarkerAlt,
    FaStore,
    FaFire,
    FaExclamationTriangle,
    FaTimesCircle,
    FaRedo,
} from "react-icons/fa";
import { MdOutlinePending } from "react-icons/md";
import { usePollingPaymentRejected } from "../usePayment";
import { formatAxiosError } from "../../../api/helpers";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import type { OrderStatusType } from "../../shopping/ShoppingTypes";
import { formatOrderStatus } from "../../shopping/utils/ShoppingUtils";

/* ─────────────────────────────────────────────
   Constantes de polling
───────────────────────────────────────────── */

const MAX_POLL_ATTEMPTS = 10; // intentos máximos antes de mostrar error de timeout

/* ─────────────────────────────────────────────
   Helpers de descuento (mismo patrón ShoppingCartItem / PaymentExiting)
───────────────────────────────────────────── */

const discountBg = (discount?: number | null) => {
    if (!discount) return "";
    if (discount < 50) return "bg-error";
    if (discount < 65) return "bg-success";
    return "bg-primary";
};

const discountText = (discount?: number | null) => {
    if (!discount) return "text-base-content";
    if (discount < 50) return "text-error";
    if (discount < 65) return "text-success";
    return "text-primary";
};

/* ─────────────────────────────────────────────
   Helpers de UI (idénticos a PaymentExiting)
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
   Skeleton loader (idéntico a PaymentExiting)
───────────────────────────────────────────── */

const SkeletonLoader = ({ attempts, maxAttempts }: { attempts: number; maxAttempts: number }) => (
    <div className="bg-base-300 rounded-3xl p-4 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Estado de polling */}
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

            {/* Skeleton de contenido */}
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
   Pantalla de timeout (max intentos alcanzados)
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
                    siendo procesado por el banco. Te recomendamos revisar tu correo de
                    confirmación o intentar de nuevo en unos minutos.
                </p>
                <p className="text-xs font-mono text-base-content/40 mt-2">
                    Folio: {orderUUID}
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                    className="flex-1 btn btn-primary gap-2"
                    onClick={onRetry}
                >
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

const PaymentError = () => {
    document.title = "Iga Productos | Error en el pago";

    const requiredStatus: OrderStatusType[] = ["IN_PROCESS", "REJECTED"];
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const orderUUID = query.get("external_reference");

    // Contador de intentos de polling
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

    const { data, error, isLoading, refetch } = usePollingPaymentRejected({ orderUUID });

    // Conteo de intentos: cada vez que el query se ejecuta sin datos confirmados
    useEffect(() => {
        if (isLoading && !data) return;
        if (!data) return;

        const statusResolved = data.status && requiredStatus.includes(data.status);
        if (statusResolved) return;

        if (data.status && !requiredStatus.includes(data.status)) {
            pollAttemptsRef.current += 1;
            setPollAttempts(pollAttemptsRef.current);

            if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
                setPollTimedOut(true);
            }
        }
    }, [data]);

    const handleRetry = () => {
        pollAttemptsRef.current = 0;
        setPollAttempts(0);
        setPollTimedOut(false);
        refetch();
    };

    /* ── Guard: error HTTP — detiene el polling inmediatamente (ej. 404) ── */
    if (error) {
        // Detectar si es un 404 específicamente
        const is404 = (error as any)?.response?.status === 404;

        return (
            <div className="bg-base-300 rounded-3xl p-4 sm:p-8">
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="bg-base-100 rounded-2xl border border-error/20 p-8 max-w-md w-full text-center space-y-4">
                        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                            <FaTimesCircle className="text-error text-2xl" />
                        </div>
                        <h2 className="font-bold text-base-content text-xl">
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
                                <button
                                    className="flex-1 btn btn-primary gap-2"
                                    onClick={handleRetry}
                                >
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

    /* ── Guard: timeout de polling ── */
    if (pollTimedOut) {
        return (
            <PollingTimeoutScreen orderUUID={orderUUID} onRetry={handleRetry} />
        );
    }

    /* ── Guard: cargando / polling ── */
    if (isLoading || !data || !data.order) {
        return (
            <SkeletonLoader
                attempts={pollAttempts}
                maxAttempts={MAX_POLL_ATTEMPTS}
            />
        );
    }

    if (!requiredStatus.includes(data.status))
        throw new Error("Error al obtener el estatus de la orden de compra");

    const { order } = data;
    const { address, items } = order;

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
                                        : "Tu orden aun esta en espera de tu pago. "}
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
                                Folio: {orderUUID}
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
                            <p
                                className={clsx(
                                    "text-xs uppercase",
                                    isRejected && "text-error-content/60",
                                    isInProcess && "text-warning-content/60",
                                )}
                            >
                                Productos
                            </p>
                            <p
                                className={clsx(
                                    "font-semibold",
                                    isRejected && "text-error-content",
                                    isInProcess && "text-warning-content",
                                )}
                            >
                                {items.length} {items.length === 1 ? "artículo" : "artículos"}
                            </p>
                        </div>
                        <div>
                            <p
                                className={clsx(
                                    "text-xs uppercase",
                                    isRejected && "text-error-content/60",
                                    isInProcess && "text-warning-content/60",
                                )}
                            >
                                Destino
                            </p>
                            <p
                                className={clsx(
                                    "font-semibold",
                                    isRejected && "text-error-content",
                                    isInProcess && "text-warning-content",
                                )}
                            >
                                {address.city}, {address.state}
                            </p>
                        </div>
                        <div>
                            <p
                                className={clsx(
                                    "text-xs uppercase",
                                    isRejected && "text-error-content/60",
                                    isInProcess && "text-warning-content/60",
                                )}
                            >
                                Destinatario
                            </p>
                            <p
                                className={clsx(
                                    "font-semibold",
                                    isRejected && "text-error-content",
                                    isInProcess && "text-warning-content",
                                )}
                            >
                                {address.recipient_name} {address.recipient_last_name}
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
                                        value={`${address.recipient_name} ${address.recipient_last_name}`}
                                    />
                                    <InfoRow
                                        label="Contacto"
                                        value={`${address.country_phone_code} ${address.contact_number}`}
                                        icon={<FaPhone />}
                                    />
                                </div>

                                <div className="bg-base-200 rounded-xl p-3 space-y-3">
                                    <p className="text-xs font-bold uppercase text-base-content/40">
                                        Domicilio
                                    </p>
                                    <InfoRow
                                        label="Calle y número"
                                        value={`${address.street_name} #${address.number}${address.aditional_number ? ` int. ${address.aditional_number}` : ""}`}
                                        icon={<FaHome />}
                                    />
                                    {address.floor && (
                                        <InfoRow label="Piso" value={address.floor} />
                                    )}
                                    <InfoRow label="Colonia / Fracc." value={address.neighborhood} />
                                    <InfoRow
                                        label="Ciudad y Estado"
                                        value={`${address.city}, ${address.state}`}
                                        icon={<FaMapMarkerAlt />}
                                    />
                                    <InfoRow label="Localidad" value={address.locality} />
                                    <InfoRow
                                        label="País"
                                        value={`${address.country} · CP ${address.zip_code}`}
                                    />
                                    <InfoRow label="Tipo de dirección" value={address.address_type} />
                                </div>

                                <div className="bg-warning/10 rounded-xl p-3 space-y-2">
                                    <p className="text-xs font-bold uppercase text-warning">
                                        Comentarios / Referencias
                                    </p>
                                    <p className="text-sm text-base-content">
                                        {address.references_or_comments || (
                                            <span className="italic text-base-content/30">
                                                Sin comentarios adicionales
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </SectionCard>
                    </div>

                    {/* ── Columna derecha: Productos + CTA ── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Productos */}
                        <SectionCard
                            icon={<FaBoxOpen />}
                            title={`Productos del pedido (${items.length})`}
                            accent="border-primary"
                        >
                            <div className="flex flex-col gap-4">
                                {items.map((item, index) => {
                                    const hasDiscount =
                                        item.isOffer &&
                                        item.discount &&
                                        item.discount > 0 &&
                                        item.product_version.unit_price_with_discount;

                                    const mainImage =
                                        item.product_images.find((img) => img.main_image)?.image_url
                                        ?? item.product_images[0]?.image_url;

                                    const subtotal =
                                        parseFloat(item.product_version.unit_price) * item.quantity;
                                    const subtotalWithDisc = hasDiscount
                                        ? parseFloat(item.product_version.unit_price_with_discount!) * item.quantity
                                        : 0;

                                    return (
                                        <div
                                            key={`item-${index}`}
                                            className="w-full rounded-2xl bg-base-100 border border-base-300 hover:border-primary/30 transition-colors duration-200 p-3 sm:p-4"
                                        >
                                            <div className="flex gap-3 sm:gap-4">
                                                {/* Imagen */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border border-base-300">
                                                        <img
                                                            src={mainImage}
                                                            alt={item.product_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Contenido principal */}
                                                <div className="flex-1 min-w-0 flex flex-col gap-2">
                                                    {/* Nombre + badge oferta */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="text-sm sm:text-base font-bold text-base-content leading-snug">
                                                            {item.product_name}
                                                        </p>
                                                        {item.isOffer && item.discount && (
                                                            <span className={clsx(
                                                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold flex-shrink-0",
                                                                discountBg(item.discount)
                                                            )}>
                                                                <FaFire className="text-[10px]" />
                                                                {item.discount}% OFF
                                                            </span>
                                                        )}
                                                        {item.isFavorite && (
                                                            <span className="text-xs">⭐</span>
                                                        )}
                                                    </div>

                                                    {/* Breadcrumbs categorías */}
                                                    <div className="breadcrumbs text-xs text-base-content/50 bg-base-200 w-fit rounded-lg px-2 sm:px-3 py-0.5">
                                                        <ul>
                                                            <li>
                                                                <strong className="text-base-content/70">
                                                                    {item.category}
                                                                </strong>
                                                            </li>
                                                            {item.subcategories.map((sub, i) => (
                                                                <li key={i}>
                                                                    <strong className="text-base-content/70">
                                                                        {sub}
                                                                    </strong>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Color */}
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className="w-4 h-4 rounded-full border border-base-300 flex-shrink-0 shadow-sm"
                                                            style={{ backgroundColor: item.product_version.color_code }}
                                                        />
                                                        <span className="text-xs sm:text-sm text-base-content/60">
                                                            {item.product_version.color_line} —{" "}
                                                            <span className="text-base-content font-medium">
                                                                {item.product_version.color_name}
                                                            </span>
                                                        </span>
                                                    </div>

                                                    {/* SKU */}
                                                    <span className="text-xs font-mono text-base-content/40 w-fit bg-base-200 px-2 py-0.5 rounded-lg">
                                                        SKU: {item.product_version.sku}
                                                    </span>

                                                    {/* Cantidad + Precios */}
                                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-1">
                                                        {/* Cantidad */}
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-xs text-base-content/50 uppercase">
                                                                Cantidad
                                                            </span>
                                                            <span className="btn btn-primary btn-sm w-fit pointer-events-none">
                                                                {item.quantity} pz
                                                            </span>
                                                        </div>

                                                        {/* Precios */}
                                                        <div className="flex gap-4 sm:gap-6 items-end">
                                                            {/* Precio unitario */}
                                                            <div className="flex flex-col items-start sm:items-end">
                                                                <span className="text-[10px] sm:text-xs text-base-content/40 uppercase mb-0.5">
                                                                    Precio unitario
                                                                </span>
                                                                {hasDiscount ? (
                                                                    <div className="flex flex-col items-start sm:items-end">
                                                                        <span className={clsx("text-base sm:text-lg font-bold", discountText(item.discount))}>
                                                                            ${formatPrice(item.product_version.unit_price_with_discount!, "es-MX")}
                                                                        </span>
                                                                        <span className="text-xs line-through text-base-content/30">
                                                                            ${formatPrice(item.product_version.unit_price, "es-MX")}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-base sm:text-lg font-bold text-base-content">
                                                                        ${formatPrice(item.product_version.unit_price, "es-MX")}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Separador */}
                                                            <div className="w-px h-10 bg-base-300 hidden sm:block" />

                                                            {/* Subtotal */}
                                                            <div className="flex flex-col items-start sm:items-end">
                                                                <span className="text-[10px] sm:text-xs text-base-content/40 uppercase mb-0.5">
                                                                    Subtotal
                                                                </span>
                                                                {hasDiscount ? (
                                                                    <div className="flex flex-col items-start sm:items-end">
                                                                        <span className={clsx("text-lg sm:text-xl font-extrabold", discountText(item.discount))}>
                                                                            ${formatPrice(subtotalWithDisc.toString(), "es-MX")}
                                                                        </span>
                                                                        <span className="text-xs line-through text-base-content/30">
                                                                            ${formatPrice(subtotal.toString(), "es-MX")}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-lg sm:text-xl font-extrabold text-base-content">
                                                                        ${formatPrice(subtotal.toString(), "es-MX")}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </SectionCard>

                        {/* ── CTA: acción según status ── */}
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
                                <p className="text-sm text-base-content/60">
                                    {isRejected
                                        ? "El pago fue rechazado por el proveedor. Verifica los datos de tu tarjeta o utiliza otro método de pago."
                                        : "Tu transacción está siendo revisada. Recibirás una confirmación por correo electrónico en breve."}
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

export default PaymentError;