import { formatDate, formatPrice } from "../../products/Helpers";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCircleDollarToSlot, FaList, FaTruckFast } from "react-icons/fa6";
import { usePollingPaymentPendingDetail } from "../usePayment";
import { formatOrderStatus, formatPaymentClass, paymentMethod, paymentProvider } from "../../shopping/utils/ShoppingUtils";
import { formatAxiosError } from "../../../api/helpers";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "../../shopping/states/paymentStore";
import clsx from "clsx";
import { BiMinus, BiPlus } from "react-icons/bi";
import { MdOutlinePending } from "react-icons/md";

const PaymentPending = () => {
    const IVA = 0.16;
    const navigate = useNavigate();
    const { search } = useLocation();
    const { order: orderStore } = usePaymentStore();
    const query = new URLSearchParams(search);
    const orderUUID = query.get("external_reference");

    if (!orderUUID) {
        return (
            <div className="bg-white rounded-xl px-10 py-25">
                <h1 className="p-5 bg-error rounded-xl">Ups! al parecer hubo un error al mostrar tu resumen de pago.</h1>
                <div className="px-5 flex flex-col gap-3">
                    <p className="mt-2 text-xl">La referencia de pago no es valida o no existe.</p>
                    <button className="w-fit btn btn-primary" onClick={() => navigate("/")}>Regresar a la tienda</button>
                </div>
            </div>
        );
    }

    const { data, error, isLoading } = usePollingPaymentPendingDetail({ orderUUID });
    const [subtotalProducts, setSubtotalProducts] = useState<string>("");
    const [subtotalBeforeIVA, setSubtotalBeforeIVA] = useState<string>("");
    const [iva, setIva] = useState<string>("");
    const [discount, setDiscount] = useState<string>("");
    const [total, setTotal] = useState<string>("");


    useEffect(() => {
        if (!data?.order) return;
        const subtotalProducts = data.order.items.reduce((acc, item) => {
            if (item.isOffer && item.discount && item.discount > 0 && item.product_version.unit_price_with_discount) {
                return acc + parseFloat(item.product_version.unit_price_with_discount) * item.quantity;
            };
            return acc + parseFloat(item.product_version.unit_price) * item.quantity;
        }, 0);
        const subtotal = data.order.items.reduce((acc, item) => {
            return acc + parseFloat(item.product_version.unit_price) * item.quantity;
        }, 0);

        const discount = data.order.items.reduce((acc, item) => {
            if (item.isOffer && item.discount && item.discount > 0 && item.product_version.unit_price_with_discount) {
                return acc + parseFloat(item.product_version.unit_price_with_discount) * item.quantity;
            };
            return acc;
        }, 0);

        const iva = subtotal * IVA;
        const subtotalBeforeIVA = subtotal - iva;
        const subtotalWithDiscount = subtotal - discount;
        const total = subtotalWithDiscount + parseFloat(data.order.details.shipping.shippingCost);
        setSubtotalProducts(formatPrice(subtotalProducts.toString(), "es-MX"));
        setSubtotalBeforeIVA(formatPrice(subtotalBeforeIVA.toString(), "es-MX"));
        setIva(formatPrice(iva.toString(), "es-MX"));
        setDiscount(formatPrice(discount.toString(), "es-MX"));
        setTotal(formatPrice(total.toString(), "es-MX"))
        if (data.status === "PENDING" && data.order.details.order.uuid === orderStore?.folio) {
            console.log("Pago aprobado");
            localStorage.removeItem("order");
        }

    }, [data?.order]);


    if (isLoading || !data || data.status !== "PENDING" || !data.order) {
        return (
            <div className="bg-white rounded-xl p-10">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl">Estamos procesando tu orden, espere unos momentos...</h1>
                    <div className="loading loading-dots loading-lg text-primary" />
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="bg-white rounded-xl p-10">
                <p>Hubo un error al procesar tu pago.</p>
                <p className="text-sm text-red-500">{formatAxiosError(error)}</p>
            </div>
        );
    }

    const { order } = data;
    const { address, items, details } = order;

    return (
        <div className="w-full animate-fade-in-up">
            <div className="w-full bg-base-300 px-5 py-10 rounded-xl">
                <div className="bg-warning p-3 rounded-xl">
                    <p className="text-3xl font-bold flex items-center gap-2"><MdOutlinePending />Orden pendiente de pago</p>
                    <p className="text-sm px-10">Acercate a tu establecimiento mas cercano para realizar el pago</p>
                </div>
                <p className="mt-1 text-lg">Folio de operación: {orderUUID}</p>
                <section className="w-full flex gap-5 mt-5">
                    {/* Información de envío */}
                    <div className="w-1/4 p-5 bg-white rounded-xl">
                        <p className="text-2xl font-bold flex items-center gap-2"><FaTruckFast />Información de envío</p>
                        <div className="flex flex-col gap-3 text-lg mt-5">
                            <fieldset className="p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-3">Información general</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Destinatario</p>
                                    <p className="px-2">{`${address.recipient_name} ${address.recipient_last_name}`}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Contacto</p>
                                    <p className="flex items-center gap-2 px-2">
                                        <span>{address.country_phone_code}</span>
                                        {address.contact_number}
                                    </p>
                                </div>
                            </fieldset>

                            <fieldset className="p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-3">Domicilio de envío</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Calle:</p>
                                    <p className="px-2">{`${address.street_name} #${address.number}`}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Colonia/Fraccionamiento:</p>
                                    <p className="px-2">{address.neighborhood}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Ciudad y Estado</p>
                                    <p className="px-2">{`${address.city}, ${address.state}`}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">País</p>
                                    <p className="px-2">{address.country}</p>
                                </div>
                            </fieldset>

                            <fieldset className="p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-3">Comentarios adicionales</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Comentarios adicionales/referencias:</p>
                                    <p className="px-2">{address.references_or_comments ? address.references_or_comments : 'Sin comentarios adicionales'}</p>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    {/* Resumen de pedido */}
                    <div className="w-3/4 flex flex-col gap-5">
                        <div className="p-5 bg-white rounded-xl">
                            <p className="font-bold text-2xl flex items-center gap-2"><FaList />Resumen de pedido</p>
                            <section className="w-full mt-5 bg-base-200 rounded-xl px-5 pt-5">
                                {!isLoading && !error && items.map((items, index) => (
                                    <div key={`item-${index}`} className="w-full mb-5">
                                        <h2 className="text-2xl font-bold">{items.product_name}</h2>
                                        <div className="text-lg text-gray-500 bg-gray-200 w-fit rounded-xl px-3 flex gap-2">
                                            <p>{items.category}</p>
                                            {items.subcategories.map((subcategories, index) => (
                                                <p key={index}>{subcategories}</p>
                                            ))}
                                        </div>
                                        <div className="w-full flex mt-2">
                                            <figure className="w-40 h-40 rounded-xl border">
                                                <img
                                                    className="rounded-xl border border-gray-300 object-cover"
                                                    src={items.product_images[0].image_url}
                                                    alt={items.product_name}
                                                />
                                            </figure>
                                            <div className="w-50/100 text-xl ml-4 flex flex-col gap-3">
                                                <p className="w-fit bg-gray-200 rounded-xl px-3">
                                                    {items.product_version.color_line}
                                                </p>
                                                <p className="w-fit rounded-xl px-3 py-1 bg-gray-200">
                                                    <span
                                                        className="rounded-full px-3 mr-2"
                                                        style={{ backgroundColor: items.product_version.color_code }}
                                                    ></span>
                                                    {items.product_version.color_name}
                                                </p>
                                                <p className="w-fit bg-primary px-5 py-1 rounded-xl text-white text-center">
                                                    {items.quantity} pz
                                                </p>
                                            </div>
                                            <div className="w-35/100">
                                                <div>
                                                    <div className="mb-2">
                                                        <p className="text-xl">Precio unitario</p>
                                                        {items.isOffer && items.product_version.unit_price_with_discount && (
                                                            <div className="flex gap-2">
                                                                <p className={clsx(
                                                                    "text-2xl font-bold underline",
                                                                    items.discount && items.discount < 50 && "text-error",
                                                                    items.discount && items.discount >= 50 && items.discount < 65 && "text-success",
                                                                    items.discount && items.discount >= 65 && "text-primary"
                                                                )
                                                                }>${formatPrice(items.product_version.unit_price_with_discount, "es-MX")}</p>
                                                                <p className="text-base line-through text-gray-500">${formatPrice(items.product_version.unit_price, "es-MX")}</p>
                                                            </div>
                                                        )}
                                                        {!items.isOffer && (
                                                            <p className="text-2xl">${formatPrice(items.product_version.unit_price, "es-MX")}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xl">Subtotal producto</p>
                                                        {items.isOffer && items.product_version.unit_price_with_discount && (
                                                            <div className="flex gap-2">
                                                                <p className={clsx(
                                                                    "font-bold text-2xl underline",
                                                                    items.discount && items.discount < 50 && "text-error",
                                                                    items.discount && items.discount >= 50 && items.discount < 65 && "text-success",
                                                                    items.discount && items.discount >= 65 && "text-primary"

                                                                )}>${formatPrice((parseFloat(items.product_version.unit_price_with_discount) * items.quantity).toString(), "es-MX")}</p>
                                                                <p className="font-bold text-base line-through text-gray-500">${items.subtotal}</p>
                                                            </div>
                                                        )}
                                                        {!items.isOffer && (
                                                            <p className="font-bold text-2xl underline">${items.subtotal}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="border-t border-t-gray-300 mt-5 py-5">
                                    <p className="text-right text-xl font-bold">{`Subtotal (${items.length}) ${items.length === 1 ? "producto" : "productos"}: $ ${subtotalProducts}`}</p>
                                </div>
                            </section>
                        </div>
                        <div className="p-5 bg-white rounded-xl">
                            {/* Desglose de pago */}
                            <h2 className="text-2xl font-bold flex items-center gap-2"><FaCircleDollarToSlot />Desglose de pago</h2>
                            <div className="mt-5">
                                <h3 className="text-xl bg-gray-100 px-2 py-1 rounded-xl">Proveedor</h3>
                                <figure className="w-50 py-5">
                                    <img className="w-full object-cover" src={paymentProvider[details.order.payment_provider].image_url} alt={paymentProvider[details.order.payment_provider].image_url} />
                                </figure>
                                <div className="w-full flex gap-10">
                                    <div className="flex-1">
                                        <h3 className="text-xl bg-gray-100 px-2 py-1 rounded-xl">Información del pago</h3>
                                        <div className="w-full mt-3 flex flex-col gap-5">
                                            {details.payments_details.map((det, index) => (
                                                <div key={`payment-${index}`} className="w-full flex justify-between gap-2 border border-gray-300 rounded-xl p-2">
                                                    <div className="w-50/100 flex flex-col gap-4">
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-gray-100 rounded-xl">Tipo de transacción</h4>
                                                            <p className="px-2">{formatPaymentClass[det.payment_class]}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-gray-100 rounded-xl">Entidad</h4>
                                                            <figure className="w-25 py-2">
                                                                <img className="w-full object-cover" src={paymentMethod[det.payment_method].image_url} alt={paymentMethod[det.payment_method].description} />
                                                            </figure>
                                                        </div>
                                                    </div>
                                                    <div className="w-50/100 flex flex-col gap-4">
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-gray-100 rounded-xl">Fecha de orden</h4>
                                                            <p className="px-2 text-xl">{formatDate(det.updated_at, "es-MX")}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-gray-100 rounded-xl">Estatus de pago</h4>
                                                            <p className="px-2 text-xl">{formatOrderStatus[det.payment_status]}</p>
                                                        </div>
                                                        <div>
                                                            <h2>Total a pagar</h2>
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

                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className=" bg-gray-100 px-2 py-1 rounded-xl">Resumen</h3>
                                        <div className="w-full bg-white rounded-xl mt-3 p-2">
                                            <div className="w-full flex flex-col gap-2  pb-5">
                                                <div className="text-xl flex">
                                                    <div className="w-3/5 ">
                                                        <p>Subtotal:</p>
                                                        <p className="text-xs">Antes de impuestos y descuentos</p>
                                                    </div>
                                                    <p className="pl-2 flex items-center "><BiPlus />${subtotalBeforeIVA}</p>
                                                </div>
                                                <div className="text-xl flex">
                                                    <p className="w-3/5 ">IVA (16%):</p>
                                                    <p className="pl-2 flex items-center "><BiPlus />${iva}</p>
                                                </div>
                                                <div className="text-xl flex">
                                                    <p className="w-3/5">Envio({order.details.shipping.boxesQty > 1 ? `${order.details.shipping.boxesQty} cajas` : `${order.details.shipping.boxesQty} caja`}):</p>
                                                    <p className="pl-2 flex items-center "><BiPlus />${formatPrice(details.shipping.shippingCost, "es-MX")}</p>
                                                </div>
                                                <div className="text-xl flex">
                                                    <p className={clsx(
                                                        "w-3/5",
                                                        parseFloat(discount) > 0 && "text-primary font-bold"
                                                    )}>Descuento:</p>
                                                    <p className={clsx(
                                                        "pl-2 flex items-center",
                                                        parseFloat(discount) > 0 && "text-primary font-bold"
                                                    )}><BiMinus />${discount}</p>
                                                </div>
                                                <div className="text-2xl font-bold flex border-t border-t-gray-400 pt-3">
                                                    <p className="w-3/5 ">Total a Pagar:</p>
                                                    <p className="pl-2">${total}</p>
                                                </div>
                                            </div>
                                            <button className="btn btn-primary mt-3 cursor-pointer"><a href={order.details.order.aditional_resource_url!} target="_blank" rel="noopener noreferrer">Descargar ticket de compra</a></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PaymentPending;