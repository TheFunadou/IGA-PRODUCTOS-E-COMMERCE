import { formatPrice } from "../../products/Helpers";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaList, FaTruckFast } from "react-icons/fa6";
import { usePollingPaymentRejected } from "../usePayment";
import { formatAxiosError } from "../../../api/helpers";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { MdOutlinePending } from "react-icons/md";
import type { OrderStatusType } from "../../shopping/ShoppingTypes";

const PaymentError = () => {
    document.title = "Iga Productos | Error en el pago";
    const requiredStatus: OrderStatusType[] = ["IN_PROCESS", "REJECTED"];
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const orderUUID = query.get("external_reference");

    if (!orderUUID) {
        return (
            <div className="bg-base-100 rounded-xl h-screen">
                <h1 className="p-3 sm:p-5 bg-error rounded-xl text-base sm:text-lg font-semibold">Ups! al parecer hubo un error al mostrar tu resumen de pago.</h1>
                <div className="px-3 sm:px-5 flex flex-col gap-3">
                    <p className="mt-2 text-base sm:text-xl">La referencia de pago no es valida o no existe.</p>
                    <button className="w-fit btn btn-primary btn-sm sm:btn-md" onClick={() => navigate("/")}>Regresar a la tienda</button>
                </div>
            </div>
        );
    }

    const { data, error, isLoading } = usePollingPaymentRejected({ orderUUID });
    const [subtotalProducts, setSubtotalProducts] = useState<string>("");


    useEffect(() => {
        if (!data?.order) return;
        const subtotalProducts = data.order.items.reduce((acc, item) => {
            if (item.isOffer && item.discount && item.discount > 0 && item.product_version.unit_price_with_discount) {
                return acc + parseFloat(item.product_version.unit_price_with_discount) * item.quantity;
            };
            return acc + parseFloat(item.product_version.unit_price) * item.quantity;
        }, 0);

        setSubtotalProducts(formatPrice(subtotalProducts.toString(), "es-MX"));
    }, [data?.order]);


    if (isLoading || !data || !data.order) {
        return (
            <div className="bg-base-100 rounded-xl p-5 sm:p-10">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl">Estamos procesando tu orden, espere unos momentos...</h1>
                    <div className="loading loading-dots loading-md sm:loading-lg text-primary" />
                </div>
            </div>
        );
    };

    if (!requiredStatus.includes(data.status)) throw new Error("Error al obtener el estatus de la orden de compra");


    if (error) {
        return (
            <div className="bg-base-100 rounded-xl p-5 sm:p-10">
                <p className="text-base sm:text-lg">Hubo un error al procesar tu pago.</p>
                <p className="text-sm text-red-500">{formatAxiosError(error)}</p>
            </div>
        );
    }

    const { order } = data;
    const { address, items } = order;

    return (
        <div className="w-full animate-fade-in-up">
            <div className="w-full bg-base-300 px-3 sm:px-5 py-6 sm:py-10 rounded-xl">
                <div className="bg-error p-3 rounded-xl">
                    <p className="text-sm sm:text-2xl md:text-3xl font-bold flex items-center gap-2"><MdOutlinePending />Ocurrio un error al procesar tu pago</p>
                    <p className="text-xs sm:text-sm px-0 sm:px-10 mt-1">Intenta realizar tu pago nuevamente</p>
                </div>
                <p className="mt-1 text-sm sm:text-base md:text-lg">Folio de operación: {orderUUID}</p>
                <section className="w-full flex flex-col lg:flex-row gap-5 mt-5">
                    {/* Información de envío */}
                    <div className="w-full lg:w-1/4 p-3 sm:p-5 bg-base-100 rounded-xl">
                        <p className="text-xl sm:text-2xl font-bold flex items-center gap-2"><FaTruckFast />Información de envío</p>
                        <div className="flex flex-col gap-3 text-base sm:text-lg mt-5">
                            <fieldset className="p-3 sm:p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-2 sm:px-3 text-sm sm:text-base">Información general</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">Destinatario</p>
                                    <p className="px-2 text-sm sm:text-base">{`${address.recipient_name} ${address.recipient_last_name}`}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">Contacto</p>
                                    <p className="flex items-center gap-2 px-2 text-sm sm:text-base">
                                        <span>{address.country_phone_code}</span>
                                        {address.contact_number}
                                    </p>
                                </div>
                            </fieldset>

                            <fieldset className="p-3 sm:p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-2 sm:px-3 text-sm sm:text-base">Domicilio de envío</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">Calle:</p>
                                    <p className="px-2 text-sm sm:text-base">{`${address.street_name} #${address.number}`}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">Colonia/Fraccionamiento:</p>
                                    <p className="px-2 text-sm sm:text-base">{address.neighborhood}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">Ciudad y Estado</p>
                                    <p className="px-2 text-sm sm:text-base">{`${address.city}, ${address.state}`}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">País</p>
                                    <p className="px-2 text-sm sm:text-base">{address.country}</p>
                                </div>
                            </fieldset>

                            <fieldset className="p-3 sm:p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-2 sm:px-3 text-sm sm:text-base">Comentarios adicionales</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2 text-sm sm:text-base">Comentarios adicionales/referencias:</p>
                                    <p className="px-2 text-sm sm:text-base">{address.references_or_comments ? address.references_or_comments : 'Sin comentarios adicionales'}</p>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    {/* Resumen de pedido */}
                    <div className="w-full lg:w-3/4 flex flex-col gap-5">
                        <div className="p-3 sm:p-5 bg-base-100 rounded-xl">
                            <p className="font-bold text-xl sm:text-2xl flex items-center gap-2"><FaList />Resumen de pedido</p>
                            <section className="w-full mt-5 bg-base-200 rounded-xl px-3 sm:px-5 pt-3 sm:pt-5">
                                {!isLoading && !error && items.map((items, index) => (
                                    <div key={`item-${index}`} className="w-full mb-3 sm:mb-4 md:mb-5">
                                        <h2 className="text-xl sm:text-2xl font-bold break-words">{items.product_name}</h2>
                                        <div className="w-full md:w-fit text-sm sm:text-base md:text-lg text-gray-500 bg-gray-200 rounded-xl px-2 sm:px-3 flex gap-2 overflow-x-scroll">
                                            <p className="flex-shrink-0">{items.category}</p>
                                            {items.subcategories.map((subcategories, index) => (
                                                <p key={index} className="flex-shrink-0">{subcategories}</p>
                                            ))}
                                        </div>
                                        <div className="w-full flex flex-col sm:flex-row mt-2 gap-3">
                                            <div className="w-full md:w-80/100 flex gap-1">
                                                <figure className="w-25 h-25 sm:w-40 md:w-50  sm:h-40 md:h-50 flex-shrink-0">
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
                                                                )
                                                                }>${formatPrice(items.product_version.unit_price_with_discount, "es-MX")}</p>
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
                                <div className="border-t border-t-gray-300 mt-5 py-3 sm:py-5">
                                    <p className="text-right text-base sm:text-lg md:text-xl font-bold">{`Subtotal (${items.length}) ${items.length === 1 ? "producto" : "productos"}: $ ${subtotalProducts}`}</p>
                                </div>
                            </section>
                        </div>
                        <section className="p-3 sm:p-5 bg-base-100 rounded-xl">
                            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3">Al parecer tu pago no se pudo completar</h2>
                            <Link to={"/pagar-productos"} className="btn btn-primary btn-sm sm:btn-md">Intentar pagar nuevamente</Link>
                        </section>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PaymentError;