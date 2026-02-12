import { formatDate, formatPrice } from "../../products/Helpers";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCircleDollarToSlot, FaFire, FaList, FaTruckFast } from "react-icons/fa6";
import { usePollingPaymentPendingDetail } from "../usePayment";
import { formatOrderStatus, formatPaymentClass, paymentMethod, paymentProvider } from "../../shopping/utils/ShoppingUtils";
import { formatAxiosError } from "../../../api/helpers";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "../../shopping/states/paymentStore";
import clsx from "clsx";
import { BiMinus, BiPlus } from "react-icons/bi";
import { MdOutlinePending } from "react-icons/md";
import { useAuthStore } from "../../auth/states/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { shoppingCartQueryKeys } from "../../shopping/hooks/useFetchShoppingCart";

const PaymentPending = () => {
    const IVA = 0.16;
    const navigate = useNavigate();
    const { search } = useLocation();
    const queryClient = useQueryClient();
    const { order: orderStore, success } = usePaymentStore();
    const { authCustomer } = useAuthStore();
    const query = new URLSearchParams(search);
    const orderUUID = query.get("external_reference");

    if (!orderUUID) {
        return (
            <div className="bg-base-100 rounded-xl px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10">
                <h1 className="p-4 sm:p-5 bg-error rounded-xl text-sm sm:text-base">Ups! al parecer hubo un error al mostrar tu resumen de pago.</h1>
                <div className="px-4 sm:px-5 flex flex-col gap-3">
                    <p className="mt-2 text-lg sm:text-xl">La referencia de pago no es valida o no existe.</p>
                    <button className="w-full sm:w-fit btn btn-primary" onClick={() => navigate("/")}>Regresar a la tienda</button>
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
        const total = subtotalWithDiscount + parseFloat(data.order.details.shipping?.shippingCost || "0");
        setSubtotalProducts(formatPrice(subtotalProducts.toString(), "es-MX"));
        setSubtotalBeforeIVA(formatPrice(subtotalBeforeIVA.toString(), "es-MX"));
        setIva(formatPrice(iva.toString(), "es-MX"));
        setDiscount(formatPrice(discount.toString(), "es-MX"));
        setTotal(formatPrice(total.toString(), "es-MX"))
        if (data.status === "PENDING" && data.order.details.order.uuid === orderStore?.folio) {
            success();
            if (authCustomer?.uuid) {
                queryClient.invalidateQueries({
                    queryKey: shoppingCartQueryKeys.shoppingCart(authCustomer.uuid)
                });
            }
        }
    }, [data?.order]);

    if (isLoading || !data || !data.order) {
        return (
            <div className="bg-base-100 rounded-xl p-4 sm:p-6 md:p-10">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <h1 className="text-lg sm:text-2xl md:text-3xl text-center sm:text-left">Estamos procesando tu orden, espere unos momentos...</h1>
                    <div className="loading loading-dots loading-lg text-primary" />
                </div>
            </div>
        );
    };

    if (data.status !== "PENDING") throw new Error("Error al obtener el estatus de la orden de compra");

    if (error) {
        return (
            <div className="bg-base-100 rounded-xl p-4 sm:p-6 md:p-10">
                <p>Hubo un error al procesar tu pago.</p>
                <p className="text-sm text-red-500">{formatAxiosError(error)}</p>
            </div>
        );
    };

    const { order } = data;
    const { address, items, details } = order;

    return (
        <div className="w-full animate-fade-in-up">
            <div className="w-full bg-base-300 px-3 sm:px-4 md:px-5 py-6 sm:py-8 md:py-10 rounded-xl">
                <div className="bg-warning p-3 rounded-xl">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2">
                        <MdOutlinePending className="flex-shrink-0" />
                        <span>Orden pendiente de pago</span>
                    </p>
                    <p className="text-xs sm:text-sm px-6 sm:px-8 md:px-10 mt-1">Acercate a tu establecimiento mas cercano para realizar el pago</p>
                </div>
                <p className="mt-1 text-sm sm:text-base md:text-lg break-all">Folio de operación: {orderUUID}</p>

                <section className="w-full flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-5 mt-5">
                    {/* Información de envío */}
                    <div className="w-full lg:w-1/4 p-3 sm:p-4 md:p-5 bg-base-100 rounded-xl">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
                            <FaTruckFast className="flex-shrink-0" />
                            <span>Información de envío</span>
                        </p>
                        <div className="flex flex-col gap-3 text-sm sm:text-base md:text-lg mt-5">
                            <fieldset className="p-3 sm:p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-2 sm:px-3 text-sm sm:text-base">Información general</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">Destinatario</p>
                                    <p className="px-2 break-words">{`${address.recipient_name} ${address.recipient_last_name}`}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">Contacto</p>
                                    <p className="flex items-center gap-2 px-2 break-all">
                                        <span>{address.country_phone_code}</span>
                                        {address.contact_number}
                                    </p>
                                </div>
                            </fieldset>

                            <fieldset className="p-3 sm:p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-2 sm:px-3 text-sm sm:text-base">Domicilio de envío</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">Calle:</p>
                                    <p className="px-2 break-words">{`${address.street_name} #${address.number}`}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">Colonia/Fraccionamiento:</p>
                                    <p className="px-2 break-words">{address.neighborhood}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">Ciudad y Estado</p>
                                    <p className="px-2 break-words">{`${address.city}, ${address.state}`}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">País</p>
                                    <p className="px-2">{address.country}</p>
                                </div>
                            </fieldset>

                            <fieldset className="p-3 sm:p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-2 sm:px-3 text-sm sm:text-base">Comentarios adicionales</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">Comentarios adicionales/referencias:</p>
                                    <p className="px-2 break-words">{address.references_or_comments ? address.references_or_comments : 'Sin comentarios adicionales'}</p>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    {/* Resumen de pedido */}
                    <div className="w-full lg:w-3/4 flex flex-col gap-3 sm:gap-4 md:gap-5">
                        <div className="p-3 sm:p-4 md:p-5 bg-base-100 rounded-xl">
                            <p className="font-bold text-lg sm:text-xl md:text-2xl flex items-center gap-2">
                                <FaList className="flex-shrink-0" />
                                <span>Resumen de pedido</span>
                            </p>
                            <section className="w-full mt-5 bg-base-200 rounded-xl px-3 sm:px-4 md:px-5 pt-3 sm:pt-4 md:pt-5">
                                {!isLoading && !error && items.map((items, index) => (
                                    <div key={`item-${index}`} className="w-full mb-3 sm:mb-4 md:mb-5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-xl sm:text-2xl font-bold break-words">{items.product_name}</h2>
                                            {items.isOffer && (
                                                <div className={clsx(
                                                    "text-lg sm:text-xl md:text-2xl flex gap-2 px-2 rounded-md text-white items-center",
                                                    items.discount && items.discount < 50 && "bg-error",
                                                    items.discount && items.discount >= 50 && items.discount < 65 && "bg-success",
                                                    items.discount && items.discount >= 65 && "bg-primary"
                                                )}>
                                                    <FaFire className="text-base sm:text-lg md:text-xl flex-shrink-0" />
                                                    <p className="text-sm sm:text-base md:text-lg">{items.discount}%</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full md:w-fit text-sm sm:text-base md:text-lg text-gray-500 bg-gray-200 rounded-xl px-2 sm:px-3 flex gap-2 overflow-x-scroll">
                                            <p className="flex-shrink-0">{items.category}</p>
                                            {items.subcategories.map((subcategories, index) => (
                                                <p key={index} className="flex-shrink-0">{subcategories}</p>
                                            ))}
                                        </div>
                                        <div className="w-full flex flex-col sm:flex-row mt-2 gap-3">
                                            <div className="w-full md:w-80/100 flex gap-1">
                                                <figure className="w-25 h-25 sm:w-40 md:w-50 sm:h-40 md:h-50 flex-shrink-0">
                                                    <img
                                                        className="rounded-xl border border-gray-300 object-cover w-full h-full"
                                                        src={items.product_images[0].image_url}
                                                        alt={items.product_name}
                                                    />
                                                </figure>
                                                <div className="flex-1 text-base sm:text-lg md:text-xl flex flex-col gap-2 sm:gap-3">
                                                    <p className="w-fit bg-gray-200 rounded-xl px-2 sm:px-3">
                                                        {items.product_version.color_line}
                                                    </p>
                                                    <p className="w-fit rounded-xl px-2 sm:px-3 py-1 bg-gray-200 flex items-center">
                                                        <span
                                                            className="rounded-full px-2 sm:px-3 mr-2 inline-block"
                                                            style={{ backgroundColor: items.product_version.color_code }}
                                                        ></span>
                                                        {items.product_version.color_name}
                                                    </p>
                                                    <p className="w-fit bg-primary px-3 sm:px-5 py-1 rounded-xl text-white text-center">
                                                        {items.quantity} pz
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full md:w-20/100 flex gap-2 mt-3 md:mt-0">
                                                <div className="flex flex-col gap-3">
                                                    <div>
                                                        <p className="text-base sm:text-lg md:text-xl">Precio unitario</p>
                                                        {items.isOffer && items.product_version.unit_price_with_discount && (
                                                            <div className="flex gap-2 flex-wrap items-center">
                                                                <p className={clsx(
                                                                    "text-xl sm:text-2xl font-bold underline",
                                                                    items.discount && items.discount < 50 && "text-error",
                                                                    items.discount && items.discount >= 50 && items.discount < 65 && "text-success",
                                                                    items.discount && items.discount >= 65 && "text-primary"
                                                                )}>${formatPrice(items.product_version.unit_price_with_discount, "es-MX")}</p>
                                                                <p className="text-sm sm:text-base line-through text-gray-500">${formatPrice(items.product_version.unit_price, "es-MX")}</p>
                                                            </div>
                                                        )}
                                                        {!items.isOffer && (
                                                            <p className="text-xl sm:text-2xl">${formatPrice(items.product_version.unit_price, "es-MX")}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-base sm:text-lg md:text-xl">Subtotal producto</p>
                                                        {items.isOffer && items.product_version.unit_price_with_discount && (
                                                            <div className="flex gap-2 flex-wrap items-center">
                                                                <p className={clsx(
                                                                    "font-bold text-xl sm:text-2xl underline",
                                                                    items.discount && items.discount < 50 && "text-error",
                                                                    items.discount && items.discount >= 50 && items.discount < 65 && "text-success",
                                                                    items.discount && items.discount >= 65 && "text-primary"
                                                                )}>${formatPrice((parseFloat(items.product_version.unit_price_with_discount) * items.quantity).toString(), "es-MX")}</p>
                                                                <p className="font-bold text-sm sm:text-base line-through text-gray-500">${items.subtotal}</p>
                                                            </div>
                                                        )}
                                                        {!items.isOffer && (
                                                            <p className="font-bold text-xl sm:text-2xl underline">${items.subtotal}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="border-t border-t-gray-300 mt-3 sm:mt-4 md:mt-5 py-3 sm:py-4 md:py-5">
                                    <p className="text-right text-base sm:text-lg md:text-xl font-bold break-words">{`Subtotal (${items.length}) ${items.length === 1 ? "producto" : "productos"}: $ ${subtotalProducts}`}</p>
                                </div>
                            </section>
                        </div>

                        <div className="p-3 sm:p-4 md:p-5 bg-base-100 rounded-xl">
                            {/* Desglose de pago */}
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
                                <FaCircleDollarToSlot className="flex-shrink-0" />
                                <span>Desglose de pago</span>
                            </h2>
                            <div className="mt-5">
                                <h3 className="text-base sm:text-lg md:text-xl bg-gray-100 px-2 py-1 rounded-xl">Proveedor</h3>
                                <figure className="w-full sm:w-40 md:w-50 py-3 sm:py-4 md:py-5">
                                    <img className="w-full object-cover" src={paymentProvider[details.order.payment_provider].image_url} alt={paymentProvider[details.order.payment_provider].image_url} />
                                </figure>
                                <div className="w-full flex flex-col lg:flex-row gap-5 sm:gap-7 md:gap-10">
                                    <div className="flex-1">
                                        <h3 className="text-base sm:text-lg md:text-xl bg-gray-100 px-2 py-1 rounded-xl">Información del pago</h3>
                                        <div className="w-full mt-3 flex flex-col gap-3 sm:gap-4 md:gap-5">
                                            {details.payments_details.map((det, index) => (
                                                <div key={`payment-${index}`} className="w-full flex flex-col sm:flex-row justify-between gap-3 sm:gap-2 border border-gray-300 rounded-xl p-2">
                                                    <div className="w-full sm:w-1/2 flex flex-col gap-3 sm:gap-4">
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-gray-100 rounded-xl text-sm sm:text-base">Tipo de transacción</h4>
                                                            <p className="px-2">{formatPaymentClass[det.payment_class]}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-gray-100 rounded-xl text-sm sm:text-base">Entidad</h4>
                                                            <figure className="w-20 sm:w-25 py-2">
                                                                <img className="w-full object-cover" src={paymentMethod[det.payment_method].image_url} alt={paymentMethod[det.payment_method].description} />
                                                            </figure>
                                                        </div>
                                                    </div>
                                                    <div className="w-full sm:w-1/2 flex flex-col gap-3 sm:gap-4">
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-gray-100 rounded-xl text-sm sm:text-base">Fecha de orden</h4>
                                                            <p className="px-2 text-base sm:text-lg md:text-xl break-words">{formatDate(det.updated_at, "es-MX")}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="px-2 py-1 bg-gray-100 rounded-xl text-sm sm:text-base">Estatus de pago</h4>
                                                            <p className="px-2 text-base sm:text-lg md:text-xl">{formatOrderStatus[det.payment_status]}</p>
                                                        </div>
                                                        <div>
                                                            <h2 className="text-sm sm:text-base">Total a pagar</h2>
                                                            <p className="text-xl sm:text-2xl font-medium">${det.customer_paid_amount}</p>
                                                            {det.installments > 1 && (
                                                                <div>
                                                                    <p className="text-sm sm:text-base">${det.customer_installment_amount} x {det.installments} Meses Sin Intereses.</p>
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
                                        <h3 className="text-base sm:text-lg md:text-xl bg-gray-100 px-2 py-1 rounded-xl">Resumen</h3>
                                        <div className="w-full bg-base-100 rounded-xl mt-3 p-2">
                                            <div className="w-full flex flex-col gap-2 pb-3 sm:pb-4 md:pb-5">
                                                <div className="text-base sm:text-lg md:text-xl flex">
                                                    <div className="w-3/5">
                                                        <p>Subtotal:</p>
                                                        <p className="text-xs">Antes de impuestos y descuentos</p>
                                                    </div>
                                                    <p className="pl-2 flex items-center break-all"><BiPlus className="flex-shrink-0" />${subtotalBeforeIVA}</p>
                                                </div>
                                                <div className="text-base sm:text-lg md:text-xl flex">
                                                    <p className="w-3/5">IVA (16%):</p>
                                                    <p className="pl-2 flex items-center break-all"><BiPlus className="flex-shrink-0" />${iva}</p>
                                                </div>
                                                <div className="text-base sm:text-lg md:text-xl flex">
                                                    <div className="w-3/5">{order.details.shipping && order.details.shipping.boxesQty && (
                                                        <p>Envio({order.details.shipping.boxesQty > 1 ? `${order.details.shipping.boxesQty} cajas` : `${order.details.shipping.boxesQty} caja`}):</p>
                                                    )}</div>
                                                    {order.details.shipping && order.details.shipping.shippingCost && (
                                                        <p className="pl-2 flex items-center break-all"><BiPlus className="flex-shrink-0" />${formatPrice(order.details.shipping.shippingCost, "es-MX")}</p>
                                                    )}
                                                </div>
                                                <div className="text-base sm:text-lg md:text-xl flex">
                                                    <p className={clsx(
                                                        "w-3/5",
                                                        parseFloat(discount) > 0 && "text-primary font-bold"
                                                    )}>Descuento:</p>
                                                    <p className={clsx(
                                                        "pl-2 flex items-center break-all",
                                                        parseFloat(discount) > 0 && "text-primary font-bold"
                                                    )}><BiMinus className="flex-shrink-0" />${discount}</p>
                                                </div>
                                                <div className="text-lg sm:text-xl md:text-2xl font-bold flex border-t border-t-gray-400 pt-3">
                                                    <p className="w-3/5">Total a Pagar:</p>
                                                    <p className="pl-2 break-all">${total}</p>
                                                </div>
                                            </div>
                                            <button className="btn btn-primary mt-3 w-full sm:w-auto cursor-pointer">
                                                <a href={order.details.order.aditional_resource_url!} target="_blank" rel="noopener noreferrer">
                                                    Descargar ticket de compra
                                                </a>
                                            </button>
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