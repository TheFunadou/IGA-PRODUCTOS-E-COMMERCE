import { FaArrowLeft, FaList } from "react-icons/fa6";
import { Link, useSearchParams } from "react-router-dom";
import { useFetchOrderDetail } from "../hooks/useFetchOrders";
import { formatAxiosError } from "../../../api/helpers";
import ShoppingCartProductResume from "../../shopping/components/ShoppingCartProductResume";
import { useAuthStore } from "../../auth/states/authStore";
import { formatDate, formatPrice } from "../../products/Helpers";
import { formatOrderStatus, formatPaymentClass, paymentMethod, paymentProvider } from "../../shopping/utils/ShoppingUtils";
import { BiMinus, BiPlus } from "react-icons/bi";
import clsx from "clsx";
import { formatShippingStatus } from "../../payments/helpers";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";


const OrderDetail = () => {
    document.title = "Iga Productos | Detalle de orden";
    const [searchParams] = useSearchParams();
    const orderUUID = searchParams.get("folio");
    const { data, isLoading, error, refetch } = useFetchOrderDetail({ orderUUID: orderUUID! });
    const { isAuth } = useAuthStore();
    const printContent = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printContent,
        documentTitle: "Detalle de orden",
    });


    return (
        <div className="bg-base-300 px-3 sm:px-4 md:px-5 py-6 sm:py-8 md:py-10 rounded-xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl">Detalle de orden</h1>
            <h4 className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
                <FaList className="text-primary flex-shrink-0" />
                <span>Revisa a detalle tu orden</span>
            </h4>
            <Link to={"/mis-ordenes"} className="btn btn-primary mt-2 w-full sm:w-auto">
                <FaArrowLeft />Regresar a mis ordenes
            </Link>

            <div className="mt-5 flex items-center justify-center">
                <div className="w-full lg:w-75/100">
                    {isLoading && !error && !data && (
                        <div className="text-center">
                            <h2 className="text-lg sm:text-xl md:text-2xl">
                                Cargando detalles de la orden
                                <span className="loading loading-dots loading-lg ml-2" />
                            </h2>
                        </div>
                    )}

                    {!isLoading && !data && error && (
                        <div className="bg-base-100 rounded-xl p-4 sm:p-6 md:p-8">
                            <h2 className="text-lg sm:text-xl md:text-2xl mb-3">Ocurrio un error al cargar los detalles de la orden</h2>
                            <p className="text-sm sm:text-base mb-4">{formatAxiosError(error)}</p>
                            <button className="btn btn-primary w-full sm:w-auto" onClick={() => refetch()}>Intentar de nuevo</button>
                        </div>
                    )}

                    {!isLoading && !error && data && (
                        <div>
                            {!data.order && (
                                <div className="bg-base-100 rounded-xl p-4 sm:p-6 md:p-8">
                                    <h2 className="text-lg sm:text-xl md:text-2xl mb-4">Ocurrio un error inesperado al intentar obtener los datos de tu orden</h2>
                                    <button className="btn btn-primary w-full sm:w-auto" onClick={() => refetch()}>Intentar de nuevo</button>
                                </div>
                            )}

                            {data.order && (
                                <div className="w-full flex flex-col gap-3 sm:gap-4 md:gap-5 p-3 sm:p-4 md:p-5" ref={printContent}>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl break-all">Orden #{data.order.details.order.uuid}</h2>

                                    {/* Información de fechas y estatus */}
                                    <div className="bg-base-100 rounded-xl p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 md:gap-5 mt-1">
                                        <div className="flex-1 text-center">
                                            <p className="text-sm sm:text-base mb-1">Pedido</p>
                                            <div className="bg-base-300 rounded-xl py-1 px-2">
                                                <h5 className="text-sm sm:text-base md:text-lg font-semibold break-words">
                                                    {formatDate(data.order.details.order.created_at, "es-MX")}
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center">
                                            <p className="text-sm sm:text-base mb-1">Ultima actualización</p>
                                            <div className="bg-base-300 rounded-xl py-1 px-2">
                                                <h5 className="text-sm sm:text-base md:text-lg font-semibold break-words">
                                                    {formatDate(data.order.details.order.updated_at, "es-MX")}
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center">
                                            <p className="text-sm sm:text-base mb-1">Estatus de orden</p>
                                            <div className={clsx(
                                                "rounded-xl py-1 px-2",
                                                data.order.details.order.status === "APPROVED" && "bg-success",
                                                data.order.details.order.status === "PENDING" && "bg-warning",
                                                (data.order.details.order.status === "REJECTED" || data.order.details.order.status === "CANCELLED") && "bg-error",
                                                data.order.details.order.status === "IN_PROCESS" && "bg-info",
                                            )}>
                                                <h5 className="text-sm sm:text-base md:text-lg font-semibold">
                                                    {formatOrderStatus[data.order.details.order.status]}
                                                </h5>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dirección de envío */}
                                    <div className="bg-base-100 rounded-xl p-3 sm:p-4 md:p-5">
                                        <h2 className="text-lg sm:text-xl md:text-2xl mb-3">Dirección de envio</h2>
                                        <div className="w-full lg:w-85/100">
                                            <p className="text-xl sm:text-2xl font-bold break-words">
                                                {`${data.order.address.recipient_name} ${data.order.address.recipient_last_name}`}
                                            </p>
                                            <p className="text-base sm:text-lg break-all">
                                                {data.order.address.country_phone_code} {data.order.address.contact_number}
                                            </p>
                                            <p className="text-base sm:text-lg break-words">
                                                {`${data.order.address.street_name}, #${data.order.address.number} EXT.${data.order.address.aditional_number === "N/A" ? "" : `${data.order.address.aditional_number} INT.`} ${data.order.address.neighborhood}, ${data.order.address.zip_code}, ${data.order.address.city}, ${data.order.address.state}, ${data.order.address.country}`}
                                            </p>
                                            {data.order.address.references_or_comments && data.order.address.references_or_comments !== "N/A" &&
                                                <div className="w-full mt-3 bg-gray-100 rounded-xl p-3 sm:p-4 md:p-5">
                                                    <p className="font-bold text-base sm:text-lg">Comentarios adicionales</p>
                                                    <p className="text-justify text-sm sm:text-base break-words">{data.order.address.references_or_comments}</p>
                                                </div>
                                            }
                                        </div>
                                        <div className="w-fit mt-2">
                                            <p className="font-bold text-lg sm:text-xl">{data.order.address.address_type}</p>
                                        </div>
                                    </div>

                                    {/* Detalles del envío */}
                                    {data.order.details.shipping && (
                                        <div className="bg-base-100 rounded-xl p-3 sm:p-4 md:p-5">
                                            <h2 className="text-lg sm:text-xl md:text-2xl mb-2">Detalles del envio</h2>
                                            {data.order.details.shipping.tracking_number && (
                                                <h3 className="underline text-primary text-sm sm:text-base md:text-lg break-all mb-3">
                                                    Guia de envio: {data.order.details.shipping.tracking_number}
                                                </h3>
                                            )}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-1">
                                                <div className="text-center">
                                                    <p className="text-sm sm:text-base mb-1">Solicitado</p>
                                                    <div className="bg-gray-200 rounded-xl py-1 px-2">
                                                        <h5 className="text-sm sm:text-base font-semibold break-words">
                                                            {formatDate(data.order.details.shipping.created_at, "es-MX")}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm sm:text-base mb-1">Ultima actualización</p>
                                                    <div className="bg-gray-200 rounded-xl py-1 px-2">
                                                        <h5 className="text-sm sm:text-base font-semibold break-words">
                                                            {formatDate(data.order.details.shipping.updated_at, "es-MX")}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm sm:text-base mb-1">Estatus de envio</p>
                                                    <div className="bg-gray-200 rounded-xl py-1 px-2">
                                                        <h5 className="text-sm sm:text-base font-semibold">
                                                            {formatShippingStatus(data.order.details.shipping.shipping_status)}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm sm:text-base mb-1">Enviado por</p>
                                                    <div className="bg-gray-200 rounded-xl py-1 px-2">
                                                        <h5 className="text-sm sm:text-base font-semibold">
                                                            {data.order.details.shipping.carrier ? data.order.details.shipping.carrier : "En proceso"}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm sm:text-base mb-1">Cajas</p>
                                                    <div className="bg-gray-200 rounded-xl py-1 px-2">
                                                        <h5 className="text-sm sm:text-base font-semibold">
                                                            {data.order.details.shipping.boxes_count}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Resumen de pedido */}
                                    <div className="bg-base-100 rounded-xl p-3 sm:p-4 md:p-5">
                                        <h2 className="text-xl sm:text-2xl font-bold mb-3">Resumen de pedido</h2>
                                        {data.order.items && data.order.items.length > 0 && data.order.items.map((item, index) => (
                                            <ShoppingCartProductResume
                                                key={index}
                                                data={item}
                                                lock={true}
                                                isAuth={isAuth ?? false}
                                            />
                                        ))}
                                        <div className="w-full border-t border-t-gray-300 pt-3 sm:pt-4 md:pt-5">
                                            <p className="text-base sm:text-lg md:text-xl text-right break-words">
                                                {`Subtotal (${data.order.items.length}) productos: `}
                                                <span className="font-bold">
                                                    ${formatPrice((data.order.details.resume.subtotalWithDiscount.toString()!), "es-MX")}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Resumen de pago */}
                                    <div className="bg-base-100 rounded-xl p-3 sm:p-4 md:p-5 gap-3 sm:gap-4 md:gap-5">
                                        <h2 className="text-lg sm:text-xl md:text-2xl mb-3">Resumen de pago</h2>
                                        <figure className="w-full sm:w-40 md:w-50 py-3 sm:py-4 md:py-5">
                                            <img
                                                className="w-full object-cover"
                                                src={paymentProvider[data.order.details.order.payment_provider].image_url}
                                                alt={paymentProvider[data.order.details.order.payment_provider].image_url}
                                            />
                                        </figure>
                                        <div className="flex flex-col lg:flex-row items-stretch lg:items-start mt-2 gap-5 sm:gap-10 lg:gap-20">
                                            {/* Detalles de pago */}
                                            {data.order.details.payments_details.length > 0 && data.order.details.payments_details.map((det, index) => (
                                                <div key={`payment-${index}`} className="w-full lg:w-1/2 flex flex-col sm:flex-row justify-between gap-3 sm:gap-2 border border-gray-300 rounded-xl p-3 sm:p-4 md:p-5">
                                                    <div className="w-full sm:w-1/2 flex flex-col gap-3 sm:gap-4">
                                                        {(det.payment_class === "credit_card" || det.payment_class === "debit_card") && (
                                                            <div>
                                                                <h4 className="px-2 py-1 bg-base-300 rounded-xl text-sm sm:text-base">Terminación</h4>
                                                                <p className="px-2 text-sm sm:text-base">{det.last_four_digits}</p>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-base-300 rounded-xl text-sm sm:text-base">Clase de tarjeta</h4>
                                                            <p className="px-2 text-sm sm:text-base">{formatPaymentClass[det.payment_class]}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-base-300 rounded-xl text-sm sm:text-base">Tipo de tarjeta</h4>
                                                            <figure className="w-20 sm:w-25 py-2">
                                                                <img
                                                                    className="w-full object-cover"
                                                                    src={paymentMethod[det.payment_method].image_url}
                                                                    alt={paymentMethod[det.payment_method].description}
                                                                />
                                                            </figure>
                                                        </div>
                                                    </div>
                                                    <div className="w-full sm:w-1/2 flex flex-col gap-3 sm:gap-4">
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-gray-100 rounded-xl text-sm sm:text-base">Fecha de acreditación</h4>
                                                            <p className="px-2 text-base sm:text-lg md:text-xl break-words">
                                                                {formatDate(det.updated_at, "es-MX")}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-gray-100 rounded-xl text-sm sm:text-base">Estatus de pago</h4>
                                                            <p className="px-2 text-base sm:text-lg md:text-xl">
                                                                {formatOrderStatus[det.payment_status]}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h2 className="text-sm sm:text-base">Total pagado</h2>
                                                            <p className="text-xl sm:text-2xl font-medium">${det.customer_paid_amount}</p>
                                                            {det.installments > 1 && (
                                                                <div>
                                                                    <p className="text-sm sm:text-base">
                                                                        ${det.customer_installment_amount} x {det.installments} Meses Sin Intereses.
                                                                    </p>
                                                                    <p className="text-xs">
                                                                        *Todas las aclaraciones e indicencias con los MSI se hacen a través de los canales oficiales de su banco.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Resumen de totales */}
                                            <div className="w-full lg:w-1/2">
                                                <div className="flex flex-col gap-2">
                                                    <div className="text-base sm:text-lg md:text-xl flex">
                                                        <div className="w-3/5">
                                                            <p>Subtotal:</p>
                                                            <p className="text-xs">Antes de impuestos y descuentos</p>
                                                        </div>
                                                        <p className="pl-2 flex items-center break-all">
                                                            <BiPlus className="flex-shrink-0" />
                                                            ${data.order.details.resume.subtotalBeforeIVA && formatPrice((data.order.details.resume.subtotalBeforeIVA.toString()), "es-MX")}
                                                        </p>
                                                    </div>
                                                    <div className="text-base sm:text-lg md:text-xl flex">
                                                        <p className="w-3/5">IVA (16%):</p>
                                                        <p className="pl-2 flex items-center break-all">
                                                            <BiPlus className="flex-shrink-0" />
                                                            ${data.order.details.resume.iva && formatPrice((data.order.details.resume.iva.toString()), "es-MX")}
                                                        </p>
                                                    </div>
                                                    <div className="text-base sm:text-lg md:text-xl flex">
                                                        <p className="w-3/5">
                                                            Envio({data.order.details.resume.boxesQty > 1 ? `${data.order.details.resume.boxesQty} cajas` : `${data.order.details.resume.boxesQty} caja`}):
                                                        </p>
                                                        <p className="pl-2 flex items-center break-all">
                                                            <BiPlus className="flex-shrink-0" />
                                                            ${data.order.details.resume.shippingCost && formatPrice((data.order.details.resume.shippingCost.toString()!), "es-MX")}
                                                        </p>
                                                    </div>
                                                    <div className="text-base sm:text-lg md:text-xl flex">
                                                        <p className={clsx(
                                                            "w-3/5",
                                                            data.order.details.resume.discount > 0 && "text-primary font-bold"
                                                        )}>Descuento:</p>
                                                        <p className={clsx(
                                                            "pl-2 flex items-center break-all",
                                                            data.order.details.resume.discount > 0 && "text-primary font-bold"
                                                        )}>
                                                            <BiMinus className="flex-shrink-0" />
                                                            ${data.order.details.resume.discount && formatPrice((data.order.details.resume.discount.toString()), "es-MX")}
                                                        </p>
                                                    </div>
                                                    <div className="text-lg sm:text-xl md:text-2xl font-bold flex border-t py-2">
                                                        <p className="w-3/5">Total a Pagar:</p>
                                                        <p className="pl-2 break-all">
                                                            ${data.order.details.resume.total && formatPrice((data.order.details.resume.total.toString()), "es-MX")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {data.order && (
                                <button className="btn btn-primary mt-5 w-full sm:w-auto" onClick={() => handlePrint()}>
                                    Imprimir página
                                </button>
                            )}

                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default OrderDetail;