import { FaArrowLeft, FaBox, FaPrint, FaCreditCard, FaReceipt, FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { formatAxiosError } from "../../../api/helpers";
import { formatDate, formatPrice } from "../../products/Helpers";
import { formatOrderStatus, paymentMethod, paymentProvider } from "../../shopping/utils/ShoppingUtils";
import clsx from "clsx";
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import { useFetchOrderDetails } from "../hooks/useFetchOrders";
import CheckoutOrderItemV2 from "../../shopping/components/CheckoutOrderItem";

/* ─────────────────────────────────────────────
   Helper: color de badge por status de orden
───────────────────────────────────────────── */

const orderStatusBadge = (status: string) => {
    switch (status) {
        case "APPROVED": return "bg-success/10 text-success border-success/20";
        case "PENDING": return "bg-warning/10 text-warning border-warning/20";
        case "REJECTED":
        case "CANCELLED": return "bg-error/10 text-error border-error/20";
        case "IN_PROCESS": return "bg-info/10 text-info border-info/20";
        case "REFUNDED": return "bg-base-300 text-base-content/50 border-base-content/10";
        default: return "bg-base-200 text-base-content/70 border-base-content/10";
    }
};

const orderStatusIcon = (status: string) => {
    switch (status) {
        case "APPROVED": return <FaCheckCircle className="text-success" />;
        case "PENDING":
        case "IN_PROCESS": return <FaClock className="text-warning" />;
        case "REJECTED":
        case "CANCELLED": return <FaExclamationCircle className="text-error" />;
        default: return <FaBox className="text-base-content/40" />;
    }
};

/* ─────────────────────────────────────────────
   Componentes de UI Reutilizables
───────────────────────────────────────────── */

const InfoBlock = ({ label, value, icon }: { label: string; value?: string | React.ReactNode; icon?: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest flex items-center gap-1.5 px-0.5">
            {icon && <span className="opacity-70">{icon}</span>}
            {label}
        </p>
        <div className="bg-base-200/50 p-3 rounded-2xl border border-base-300/30">
            {typeof value === "string" ? (
                <p className="text-sm font-bold text-base-content leading-snug break-words">
                    {value || "—"}
                </p>
            ) : (
                value
            )}
        </div>
    </div>
);

const SectionContainer = ({ icon, title, children, className }: { icon: React.ReactNode; title: string; children: React.ReactNode; className?: string }) => (
    <div className={clsx("w-full rounded-3xl bg-base-100 border border-base-300 shadow-sm overflow-hidden", className)}>
        <div className="px-5 py-4 bg-base-200/40 border-b border-base-300 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm shadow-sm border border-primary/5">
                {icon}
            </div>
            <h2 className="font-black text-base-content text-xs uppercase tracking-widest">{title}</h2>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
    </div>
);

const SummaryRow = ({ label, value, isBold, isTotal, isDiscount }: { label: string; value: string; isBold?: boolean; isTotal?: boolean; isDiscount?: boolean }) => (
    <div className={clsx(
        "flex justify-between items-center gap-4 py-2",
        isTotal && "border-t border-base-300 pt-4 mt-2"
    )}>
        <span className={clsx(
            "text-sm tracking-tight",
            isBold ? "font-bold text-base-content" : "text-base-content/60 font-medium",
            isTotal && "text-base uppercase font-black"
        )}>
            {label}
        </span>
        <span className={clsx(
            "text-sm font-black tabular-nums tracking-tighter",
            isBold ? "text-base-content" : "text-base-content/70",
            isTotal && "text-2xl text-primary",
            isDiscount && "text-success"
        )}>
            {isDiscount ? `- ${value}` : value}
        </span>
    </div>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */

const OrderDetail = () => {
    document.title = "Iga Productos | Detalle de orden";

    const { "order-uuid": orderUUID } = useParams();
    const navigate = useNavigate();
    const printContent = useRef<HTMLDivElement>(null);
    const [itemsExpanded, setItemsExpanded] = useState(false);

    const { data, isLoading, error, refetch } = useFetchOrderDetails({ orderUUID: orderUUID! });

    const handlePrint = useReactToPrint({
        contentRef: printContent,
        documentTitle: `Liquidación de Orden - ${orderUUID}`,
    });

    if (isLoading) {
        return (
            <div className="w-full min-h-screen py-10 px-4 flex flex-col items-center justify-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-sm font-bold text-base-content/40 uppercase tracking-widest animate-pulse">Obteniendo detalles de tu orden...</p>
            </div>
        );
    }

    if (error || !data || !data.order) {
        return (
            <div className="w-full px-3 md:px-6 py-10 flex flex-col gap-6 items-center">
                <SectionContainer icon={<FaExclamationCircle />} title="Error de conexión" className="max-w-2xl border-error/20">
                    <div className="flex flex-col items-center gap-6 py-8 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center border border-error/5 shadow-inner">
                            <FaExclamationCircle className="text-4xl text-error" />
                        </div>
                        <div className="max-w-xs">
                            <p className="text-sm font-bold text-base-content/60 leading-relaxed">
                                {data && !data.order ? "No pudimos encontrar los detalles de esta orden." : formatAxiosError(error)}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                            <button onClick={() => navigate("/mis-ordenes")} className="btn btn-ghost border-base-300 btn-sm gap-2 font-bold px-6">
                                <FaArrowLeft className="text-xs" />
                                Mis ordenes
                            </button>
                            <button onClick={() => refetch()} className="btn btn-primary btn-sm gap-2 font-bold px-6 shadow-md">
                                Reintentar
                            </button>
                        </div>
                    </div>
                </SectionContainer>
            </div>
        );
    }

    const { order } = data;
    const itemsToShow = itemsExpanded ? order.items : order.items.slice(0, 5);
    const hasMoreItems = order.items.length > 5;

    return (
        <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200 min-h-screen">

            {/* ── Header Navigation ── */}
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/mis-ordenes")}
                        className="w-10 h-10 rounded-2xl bg-base-100 flex items-center justify-center border border-base-300 shadow-sm hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">Panel de cliente</span>
                            <span className="w-1 h-1 rounded-full bg-base-content/20" />
                            <span className="text-[10px] font-black uppercase text-primary tracking-widest">Detalle de orden</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-base-content tracking-tight">
                            Orden <span className="text-primary/50 text-xl font-mono">#{order.orderUUID.slice(0, 8)}</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handlePrint()}
                        className="btn btn-base-100 border-base-300 btn-sm md:btn-md gap-3 font-bold shadow-sm px-6"
                    >
                        <FaPrint className="text-base-content/60" />
                        Imprimir Recibo
                    </button>
                </div>
            </div>

            {/* ── Main Content Grid ── */}
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8" ref={printContent}>

                {/* Left Column: Details & Products */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Order Status Header Card */}
                    <div className="w-full rounded-3xl bg-base-100 border border-base-300 shadow-sm overflow-hidden border-l-4 border-l-primary">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className="flex-1 flex flex-col gap-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">Folio Completo (UUID)</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs sm:text-sm font-mono font-black text-base-content/80 bg-base-200 px-3 py-1.5 rounded-xl border border-base-300 select-all">
                                            {order.orderUUID}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-base-content/30 tracking-widest mb-1">Estatus actual</span>
                                        <div className={clsx(
                                            "flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase shadow-sm",
                                            orderStatusBadge(order.status)
                                        )}>
                                            {orderStatusIcon(order.status)}
                                            {formatOrderStatus[order.status]}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-base-content/30 tracking-widest mb-1">Pasarela de pago</span>
                                        <div className="flex items-center gap-3 h-[34px]">
                                            <figure className="h-full bg-base-200 p-1.5 rounded-lg border border-base-300">
                                                <img
                                                    src={paymentProvider[order.paymentProvider].image_url}
                                                    alt={order.paymentProvider}
                                                    className="h-full object-contain"
                                                />
                                            </figure>
                                            <span className="text-sm font-bold text-base-content uppercase tracking-tight">
                                                {paymentProvider[order.paymentProvider].description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-px h-px md:h-20 bg-base-300 hidden md:block" />

                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">Fecha de compra</span>
                                    <p className="text-sm font-bold text-base-content">{formatDate(order.createdAt, "es-MX")}</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">Última actualización</span>
                                    <p className="text-sm font-bold text-base-content">{formatDate(order.updatedAt, "es-MX")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products List Section */}
                    <SectionContainer icon={<FaList />} title={`Resumen de productos (${order.items.length})`}>
                        <div className="flex flex-col gap-4">
                            {itemsToShow.map((item, idx) => (
                                <CheckoutOrderItemV2 key={`${order.orderUUID}-item-${idx}`} data={item} />
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
                                                Ver {order.items.length - 5} productos más...
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </SectionContainer>

                    {/* Shipping and Billing Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SectionContainer icon={<FaMapMarkerAlt />} title="Información de Envío">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center flex-shrink-0 border border-base-300">
                                        <FaMapMarkerAlt className="text-xl text-primary/50" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">Destinatario</span>
                                        <p className="text-base font-black text-base-content">{order.shipping.recipientName} {order.shipping.recipientLastName}</p>
                                        <p className="text-sm font-bold text-base-content/50">{order.shipping.countryPhoneCode} {order.shipping.contactNumber}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    <InfoBlock
                                        label="Dirección completa"
                                        value={`${order.shipping.streetName} #${order.shipping.number}${order.shipping.aditionalNumber && order.shipping.aditionalNumber !== "N/A" ? ` Int. ${order.shipping.aditionalNumber}` : ""}`}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoBlock label="Colonia" value={order.shipping.neighborhood} />
                                        <InfoBlock label="CP" value={order.shipping.zipCode} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoBlock label="Ciudad" value={order.shipping.city} />
                                        <InfoBlock label="Estado" value={order.shipping.state} />
                                    </div>
                                </div>

                                {order.shipping.referencesOrComments && order.shipping.referencesOrComments !== "N/A" && (
                                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-2xl">
                                        <p className="text-[10px] font-black uppercase text-warning tracking-widest mb-2">Comentarios / Referencias</p>
                                        <p className="text-xs font-bold text-base-content/70 italic leading-relaxed">
                                            "{order.shipping.referencesOrComments}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </SectionContainer>

                        <SectionContainer icon={<FaCreditCard />} title="Método de Pago Detallado">
                            <div className="flex flex-col gap-6">
                                {order.paymentDetails.map((payment, idx) => (
                                    <div key={idx} className="flex flex-col gap-4 p-5 rounded-2xl border border-base-300 bg-base-200/30">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <figure className="h-8 bg-white p-1 rounded-lg border border-base-300 shadow-sm">
                                                    <img
                                                        src={paymentMethod[payment.paymentMethod].image_url}
                                                        alt={payment.paymentMethod}
                                                        className="h-full object-contain"
                                                    />
                                                </figure>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-base-content tracking-tight">{paymentMethod[payment.paymentMethod || "standard"].description}</span>
                                                    <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">{payment.paymentStatus}</span>
                                                </div>
                                            </div>
                                            <div className={clsx(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                                                orderStatusBadge(payment.paymentStatus)
                                            )}>
                                                {formatOrderStatus[payment.paymentStatus]}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-base-content/30 uppercase tracking-widest">Monto Pagado</span>
                                                <span className="text-base font-black text-primary">${formatPrice(payment.paidAmount, "es-MX")}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-base-content/30 uppercase tracking-widest">Terminación</span>
                                                <span className="text-sm font-mono font-bold text-base-content">•••• {payment.lastFourDigits || "****"}</span>
                                            </div>
                                            <div className="flex flex-col col-span-2">
                                                <span className="text-[10px] font-black text-base-content/30 uppercase tracking-widest">Acreditación</span>
                                                <span className="text-xs font-bold text-base-content/60">{formatDate(payment.updatedAt, "es-MX")}</span>
                                            </div>
                                        </div>

                                        {payment.installments > 1 && (
                                            <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl flex items-center justify-between">
                                                <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest">Financiamiento</span>
                                                <span className="text-xs font-black text-primary">{payment.installments} Meses sin Intereses</span>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="flex flex-col gap-1.5 px-1 py-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaReceipt className="text-base-content/20" />
                                        <span className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">Datos del Comprador</span>
                                    </div>
                                    <p className="text-sm font-black text-base-content">{order.buyer.name} {order.buyer.surname}</p>
                                    <p className="text-xs font-bold text-base-content/50 truncate">{order.buyer.email}</p>
                                    {order.buyer.phone && <p className="text-xs font-bold text-base-content/50">{order.buyer.phone}</p>}
                                </div>
                            </div>
                        </SectionContainer>
                    </div>
                </div>

                {/* Right Column: Sticky Summary */}
                <div className="lg:col-span-4">
                    <div className="sticky top-6 flex flex-col gap-6">
                        <SectionContainer icon={<FaReceipt />} title="Resumen Económico" className="border-primary/20 shadow-lg shadow-primary/5">
                            <div className="flex flex-col gap-1">
                                <SummaryRow label="Subtotal antes de impuestos" value={`$${formatPrice(order.paymentResume.itemsSubtotalBeforeTaxes.toString(), "es-MX")}`} />
                                {parseFloat(order.paymentResume.shippingCostBeforeTaxes) > 0 && (
                                    <SummaryRow
                                        label={`Envío antes de impuestos (${order.paymentResume.boxesCount} ${order.paymentResume.boxesCount === 1 ? 'caja' : 'cajas'})`}
                                        value={`$${order.paymentResume.shippingCostBeforeTaxes}`}
                                    />
                                )}
                                <SummaryRow label="IVA (16%)" value={`$${formatPrice(order.paymentResume.iva.toString(), "es-MX")}`} />
                                {parseFloat(order.paymentResume.discount) > 0 && (
                                    <SummaryRow
                                        label="Descuentos"
                                        value={`$${formatPrice(order.paymentResume.discount.toString(), "es-MX")}`}
                                        isDiscount
                                    />
                                )}

                                <div className="mt-4 pt-4 border-t border-dashed border-base-300">
                                    <SummaryRow
                                        label="Total de la Orden"
                                        value={`$${formatPrice(order.totalAmount, "es-MX")}`}
                                        isTotal
                                    />
                                    <div className="flex items-center justify-center gap-2 mt-4 bg-success/10 text-success py-2 rounded-xl border border-success/10">
                                        <FaCheckCircle className="text-xs" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Transacción Segura {order.exchange}</span>
                                    </div>
                                </div>
                            </div>
                        </SectionContainer>

                        {/* Additional Resources / Help */}
                        <div className="w-full rounded-3xl bg-primary/95 text-primary-content p-6 shadow-xl shadow-primary/20 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
                                    <FaBox />
                                </div>
                                <h3 className="font-extrabold text-lg tracking-tight">¿Necesitas ayuda?</h3>
                            </div>
                            <p className="text-sm font-medium opacity-80 leading-relaxed">
                                Si tienes algún inconveniente con tu pedido o necesitas facturar tu compra, contacta a nuestro equipo de soporte con tu número de folio.
                            </p>
                            <button className="btn btn-white btn-sm w-full font-black uppercase tracking-widest mt-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Contactar Soporte
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;