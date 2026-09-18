import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaExclamationTriangle, FaExternalLinkAlt, FaFileInvoice, FaFire } from "react-icons/fa";
import { formatDate, formatPrice } from "../../products/Helpers";
import { formatOrderStatus, paymentProvider } from "../../shopping/utils/ShoppingUtils";
import type { CustomerOrdersDashboardCardI } from "../OrdersTypes";
import {
    canRequestInvoice,
    isAbandoned,
    orderStatusActionButtonClass,
    orderStatusBadgeClass,
    orderStatusCardTintClass,
    orderStatusIconTextClass,
    orderStatusStripClass,
} from "../utils/orderStatus";
import { buildInvoiceMailto } from "../utils/invoice";
import { formatShippingStatus } from "../utils/shippingStatus";
import FolioCopyButton from "./FolioCopyButton";
import OrderIssueModal from "./OrderIssueModal";
import ThumbnailGallery from "./ThumbnailGallery";
import { useThemeStore } from "../../../layouts/states/themeStore";

type Props = {
    order: CustomerOrdersDashboardCardI;
    isActive: boolean;
    onToggleActive: () => void;
};

const OrderDashboardCard = ({ order, isActive, onToggleActive }: Props) => {
    const [issueOpen, setIssueOpen] = useState(false);
    const navigate = useNavigate();
    const { theme } = useThemeStore();

    const item = order.items[0];
    const buyerName = `${order.buyer.name} ${order.buyer.surname}`.trim();
    const tags = item?.tags ?? [];
    const abandoned = isAbandoned(order.status);
    const canInvoice = canRequestInvoice(order.status);

    const invoiceHref = buildInvoiceMailto({
        uuid: order.uuid,
        createdAt: order.createdAt,
        buyerName,
    });

    return (
        <article
            className={clsx(
                "w-full rounded-3xl border border-base-300 shadow-sm relative transition-all duration-200 cursor-pointer",
                orderStatusCardTintClass(order.status),
                isActive ? "shadow-lg ring-1 ring-primary/20" : "hover:shadow-md"
            )}
            onClick={onToggleActive}
            role="button"
            aria-expanded={isActive}
            aria-label={`Orden ${order.uuid}`}
        >
            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                <span className={clsx("absolute left-0 top-0 bottom-0 w-1.5", orderStatusStripClass(order.status))} />
            </span>

            {/* ── Header ── */}
            <div className="px-5 sm:pl-8 pr-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest shrink-0">
                        Folio
                    </span>
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono font-extrabold text-xs sm:text-sm text-base-content uppercase tracking-widest bg-base-200 px-3 py-1 rounded-lg border border-base-300 truncate">
                            {order.uuid}
                        </span>
                        <FolioCopyButton uuid={order.uuid} />
                    </div>
                    <span className={clsx("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border shrink-0", orderStatusBadgeClass(order.status))}>
                        {formatOrderStatus[order.status]}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-base-content/40 font-semibold">
                    <FaBox className={orderStatusIconTextClass(order.status)} />
                    Creada el {formatDate(order.createdAt, "es-MX")}
                    <span className="hidden sm:inline text-base-content/20">•</span>
                    <span className="hidden sm:inline">Actualizada {formatDate(order.updatedAt, "es-MX")}</span>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="px-5 sm:pl-8 pr-5 pb-4 flex flex-col gap-4">
                {item && (
                    <div className="flex flex-col gap-3 rounded-2xl bg-base-200/50 border border-base-300/60 p-3">
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm sm:text-base font-bold text-base-content truncate">
                                    {item.name}
                                </span>
                                <span className="badge badge-ghost badge-sm font-bold text-base-content/50 shrink-0">
                                    {item.quantity} pza{item.quantity > 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                                {item.offer.applicableOffers.slice(0, 2).map((offer, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold border border-success/20">
                                        <FaFire className="text-[9px]" />
                                        {offer.discount}% OFF
                                    </span>
                                ))}
                                {tags.slice(0, 4).map((tag) => (
                                    <span key={tag} className="badge badge-outline badge-xs text-base-content/50 font-semibold">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-base-content/50">
                                <span className="font-semibold text-base-content/70">{item.category}</span>
                                <span className="w-px h-3 bg-base-300" />
                                <span>SKU <span className="font-bold uppercase">{item.sku}</span></span>
                            </div>
                        </div>

                        <div className="divider my-0 before:bg-base-300 after:bg-base-300" />

                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">
                                Productos en tu orden
                            </span>
                            <ThumbnailGallery
                                thumbnails={order.productThumbnails}
                                remainingItems={order.remainingItems}
                            />
                        </div>
                    </div>
                )}

                {/* ── Footer row ── */}
                <div className={clsx("grid grid-cols-2 gap-4 items-end", abandoned ? "md:grid-cols-3" : "md:grid-cols-4")}>
                    <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">
                            Método de pago
                        </p>
                        <div className="flex items-center gap-2.5 pr-3 rounded-xl border border-base-200 bg-base-200/60">
                            <figure className={clsx("w-9 h-9 shrink-0 rounded-lg flex items-center justify-center p-1 overflow-hidden ring-1 ring-base-300/60", theme === "dark" ? "bg-white/15" : "bg-white")}>
                                <img
                                    className="w-full h-full object-contain"
                                    src={paymentProvider[order.paymentProvider].image_url}
                                    alt={paymentProvider[order.paymentProvider].description}
                                    loading="lazy"
                                />
                            </figure>
                            <span className="text-xs font-bold text-base-content truncate">
                                {paymentProvider[order.paymentProvider].description}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">
                            Envío
                        </p>
                        {order.shippingStatus ? (
                            <span className="badge badge-outline badge-sm font-bold text-base-content/70 justify-start">
                                {formatShippingStatus(order.shippingStatus)}
                            </span>
                        ) : (
                            <span className="text-xs text-base-content/30 italic">Sin seguimiento</span>
                        )}
                    </div>

                    <div className="hidden md:flex flex-col gap-1">
                        <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">
                            Ítems totales
                        </p>
                        <p className="text-sm font-bold text-base-content">
                            {order.itemsCount} {order.itemsCount === 1 ? "Producto" : "Productos"}
                        </p>
                    </div>

                    {!abandoned && (
                        <div className="flex flex-col items-end gap-0.5 justify-self-end">
                            <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">Total pagado</span>
                            <span className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                                ${formatPrice(order.totalAmount, "es-MX")}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Action row (revelada al hacer clic) ── */}
            {isActive && (
                <div className="px-5 sm:pl-8 pr-5 py-3 bg-base-200/50 border-t border-base-300 flex flex-wrap items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/mis-ordenes/detalle/${order.uuid}`);
                        }}
                        className={clsx("btn btn-sm gap-2 font-bold shadow-sm border", orderStatusActionButtonClass(order.status))}
                    >
                        Ver detalle
                        <FaExternalLinkAlt className="text-[10px]" />
                    </button>
                    {canInvoice && (
                        <a
                            href={invoiceHref}
                            data-tip="Adjunta tu Constancia de Situación Fiscal, tu régimen fiscal y el uso de CFDI (p. ej. G03 - Gastos en general)"
                            className={clsx("btn btn-sm gap-2 font-bold tooltip tooltip-top z-50 border", orderStatusActionButtonClass(order.status))}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaFileInvoice className="text-[11px]" />
                            Solicitar factura
                        </a>
                    )}
                    {!abandoned && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIssueOpen(true);
                            }}
                            className={clsx("btn btn-sm gap-2 font-bold border", orderStatusActionButtonClass(order.status))}
                        >
                            <FaExclamationTriangle className="text-xs" />
                            ¿Tienes un problema con tu pedido?
                        </button>
                    )}
                </div>
            )}

            <OrderIssueModal open={issueOpen} order={order} onClose={() => setIssueOpen(false)} />
        </article>
    );
};

export default OrderDashboardCard;