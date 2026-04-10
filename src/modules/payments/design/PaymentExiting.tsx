import { formatDate, formatPrice } from "../../products/Helpers";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
    FaCheckCircle,
    FaBoxOpen,
    FaReceipt,
    FaShippingFast,
    FaCreditCard,
    FaHome,
    FaPhone,
    FaMapMarkerAlt,
    FaTag,
    FaDownload,
    FaStore,
    FaFire,
    FaExclamationTriangle,
    FaTimesCircle,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { usePollingPaymentApprovedDetail } from "../usePayment";
import {
    formatOrderStatus,
    formatPaymentClass,
    paymentMethod,
    paymentProvider,
} from "../../shopping/utils/ShoppingUtils";
import { formatAxiosError } from "../../../api/helpers";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "../../shopping/states/paymentStore";
import clsx from "clsx";
import { useAuthStore } from "../../auth/states/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { shoppingCartQueryKeys } from "../../shopping/hooks/useFetchShoppingCart";

/* ─────────────────────────────────────────────
   Helpers de descuento (mismo patrón ShoppingCartItem)
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
   Helpers de UI
───────────────────────────────────────────── */

const Badge = ({ label, color = "gray" }: { label: string; color?: string }) => (
    <span
        className={clsx(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase",
            color === "success" && "bg-success/20 text-success",
            color === "warning" && "bg-warning/20 text-warning",
            color === "error" && "bg-error/20 text-error",
            color === "primary" && "bg-primary/10 text-primary",
            color === "gray" && "bg-base-200 text-base-content/70",
        )}
    >
        {label}
    </span>
);

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

const SummaryLine = ({
    label,
    value,
    sub,
    highlight,
    minus,
    large,
}: {
    label: string;
    value: string;
    sub?: string;
    highlight?: boolean;
    minus?: boolean;
    large?: boolean;
}) => (
    <div
        className={clsx(
            "flex justify-between items-start gap-2",
            large && "pt-3 mt-1 border-t border-base-200",
        )}
    >
        <div className="flex flex-col">
            <span
                className={clsx(
                    large ? "text-base font-bold text-base-content" : "text-sm text-base-content/70",
                    highlight && "text-success font-semibold",
                )}
            >
                {label}
            </span>
            {sub && <span className="text-xs text-base-content/40">{sub}</span>}
        </div>
        <span
            className={clsx(
                "font-semibold tabular-nums whitespace-nowrap",
                large ? "text-xl text-base-content font-bold" : "text-sm text-base-content",
                highlight && "text-success",
                minus && "text-success",
            )}
        >
            {minus ? "− " : "+ "}
            {value}
        </span>
    </div>
);

/* ─────────────────────────────────────────────
   Skeleton loader
───────────────────────────────────────────── */

const SkeletonLoader = () => (
    <div className="bg-base-300 rounded-3xl p-4 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="h-24 bg-base-200 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="h-64 bg-base-200 rounded-2xl animate-pulse" />
                <div className="lg:col-span-2 space-y-4">
                    <div className="h-40 bg-base-200 rounded-2xl animate-pulse" />
                    <div className="h-48 bg-base-200 rounded-2xl animate-pulse" />
                </div>
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

const PaymentExiting = () => {
    document.title = "Iga Productos | Pago procesado";

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { authCustomer } = useAuthStore();
    const { search } = useLocation();
    const { order: orderStore, success } = usePaymentStore();

    const query = new URLSearchParams(search);
    const orderUUID = query.get("external_reference");

    /* ── Guard: sin UUID ── */
    if (!orderUUID) {
        return (
            <div className="bg-base-300 rounded-3xl p-4 sm:p-8">
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="bg-base-100 rounded-2xl border border-error/20 p-8 max-w-md w-full text-center space-y-4">
                        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                            <FaReceipt className="text-error text-2xl" />
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

    const { data, error, isLoading } = usePollingPaymentApprovedDetail({ orderUUID });

    useEffect(() => {
        if (!data?.order) return;
        if (
            data.status === "APPROVED" &&
            data.order.details.order.uuid === orderStore?.orderUUID
        ) {
            success();
            if (authCustomer?.uuid) {
                queryClient.invalidateQueries({
                    queryKey: shoppingCartQueryKeys.shoppingCart(authCustomer.uuid),
                });
            }
        }
    }, [data?.order]);

    if (error) {
        const is404 = (error as any)?.response?.status === 404;

        return (
            <div className="bg-base-300 rounded-3xl p-4 sm:p-8">
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="bg-base-100 rounded-2xl border border-error/20 p-8 max-w-md w-full text-center space-y-4">
                        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                            {is404
                                ? <FaTimesCircle className="text-error text-2xl" />
                                : <FaExclamationTriangle className="text-error text-2xl" />
                            }
                        </div>
                        <h2 className="text-xl font-bold text-base-content">
                            {is404 ? "Orden no encontrada" : "Error al verificar el pago"}
                        </h2>
                        <p className="text-base-content/60 text-sm">
                            {is404
                                ? "No existe ninguna orden asociada a esta referencia de pago. Verifica tu correo de confirmación o contacta a soporte."
                                : "Ocurrió un error inesperado al consultar el estado de tu orden."
                            }
                        </p>
                        {!is404 && (
                            <p className="text-xs text-error bg-error/10 px-3 py-2 rounded-xl text-left font-mono break-all">
                                {formatAxiosError(error)}
                            </p>
                        )}
                        <p className="text-xs font-mono text-base-content/40">
                            Folio: {orderUUID}
                        </p>
                        <button className="btn btn-ghost w-full gap-2" onClick={() => navigate("/")}>
                            <FaStore /> Ir a la tienda
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Guard: cargando ── */
    if (isLoading || !data || !data.order) return <SkeletonLoader />;

    if (data.status !== "APPROVED")
        throw new Error("Error al obtener el estatus de la orden de compra");

    const { order } = data;
    const { address, items, details, customer } = order;
    const { resume } = details;

    const fmt = (n: number) => formatPrice(n.toString(), "es-MX");

    return (
        <div className="bg-base-300 rounded-3xl py-6 px-3 sm:px-6 animate-fade-in-up">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* ══════════════════════════════════════
                    HERO: bg-success
                ══════════════════════════════════════ */}
                <div className="bg-success rounded-2xl p-5 sm:p-8 text-success-content">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-success-content/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaCheckCircle className="text-2xl text-success-content" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-success-content/70">
                                    Pago procesado exitosamente
                                </p>
                                <h1 className="text-xl sm:text-2xl font-bold leading-tight text-success-content">
                                    ¡Gracias por tu compra!
                                </h1>
                                {customer && (
                                    <p className="text-success-content/70 text-sm mt-0.5">
                                        {customer.name} {customer.last_name} · {customer.email}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-success-content/20 text-success-content">
                                {formatOrderStatus[data.status]}
                            </span>
                            <p className="text-success-content/60 text-xs font-mono break-all max-w-xs text-right">
                                Folio: {orderUUID}
                            </p>
                            <p className="text-success-content/60 text-xs">
                                {formatDate(details.order.created_at, "es-MX")}
                            </p>
                        </div>
                    </div>

                    {/* Meta de la orden */}
                    <div className="mt-5 pt-5 border-t border-success-content/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-success-content/60 text-xs uppercase">Total pagado</p>
                            <p className="font-bold text-xl text-success-content">${fmt(resume.total)}</p>
                        </div>
                        <div>
                            <p className="text-success-content/60 text-xs uppercase">Proveedor</p>
                            <p className="font-semibold text-success-content">
                                {details.order.payment_provider === "mercado_pago" ? "Mercado Pago" : "PayPal"}
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
                                {details.order.is_guest_order ? "Invitado" : "Cliente registrado"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════
                    GRID PRINCIPAL
                ══════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* ── Columna izquierda: Envío + Resumen ── */}
                    <div className="space-y-5">

                        {/* Información de envío */}
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

                        {/* Resumen financiero */}
                        <SectionCard
                            icon={<FaReceipt />}
                            title="Resumen de pago"
                            accent="border-primary"
                        >
                            <div className="space-y-3">
                                <SummaryLine
                                    label="Subtotal (sin imp. ni desc.)"
                                    value={`$${fmt(resume.subtotalBeforeIVA)}`}
                                    sub="Precio base de productos"
                                />
                                <SummaryLine
                                    label="IVA (16%)"
                                    value={`$${fmt(resume.iva)}`}
                                />
                                {resume.discount > 0 && (
                                    <SummaryLine
                                        label="Descuentos aplicados"
                                        value={`$${fmt(resume.discount)}`}
                                        highlight
                                        minus
                                    />
                                )}
                                {resume.shippingCost > 0 && (
                                    <SummaryLine
                                        label={`Envío (${resume.boxesQty > 1 ? `${resume.boxesQty} cajas` : `${resume.boxesQty} caja`})`}
                                        value={`$${fmt(resume.shippingCost)}`}
                                    />
                                )}
                                <SummaryLine
                                    label="Total pagado"
                                    value={`$${fmt(resume.total)}`}
                                    large
                                />
                            </div>

                            {details.order.coupon_code && (
                                <div className="mt-4 flex items-center gap-2 bg-success/10 text-success text-xs font-semibold px-3 py-2 rounded-xl">
                                    <FaTag />
                                    Cupón aplicado:{" "}
                                    <span className="font-mono">{details.order.coupon_code}</span>
                                </div>
                            )}

                            <button
                                className="btn btn-outline btn-sm w-full mt-4 gap-2"
                                onClick={() => window.print()}
                            >
                                <FaDownload /> Descargar resumen
                            </button>
                        </SectionCard>
                    </div>

                    {/* ── Columna derecha: Productos + Pago ── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* ── Productos (estilo ShoppingCartItem) ── */}
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

                        {/* ── Detalle de pagos ── */}
                        <SectionCard
                            icon={<FaCreditCard />}
                            title="Detalle de pago"
                            accent="border-primary"
                        >
                            {/* Logo proveedor */}
                            <div className="flex items-center gap-3 mb-5">
                                <figure className="h-8">
                                    <img
                                        className="h-full object-contain"
                                        src={paymentProvider[details.order.payment_provider].image_url}
                                        alt={details.order.payment_provider}
                                    />
                                </figure>
                                <div className="text-xs text-base-content/40 space-y-0.5">
                                    <p>
                                        Folio de orden:{" "}
                                        <span className="font-mono text-base-content/70">
                                            {details.order.uuid}
                                        </span>
                                    </p>
                                    {details.order.aditional_resource_url && (
                                        <a
                                            href={details.order.aditional_resource_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-primary underline"
                                        >
                                            Ver recurso adicional
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {details.payments_details.map((det, index) => (
                                    <div
                                        key={`payment-${index}`}
                                        className="rounded-xl border border-base-200 overflow-hidden"
                                    >
                                        {/* Header pago */}
                                        <div className="bg-base-200 px-4 py-2.5 flex flex-wrap items-center gap-2">
                                            <figure className="h-6">
                                                <img
                                                    className="h-full object-contain"
                                                    src={paymentMethod[det.payment_method].image_url}
                                                    alt={paymentMethod[det.payment_method].description}
                                                />
                                            </figure>
                                            <span className="font-mono text-sm text-base-content/70">
                                                •••• •••• •••• {det.last_four_digits}
                                            </span>
                                            <Badge
                                                label={formatPaymentClass[det.payment_class]}
                                                color="gray"
                                            />
                                            <Badge
                                                label={formatOrderStatus[det.payment_status]}
                                                color={
                                                    det.payment_status === "APPROVED"
                                                        ? "success"
                                                        : det.payment_status === "PENDING"
                                                            ? "warning"
                                                            : "error"
                                                }
                                            />
                                        </div>

                                        {/* Cuerpo pago */}
                                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                                            <InfoRow
                                                label="Total pagado"
                                                value={`$${det.customer_paid_amount}`}
                                            />
                                            <InfoRow
                                                label="Fecha de acreditación"
                                                value={formatDate(det.updated_at, "es-MX")}
                                            />
                                            <InfoRow
                                                label="Fecha de creación"
                                                value={formatDate(det.created_at, "es-MX")}
                                            />

                                            {det.installments > 1 && (
                                                <div className="col-span-2 sm:col-span-3 bg-primary/10 rounded-xl p-3 space-y-1">
                                                    <p className="text-xs font-bold uppercase text-primary/70">
                                                        Meses sin intereses
                                                    </p>
                                                    <p className="text-primary font-semibold">
                                                        ${det.customer_installment_amount} × {det.installments} meses
                                                    </p>
                                                    <p className="text-xs text-primary/60">
                                                        * Las aclaraciones e incidencias con MSI se gestionan directamente con tu banco.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Info del cliente */}
                            {customer && (
                                <div className="mt-4 pt-4 border-t border-base-200 flex flex-col sm:flex-row gap-4 text-sm">
                                    <InfoRow
                                        label="Comprador"
                                        value={`${customer.name} ${customer.last_name}`}
                                    />
                                    <InfoRow
                                        label="Email de confirmación"
                                        value={customer.email}
                                        icon={<MdEmail />}
                                    />
                                </div>
                            )}
                        </SectionCard>

                        {/* ── CTA final ── */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                className="flex-1 btn btn-primary gap-2"
                                onClick={() => navigate("/")}
                            >
                                <FaStore /> Seguir comprando
                            </button>
                            <button
                                className="flex-1 btn btn-outline gap-2"
                                onClick={() => window.print()}
                            >
                                <FaDownload /> Descargar comprobante
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentExiting;