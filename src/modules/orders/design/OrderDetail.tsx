import { FaArrowLeft, FaBox, FaPrint, FaShippingFast, FaCreditCard, FaReceipt, FaMapMarkerAlt, FaFire } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import { Link, useSearchParams } from "react-router-dom";
import { useFetchOrderDetail } from "../hooks/useFetchOrders";
import { formatAxiosError } from "../../../api/helpers";
import { formatDate, formatPrice, makeSlug } from "../../products/Helpers";
import { formatOrderStatus, formatPaymentClass, paymentMethod, paymentProvider } from "../../shopping/utils/ShoppingUtils";
import clsx from "clsx";
import { formatShippingStatus } from "../../payments/helpers";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

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
   Helper: badge de status (mismo que Orders)
───────────────────────────────────────────── */

const orderStatusBadge = (status: string) => {
    switch (status) {
        case "APPROVED": return "bg-success/20 text-success";
        case "PENDING": return "bg-warning/20 text-warning";
        case "REJECTED":
        case "CANCELLED": return "bg-error/20 text-error";
        case "IN_PROCESS": return "bg-info/20 text-info";
        case "REFUNDED": return "bg-base-200 text-base-content/70";
        default: return "bg-base-200 text-base-content/70";
    }
};

/* ─────────────────────────────────────────────
   Helpers de UI
───────────────────────────────────────────── */

const InfoRow = ({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) => (
    <div className="flex flex-col gap-0.5">
        <p className="text-xs font-semibold uppercase text-base-content/40">{label}</p>
        <p className="text-sm text-base-content break-words leading-snug">
            {value || <span className="italic text-base-content/30">—</span>}
        </p>
    </div>
);

const SectionCard = ({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) => (
    <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
        <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center gap-3">
            <span className="text-primary text-base">{icon}</span>
            <h2 className="font-bold text-base-content text-sm uppercase">{title}</h2>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
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
    <div className={clsx("flex justify-between items-start gap-2", large && "pt-3 mt-1 border-t border-base-300")}>
        <div className="flex flex-col">
            <span className={clsx(
                large ? "text-base font-bold text-base-content" : "text-sm text-base-content/70",
                highlight && "text-success font-semibold",
            )}>
                {label}
            </span>
            {sub && <span className="text-xs text-base-content/40">{sub}</span>}
        </div>
        <span className={clsx(
            "font-semibold tabular-nums whitespace-nowrap",
            large ? "text-xl text-base-content font-bold" : "text-sm text-base-content",
            highlight && "text-success",
            minus && "text-success",
        )}>
            {minus ? "− " : "+ "}{value}
        </span>
    </div>
);

/* ─────────────────────────────────────────────
   Skeleton loader
───────────────────────────────────────────── */

const SkeletonLoader = () => (
    <div className="flex flex-col gap-4">
        <div className="h-24 bg-base-100 border border-base-300 rounded-2xl animate-pulse" />
        <div className="h-40 bg-base-100 border border-base-300 rounded-2xl animate-pulse" />
        <div className="h-64 bg-base-100 border border-base-300 rounded-2xl animate-pulse" />
        <div className="h-48 bg-base-100 border border-base-300 rounded-2xl animate-pulse" />
    </div>
);

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

const OrderDetail = () => {
    document.title = "Iga Productos | Detalle de orden";

    const [searchParams] = useSearchParams();
    const orderUUID = searchParams.get("folio");
    const { data, isLoading, error, refetch } = useFetchOrderDetail({ orderUUID: orderUUID! });
    const printContent = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printContent,
        documentTitle: "Detalle de orden",
    });

    return (
        <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FaList className="text-primary text-lg sm:text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                            Detalle de orden
                        </h1>
                        <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                            Revisa a detalle tu orden de compra
                        </p>
                    </div>
                </div>
                <Link
                    to="/mis-ordenes"
                    className="btn btn-ghost btn-sm gap-2 w-full sm:w-auto"
                >
                    <FaArrowLeft className="text-xs" />
                    Regresar a mis órdenes
                </Link>
            </div>

            {/* ── Loading ── */}
            {isLoading && !error && !data && <SkeletonLoader />}

            {/* ── Error ── */}
            {!isLoading && !data && error && (
                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                    <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
                            <FaBox className="text-error text-sm" />
                        </div>
                        <h2 className="font-bold text-base-content text-sm uppercase">
                            Error al cargar la orden
                        </h2>
                    </div>
                    <div className="p-5 space-y-3">
                        <p className="text-sm text-base-content/70">{formatAxiosError(error)}</p>
                        <button className="btn btn-primary btn-sm gap-2" onClick={() => refetch()}>
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            )}

            {/* ── Sin datos de orden ── */}
            {!isLoading && !error && data && !data.order && (
                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center">
                            <FaBox className="text-3xl text-base-content/20" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-base-content">
                                No se encontró la orden
                            </p>
                            <p className="text-sm text-base-content/50 mt-1">
                                Ocurrió un error inesperado al obtener los datos de tu orden
                            </p>
                        </div>
                        <button className="btn btn-primary btn-sm gap-2" onClick={() => refetch()}>
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            )}

            {/* ── Contenido principal ── */}
            {!isLoading && !error && data?.order && (
                <div className="flex flex-col gap-4" ref={printContent}>

                    {/* Folio + status */}
                    <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                        <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <p className="text-xs font-mono text-base-content/50 truncate">
                                Folio:{" "}
                                <span className="text-base-content/80">{data.order.details.order.uuid}</span>
                            </p>
                            <span className={clsx(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase w-fit",
                                orderStatusBadge(data.order.details.order.status)
                            )}>
                                {formatOrderStatus[data.order.details.order.status]}
                            </span>
                        </div>
                        <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <InfoRow
                                label="Pedido"
                                value={formatDate(data.order.details.order.created_at, "es-MX")}
                            />
                            <InfoRow
                                label="Última actualización"
                                value={formatDate(data.order.details.order.updated_at, "es-MX")}
                            />
                            <InfoRow
                                label="Proveedor de pago"
                                value={data.order.details.order.payment_provider === "mercado_pago" ? "Mercado Pago" : "PayPal"}
                            />
                        </div>
                    </div>

                    {/* Dirección de envío */}
                    <SectionCard icon={<FaMapMarkerAlt />} title="Dirección de envío">
                        <div className="space-y-3">
                            <div>
                                <p className="text-base sm:text-lg font-bold text-base-content">
                                    {data.order.address.recipient_name} {data.order.address.recipient_last_name}
                                </p>
                                <p className="text-sm text-base-content/60">
                                    {data.order.address.country_phone_code} {data.order.address.contact_number}
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-xl p-3 space-y-2">
                                <InfoRow
                                    label="Calle y número"
                                    value={`${data.order.address.street_name} #${data.order.address.number}${data.order.address.aditional_number && data.order.address.aditional_number !== "N/A" ? ` int. ${data.order.address.aditional_number}` : ""}`}
                                />
                                <InfoRow label="Colonia / Fracc." value={data.order.address.neighborhood} />
                                <div className="grid grid-cols-2 gap-3">
                                    <InfoRow label="Ciudad y Estado" value={`${data.order.address.city}, ${data.order.address.state}`} />
                                    <InfoRow label="CP" value={data.order.address.zip_code} />
                                    <InfoRow label="País" value={data.order.address.country} />
                                    <InfoRow label="Tipo de dirección" value={data.order.address.address_type} />
                                </div>
                            </div>

                            {data.order.address.references_or_comments &&
                                data.order.address.references_or_comments !== "N/A" && (
                                    <div className="bg-warning/10 rounded-xl p-3 space-y-1">
                                        <p className="text-xs font-bold uppercase text-warning">
                                            Comentarios / Referencias
                                        </p>
                                        <p className="text-sm text-base-content break-words">
                                            {data.order.address.references_or_comments}
                                        </p>
                                    </div>
                                )}
                        </div>
                    </SectionCard>

                    {/* Detalles del envío */}
                    {data.order.details.shipping && (
                        <SectionCard icon={<FaShippingFast />} title="Detalles del envío">
                            {data.order.details.shipping.tracking_number && (
                                <div className="mb-4 flex items-center gap-2 bg-primary/5 rounded-xl px-3 py-2">
                                    <span className="text-xs font-semibold uppercase text-primary/70">Guía de envío</span>
                                    <span className="text-sm font-mono text-primary break-all">
                                        {data.order.details.shipping.tracking_number}
                                    </span>
                                </div>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                <InfoRow
                                    label="Solicitado"
                                    value={formatDate(data.order.details.shipping.created_at, "es-MX")}
                                />
                                <InfoRow
                                    label="Última actualización"
                                    value={formatDate(data.order.details.shipping.updated_at, "es-MX")}
                                />
                                <InfoRow
                                    label="Estatus de envío"
                                    value={formatShippingStatus(data.order.details.shipping.shipping_status)}
                                />
                                <InfoRow
                                    label="Enviado por"
                                    value={data.order.details.shipping.carrier ?? "En proceso"}
                                />
                                <InfoRow
                                    label="Cajas"
                                    value={String(data.order.details.shipping.boxes_count)}
                                />
                            </div>
                        </SectionCard>
                    )}

                    {/* Resumen de pedido — productos */}
                    <SectionCard icon={<FaList />} title={`Resumen de pedido (${data.order.items.length} ${data.order.items.length === 1 ? "producto" : "productos"})`}>
                        <div className="flex flex-col gap-4">
                            {data.order.items.map((item, index) => {
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

                                const productUrl = `/tienda/${item.category.toLowerCase()}/${makeSlug(item.product_name)}/${item.product_version.sku.toLowerCase()}`;

                                return (
                                    <div
                                        key={index}
                                        className="w-full rounded-2xl bg-base-100 border border-base-300 hover:border-primary/30 transition-colors duration-200 p-3 sm:p-4"
                                    >
                                        <div className="flex gap-3 sm:gap-4">
                                            {/* Imagen */}
                                            <Link to={productUrl} className="flex-shrink-0 group">
                                                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border border-base-300 group-hover:border-primary/50 transition-colors duration-200">
                                                    <img
                                                        src={mainImage}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            </Link>

                                            {/* Contenido */}
                                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                                {/* Nombre + badge oferta */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Link
                                                        to={productUrl}
                                                        className="text-sm sm:text-base font-bold text-base-content hover:text-primary hover:underline underline-offset-2 transition-colors duration-150 leading-snug"
                                                    >
                                                        {item.product_name}
                                                    </Link>
                                                    {item.isOffer && item.discount && (
                                                        <span className={clsx(
                                                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold flex-shrink-0",
                                                            discountBg(item.discount)
                                                        )}>
                                                            <FaFire className="text-[10px]" />
                                                            {item.discount}% OFF
                                                        </span>
                                                    )}
                                                    {item.isFavorite && <span className="text-xs">⭐</span>}
                                                </div>

                                                {/* Breadcrumbs */}
                                                <div className="breadcrumbs text-xs text-base-content/50 bg-base-200 w-fit rounded-lg px-2 sm:px-3 py-0.5">
                                                    <ul>
                                                        <li><strong className="text-base-content/70">{item.category}</strong></li>
                                                        {item.subcategories.map((sub, i) => (
                                                            <li key={i}><strong className="text-base-content/70">{sub}</strong></li>
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
                                                    {/* Cantidad (solo lectura) */}
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-base-content/50 uppercase">Cantidad</span>
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
                        <div className="mt-4 pt-3 border-t border-base-300 flex justify-end">
                            <p className="text-sm text-base-content/60">
                                Subtotal ({data.order.items.length} {data.order.items.length === 1 ? "producto" : "productos"}):&nbsp;
                                <span className="font-bold text-base-content">
                                    ${formatPrice(data.order.details.resume.subtotalWithDiscount.toString(), "es-MX")}
                                </span>
                            </p>
                        </div>
                    </SectionCard>

                    {/* Resumen de pago */}
                    <SectionCard icon={<FaCreditCard />} title="Resumen de pago">
                        {/* Logo proveedor */}
                        <div className="flex items-center gap-3 mb-5">
                            <figure className="h-8">
                                <img
                                    className="h-full object-contain"
                                    src={paymentProvider[data.order.details.order.payment_provider].image_url}
                                    alt={data.order.details.order.payment_provider}
                                />
                            </figure>
                            <p className="text-xs text-base-content/40 font-mono">
                                UUID: {data.order.details.order.uuid}
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
                            {/* Detalles de cada pago */}
                            <div className="flex-1 flex flex-col gap-4">
                                {data.order.details.payments_details.map((det, index) => (
                                    <div
                                        key={`payment-${index}`}
                                        className="rounded-xl border border-base-200 overflow-hidden"
                                    >
                                        {/* Header */}
                                        <div className="bg-base-200 px-4 py-2.5 flex flex-wrap items-center gap-2">
                                            <figure className="h-6">
                                                <img
                                                    className="h-full object-contain"
                                                    src={paymentMethod[det.payment_method].image_url}
                                                    alt={paymentMethod[det.payment_method].description}
                                                />
                                            </figure>
                                            {(det.payment_class === "credit_card" || det.payment_class === "debit_card") && (
                                                <span className="font-mono text-sm text-base-content/70">
                                                    •••• •••• •••• {det.last_four_digits}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-base-300 text-base-content/70">
                                                {formatPaymentClass[det.payment_class]}
                                            </span>
                                            <span className={clsx(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase",
                                                orderStatusBadge(det.payment_status)
                                            )}>
                                                {formatOrderStatus[det.payment_status]}
                                            </span>
                                        </div>

                                        {/* Body */}
                                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <InfoRow label="Total pagado" value={`$${det.customer_paid_amount}`} />
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
                                                    <p className="text-primary font-semibold text-sm">
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

                            {/* Totales */}
                            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                                <SectionCard icon={<FaReceipt />} title="Desglose">
                                    <div className="space-y-3">
                                        <SummaryLine
                                            label="Subtotal (sin imp. ni desc.)"
                                            value={`$${formatPrice(data.order.details.resume.subtotalBeforeIVA.toString(), "es-MX")}`}
                                            sub="Precio base de productos"
                                        />
                                        <SummaryLine
                                            label="IVA (16%)"
                                            value={`$${formatPrice(data.order.details.resume.iva.toString(), "es-MX")}`}
                                        />
                                        {data.order.details.resume.shippingCost > 0 && (
                                            <SummaryLine
                                                label={`Envío (${data.order.details.resume.boxesQty > 1 ? `${data.order.details.resume.boxesQty} cajas` : `${data.order.details.resume.boxesQty} caja`})`}
                                                value={`$${formatPrice(data.order.details.resume.shippingCost.toString(), "es-MX")}`}
                                            />
                                        )}
                                        {data.order.details.resume.discount > 0 && (
                                            <SummaryLine
                                                label="Descuentos aplicados"
                                                value={`$${formatPrice(data.order.details.resume.discount.toString(), "es-MX")}`}
                                                highlight
                                                minus
                                            />
                                        )}
                                        <SummaryLine
                                            label="Total"
                                            value={`$${formatPrice(data.order.details.resume.total.toString(), "es-MX")}`}
                                            large
                                        />
                                    </div>
                                </SectionCard>
                            </div>
                        </div>
                    </SectionCard>

                    {/* CTA imprimir */}
                    <div className="flex justify-end">
                        <button
                            className="btn btn-outline btn-sm gap-2"
                            onClick={() => handlePrint()}
                        >
                            <FaPrint /> Imprimir orden
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;