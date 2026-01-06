import { LiaMinusSolid, LiaPlusSolid } from "react-icons/lia";
import { formatPrice } from "../../products/Helpers";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePaymentStore } from "../states/paymentStore";
import clsx from "clsx";
import { useFetchOrderDetail } from "../../orders/hooks/useFetchOrders";
import { FaCheckCircle } from "react-icons/fa";
import { formatPaymentClass, paymentMethod, paymentProvider } from "../utils/ShoppingUtils";

const PaymentExiting = () => {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const externalID = query.get("payment_id");
    const internalID = query.get("external_reference");
    // const { authCustomer } = useAuthStore();

    if (!internalID) {
        throw new Error("Ocurrió un error inesperado");
    }

    const { data, isLoading, error } = useFetchOrderDetail(internalID);
    const { success } = usePaymentStore();

    const IVA: number = 0.16;
    const [subtotal, setSubtotal] = useState<number>(0);

    useEffect(() => {
        if (!data?.items) return;

        const calculatedSubtotal = data.items.reduce(
            (acc, item) => acc + parseFloat(item.subtotal),
            0
        );
        setSubtotal(calculatedSubtotal);
        if (data.status === "approved") success();
        if (data.status === "rejected") console.log("handle for falied")
    }, [data]);

    // Manejo de estados
    if (error) {
        return (
            <div className="w-full animate-fade-in-up">
                <div className="alert alert-error">
                    <p>Error al cargar la orden. Por favor, intenta de nuevo.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full animate-fade-in-up flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
                <p className="ml-4 text-xl">Cargando información del pedido...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full animate-fade-in-up">
                <div className="alert alert-warning">
                    <p>No se encontró la información de la orden.</p>
                </div>
            </div>
        );
    }

    const total: number = subtotal;

    return (
        <div className="w-full animate-fade-in-up">
            <div className="w-full bg-base-300 px-5 py-10 rounded-xl">
                <p className="text-3xl font-bold bg-success flex items-center gap-2 rounded-xl p-3">
                    <FaCheckCircle className="text-white" />
                    Pago procesado exitosamente
                </p>
                <p className="mt-1 text-lg">Folio de operación: {internalID}</p>
                <p className="mt-1 text-lg">ID de operación: {externalID}</p>

                <section className="w-full flex gap-5 mt-5">
                    {/* Información de envío */}
                    <div className="w-1/4 p-5 bg-white rounded-xl">
                        <p className="text-2xl font-bold">Información de envío</p>
                        <div className="flex flex-col gap-3 text-lg mt-5">
                            <fieldset className="p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-3">Información general</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Destinatario</p>
                                    <p>{data.shipping_address.recipient_name}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Contacto</p>
                                    <p>
                                        {data.shipping_address.country_phone_code}
                                        <span className="ml-2">{data.shipping_address.contact_number}</span>
                                    </p>
                                </div>
                            </fieldset>

                            <fieldset className="p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-3">Domicilio de envío</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Calle:</p>
                                    <p>{`${data.shipping_address.street_name} ${data.shipping_address.number}`}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Colonia/Fraccionamiento:</p>
                                    <p>{data.shipping_address.neighborhood}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Ciudad y Estado</p>
                                    <p>{`${data.shipping_address.city}, ${data.shipping_address.state}`}</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">País</p>
                                    <p>{data.shipping_address.country}</p>
                                </div>
                            </fieldset>

                            <fieldset className="p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-3">Comentarios adicionales</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Comentarios adicionales/referencias:</p>
                                    <p>
                                        {data.shipping_address.references_or_comments === "N/A"
                                            ? "Sin comentarios adicionales"
                                            : data.shipping_address.references_or_comments}
                                    </p>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    {/* Resumen de pedido */}
                    <div className="w-3/4 p-5 bg-white rounded-xl">
                        <p className="font-bold text-2xl">Resumen de pedido</p>
                        <section className="w-full mt-5 bg-base-200 rounded-xl px-5 pt-5">
                            {data.items.map((item, index) => (
                                <div key={index} className="w-full mb-5">
                                    <p className="text-2xl font-bold">{item.product_name}</p>
                                    <p className="text-lg text-gray-500 bg-gray-200 w-fit rounded-xl px-3">
                                        {item.product_attributes.map(attr => attr.category_attribute.description).join(", ")}
                                    </p>
                                    <div className="w-full flex mt-2">
                                        <figure className="w-15/100 rounded-xl">
                                            <img
                                                className="rounded-xl border border-gray-300"
                                                src={item.product_images[0].image_url}
                                                alt={item.product_name}
                                            />
                                        </figure>
                                        <div className="w-65/100 text-xl ml-4 flex flex-col gap-3">
                                            <p className="w-fit bg-gray-200 rounded-xl px-3">
                                                {item.product_version.color_line}
                                            </p>
                                            <p className="w-fit rounded-xl px-3 py-1 bg-gray-200">
                                                <span
                                                    className="rounded-full px-3 mr-2"
                                                    style={{ backgroundColor: item.product_version.color_code }}
                                                ></span>
                                                {item.product_version.color_name}
                                            </p>
                                            <p className="w-fit bg-primary px-5 py-1 rounded-xl text-white text-center">
                                                {`x ${item.quantity} pz`}
                                            </p>
                                        </div>
                                        <div className="w-20/100">
                                            <div>
                                                <p className="text-xl bg-gray-200 rounded-xl px-2">Precio unitario</p>
                                                <p className="text-2xl">
                                                    ${formatPrice(item.product_version.unit_price, "es-MX")}
                                                </p>
                                            </div>
                                            <div className="mt-3">
                                                <p className="text-xl font-bold bg-gray-200 rounded-xl px-2">
                                                    Subtotal de producto
                                                </p>
                                                <p className="text-2xl font-bold">
                                                    ${formatPrice(item.subtotal, "es-MX")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="border-t border-t-gray-300 mt-5 py-5">
                                <p className="text-right text-xl font-bold">
                                    Subtotal ({data.items.length}) productos: ${formatPrice(subtotal.toString(), "es-MX")}
                                </p>
                            </div>
                        </section>

                        {/* Desglose de pago */}
                        <p className="text-2xl font-bold mt-5">Desglose de pago</p>
                        <div className="mt-5">
                            <p className="text-xl bg-gray-100 px-2 rounded-xl">Proveedor</p>
                            <p className="flex items-center gap-2 text-primary font-bold mt-3 text-2xl">
                                <span className="text-6xl">
                                    {paymentProvider[data.payment_provider].icon}
                                </span>
                                {paymentProvider[data.payment_provider].description}
                            </p>
                            <p className="text-xl bg-gray-100 px-2 rounded-xl mt-2">Información de tarjeta</p>
                            <div className="py-5">
                                <p>
                                    {/* {data.payment_class === "debit_card" && "Tarjeta de debito"}
                                    {data.payment_class === "credit_card" && "Tarjeta de credito"} */}
                                    {formatPaymentClass[data.payment_class]}
                                </p>
                                <p
                                    className="text-xl font-medium flex gap-2 items-center">
                                    <span className={clsx(
                                        "text-6xl",
                                        data.payment_method === "visa" && "text-primary",
                                        data.payment_method === "mastercard" && "text-warning"
                                    )}
                                    >{paymentMethod[data.payment_method].icon}</span>
                                    **********{`${data.last_four_digits}`}
                                </p>
                                <div className="text-lg">
                                    <div className="flex gap-2">
                                        Tipo de pago:
                                        {data.installments < 3 && <p className="ml-2">Contado</p>}
                                        {data.installments > 1 &&
                                            <p>{`MSI ${data.installments} x $${formatPrice((parseFloat(data.total_amount) / data.installments).toString(), "es-MX")}`}</p>
                                        }
                                    </div>
                                    <p className="mt-1">{`Tipo de cambio: ${data.exchange}`}</p>
                                </div>
                            </div>
                            <p className="text-xl bg-gray-100 px-2 rounded-xl">Resumen</p>
                            <div className="w-full bg-white rounded-xl mt-3">
                                <div className="w-full flex flex-col gap-2">
                                    <div className="text-xl flex">
                                        <p className="w-3/5">Subtotal antes de IVA:</p>
                                        <p className="pl-2 flex items-center">
                                            <LiaPlusSolid />${formatPrice(subtotal.toString(), "es-MX")}
                                        </p>
                                    </div>
                                    <div className="text-xl flex">
                                        <p className="w-3/5">IVA (16%):</p>
                                        <p className="pl-2 flex items-center">
                                            <LiaPlusSolid />${formatPrice((subtotal * IVA).toString(), "es-MX")}
                                        </p>
                                    </div>
                                    <div className="text-xl flex">
                                        <p className="w-3/5">Envío:</p>
                                        <p className="pl-2 flex items-center">
                                            <LiaPlusSolid />${formatPrice("0", "es-MX")}
                                        </p>
                                    </div>
                                    <div className="text-xl flex text-green-700">
                                        <p className="w-3/5">Descuento aplicado:</p>
                                        <p className="pl-2 flex items-center">
                                            <LiaMinusSolid />${formatPrice("0.00", "es-MX")}
                                        </p>
                                    </div>
                                    <div className="text-2xl font-bold flex border-t border-gray-300 pt-5">
                                        <p className="w-3/5 text-primary">Total:</p>
                                        <p className="pl-2 text-primary">
                                            ${formatPrice(total.toString(), "es-MX")}
                                        </p>
                                    </div>
                                </div>
                                <button className="btn btn-primary mt-3">Descargar página</button>
                                <p className="mt-5 text-sm">
                                    Todos nuestros productos ya tienen el IVA incluido.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PaymentExiting;