import { Link } from "react-router-dom";
import { FaBoxOpen, FaEnvelope, FaInfoCircle, FaScroll, FaStore } from "react-icons/fa";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import SideAdBanner from "../../shopping/components/SideAdBanner";
import { formatDate } from "../../products/Helpers";
import { formatOrderStatus } from "../../shopping/utils/ShoppingUtils";
import { SUPPORT_EMAIL } from "../utils/invoice";
import { orderStatusBadgeClass } from "../utils/orderStatus";
import type { CustomerOrdersDashboardCardI } from "../OrdersTypes";

type Props = {
    pageOrders: CustomerOrdersDashboardCardI[];
    totalRecords: number | null;
};

const MAX_ROWS = 5;

const statusLabel = (status: string): string =>
    formatOrderStatus[status as keyof typeof formatOrderStatus] ?? status;

const OrdersSidebar = ({ pageOrders, totalRecords }: Props) => {
    const rows = pageOrders.slice(0, MAX_ROWS);

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm">
                <div className="card-body p-4 gap-3">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <FaBoxOpen className="text-primary text-sm" />
                            </div>
                            <div>
                                <h2 className="font-black text-base-content uppercase tracking-wide text-sm leading-tight">
                                    Tus pedidos
                                </h2>
                                <p className="text-[11px] text-base-content/50 font-medium">
                                    Pedidos de tu cuenta
                                </p>
                            </div>
                        </div>
                        <span
                            title="Total de pedidos solicitados"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-content text-sm font-black shrink-0 shadow-sm"
                        >
                            {totalRecords ?? "—"}
                        </span>
                    </div>

                    {rows.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-6 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center">
                                <FaBoxOpen className="text-lg text-base-content/25" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-bold text-base-content">Aún no tienes pedidos</p>
                                <p className="text-[11px] text-base-content/50 font-medium">
                                    Cuando realices tu primera compra aparecerá aquí.
                                </p>
                            </div>
                            <Link to="/tienda" className="btn btn-primary btn-xs font-bold gap-2">
                                <FaStore className="text-[10px]" />
                                Ir a la tienda
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y divide-base-200">
                            {rows.map((order) => {
                                const thumbnail = order.productThumbnails[0] ?? NotFoundSVG;
                                return (
                                    <Link
                                        key={order.uuid}
                                        to={`/mis-ordenes/detalle/${order.uuid}`}
                                        className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0 rounded-lg group"
                                    >
                                        <img
                                            src={thumbnail}
                                            alt="Producto"
                                            loading="lazy"
                                            className="w-10 h-10 rounded-lg object-cover border border-base-200 bg-base-100 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                            <span className="font-mono font-extrabold text-[10px] text-base-content uppercase tracking-wider truncate group-hover:text-primary transition-colors">
                                                {order.uuid}
                                            </span>
                                            <span className="text-[10px] text-base-content/40 font-semibold">
                                                Creada el {formatDate(order.createdAt, "es-MX")}
                                            </span>
                                        </div>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase border shrink-0 ${orderStatusBadgeClass(order.status)}`}
                                        >
                                            {statusLabel(order.status)}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm">
                <div className="card-body p-4 gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <FaInfoCircle className="text-primary text-sm" />
                        </div>
                        <div>
                            <h2 className="font-black text-base-content uppercase tracking-wide text-sm leading-tight">
                                ¿Necesitas ayuda?
                            </h2>
                            <p className="text-[11px] text-base-content/50 font-medium">
                                Consulta nuestras políticas
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Link to="/politica-de-compras" className="btn btn-sm justify-start gap-2 font-bold text-primary bg-primary/10 border-primary/20 hover:bg-primary hover:text-primary-content hover:border-primary">
                            <FaStore className="text-xs" />
                            Política de compras
                        </Link>
                        <Link to="/politica-de-devolucion" className="btn btn-sm justify-start gap-2 font-bold text-primary bg-primary/10 border-primary/20 hover:bg-primary hover:text-primary-content hover:border-primary">
                            <FaScroll className="text-xs" />
                            Política de devolución
                        </Link>
                    </div>

                    <a
                        href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Ayuda con mis pedidos")}`}
                        className="flex items-center gap-2 text-[11px] font-bold text-primary hover:underline underline-offset-2"
                    >
                        <FaEnvelope className="text-xs" />
                        {SUPPORT_EMAIL}
                    </a>
                </div>
            </div>

            <SideAdBanner />
        </div>
    );
};

export default OrdersSidebar;