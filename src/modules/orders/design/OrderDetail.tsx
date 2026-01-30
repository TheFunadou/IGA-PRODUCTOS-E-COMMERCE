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
        <div className="bg-base-300 px-5 py-10 rounded-xl">
            <h1>Detalle de orden</h1>
            <h4 className="flex items-center gap-2"><FaList className="text-primary" />Revisa a detalle tu orden </h4>
            <Link to={"/mis-compras"} className="btn btn-primary mt-2"> <FaArrowLeft />Regresar a mis compras</Link>

            <div className="mt-5 flex items-center justify-center">
                <div className="w-75/100">
                    {isLoading && !error && !data && (
                        <div>
                            <h2>Cargando detalles de la orden <span className="loading loading-dots loading-lg" /></h2>
                        </div>
                    )}

                    {!isLoading && !data && error && (
                        <div>
                            <h2>Ocurrio un error al cargar los detalles de la orden</h2>
                            <p>{formatAxiosError(error)}</p>
                            <button className="btn btn-primary" onClick={() => refetch()}>Intentar de nuevo</button>
                        </div>
                    )}

                    {!isLoading && !error && data && (
                        <div>
                            {!data.order && (
                                <div>
                                    <h2>Ocurrio un error inesperado al intentar obtener los datos de tu orden</h2>
                                    <button className="btn btn-primary" onClick={() => refetch()}>Intentar de nuevo</button>
                                </div>
                            )}

                            {data.order && (
                                <div className="w-full flex flex-col gap-5 p-5" ref={printContent}>
                                    <h2>Orden #{data.order.details.order.uuid}</h2>
                                    <div className="bg-base-100 rounded-xl p-5 flex items-center justify-between gap-5 mt-1">
                                        <div className="flex-1 text-center ">
                                            Pedido
                                            <div className="bg-base-300 rounded-xl py-1">
                                                <h5>{formatDate(data.order.details.order.created_at, "es-MX")}</h5>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center ">
                                            Ultima actualización
                                            <div className="bg-base-300 rounded-xl py-1">
                                                <h5>{formatDate(data.order.details.order.updated_at, "es-MX")}</h5>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center ">
                                            Estatus de orden
                                            <div className={clsx(
                                                "rounded-xl py-1",
                                                data.order.details.order.status === "APPROVED" && "bg-success",
                                                data.order.details.order.status === "PENDING" && "bg-warning",
                                                (data.order.details.order.status === "REJECTED" || data.order.details.order.status === "CANCELLED") && "bg-error",
                                                data.order.details.order.status === "IN_PROCESS" && "bg-info",
                                            )}>
                                                <h5>{formatOrderStatus[data.order.details.order.status]}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-base-100 rounded-xl p-5">
                                        <h2>Dirección de envio</h2>
                                        <div className="w-85/100">
                                            <p className="text-2xl font-bold">{`${data.order.address.recipient_name} ${data.order.address.recipient_last_name}`}</p>
                                            <p className="text-lg">{data.order.address.country_phone_code} {data.order.address.contact_number}</p>
                                            <p className="text-lg">{`${data.order.address.street_name}, #${data.order.address.number} EXT.${data.order.address.aditional_number === "N/A" ? "" : `${data.order.address.aditional_number} INT.`} ${data.order.address.neighborhood}, ${data.order.address.zip_code}, ${data.order.address.city}, ${data.order.address.state}, ${data.order.address.country}`}</p>
                                            {data.order.address.references_or_comments && data.order.address.references_or_comments !== "N/A" &&
                                                <div className="w-full mt-3 bg-gray-100 rounded-xl p-5">
                                                    <p className="font-bold text-lg">Comentarios adicionales</p>
                                                    <p className="text-justify">{data.order.address.references_or_comments}</p>
                                                </div>
                                            }
                                        </div>
                                        <div className="w-fit mt-2">
                                            <p className="font-bold text-xl">{data.order.address.address_type}</p>
                                        </div>
                                    </div>
                                    {data.order.details.shipping && (
                                        <div className="bg-base-100 rounded-xl p-5">
                                            <h2>Detalles del envio</h2>
                                            {data.order.details.shipping.tracking_number && <h3 className="underline text-primary">Guia de envio: {data.order.details.shipping.tracking_number}</h3>}
                                            <div className="flex items-center justify-between gap-5 mt-1">
                                                <div className="flex-1 text-center ">
                                                    Solicitado
                                                    <div className="bg-gray-200 rounded-xl py-1">
                                                        <h5>{formatDate(data.order.details.shipping.created_at, "es-MX")}</h5>
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-center ">
                                                    Ultima actualización
                                                    <div className="bg-gray-200 rounded-xl py-1">
                                                        <h5>{formatDate(data.order.details.shipping.updated_at, "es-MX")}</h5>
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-center ">
                                                    Estatus de envio
                                                    <div className="bg-gray-200 rounded-xl py-1">
                                                        <h5>{formatShippingStatus(data.order.details.shipping.shipping_status)}</h5>
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-center ">
                                                    Enviado por
                                                    <div className="bg-gray-200 rounded-xl py-1">
                                                        <h5>{data.order.details.shipping.carrier ? data.order.details.shipping.carrier : "En proceso"}</h5>
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-center ">
                                                    Cajas
                                                    <div className="bg-gray-200 rounded-xl py-1">
                                                        <h5>{data.order.details.shipping.boxes_count}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="bg-base-100 rounded-xl p-5">
                                        <h2 className="text-2xl font-bold">Resumen de pedido</h2>
                                        {data.order.items && data.order.items.length > 0 && data.order.items.map((item, index) => (
                                            <ShoppingCartProductResume
                                                key={index}
                                                data={item}
                                                lock={true}
                                                isAuth={isAuth ?? false}
                                            />
                                        ))}
                                        <div className="w-full border-t border-t-gray-300 pt-5">
                                            <p className="text-xl text-right">{`Subtotal (${data.order.items.length}) productos: `}<span className="font-bold">${formatPrice((data.order.details.resume.subtotalWithDiscount.toString()!), "es-MX")}</span> </p>
                                        </div>
                                    </div>
                                    <div className="bg-base-100 rounded-xl p-5 gap-5">
                                        <h2>Resumen de pago</h2>
                                        <figure className="w-50 py-5">
                                            <img className="w-full object-cover" src={paymentProvider[data.order.details.order.payment_provider].image_url} alt={paymentProvider[data.order.details.order.payment_provider].image_url} />
                                        </figure>
                                        <div className="flex items-center mt-2 gap-20">
                                            {data.order.details.payments_details.length > 0 && data.order.details.payments_details.map((det, index) => (
                                                <div key={`payment-${index}`} className="w-1/2 flex justify-between gap-2 border border-gray-300 rounded-xl p-5">
                                                    <div className="w-50/100 flex flex-col gap-4">
                                                        {(det.payment_class === "credit_card" || det.payment_class === "debit_card") && (
                                                            <div>
                                                                <h4 className="px-2 py-1 bg-base-300 rounded-xl">Terminación</h4>
                                                                <p className="px-2">{det.last_four_digits}</p>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-base-300 rounded-xl">Clase de tarjeta</h4>
                                                            <p className="px-2">{formatPaymentClass[det.payment_class]}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-base-300 rounded-xl">Tipo de tarjeta</h4>
                                                            <figure className="w-25 py-2">
                                                                <img className="w-full object-cover" src={paymentMethod[det.payment_method].image_url} alt={paymentMethod[det.payment_method].description} />
                                                            </figure>
                                                        </div>
                                                    </div>
                                                    <div className="w-50/100 flex flex-col gap-4">
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-gray-100 rounded-xl">Fecha de acreditación</h4>
                                                            <p className="px-2 text-xl">{formatDate(det.updated_at, "es-MX")}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-gray-100 rounded-xl">Estatus de pago</h4>
                                                            <p className="px-2 text-xl">{formatOrderStatus[det.payment_status]}</p>
                                                        </div>
                                                        <div>
                                                            <h2>Total pagado</h2>
                                                            <p className="text-2xl font-medium">${det.customer_paid_amount}</p>
                                                            {det.installments > 1 && (
                                                                <div>
                                                                    <p>${det.customer_installment_amount} x {det.installments} Meses Sin Intereses.</p>
                                                                    <p className="text-xs">*Todas las aclaraciones e indicencias con los MSI se hacen a través de los canales oficiales de su banco.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="w-1/2">
                                                <div className="flex flex-col gap-2">
                                                    <div className="text-xl flex">
                                                        <div className="w-3/5 ">
                                                            <p>Subtotal:</p>
                                                            <p className="text-xs">Antes de impuestos y descuentos</p>
                                                        </div>
                                                        <p className="pl-2 flex items-center "><BiPlus />${data.order.details.resume.subtotalBeforeIVA && formatPrice((data.order.details.resume.subtotalBeforeIVA.toString()), "es-MX")}</p>
                                                    </div>
                                                    <div className="text-xl flex">
                                                        <p className="w-3/5 ">IVA (16%):</p>
                                                        <p className="pl-2 flex items-center "><BiPlus />${data.order.details.resume.iva && formatPrice((data.order.details.resume.iva.toString()), "es-MX")}</p>
                                                    </div>
                                                    <div className="text-xl flex">
                                                        <p className="w-3/5">Envio({data.order.details.resume.boxesQty > 1 ? `${data.order.details.resume.boxesQty} cajas` : `${data.order.details.resume.boxesQty} caja`}):</p>
                                                        <p className="pl-2 flex items-center "><BiPlus />${data.order.details.resume.shippingCost && formatPrice((data.order.details.resume.shippingCost.toString()!), "es-MX")}</p>
                                                    </div>
                                                    <div className="text-xl flex">
                                                        <p className={clsx(
                                                            "w-3/5",
                                                            data.order.details.resume.discount > 0 && "text-primary font-bold"
                                                        )}>Descuento:</p>
                                                        <p className={clsx(
                                                            "pl-2 flex items-center",
                                                            data.order.details.resume.discount > 0 && "text-primary font-bold"
                                                        )}><BiMinus />${data.order.details.resume.discount && formatPrice((data.order.details.resume.discount.toString()), "es-MX")}</p>
                                                    </div>
                                                    <div className="text-2xl font-bold flex border-t py-2">
                                                        <p className="w-3/5 ">Total a Pagar:</p>
                                                        <p className="pl-2">${data.order.details.resume.total && formatPrice((data.order.details.resume.total.toString()), "es-MX")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {data.order && (<button className="btn btn-primary mt-5" onClick={() => handlePrint()}>Imprimir página</button>)}

                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default OrderDetail;