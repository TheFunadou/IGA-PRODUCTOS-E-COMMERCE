// import { FaCcPaypal } from "react-icons/fa";
// import { SiMercadopago } from "react-icons/si";
// import type { PaymentMethodDetails, PaymentMethodType, PaymentProvidersType } from "../ShoppingTypes";
import { LiaMinusSolid, LiaPlusSolid } from "react-icons/lia";
import { formatPrice } from "../../products/Helpers";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/states/authStore";
import { useEffect, useState } from "react";
import { usePaymentStore } from "../states/paymentStore";
// import { FaCcMastercard, FaCcVisa } from "react-icons/fa6";
import { PiDotsThreeCircle } from "react-icons/pi";
import { useFetchOrderDetail } from "../../orders/hooks/useFetchOrders";
import { paymentMethod, paymentProvider } from "../utils/ShoppingUtils";

const PaymentPending = () => {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const externalID = query.get("payment_id");
    const internalID = query.get("external_reference");
    const { authCustomer } = useAuthStore();
    // const navigate = useNavigate();

    if (!internalID || !authCustomer) {
        throw new Error("Ocurrió un error inesperado");
    };

    const { data, isLoading, error } = useFetchOrderDetail(internalID);
    const { success } = usePaymentStore();
    const [subtotal, setSubtotal] = useState<number>(0);

    useEffect(() => {
        if (!data?.items) return;

        const calculatedSubtotal = data.items.reduce(
            (acc, item) => acc + parseFloat(item.subtotal),
            0
        );
        setSubtotal(calculatedSubtotal);
        if (data.status === "failed") console.log("handle for falied")
        success();
    }, [data]);

    // const paymentProvider: Record<Exclude<PaymentProvidersType, null>, PaymentMethodDetails> = {
    //     paypal: {
    //         icon: <FaCcPaypal />,
    //         description: "PayPal"
    //     },
    //     mercado_pago: {
    //         icon: <SiMercadopago />,
    //         description: "Mercado Pago"
    //     }
    // };

    // const paymentMethod: Record<PaymentMethodType, PaymentMethodDetails> = {
    //     visa: {
    //         icon: <FaCcVisa />,
    //         description: "Visa"
    //     },
    //     mastercard: {
    //         icon: <FaCcMastercard />,
    //         description: "Mastercard"
    //     },
    //     oxxo: {
    //         icon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Oxxo_Logo.svg/2560px-Oxxo_Logo.svg.png" alt="Oxxo" />,
    //         description: "OXXO"
    //     },
    //     paycash: {
    //         icon: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYnm51TwY4R0HrCNAZB4Isk0JgrEKdBYvp-qEf-YP4OGfGgkHOgZbNybMxEpaY4kx0tg&usqp=CAU" alt="Santander" />,
    //         description: "Santander"
    //     },
    //     bancomer: {
    //         icon: <img src="https://bmv.com.mx/docs-pub/GESTOR/IMAGENES_EMISORAS/5114.png" alt="BBVA" />,
    //         description: "BBVA"
    //     },
    //     clabe:{
    //         icon: <img src="https://cdn2.downdetector.com/static/uploads/logo/spei.png" alt="SPEI" />,
    //         description: "Transferencia SPEI"
    //     }

    // };


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

    const IVA: number = 0.16;
    const subtotalIVA = subtotal * IVA;
    const subtotalWithoutIVA: number = subtotal - (subtotal * IVA);
    const total: number = subtotalIVA + subtotalWithoutIVA;

    return (
        <div className="w-full animate-fade-in-up">
            <div className="w-full bg-base-300 px-5 py-10 rounded-xl">
                <p className="text-3xl font-bold bg-warning flex items-center gap-2 rounded-xl p-3">
                    <PiDotsThreeCircle />
                    Orden pendiente de pago
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
                                        {item.subcategories.join(", ")}
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
                            <p className="text-xl bg-gray-100 px-2 rounded-xl mt-2">Forma de pago</p>
                            <div className="py-5">
                                <figure className="w-1/6">
                                    {paymentMethod[data.payment_method].icon}
                                </figure>
                                {data.payment_method === "bancomer" && <p className="text-lg mt-2">También puedes pagar en Farmacias del Ahorro, Casa Ley o desde tu banca online en la opción Pago de servicios.</p>}
                                {data.payment_method === "paycash" &&
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="aspect-square rounded-full w-1/24 p-2 border border-gray-300">
                                                <img className="w-full h-full object-contain" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/7-Eleven_logo_2021.svg/899px-7-Eleven_logo_2021.svg.png" alt="7 Eleven" />
                                            </div>
                                            <div className="aspect-square rounded-full w-1/24 p-2 border border-gray-300">
                                                <img className="w-full h-full object-contain" src="https://santander.tufinanziacion.com/app/views/themes/santander/images/favicon.ico?v=20240116" alt="Santander" />
                                            </div>
                                            <div className="aspect-square rounded-full w-1/24 p-2 border border-gray-300">
                                                <img className="w-full h-full object-contain" src="https://play-lh.googleusercontent.com/0yVbvq9Hm7oHbV0QWAIV3bnRiZhui2AmEMZP3q9QpBglbjzx6rf3EtdmFrUkJFWMDgwu" alt="Circle K" />
                                            </div>
                                            <div className="aspect-square rounded-full w-1/24 p-2 border border-gray-300">
                                                <img className="w-full h-full object-contain" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9mcTr1IQINjqjJLBhcdNGDlo5eaG9ucTEng&s" alt="Soriana" />
                                            </div>
                                            <div className="aspect-square rounded-full w-1/24 p-2 border border-gray-300">
                                                <img className="w-full h-full object-contain" src="https://internet.guruteconecta.com/assets/images/extra-9ba5b36cc986fb03312d7acebb66991c.png" alt="Extra" />
                                            </div>
                                            <div className="aspect-square rounded-full w-1/24 p-2 border border-gray-300">
                                                <img className="w-full h-full object-contain" src="https://toshibacommerce.com/wps/wcm/connect/marketing/0f5696a6-93ed-404a-9db7-b310cd792c51/Calimax-logo.png?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_KA0A1A02NGL3D0AVS7NACQ0000-0f5696a6-93ed-404a-9db7-b310cd792c51-nDHNTqM" alt="Calimax" />
                                            </div>

                                        </div>
                                        <p className="mt-2">Dirígete y paga en cualquier sucursal de 7-Eleven, Circle K, Soriana, Extra, Calimax o Santander.</p>
                                        <p className="text-gray-500">En caso de pagar por Santander, informa el convenio 7292.</p>
                                    </div>
                                }
                                {data.payment_method === "clabe" &&
                                    <div>
                                        <p>{paymentMethod[data.payment_method].description}</p>
                                        <p>El pago se acredita al instante</p>
                                    </div>
                                }
                            </div>
                            <p className="text-xl bg-gray-100 px-2 rounded-xl">Resumen</p>
                            <div className="w-full bg-white rounded-xl mt-3">
                                <div className="w-full flex flex-col gap-2">
                                    <div className="text-xl flex">
                                        <p className="w-3/5">Subtotal antes de IVA:</p>
                                        <p className="pl-2 flex items-center">
                                            <LiaPlusSolid />${formatPrice(subtotalWithoutIVA.toString(), "es-MX")}
                                        </p>
                                    </div>
                                    <div className="text-xl flex">
                                        <p className="w-3/5">IVA (16%):</p>
                                        <p className="pl-2 flex items-center">
                                            <LiaPlusSolid />${formatPrice((subtotalIVA).toString(), "es-MX")}
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
                                <button className="btn btn-primary mt-3"><a href={data.aditional_source_url} target="_blank">Ver ticket</a></button>
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

export default PaymentPending;