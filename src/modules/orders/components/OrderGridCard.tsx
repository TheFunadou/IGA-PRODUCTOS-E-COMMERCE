import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaExclamationTriangle, FaExternalLinkAlt, FaFileInvoice } from "react-icons/fa";
import { formatDate, formatPrice } from "../../products/Helpers";
import { formatOrderStatus, paymentProvider } from "../../shopping/utils/ShoppingUtils";
import type { CustomerOrdersDashboardCardI } from "../OrdersTypes";
import { orderStatusBadgeClass, orderStatusCardTintClass, orderStatusIconTextClass, orderStatusStripClass, canRequestInvoice, isAbandoned } from "../utils/orderStatus";
import { buildInvoiceMailto } from "../utils/invoice";
import FolioCopyButton from "./FolioCopyButton";
import OrderIssueModal from "./OrderIssueModal";
import ThumbnailGallery from "./ThumbnailGallery";

type Props = {
    order: CustomerOrdersDashboardCardI;
    isActive: boolean;
    onToggleActive: () => void;
};

const OrderGridCard = ({ order, isActive, onToggleActive }: Props) => {
    const [issueOpen, setIssueOpen] = useState(false);
    const navigate = useNavigate();

    const item = order.items[0];
    const buyerName = `${order.buyer.name} ${order.buyer.surname}`.trim();
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
                "w-full rounded-3xl border border-base-300 overflow-hidden shadow-sm relative flex flex-col transition-all duration-200 cursor-pointer",
                orderStatusCardTintClass(order.status),
                isActive ? "shadow-lg ring-1 ring-primary/20" : "hover:shadow-md"
            )}
            onClick={onToggleActive}
            role="button"
            aria-expanded={isActive}
            aria-label={`Orden ${order.uuid}`}
        >
            <span className={clsx("absolute top-0 left-0 right-0 h-1.5", orderStatusStripClass(order.status))} />

            <div className="p-4 flex flex-col gap-3 flex-1 pt-6">
                <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase text-base-content/40 tracking-widest flex items-center gap-1">
                            <FaBox className={orderStatusIconTextClass(order.status)} />
                            Folio
                        </span>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-mono font-extrabold text-[11px] text-base-content uppercase tracking-widest bg-base-200 px-2 py-0.5 rounded-md border border-base-300 truncate">
                                {order.uuid}
                            </span>
                            <FolioCopyButton uuid={order.uuid} sizeClass="text-[9px]" />
                        </div>
                        <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border w-fit", orderStatusBadgeClass(order.status))}>
                            {formatOrderStatus[order.status]}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="text-sm font-bold text-base-content leading-snug truncate">
                        {item?.name ?? "Orden de compra"}
                    </p>
                    <p className="text-[11px] text-base-content/50 font-semibold">
                        {order.itemsCount} {order.itemsCount === 1 ? "Producto" : "Productos"}
                    </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-black uppercase text-base-content/30 tracking-widest">
                        Productos
                    </span>
                    <ThumbnailGallery
                        thumbnails={order.productThumbnails}
                        remainingItems={order.remainingItems}
                        size="sm"
                    />
                </div>

                <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-base-200">
                    {!abandoned && (
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase text-base-content/30 tracking-widest">Total</span>
                            <span className="text-lg font-black text-primary tracking-tight">
                                ${formatPrice(order.totalAmount, "es-MX")}
                            </span>
                        </div>
                    )}
                    <div className={clsx("flex flex-col items-end gap-0.5 min-w-0", abandoned && "ml-auto")}>
                        <span className="text-[9px] font-black uppercase text-base-content/30 tracking-widest">Actualización</span>
                        <span className="text-[11px] font-bold text-base-content/60">
                            {formatDate(order.updatedAt, "es-MX")}
                        </span>
                    </div>
                </div>
            </div>

            {isActive && (
                <div className="px-4 py-2.5 bg-base-200/50 border-t border-base-300 flex flex-wrap items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/mis-ordenes/detalle/${order.uuid}`);
                        }}
                        className="btn btn-primary btn-xs gap-1.5 font-bold shadow-sm"
                    >
                        Ver detalle
                        <FaExternalLinkAlt className="text-[9px]" />
                    </button>
                    {canInvoice && (
                        <a
                            href={invoiceHref}
                            data-tip="Adjunta tu Constancia de Situación Fiscal, régimen fiscal y uso CFDI"
                            className="btn btn-xs gap-1.5 font-bold tooltip tooltip-top bg-primary/10 text-primary border-primary/25 hover:bg-primary hover:text-primary-content hover:border-primary"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaFileInvoice className="text-[9px]" />
                            Factura
                        </a>
                    )}
                    {!abandoned && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIssueOpen(true);
                            }}
                            className="btn btn-ghost btn-xs gap-1.5 font-bold text-warning hover:bg-warning/10"
                            aria-label="Reportar un problema con este pedido"
                        >
                            <FaExclamationTriangle className="text-[10px]" />
                            Problema
                        </button>
                    )}
                    <span className="text-[9px] font-bold text-base-content/40 ml-auto">
                        {paymentProvider[order.paymentProvider].description}
                    </span>
                </div>
            )}

            <OrderIssueModal open={issueOpen} order={order} onClose={() => setIssueOpen(false)} />
        </article>
    );
};

export default OrderGridCard;