import { formatPrice } from "../../products/Helpers";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaFire, FaList, FaTruckFast } from "react-icons/fa6";
import { usePollingPaymentRejected } from "../usePayment";
import { formatAxiosError } from "../../../api/helpers";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { MdOutlinePending } from "react-icons/md";
import type { OrderStatusType } from "../../shopping/ShoppingTypes";

const PaymentError = () => {
    const requiredStatus: OrderStatusType[] = ["IN_PROCESS", "REJECTED"];
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const orderUUID = query.get("external_reference");

    if (!orderUUID) {
        return (
            <div className="bg-white rounded-xl h-screen">
                <h1 className="p-5 bg-error rounded-xl">Ups! al parecer hubo un error al mostrar tu resumen de pago.</h1>
                <div className="px-5 flex flex-col gap-3">
                    <p className="mt-2 text-xl">La referencia de pago no es valida o no existe.</p>
                    <button className="w-fit btn btn-primary" onClick={() => navigate("/")}>Regresar a la tienda</button>
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
            <div className="bg-white rounded-xl p-10">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl">Estamos procesando tu orden, espere unos momentos...</h1>
                    <div className="loading loading-dots loading-lg text-primary" />
                </div>
            </div>
        );
    };

    if (!requiredStatus.includes(data.status)) throw new Error("Error al obtener el estatus de la orden de compra");


    if (error) {
        return (
            <div className="bg-white rounded-xl p-10">
                <p>Hubo un error al procesar tu pago.</p>
                <p className="text-sm text-red-500">{formatAxiosError(error)}</p>
            </div>
        );
    }

    const { order } = data;
    const { address, items } = order;

    return (
        <div className="w-full animate-fade-in-up">
            <div className="w-full bg-base-300 px-5 py-10 rounded-xl">
                <div className="bg-error p-3 rounded-xl">
                    <p className="text-3xl font-bold flex items-center gap-2"><MdOutlinePending />Ocurrio un error al procesar tu pago</p>
                    <p className="text-sm px-10">Intenta realizar tu pago nuevamente</p>
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
                                        <div className="flex items-center gap-2">
                                            <h2 className="flex items-center gap-2">{items.product_name}</h2>
                                            {items.isOffer && (
                                                <div className={clsx(
                                                    "text-2xl flex gap-2 px-2 rounded-md text-white items-center",
                                                    items.discount && items.discount < 50 && "bg-error",
                                                    items.discount && items.discount >= 50 && items.discount < 65 && "bg-success",
                                                    items.discount && items.discount >= 65 && "bg-primary"
                                                )} >
                                                    <FaFire className="text-xl" />
                                                    <p className="text-lg">{items.discount}%</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-lg text-gray-500 bg-gray-200 w-fit rounded-xl px-3 flex gap-2">
                                            <p>{items.category}</p>
                                            {items.subcategories.map((subcategories, index) => (
                                                <p key={index}>{subcategories}</p>
                                            ))}
                                        </div>
                                        <div className="w-full flex mt-2">
                                            <figure className="w-40 h-40 rounded-xl">
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
                        <section className="p-5 bg-white">
                            <h2>Al parecer tu pago no se pudo completar</h2>
                            <Link to={"/pagar-productos"} className="btn btn-primary">Intentar pagar nuevamente</Link>
                        </section>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PaymentError;