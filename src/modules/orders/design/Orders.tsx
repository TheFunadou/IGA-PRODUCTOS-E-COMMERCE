import { FaBox, FaPlus } from "react-icons/fa6";
import { useFetchOrders } from "../hooks/useFetchOrders";
import { useThemeStore } from "../../../layouts/states/themeStore";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { formatAxiosError } from "../../../api/helpers";
import { formatDate, formatPrice } from "../../products/Helpers";
import PaginationComponent from "../../../global/components/PaginationComponent";
import OrderSkeleton from "../components/OrdersSkeleton";
import { formatShippingStatus } from "../../payments/helpers";
import { formatOrderStatus } from "../../shopping/utils/ShoppingUtils";
import clsx from "clsx";

const Orders = () => {
    const MAX_LIMIT_ROWS = 10;
    const { theme } = useThemeStore();
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
        <div className="bg-base-300 px-5 py-10 rounded-xl">
            <h1>Mis compras</h1>
            <h4 className="flex items-center gap-2"><FaBox className="text-primary" />Explora todas tus compras a detalle </h4>
            <div className="mt-5 flex items-center justify-end">
                <select className="select" value={currentOrderBy} onChange={(e) => handleOrderByChange(e.target.value as "recent" | "oldest")}>
                    <option value="recent">Mas recientes</option>
                    <option value="oldest">Mas antiguas</option>
                </select>
            </div>
            <div className="flex justify-center">
                <section className="w-75/100 mt-5 flex flex-col gap-5">
                    {isLoading && !error && !data && (
                        <div className="flex flex-col gap-5">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <OrderSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {!isLoading && !data && error && (
                        <div>
                            <h1>Ocurrio un error al cargar tus ordenes</h1>
                            <p>{formatAxiosError(error)}</p>
                            <button className="btn btn-primary" onClick={() => refetch()}>Intentar de nuevo</button>
                        </div>
                    )}

                    {!isLoading && !error && data && data.data.length === 0 && (
                        <div className="bg-white rounded-xl p-5">
                            <h1>📦 No tienes ordenes de compra registradas</h1>
                            <Link to={"/tienda"} className="underline text-primary text-lg">Realiza tu primera compra ahora</Link>
                        </div>
                    )}
                    {!isLoading && !error && data && data.data.length > 0 && (
                        <div className="flex flex-col gap-5">
                            {data.data.map((order, index) => (
                                <div key={`order-${index}`} className="bg-white rounded-xl p-5">
                                    <div className="flex items-center justify-between">
                                        <h3>Folio #{order.order.uuid}</h3>
                                        {order.order.aditional_resource_url && (
                                            <a href={order.order.aditional_resource_url} target="_blank" className="btn btn-soft btn-primary">Descargar ticket para pago en sitio</a>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-5 mt-1">
                                        <div className="flex-1 text-center ">
                                            Pedido
                                            <div className="bg-gray-200 rounded-xl py-1">
                                                <h3>{formatDate(order.order.created_at, "es-MX")}</h3>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center ">
                                            Ultima actualización
                                            <div className="bg-gray-200 rounded-xl py-1">
                                                <h5>{formatDate(order.order.updated_at, "es-MX")}</h5>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center ">
                                            Estatus de envio
                                            <div className="bg-gray-200 rounded-xl py-1">
                                                <h5>{order.shippingStatus ? formatShippingStatus(order.shippingStatus) : "En espera de pago"}</h5>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center ">
                                            Estatus de orden
                                            <div className={clsx(
                                                "rounded-xl py-1",
                                                order.order.status === "APPROVED" && "bg-success",
                                                order.order.status === "PENDING" && "bg-warning",
                                                (order.order.status === "REJECTED" || order.order.status === "CANCELLED") && "bg-error",
                                                order.order.status === "IN_PROCESS" && "bg-info",
                                            )}>
                                                <h5>{formatOrderStatus[order.order.status]}</h5>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center ">
                                            <p>Acciones</p>
                                            <div className="border border-gray-300 rounded-xl bg-primary py-1">
                                                <button type="button" className="w-full text-white flex items-center gap-2 justify-center cursor-pointer" onClick={() => navigate(`/mis-compras/detalle?folio=${order.order.uuid}`)}>Mas detalles<FaPlus /></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                {order.orderItemImages.map((img, index) => (
                                                    <figure key={`img-${index}`} className="w-35 h-35 rounded-xl border border-gray-300">
                                                        <img className="w-full h-full object-cover rounded-xl" src={img} alt={`img-${index}`} />
                                                    </figure>
                                                ))}

                                            </div>
                                            <p className="text-lg">{order.totalOrderItems > 3 && `y ${order.totalOrderItems - 3} más...`}</p>
                                        </div>
                                        <div className="text-right">
                                            <div>
                                                <h2>{order.order.status === "APPROVED" ? "Total pagado" : "Total a pagar"}</h2>
                                                <h2>${formatPrice(order.order.total_amount, "es-MX")}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {data.totalPages > 1 && (
                                <div className="w-fit">
                                    <PaginationComponent currentPage={Number(pageParam) || 1} onPageChange={handlePageChange} totalPages={data.totalPages} />
                                    <p className="text-center mt-2">Página {Number(pageParam) || 1} de {data.totalPages}</p>
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