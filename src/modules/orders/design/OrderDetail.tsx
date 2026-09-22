import {
    FaArrowLeft,
    FaBoxOpen,
    FaChevronDown,
    FaChevronUp,
    FaCreditCard,
    FaDownload,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaHourglassHalf,
    FaHome,
    FaPhone,
    FaReceipt,
    FaRedo,
    FaShippingFast,
    FaTag,
    FaUser,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { formatAxiosError } from "../../../api/helpers";
import { formatDate, formatPrice } from "../../products/Helpers";
import { formatOrderStatus, formatPaymentClass, getPaymentMethodDetails, getPaymentProviderDetails } from "../../shopping/utils/ShoppingUtils";
import clsx from "clsx";
import { useRef, useState } from "react";
import { useThemeStore } from "../../../layouts/states/themeStore";
import { useCancelOrder, useFetchOrderDetailsV3 } from "../hooks/useFetchOrders";
import CheckoutOrderItemV3 from "../../shopping/components/CheckoutOrderItemV3";
import CancelOrderForm from "../../shopping/components/CancelOrderForm";
import { showModal } from "../../../global/GlobalHelpers";
import FolioCopyButton from "../components/FolioCopyButton";
import {
    orderStatusBadgeClass,
    orderStatusCardTintClass,
    orderStatusIconBoxClass,
    orderStatusIconTextClass,
    orderStatusStripClass,
} from "../utils/orderStatus";
import { getOrderPaymentTotals, parseFmt } from "../utils/paymentSummary";

/* ─────────────────────────────────────────────
   Helpers de UI (lenguaje V3)
───────────────────────────────────────────── */

const Badge = ({ label, color = "gray" }: { label: string; color?: string }) => (
    <span
        className={clsx(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase",
            color === "success" && "bg-success/20 text-success",
            color === "warning" && "bg-warning/20 text-warning",
            color === "error" && "bg-error/20 text-error",
            color === "primary" && "bg-primary/20 text-primary",
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
        <p className="text-[10px] font-black uppercase text-base-content/40 tracking-widest flex items-center gap-1">
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
    action,
    tint,
    strip,
    iconBoxClass,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    tint?: string;
    strip?: string;
    iconBoxClass?: string;
}) => (
    <div className={clsx("w-full rounded-3xl bg-base-100 border border-base-300 shadow-sm overflow-hidden relative", tint)}>
        {strip && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                <div className={clsx("absolute top-0 left-0 right-0 h-1", strip)} />
            </div>
        )}
        <div className="px-5 py-4 bg-base-200/40 border-b border-base-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
                <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-sm border", iconBoxClass ?? "bg-primary/10 text-primary border-primary/5")}>
                    {icon}
                </div>
                <h2 className="text-xs font-black text-base-content uppercase tracking-widest">{title}</h2>
            </div>
            {action}
        </div>
        <div className="p-5 sm:p-6">{children}</div>
    </div>
);

const SummaryLine = ({
    label,
    value,
    sub,
    highlight,
    minus,
    large,
    isTotalCollected
}: {
    label: string;
    value: string;
    sub?: string;
    highlight?: boolean;
    minus?: boolean;
    large?: boolean;
    isTotalCollected?: boolean
}) => (
    <div
        className={clsx(
            "flex justify-between items-start gap-2",
            large && "pt-3 mt-1 border-t border-base-300",
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
                large ? "text-xl font-extrabold text-primary" : "text-sm text-base-content",
                highlight && "text-success",
                minus && "text-success",
            )}
        >
            {!isTotalCollected && (minus ? "− " : "+ ")}
            {value}
        </span>
    </div>
);

/* ─────────────────────────────────────────────
   Skeleton loader (V3)
───────────────────────────────────────────── */

const SkeletonLoader = () => (
    <div className="w-full flex justify-center items-start">
        <div className="w-full md:w-80/100 px-2 sm:px-3 md:px-4 py-6 md:py-10">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="rounded-3xl bg-base-100 border border-base-300 p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="loading loading-spinner loading-md text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-base-content text-lg">
                            Obteniendo detalles de tu orden...
                        </p>
                        <p className="text-base-content/60 text-sm mt-0.5 animate-pulse">
                            Esto puede tomar unos momentos.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-5">
                        <div className="h-48 bg-base-200 rounded-3xl animate-pulse" />
                        <div className="h-72 bg-base-200 rounded-3xl animate-pulse" />
                    </div>
                    <div className="lg:col-span-4 space-y-5">
                        <div className="h-64 bg-base-200 rounded-3xl animate-pulse" />
                        <div className="h-48 bg-base-200 rounded-3xl animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */

const OrderDetail = () => {
    document.title = "Iga Productos | Detalle de orden";

    const { "order-uuid": orderUUID } = useParams();
    const navigate = useNavigate();
    const [itemsExpanded, setItemsExpanded] = useState(false);
    const { theme } = useThemeStore();
    const cancelOrderRef = useRef<HTMLDialogElement | null>(null);

    const { data, isLoading, error, refetch } = useFetchOrderDetailsV3({ orderUUID: orderUUID! });
    const cancelOrderMutation = useCancelOrder({ orderUUID: orderUUID!, type: "ABANDONED" });

    const handleAbandonPending = async () => {
        await cancelOrderMutation.mutateAsync();
        await refetch();
    };

    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (error || !data || !data.order) {
        const is404 = (error as { response?: { status?: number } }).response?.status === 404;
        return (
            <div className="w-full flex justify-center items-start">
                <div className="w-full md:w-80/100 px-2 sm:px-3 md:px-4 py-6 md:py-10 flex flex-col gap-6 items-center">
                    <div className="rounded-3xl bg-base-100 border border-base-300 p-8 max-w-2xl w-full text-center space-y-6">
                        <div className="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center mx-auto border border-error/5 shadow-inner">
                            <FaExclamationCircle className="text-4xl text-error" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-xl font-bold text-base-content">
                                {is404 ? "Orden no encontrada" : "Error de conexión"}
                            </h1>
                            <p className="text-base-content/60 text-sm">
                                {is404
                                    ? "No pudimos encontrar los detalles de esta orden. Verifica tu folio o contacta a soporte."
                                    : data && !data.order
                                        ? "No pudimos encontrar los detalles de esta orden."
                                        : formatAxiosError(error)}
                            </p>
                        </div>
                        <p className="text-xs font-mono text-base-content/40 break-all">
                            Folio: {orderUUID}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                            <button
                                onClick={() => navigate("/mis-ordenes")}
                                className="btn btn-ghost border-base-300 gap-2 font-bold px-6"
                            >
                                <FaArrowLeft className="text-xs" />
                                Mis ordenes
                            </button>
                            {!is404 && (
                                <button
                                    onClick={() => refetch()}
                                    className="btn btn-primary gap-2 font-bold px-6 shadow-md"
                                >
                                    <FaRedo />
                                    Reintentar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { order, shippings } = data;
    const items = order.items;
    const paymentResume = order.paymentResume;
    const { orderTotal, totalPaid, hasFinancing, interest } =
        getOrderPaymentTotals(order);
    const unpaid = totalPaid <= 0;
    const isVerifying = order.status === "PENDING_CONFIRMATION";
    // Solo las ordenes PENDING sin cobro pueden abandonarse desde el detalle.
    // APPROVED / PENDING_CONFIRMATION / AUTHORIZED quedan bloqueadas en backend.
    const canAbandonPending = order.status === "PENDING";
    const itemsToShow = itemsExpanded ? items : items.slice(0, 5);
    const hasMoreItems = items.length > 5;

    const fmt = (n: number) => formatPrice(n.toString(), "es-MX");

    return (
        <div className="w-full flex justify-center items-start">
            <div className="w-full px-2 sm:px-3 md:px-4 py-6 md:py-10">

                {/* ── Header Navigation ── */}
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4 min-w-0">
                        <button
                            onClick={() => navigate("/mis-ordenes")}
                            className="w-10 h-10 rounded-2xl bg-base-100 flex items-center justify-center border border-base-300 shadow-sm hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all group"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">Panel de cliente</span>
                                <span className="w-1 h-1 rounded-full bg-base-content/20" />
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest">Detalle de orden</span>
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-black text-base-content tracking-tight flex flex-wrap items-baseline gap-x-2 min-w-0">
                                Orden <span className="text-primary/60 text-xl font-mono break-all">#{order.orderUUID}</span>
                            </h1>
                        </div>
                    </div>
                </div>

                {/* ── Main Content Grid ── */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left Column: Estatus + Envío + Artículos */}
                        <div className="lg:col-span-8 flex flex-col gap-6">

                            {/* ── Hero: estatus de la orden ── */}
                            <div className={clsx(
                                "w-full rounded-3xl bg-base-100 border border-base-300 shadow-sm relative",
                                orderStatusCardTintClass(order.status),
                            )}>
                                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                                    <div className={clsx("absolute left-0 top-0 bottom-0 w-1.5", orderStatusStripClass(order.status))} />
                                </div>

                                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                                    <div className="flex-1 flex flex-col gap-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-base-100 border border-base-300 shadow-sm flex items-center justify-center flex-shrink-0">
                                                <MdVerified className={clsx("text-2xl", orderStatusIconTextClass(order.status))} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest mb-0.5">Estado de tu pedido</p>
                                                <div className="flex items-center gap-3">
                                                    <span className={clsx(
                                                        "px-4 py-1.5 rounded-full border text-xs font-black uppercase shadow-sm",
                                                        orderStatusBadgeClass(order.status),
                                                    )}>
                                                        {formatOrderStatus[order.status]}
                                                    </span>
                                                    {order.isGuestOrder ? (
                                                        <Badge label="Invitado" color="gray" />
                                                    ) : (
                                                        <Badge label="Cliente registrado" color="primary" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest mb-1">Número de pedido</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs sm:text-sm font-mono font-black text-base-content/80 bg-base-200 px-3 py-1.5 rounded-xl border border-base-300 select-all break-all">
                                                    {order.orderUUID}
                                                </p>
                                                <FolioCopyButton uuid={order.orderUUID} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-px h-px md:h-24 bg-base-300 hidden md:block" />

                                    <div className="grid grid-cols-2 md:grid-cols-1 gap-5 flex-shrink-0">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">Fecha de compra</p>
                                            <p className="text-sm font-bold text-base-content mt-0.5">{formatDate(order.createdAt, "es-MX")}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">Última actualización</p>
                                            <p className="text-sm font-bold text-base-content mt-0.5">{formatDate(order.updatedAt, "es-MX")}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">Método de pago</p>
                                            <div className="flex items-center gap-2 h-[34px] mt-0.5">
                                                <figure className="h-full bg-base-200 p-1.5 rounded-lg border border-base-300">
                                                    <img
                                                        src={getPaymentProviderDetails(order.paymentProvider).image_url}
                                                        alt={order.paymentProvider}
                                                        className="h-full object-contain"
                                                    />
                                                </figure>
                                                <span className="text-sm font-bold text-base-content uppercase tracking-tight">
                                                    {getPaymentProviderDetails(order.paymentProvider).description}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">Total pagado</p>
                                            {isVerifying ? (
                                                <>
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase border bg-info/10 text-info border-info/20 mt-1">
                                                        <FaHourglassHalf className="text-[10px]" />
                                                        Cargo en verificación
                                                    </span>
                                                    <p className="text-lg font-black text-primary tabular-nums mt-0.5">
                                                        ${fmt(totalPaid > 0 ? totalPaid : orderTotal)}
                                                    </p>
                                                </>
                                            ) : unpaid ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase border bg-error/10 text-error border-error/20 mt-1">
                                                    <FaExclamationCircle className="text-[10px]" />
                                                    No pagada
                                                </span>
                                            ) : (
                                                <p className="text-lg font-black text-primary tabular-nums mt-0.5">
                                                    ${fmt(hasFinancing ? totalPaid : orderTotal)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Banner: pago en verificación ── */}
                            {isVerifying && (
                                <div className="w-full rounded-3xl bg-info/10 border border-info/20 p-5 md:p-6 flex flex-col sm:flex-row items-start gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-info/15 flex items-center justify-center flex-shrink-0">
                                        <FaHourglassHalf className="text-info text-xl" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-base-content">Tu pago está en verificación</p>
                                        <p className="text-base-content/60 mt-1 leading-relaxed">
                                            Tu banco aún no confirma el cargo. Esto puede tardar hasta 48 horas
                                            y es normal: tu dinero está a salvo y tus productos quedaron reservados.
                                            Te avisaremos por correo cuando se resuelva. Por favor no vuelvas a
                                            pagar esta orden para evitar un cargo duplicado.
                                        </p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-semibold">
                                            <a href="mailto:atencionaclientes@igaproductos.com" className="text-primary hover:underline">
                                                atencionaclientes@igaproductos.com
                                            </a>
                                            <a href="https://wa.me/529211963246" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                                WhatsApp +52 921 196 3246
                                            </a>
                                            <a href="tel:+529211963246" className="text-primary hover:underline">
                                                +52 921 196 3246
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Información del comprador ── */}
                            <SectionCard icon={<FaUser />} title="Información del comprador">
                                <p className="text-xs text-base-content/40 mb-3 leading-relaxed">
                                    Quién realizó el pago · puede diferir del destinatario del envío
                                </p>
                                <div className="bg-primary/5 rounded-xl p-3 space-y-3">
                                    <InfoRow
                                        label="Nombre completo"
                                        value={`${order.buyer.name} ${order.buyer.surname}`}
                                    />
                                    <InfoRow label="Correo" value={order.buyer.email} />
                                    {order.buyer.phone && (
                                        <InfoRow label="Teléfono" value={order.buyer.phone} icon={<FaPhone />} />
                                    )}
                                </div>
                            </SectionCard>

                            {/* ── Artículos ── */}
                            <SectionCard icon={<FaBoxOpen />} title={`Artículos de tu compra (${items.length})`}>
                                <div className="flex flex-col gap-4">
                                    {itemsToShow.map((item, idx) => (
                                        <CheckoutOrderItemV3 key={`${order.orderUUID}-item-${idx}`} data={item} />
                                    ))}

                                    {hasMoreItems && (
                                        <div className="flex justify-center pt-4 mt-2 border-t border-base-200">
                                            <button
                                                onClick={() => setItemsExpanded(!itemsExpanded)}
                                                className="btn btn-ghost hover:bg-primary/5 text-primary gap-2 font-black uppercase text-xs tracking-widest transition-all"
                                            >
                                                {itemsExpanded ? (
                                                    <>
                                                        <FaChevronUp className="text-xs" />
                                                        Ocultar productos
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaChevronDown className="text-xs" />
                                                        Ver {items.length - 5} productos más...
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </SectionCard>

                            {/* ── Envío ── */}
                            {order.shipping.map((shippingAddress, idx: number) => {
                                const tracking = shippings.find(s => s.shippingInfoId === shippingAddress.id);

                                return (
                                    <SectionCard
                                        key={idx}
                                        icon={<FaShippingFast />}
                                        title={order.shipping.length > 1 ? `Información de envío ${idx + 1}` : "Información de envío"}
                                    >
                                        <div className={clsx("flex flex-col", order.shipping.length > 1 && idx > 0 && "border-t border-dashed border-base-300 pt-5")}>
                                            <div className="space-y-4">
                                                <div className="bg-primary/5 rounded-xl p-3 space-y-3">
                                                    <p className="text-xs font-bold uppercase text-primary/70">
                                                        Destinatario
                                                    </p>
                                                    <InfoRow
                                                        label="Nombre completo"
                                                        value={`${shippingAddress.recipientName} ${shippingAddress.recipientLastName}`}
                                                    />
                                                    <InfoRow
                                                        label="Contacto"
                                                        value={`${shippingAddress.countryPhoneCode} ${shippingAddress.contactNumber}`}
                                                        icon={<FaPhone />}
                                                    />
                                                </div>

                                                <div className="bg-base-200 rounded-xl p-3 space-y-3">
                                                    <p className="text-xs font-bold uppercase text-base-content/40">
                                                        Domicilio
                                                    </p>
                                                    <InfoRow
                                                        label="Calle y número"
                                                        value={`${shippingAddress.streetName} #${shippingAddress.number}${shippingAddress.aditionalNumber && shippingAddress.aditionalNumber !== "N/A" ? ` Int. ${shippingAddress.aditionalNumber}` : ""}`}
                                                        icon={<FaHome />}
                                                    />
                                                    {shippingAddress.floor && <InfoRow label="Piso" value={shippingAddress.floor} />}
                                                    <InfoRow label="Colonia / Fracc." value={shippingAddress.neighborhood} />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <InfoRow label="Ciudad" value={shippingAddress.city} />
                                                        <InfoRow label="Estado" value={shippingAddress.state} />
                                                    </div>
                                                    <InfoRow label="Localidad" value={shippingAddress.locality} />
                                                    <InfoRow
                                                        label="País"
                                                        value={`${shippingAddress.country} · CP ${shippingAddress.zipCode}`}
                                                    />
                                                </div>

                                                {tracking?.trackingNumber && (
                                                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 sm:p-4 flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-base-100 flex items-center justify-center text-primary flex-shrink-0 shadow-sm border border-primary/10">
                                                            <FaBoxOpen />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Número de guía</p>
                                                            <p className="text-sm font-mono font-black text-primary tabular-nums tracking-wider select-all break-all">
                                                                {tracking.trackingNumber}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-start gap-2 text-xs text-base-content/50 bg-base-200/60 rounded-xl px-3 py-2.5">
                                                    <FaShippingFast className="text-primary/50 flex-shrink-0 mt-0.5" />
                                                    <p className="leading-relaxed">
                                                        Todos nuestros paquetes son enviados por <span className="font-bold text-base-content/70">PaqueteExpress</span>.
                                                    </p>
                                                </div>

                                                {shippingAddress.referencesOrComments && shippingAddress.referencesOrComments !== "N/A" && (
                                                    <div className="bg-warning/10 rounded-xl p-3 space-y-2">
                                                        <p className="text-xs font-bold uppercase text-warning">
                                                            Comentarios / Referencias
                                                        </p>
                                                        <p className="text-sm text-base-content italic text-balance">
                                                            "{shippingAddress.referencesOrComments}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </SectionCard>
                                );
                            })}
                        </div>

                        {/* Right Column: Resumen + Transacción + Soporte */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-6 flex flex-col gap-6">

                                {/* ── Recibo económico ── */}
                                <SectionCard icon={<FaReceipt />} title="Resumen de tu compra" action={<Badge label={order.exchange} color="primary" />} tint={orderStatusCardTintClass(order.status)} strip={orderStatusStripClass(order.status)} iconBoxClass={orderStatusIconBoxClass(order.status)}>
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

                                        {/* Firma: recibo con línea punteada */}
                                        <div className="mt-4 pt-4 border-t-2 border-dashed border-base-300">
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
                                            />
                                            {hasFinancing && (
                                                <SummaryLine
                                                    label="Total cobrado"
                                                    value={`$${fmt(totalPaid)}`}
                                                    sub="Monto total que se cobra a tu tarjeta"
                                                    large
                                                    isTotalCollected
                                                />
                                            )}
                                            {unpaid && (
                                                <div className="pt-3 mt-1 border-t border-base-300 flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase border bg-error/10 text-error border-error/20">
                                                        <FaExclamationCircle className="text-[10px]" />
                                                        No pagada
                                                    </span>
                                                    <span className="text-xs text-base-content/40">
                                                        No se realizó ningún cobro
                                                    </span>
                                                </div>
                                            )}
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

                                        {canAbandonPending && (
                                            <div className="mt-4 flex flex-col gap-2 rounded-xl border border-error/20 bg-error/5 p-3">
                                                <p className="text-xs text-base-content/60 leading-relaxed">
                                                    Dejaste esta orden pendiente de pago. Puedes abandonarla para liberarla de tu historial.
                                                </p>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline btn-error btn-sm w-full"
                                                    disabled={cancelOrderMutation.isPending}
                                                    onClick={() => showModal(cancelOrderRef.current)}
                                                >
                                                    {cancelOrderMutation.isPending ? (
                                                        <span className="loading loading-spinner loading-xs" />
                                                    ) : null}
                                                    Abandonar orden
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </SectionCard>

                                {/* ── Pago ── */}
                                <SectionCard icon={<FaCreditCard />} title="Pago">
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
                                        {order.paymentDetails.map((det, idx) => {
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
                                                        <p className="text-lg font-bold text-base-content tabular-nums">${fmt(parseFmt(det.paidAmount))}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                                        {order.status !== "PENDING" && (
                                                            <InfoRow label="Tarjeta" value={`**** ${det.lastFourDigits}`} />
                                                        )}
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
                                                            <p className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">
                                                                Estado
                                                            </p>
                                                            <span className={clsx(
                                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase border w-fit",
                                                                orderStatusBadgeClass(det.paymentStatus),
                                                            )}>
                                                                {formatOrderStatus[det.paymentStatus]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </SectionCard>

                                {/* ── Soporte ── */}
                                <div className="w-full rounded-3xl bg-primary/95 text-primary-content p-6 shadow-xl shadow-primary/20 flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
                                            <FaBoxOpen />
                                        </div>
                                        <h3 className="font-extrabold text-lg tracking-tight">¿Necesitas ayuda?</h3>
                                    </div>
                                    <p className="text-sm font-medium opacity-80 leading-relaxed">
                                        Si tienes algún inconveniente con tu pedido o necesitas facturar tu compra, contacta a nuestro equipo de soporte con tu número de folio.
                                    </p>
                                    <a
                                        href="https://wa.me/529211963246"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-white btn-sm w-full font-black uppercase tracking-widest mt-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Contactar Soporte
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <CancelOrderForm ref={cancelOrderRef} onCanceled={handleAbandonPending} />
    );
};

export default OrderDetail;