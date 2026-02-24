import { FaBox, FaPlus } from "react-icons/fa6";
import { useFetchOrders } from "../hooks/useFetchOrders";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { formatAxiosError } from "../../../api/helpers";
import { formatDate, formatPrice } from "../../products/Helpers";
import PaginationComponent from "../../../global/components/PaginationComponent";
import OrderSkeleton from "../components/OrdersSkeleton";
import { formatShippingStatus } from "../../payments/helpers";
import { formatOrderStatus } from "../../shopping/utils/ShoppingUtils";
import clsx from "clsx";

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
        pagination: {
            page: currentPage,
            limit: MAX_LIMIT_ROWS
        },
        orderBy: currentOrderBy
    });

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString(), orderBy: currentOrderBy });
    };

    const handleOrderByChange = (newOrderBy: "recent" | "oldest") => {
        setSearchParams({ page: "1", orderBy: newOrderBy });
    };


    return (
        <div className="bg-base-300 px-3 sm:px-5 py-6 sm:py-10 rounded-xl">
            <h1 className="text-2xl sm:text-3xl font-bold">Mis ordenes</h1>
            <h4 className="flex items-center gap-2 text-sm sm:text-base"><FaBox className="text-primary" />Explora todas tus compras a detalle </h4>
            <div className="mt-5 flex items-center justify-end">
                <select className="select select-sm sm:select-md" value={currentOrderBy} onChange={(e) => handleOrderByChange(e.target.value as "recent" | "oldest")}>
                    <option value="recent">Mas recientes</option>
                    <option value="oldest">Mas antiguas</option>
                </select>
            </div>
            <div className="flex justify-center">
                <section className="w-full lg:w-75/100 mt-5 flex flex-col gap-5">
                    {isLoading && !error && !data && (
                        <div className="flex flex-col gap-5">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <OrderSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {!isLoading && !data && error && (
                        <div className="bg-base-100 rounded-xl p-4 sm:p-5">
                            <h1 className="text-lg sm:text-xl font-bold">Ocurrio un error al cargar tus ordenes</h1>
                            <p className="text-sm sm:text-base">{formatAxiosError(error)}</p>
                            <button className="btn btn-primary btn-sm sm:btn-md mt-3" onClick={() => refetch()}>Intentar de nuevo</button>
                        </div>
                    )}

                    {!isLoading && !error && data && data.data.length === 0 && (
                        <div className="bg-base-100 rounded-xl p-4 sm:p-5">
                            <h1 className="text-lg sm:text-xl font-bold">📦 No tienes ordenes de compra registradas</h1>
                            <Link to={"/tienda"} className="underline text-primary text-sm sm:text-base lg:text-lg">Realiza tu primera compra ahora</Link>
                        </div>
                    )}
                    {!isLoading && !error && data && data.data.length > 0 && (
                        <div className="flex flex-col gap-5">
                            {data.data.map((order, index) => (
                                <div key={`order-${index}`} className="bg-base-100 rounded-xl p-3 sm:p-4 md:p-5">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <h3 className="text-base sm:text-lg font-semibold">Folio #{order.order.uuid}</h3>
                                        {order.order.aditional_resource_url && (
                                            <a href={order.order.aditional_resource_url} target="_blank" className="btn btn-soft btn-primary btn-xs sm:btn-sm md:btn-md text-xs sm:text-sm">Descargar ticket para pago en sitio</a>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 md:gap-5 mt-3">
                                        <div className="text-center">
                                            <p className="text-xs sm:text-sm font-medium">Pedido</p>
                                            <div className="bg-base-300 rounded-xl py-1 mt-1">
                                                <h3 className="text-xs sm:text-sm md:text-base">{formatDate(order.order.created_at, "es-MX")}</h3>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs sm:text-sm font-medium">Ultima actualización</p>
                                            <div className="bg-base-300 rounded-xl py-1 mt-1">
                                                <h5 className="text-xs sm:text-sm md:text-base">{formatDate(order.order.updated_at, "es-MX")}</h5>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs sm:text-sm font-medium">Estatus de envio</p>
                                            <div className="bg-base-300 rounded-xl py-1 mt-1">
                                                <h5 className="text-xs sm:text-sm md:text-base">{order.shippingStatus ? formatShippingStatus(order.shippingStatus) : "En espera de pago"}</h5>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs sm:text-sm font-medium">Estatus de orden</p>
                                            <div className={clsx(
                                                "rounded-xl py-1 mt-1",
                                                order.order.status === "APPROVED" && "bg-success",
                                                order.order.status === "PENDING" && "bg-warning",
                                                (order.order.status === "REJECTED" || order.order.status === "CANCELLED") && "bg-error",
                                                order.order.status === "IN_PROCESS" && "bg-info",
                                            )}>
                                                <h5 className="text-xs sm:text-sm md:text-base">{formatOrderStatus[order.order.status]}</h5>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs sm:text-sm font-medium">Acciones</p>
                                            <div className="rounded-xl bg-primary py-1 mt-1">
                                                <button type="button" className="w-full text-white flex items-center gap-1 sm:gap-2 justify-center cursor-pointer text-xs sm:text-sm md:text-base" onClick={() => navigate(`/mis-ordenes/detalle?folio=${order.order.uuid}`)}>Mas detalles<FaPlus className="text-xs sm:text-sm" /></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                {order.orderItemImages.map((img, index) => (
                                                    <figure key={`img-${index}`} className="w-16 h-16 sm:w-24 sm:h-24 md:w-35 md:h-35 rounded-xl border border-gray-300 flex-shrink-0">
                                                        <img className="w-full h-full object-cover rounded-xl" src={img} alt={`img-${index}`} />
                                                    </figure>
                                                ))}

                                            </div>
                                            <p className="text-sm sm:text-base md:text-lg mt-1">{order.totalOrderItems > 3 && `y ${order.totalOrderItems - 3} más...`}</p>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <div>
                                                <h2 className="text-sm sm:text-base md:text-lg font-semibold">{order.order.status === "APPROVED" ? "Total pagado" : "Total a pagar"}</h2>
                                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">${formatPrice(order.order.total_amount, "es-MX")}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {data.totalPages > 1 && (
                                <div className="w-full sm:w-fit">
                                    <PaginationComponent currentPage={Number(pageParam) || 1} onPageChange={handlePageChange} totalPages={data.totalPages} />
                                    <p className="text-center mt-2 text-sm sm:text-base">Página {Number(pageParam) || 1} de {data.totalPages}</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Orders;