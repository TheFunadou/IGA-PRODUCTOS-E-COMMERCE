import { FaBox, FaShoppingBag, FaChevronDown, FaChevronUp, FaExternalLinkAlt } from "react-icons/fa";
import { useFetchOrders } from "../hooks/useFetchOrders";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { formatAxiosError } from "../../../api/helpers";
import { formatDate, formatPrice } from "../../products/Helpers";
import PaginationComponent from "../../../global/components/PaginationComponent";
import OrderSkeleton from "../components/OrdersSkeleton";
import { formatOrderStatus, paymentProvider } from "../../shopping/utils/ShoppingUtils";
import clsx from "clsx";
import CheckoutOrderItemV2 from "../../shopping/components/CheckoutOrderItem";
import { useState } from "react";

/* ─────────────────────────────────────────────
   Helper: color de badge por status de orden
   (Reutilizado y mejorado según Checkout design)
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

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

const Orders = () => {
    document.title = "Iga Productos | Mis órdenes";

    const MAX_LIMIT_ROWS = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const orderByParam = searchParams.get("orderBy") as "recent" | "oldest" | null;
    const currentOrderBy = orderByParam || "recent";
    const currentPage = Number(pageParam) || 1;
    const navigate = useNavigate();

    // Estado para gestionar que ordenes están expandidas
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

    const { data, isLoading, error, refetch } = useFetchOrders({
        pagination: { page: currentPage, limit: MAX_LIMIT_ROWS },
        orderBy: currentOrderBy,
    });

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString(), orderBy: currentOrderBy });
    };

    const handleOrderByChange = (newOrderBy: "recent" | "oldest") => {
        setSearchParams({ page: "1", orderBy: newOrderBy });
    };

    const toggleOrderExpansion = (uuid: string) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(uuid)) {
            newExpanded.delete(uuid);
        } else {
            newExpanded.add(uuid);
        }
        setExpandedOrders(newExpanded);
    };

    return (
        <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200 min-h-screen">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/5">
                        <FaBox className="text-primary text-xl shadow-sm" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-base-content tracking-tight">
                            Mis órdenes
                        </h1>
                        <p className="text-xs sm:text-sm text-base-content/50 font-medium">
                            Gestiona y revisa el historial de tus compras
                        </p>
                    </div>
                </div>

                {/* Filtro Ordenar */}
                <div className="flex items-center gap-2 bg-base-100 p-1.5 rounded-xl border border-base-300 w-full sm:w-auto shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-base-content/40 ml-2 hidden sm:block">Ordenar por:</span>
                    <select
                        className="select select-sm bg-transparent border-none focus:outline-none w-full sm:w-auto text-xs font-bold uppercase"
                        value={currentOrderBy}
                        onChange={(e) => handleOrderByChange(e.target.value as "recent" | "oldest")}
                    >
                        <option value="recent">Más recientes</option>
                        <option value="oldest">Más antiguas</option>
                    </select>
                </div>
            </div>

            {/* ── Loading ── */}
            {isLoading && !error && !data && (
                <div className="flex flex-col gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <OrderSkeleton key={index} />
                    ))}
                </div>
            )}

            {/* ── Error ── */}
            {!isLoading && !data && error && (
                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-lg">
                    <div className="px-4 py-3 bg-error/5 border-b border-error/10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                            <FaBox className="text-error text-lg" />
                        </div>
                        <h2 className="font-bold text-error text-sm uppercase">
                            Error al cargar tus pedidos
                        </h2>
                    </div>
                    <div className="p-8 flex flex-col items-center gap-4">
                        <p className="text-sm text-base-content/70 max-w-md text-center">
                            {formatAxiosError(error)}
                        </p>
                        <button
                            className="btn btn-primary btn-sm px-6 gap-2 font-bold"
                            onClick={() => refetch()}
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            )}

            {/* ── Empty state ── */}
            {!isLoading && !error && data && data.data.length === 0 && (
                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-sm">
                    <div className="flex flex-col items-center justify-center gap-6 py-24 px-6 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-base-200 flex items-center justify-center border border-base-300/50 shadow-inner">
                            <FaBox className="text-4xl text-base-content/20" />
                        </div>
                        <div className="max-w-xs">
                            <p className="text-xl font-bold text-base-content">
                                Aún no tienes órdenes
                            </p>
                            <p className="text-sm text-base-content/50 mt-2 leading-relaxed">
                                Parece que todavía no has realizado ninguna compra en nuestra tienda.
                            </p>
                        </div>
                        <Link to="/tienda" className="btn btn-primary btn-md gap-3 font-bold px-8 shadow-md">
                            <FaShoppingBag className="text-lg" />
                            Comenzar a comprar
                        </Link>
                    </div>
                </div>
            )}

            {/* ── Lista de órdenes ── */}
            {!isLoading && !error && data && data.data.length > 0 && (
                <div className="flex flex-col gap-6">
                    {data.data.map((order) => {
                        const isExpanded = expandedOrders.has(order.uuid);
                        const itemsToShow = isExpanded ? order.items : [order.items[0]];
                        const remainingItems = order.items.length - 1;

                        return (
                            <div
                                key={order.uuid}
                                className="w-full rounded-3xl bg-base-100 border border-base-300 hover:border-primary/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
                            >
                                {/* ── Header del Folio (Destacado) ── */}
                                <div className="px-5 py-4 bg-base-200/50 border-b border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase text-base-content/40 tracking-wider">Folio de compra</span>
                                            <span className="text-sm font-mono font-extrabold text-base-content uppercase tracking-widest bg-base-100 px-3 py-1 rounded-lg border border-base-300 shadow-sm">
                                                {order.uuid}
                                            </span>
                                        </div>
                                        <div className="h-8 w-px bg-base-300 hidden sm:block" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase text-base-content/40 tracking-wider">Estatus de orden</span>
                                            <span className={clsx(
                                                "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                                                orderStatusBadge(order.status)
                                            )}>
                                                {formatOrderStatus[order.status]}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => navigate(`/mis-ordenes/detalle/${order.uuid}`)}
                                            className="btn btn-primary btn-sm gap-2 font-bold shadow-sm"
                                        >
                                            Ver detalle
                                            <FaExternalLinkAlt className="text-[10px]" />
                                        </button>
                                    </div>
                                </div>

                                {/* ── Body con Ítems ── */}
                                <div className="p-5 flex flex-col gap-5">
                                    
                                    {/* Items Container */}
                                    <div className="flex flex-col gap-3">
                                        {itemsToShow.map((item, idx) => (
                                            <CheckoutOrderItemV2 key={`${order.uuid}-item-${idx}`} data={item} />
                                        ))}

                                        {/* Toggle Expand Button */}
                                        {remainingItems > 0 && (
                                            <div className="flex justify-center mt-1">
                                                <button
                                                    onClick={() => toggleOrderExpansion(order.uuid)}
                                                    className="btn btn-ghost btn-sm hover:bg-primary/5 text-primary gap-2 font-bold transition-all"
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            <FaChevronUp className="text-xs" />
                                                            Ocultar productos
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaChevronDown className="text-xs" />
                                                            Mostrar {remainingItems} producto{remainingItems !== 1 ? "s" : ""} más...
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-base-200" />

                                    {/* ── Footer Information Row ── */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end">
                                        
                                        {/* Método de Pago */}
                                        <div className="flex flex-col gap-1.5 min-w-0">
                                            <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest px-1">
                                                Método de pago
                                            </p>
                                            <div className="flex items-center gap-2.5 bg-base-200/50 p-2 rounded-2xl border border-base-300/50 group overflow-hidden">
                                                <figure className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-base-200 group-hover:scale-110 transition-transform flex-shrink-0">
                                                    <img
                                                        className="w-full h-full object-contain"
                                                        src={paymentProvider[order.paymentProvider].image_url}
                                                        alt={paymentProvider[order.paymentProvider].description}
                                                    />
                                                </figure>
                                                <span className="text-xs sm:text-sm font-bold text-base-content truncate">
                                                    {paymentProvider[order.paymentProvider].description}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Fecha y Actualización */}
                                        <div className="flex flex-col gap-1 px-1">
                                            <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">
                                                Última actualización
                                            </p>
                                            <p className="text-xs sm:text-sm font-bold text-base-content flex items-center gap-1.5">
                                                {formatDate(order.updatedAt, "es-MX")}
                                            </p>
                                            <p className="text-[10px] text-base-content/40 italic">
                                                Creado el {formatDate(order.createdAt, "es-MX")}
                                            </p>
                                        </div>

                                        {/* Detalle placeholder or other info */}
                                        <div className="hidden md:flex flex-col gap-1 px-1">
                                            <p className="text-[10px] font-black uppercase text-base-content/30 tracking-widest">
                                                Ítems totales
                                            </p>
                                            <p className="text-sm font-bold text-base-content">
                                                {order.items.length} {order.items.length === 1 ? "Producto" : "Productos"}
                                            </p>
                                        </div>

                                        {/* Total (Destacado) */}
                                        <div className="flex flex-col items-end gap-0.5 justify-self-end">
                                            <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">Total pagado</span>
                                            <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                                                ${formatPrice(order.totalAmount, "es-MX")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* ── Paginación ── */}
                    {data.totalPages > 1 && (
                        <div className="flex flex-col items-center sm:items-start gap-4 mt-4 py-8 border-t border-base-300">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <PaginationComponent
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                    totalPages={data.totalPages}
                                />
                                <div className="px-4 py-1.5 bg-base-100 rounded-full border border-base-300 shadow-sm">
                                    <p className="text-xs font-bold text-base-content/40 uppercase">
                                        Página <span className="text-base-content">{currentPage}</span> de <span className="text-base-content">{data.totalPages}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Orders;