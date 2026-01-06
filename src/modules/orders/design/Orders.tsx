import clsx from "clsx";
import { Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useFetchOrderDetail, useFetchOrders } from "../hooks/useFetchOrders";
import { formatDate, formatPrice } from "../../products/Helpers";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { formatOrderStatus, formatPaymentClass, paymentMethod, paymentProvider } from "../../shopping/utils/ShoppingUtils";
import type { ItemsOrderType } from "../OrdersTypes";
import { useNavigate } from "react-router-dom";

const Orders = () => {
    const [filter, setFilter] = useState<"desc" | "asc">("desc");
    const [showDateRange, setShowDateRange] = useState<boolean>(false);
    const [orderDetailId, setOrderDetailId] = useState<string | undefined>(undefined);
    const [orderId, setOrderId] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

    const {
        data: orders,
        isLoading: ordersLoading,
        isError: ordersError,
        refetch: ordersRefetch,
    } = useFetchOrders({ orderby: filter });
    const {
        data: orderDetail,
        isLoading: orderDetailLoading,
        isError: orderDetailError,
        refetch: orderDetailRefetch,
    } = useFetchOrderDetail(orderDetailId);

    // useEffect(() => {
    //     if (filter === "range") setShowDateRange(true);
    // }, [filter]);

    const calcSubtotal = (items: ItemsOrderType[]) => {
        return items.reduce((acc, current) => { return acc + (parseFloat(current.subtotal)) }, 0);
    };

    return (
        <div className="animate-fade-in-up">
            <div className="w-full bg-white rounded-xl p-10">
                <p className="text-3xl font-bold">Mis compras</p>
                <div className="w-full flex items-center gap-5 mt-5">
                    <select
                        defaultValue={"recent"}
                        className="select"
                        onChange={(e) => setFilter(e.currentTarget.value as "desc" | "asc")}
                    >
                        <option value="desc">Mas recientes</option>
                        <option value="asc">Mas antiguas</option>
                        <option value="desc">Rango de fechas</option>
                    </select>
                    <div
                        className={clsx(
                            "w-full flex items-center gap-3",
                            showDateRange ? "block" : "hidden"
                        )}
                    >
                        <p className="font-semibold">Rango de fechas:</p>
                        <input type="date" className="input" />
                        <Minus />
                        <input type="date" className="input" />
                    </div>
                </div>
                <div className="w-full bg-base-300 rounded-xl p-5 mt-5 flex flex-col gap-10">

                    {!orders && !ordersError && ordersLoading && "Cargando..."}
                    {!orders && !ordersError && !ordersLoading && "No hay ordenes"}
                    {!orders && !ordersLoading && ordersError &&
                        <div>
                            <p>Ocurrio un error inesperado al cargar las ordenes</p>
                            <p>{getErrorMessage(ordersError)}</p>
                            <button className="btn btn-primary mt-2" onClick={() => ordersRefetch()}>Intentar de nuevo</button>
                        </div>
                    }
                    {orders && !ordersLoading && !ordersError && orders.map((data, index) => (
                        <div key={index}>
                            <div className="p-2 rounded-xl bg-gray-300 flex justify-between [&_span]: font-semibold [&_span]:mr-2 [&_p]:text-lg">
                                <p className="w-30/100">
                                    <span>Folio de compra:</span>{data.id}
                                </p>
                                <p className={clsx(
                                    "w-12/100 px-3 rounded-xl flex items-center gap-2 justify-center",
                                    data.status === "approved" && "bg-success",
                                    data.status === "pending" && "bg-warning",
                                    data.status === "rejected" && "bg-error",
                                    data.status === "in_process" && "bg-secondary",
                                    data.status === "canceled" && "bg-error",
                                    data.status === "refounded" && "bg-blue-300"
                                )}>
                                    Estatus: <span>{formatOrderStatus[data.status]}</span>
                                </p>
                                <p className="w-12/100 bg-warning text-center rounded-xl px-3">
                                    Envio: <span>En proceso</span>
                                </p>
                                <p className="w-1/5 flex items-center gap-2">
                                    Metodo de pago:
                                    {data.payment_class ? (
                                        <span>{formatPaymentClass[data.payment_class]}</span>
                                    ) : (
                                        "En proceso"
                                    )}
                                </p>
                                <p>Fecha: {formatDate(data.created_at, "es-MX")}</p>
                                <button
                                    className={clsx(
                                        "flex items-center gap-2 border-1 rounded-xl px-2 cursor-pointer",
                                        data.id === orderDetailId && "bg-primary text-white border-primary"
                                    )}
                                    onClick={() => {
                                        data.id === orderDetailId ? setOrderDetailId(undefined) : setOrderDetailId(data.id)
                                    }}>
                                    {data.id === orderDetailId ? "Ocultar detalles" : "Ver mas detalles"}
                                    {data.id === orderDetailId ? <IoIosArrowUp className="text-xl" /> : <IoIosArrowDown className="text-xl" />}
                                </button>
                            </div>
                            {(!orderDetail || orderDetail.id !== data.id) &&
                                <div className="w-full bg-white rounded-xl flex mt-2 p-5 ">
                                    <div className="w-65/100">
                                        {/* Preview */}
                                        <div className="w-full flex gap-5 mt-2">
                                            {data.order_detail.map((detail) => (
                                                detail.product_version.product_images.map((img, index) => (
                                                    <figure key={`img-${index}`} className="w-15/100 rounded-xl">
                                                        <img
                                                            className="w-full border border-gray-300 rounded-xl"
                                                            src={img.image_url}
                                                            alt={"image 1"}
                                                        />
                                                    </figure>
                                                ))
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-35/100 border-l border-l-gray-300 pl-5">
                                        <div className="w-full flex flex-col gap-3">
                                            <div>
                                                <div>
                                                    <span className="text-5xl text-primary">{paymentProvider[data.payment_provider].icon}</span>
                                                    <p>{paymentProvider[data.payment_provider].description}, {data.payment_class && formatPaymentClass[data.payment_class]}</p>
                                                </div>
                                                <p>{data.installments && data.installments > 1 &&
                                                    `${data.installments} MSI x ${formatPrice((parseFloat(data.total_amount) / data.installments).toString(), "es-MX")}`
                                                }</p>
                                                <p className="text-2xl font-bold">
                                                    Total: <span>{formatPrice(data.total_amount, "es-MX")}</span>
                                                </p>
                                                <p>
                                                    <span className="font-medium">Tipo de cambio: </span>{data.exchange}
                                                </p>
                                                {data.status === "approved" &&
                                                    <button className="btn btn-primary mt-2">Descargar desglose de esta compra</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {(!orderDetail || orderDetail.id !== data.id) && orderDetailLoading && !orderDetailError && "Cargando ..."}
                            {(!orderDetail || orderDetail.id !== data.id) && !orderDetailLoading && orderDetailError &&
                                <p>Error al cargar el detalle de la orden</p>
                            }
                            {orderDetail && orderDetail.id === data.id &&
                                <div className="w-full bg-white rounded-xl flex mt-5 p-5 animate-fade-in-up">
                                    <div className="w-65/100 flex flex-col gap-3">
                                        {orderDetail.items.map((data, index) => (
                                            <div className="w-full" key={index}>
                                                <p className="text-2xl font-semibold">{data.product_name}</p>
                                                <p className="px-3 py-1 bg-gray-200 w-fit rounded-xl text-lg">{data.product_attributes.map((attr) => attr.category_attribute.description).join(" - ")}</p>
                                                <div className="w-full flex gap-5 mt-2">
                                                    <figure className="w-50 h-50 rounded-xl">
                                                        <img className="w-full h-full object-cover border border-gray-300 rounded-xl" src={data.product_images[0].image_url} alt={data.product_name} />
                                                    </figure>
                                                    <div className="w-25/100 flex flex-col gap-3">
                                                        <p className="bg-gray-200 px-2 py-1 rounded-xl text-lg w-fit">{data.product_version.color_line}</p>
                                                        <p className="flex items-center gap-2"><span className="px-5 py-5 rounded-full" style={{ backgroundColor: data.product_version.color_code }}></span>{data.product_version.color_name}</p>
                                                        <p className="px-5 py-1 bg-primary rounded-xl text-center text-white w-fit">x {data.quantity} pz</p>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <p className="font-semibold text-xl">Precio unitario:</p>
                                                            <p className="text-2xl">${formatPrice(data.product_version.unit_price, "es-MX")}</p>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="font-semibold text-xl">Subtotal de producto:</p>
                                                            <p className="text-2xl">${formatPrice(formatPrice((data.quantity * parseFloat(data.product_version.unit_price)).toString(), "es-MX"), "es-MX")}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-35/100 border-l border-l-gray-300 pl-5">
                                        <p className="text-2xl font-bold">Desglose</p>
                                        <div className="w-full flex flex-col gap-5">
                                            <div className="w-full">
                                                <p className="text-xl font-medium">Dirección de envio:</p>
                                                <p className="text-lg">{`${orderDetail.shipping_address.street_name} #${orderDetail.shipping_address.number} EXT. ${orderDetail.shipping_address.aditional_number === "N/A" ? "" : orderDetail.shipping_address.aditional_number} ${orderDetail.shipping_address.neighborhood} ${orderDetail.shipping_address.zip_code}, ${orderDetail.shipping_address.city}, ${orderDetail.shipping_address.state}, ${orderDetail.shipping_address.country}`}.</p>
                                                <p>{`${orderDetail.shipping_address.country_phone_code} ${orderDetail.shipping_address.contact_number}`}</p>
                                                <p>{orderDetail.shipping_address.references_or_comments === "N/A" ? "" : orderDetail.shipping_address.references_or_comments}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-5xl text-primary">{paymentProvider[orderDetail.payment_provider].icon}</span>
                                                    <figure className="w-1/6">
                                                        {paymentMethod[orderDetail.payment_method].icon}
                                                    </figure>
                                                </div>
                                                {orderDetail.last_four_digits && <p>************{orderDetail.last_four_digits}</p>}
                                                <p>{paymentProvider[orderDetail.payment_provider].description}, {orderDetail.payment_class && formatPaymentClass[orderDetail.payment_class]}</p>
                                            </div>
                                            <div>
                                                <p className="text-xl font-medium">Resumen de pago</p>
                                                <div className="flex items-start">
                                                    <div className="w-fit">
                                                        <div className="w-full pb-2">
                                                            <p>Subtotal de productos(antes de IVA):</p>
                                                            <p>IVA(16%):</p>
                                                            <p>Descuento aplicado:</p>
                                                        </div>
                                                        <p className="mt-1 text-xl font-bold">Total:</p>
                                                    </div>
                                                    <div className="w-fit pl-3">
                                                        <div className="w-full pb-2">
                                                            <p>+${formatPrice(((calcSubtotal(orderDetail.items)) - (calcSubtotal(orderDetail.items) * 0.16)).toString(), "es-MX")}</p>
                                                            <p>+${formatPrice((calcSubtotal(orderDetail.items) * 0.16).toString(), "es-MX")}</p>
                                                            <p>-$0</p>
                                                        </div>
                                                        <p className="mt-1 text-xl font-bold">${formatPrice(calcSubtotal(orderDetail.items).toString(), "es-MX")}</p>
                                                    </div>
                                                </div>
                                                <p><span className="font-medium">Tipo de cambio: </span>{orderDetail.exchange}</p>
                                                <div className="mt-2">
                                                    {orderDetail.payment_class === "ticket" && orderDetail.aditional_source_url &&
                                                        <button className="btn btn-primary w-fit mt-2 cursor-pointer"><a href={orderDetail.aditional_source_url} target="_blank">Descargar código de compra en efectivo</a></button>
                                                    }
                                                    {orderDetail.status === "approved" &&
                                                        <button className="btn btn-primary">Descargar desglose de esta compra</button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;
