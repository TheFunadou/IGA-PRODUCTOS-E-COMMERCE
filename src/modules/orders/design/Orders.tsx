import { FaBox, FaShoppingBag } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useFetchOrders } from "../hooks/useFetchOrders";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { formatAxiosError } from "../../../api/helpers";
import { formatDate, formatPrice } from "../../products/Helpers";
import PaginationComponent from "../../../global/components/PaginationComponent";
import OrderSkeleton from "../components/OrdersSkeleton";
import { formatShippingStatus } from "../../payments/helpers";
import { formatOrderStatus } from "../../shopping/utils/ShoppingUtils";
import clsx from "clsx";

/* ─────────────────────────────────────────────
   Helper: color de badge por status de orden
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
   Main component
───────────────────────────────────────────── */

const Orders = () => {
    document.title = "Iga Productos | Mis ordenes";

    const MAX_LIMIT_ROWS = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const orderByParam = searchParams.get("orderBy") as "recent" | "oldest" | null;
    const currentOrderBy = orderByParam || "recent";
    const currentPage = Number(pageParam) || 1;
    const navigate = useNavigate();

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

    return (
        <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FaBox className="text-primary text-lg sm:text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                            Mis órdenes
                        </h1>
                        <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                            Explora todas tus compras a detalle
                        </p>
                    </div>
                </div>

                {/* Ordenar */}
                <select
                    className="select select-sm sm:select-md bg-base-100 border-base-300 w-full sm:w-auto"
                    value={currentOrderBy}
                    onChange={(e) => handleOrderByChange(e.target.value as "recent" | "oldest")}
                >
                    <option value="recent">Más recientes</option>
                    <option value="oldest">Más antiguas</option>
                </select>
            </div>

            {/* ── Loading ── */}
            {isLoading && !error && !data && (
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <OrderSkeleton key={index} />
                    ))}
                </div>
            )}

            {/* ── Error ── */}
            {!isLoading && !data && error && (
                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                    <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
                            <FaBox className="text-error text-sm" />
                        </div>
                        <h2 className="font-bold text-base-content text-sm uppercase">
                            Error al cargar órdenes
                        </h2>
                    </div>
                    <div className="p-5 space-y-3">
                        <p className="text-sm text-base-content/70">{formatAxiosError(error)}</p>
                        <button
                            className="btn btn-primary btn-sm gap-2"
                            onClick={() => refetch()}
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            )}

            {/* ── Empty state ── */}
            {!isLoading && !error && data && data.data.length === 0 && (
                <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center">
                            <FaBox className="text-3xl text-base-content/20" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-base-content">
                                No tienes órdenes de compra aún
                            </p>
                            <p className="text-sm text-base-content/50 mt-1">
                                Explora nuestra tienda y realiza tu primera compra
                            </p>
                        </div>
                        <Link to="/tienda" className="btn btn-primary btn-sm gap-2 mt-1">
                            <FaShoppingBag className="text-base" />
                            Ir a la tienda
                        </Link>
                    </div>
                </div>
            )}

            {/* ── Lista de órdenes ── */}
            {!isLoading && !error && data && data.data.length > 0 && (
                <div className="flex flex-col gap-4">
                    {data.data.map((order, index) => (
                        <div
                            key={`order-${index}`}
                            className="w-full rounded-2xl bg-base-100 border border-base-300 hover:border-primary/30 transition-colors duration-200 overflow-hidden"
                        >
                            {/* Card header */}
                            <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <p className="text-xs font-mono text-base-content/50 truncate">
                                    Folio:{" "}
                                    <span className="text-base-content/80">{order.order.uuid}</span>
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* Badge status */}
                                    <span className={clsx(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase",
                                        orderStatusBadge(order.order.status)
                                    )}>
                                        {formatOrderStatus[order.order.status]}
                                    </span>

                                    {/* Ticket externo */}
                                    {order.order.aditional_resource_url && (
                                        <a
                                            href={order.order.aditional_resource_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-outline btn-primary btn-xs gap-1"
                                        >
                                            Descargar ticket
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="p-4 sm:p-5 flex flex-col gap-4">

                                {/* Imágenes + total */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    {/* Imágenes de productos */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            {order.orderItemImages.map((img, i) => (
                                                <div
                                                    key={`img-${i}`}
                                                    className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl overflow-hidden border border-base-300 flex-shrink-0"
                                                >
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={img}
                                                        alt={`producto-${i}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {order.totalOrderItems > 3 && (
                                            <p className="text-xs text-base-content/50 mt-0.5">
                                                y {order.totalOrderItems - 3} producto{order.totalOrderItems - 3 !== 1 ? "s" : ""} más
                                            </p>
                                        )}
                                    </div>

                                    {/* Total */}
                                    <div className="text-left sm:text-right flex-shrink-0">
                                        <p className="text-xs text-base-content/50 uppercase font-semibold">
                                            {order.order.status === "APPROVED" ? "Total pagado" : "Total a pagar"}
                                        </p>
                                        <p className="text-xl sm:text-2xl font-extrabold text-base-content">
                                            ${formatPrice(order.order.total_amount, "es-MX")}
                                        </p>
                                    </div>
                                </div>

                                {/* Metadata grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-xs font-semibold uppercase text-base-content/40">
                                            Pedido
                                        </p>
                                        <p className="text-sm text-base-content">
                                            {formatDate(order.order.created_at, "es-MX")}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-xs font-semibold uppercase text-base-content/40">
                                            Última actualización
                                        </p>
                                        <p className="text-sm text-base-content">
                                            {formatDate(order.order.updated_at, "es-MX")}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-xs font-semibold uppercase text-base-content/40">
                                            Estatus de envío
                                        </p>
                                        <p className="text-sm text-base-content">
                                            {order.shippingStatus
                                                ? formatShippingStatus(order.shippingStatus)
                                                : "En espera de pago"}
                                        </p>
                                    </div>
                                </div>

                                {/* Acción */}
                                <div className="pt-1">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm gap-2"
                                        onClick={() => navigate(`/mis-ordenes/detalle?folio=${order.order.uuid}`)}
                                    >
                                        Ver detalle
                                        <FaPlus className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Paginación */}
                    {data.totalPages > 1 && (
                        <div className="flex flex-col items-center sm:items-start gap-2 mt-2">
                            <PaginationComponent
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                                totalPages={data.totalPages}
                            />
                            <p className="text-sm text-base-content/50">
                                Página {currentPage} de {data.totalPages}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Orders;