import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/states/authStore";
import ShoppingCartProductResume from "../components/ShoppingCartProductResume";
import { formatPrice } from "../../products/Helpers";
import { useRef, useState } from "react";
import MercadoPagoCheckoutPro from "../components/MercadoPagoCheckoutPro";
import { usePaymentStore } from "../states/paymentStore";
import { BiMinus, BiPlus } from "react-icons/bi";
import clsx from "clsx";
import { paymentProvider } from "../utils/ShoppingUtils";
import CancelOrderForm from "../components/CancelOrderForm";
import { showModal } from "../../../global/GlobalHelpers";
import { useCancelOrder, useFetchCheckoutOrder } from "../../orders/hooks/useFetchOrders";

const Checkout = () => {
    document.title = "Iga Productos | Resumen de pago";
    const [showGuestForm, _setShowGuestForm] = useState<boolean>(false);
    const { isAuth } = useAuthStore();
    const { order, cancelOrder } = usePaymentStore();
    const cancelOrderRef = useRef<HTMLDialogElement | null>(null);
    const navigate = useNavigate();
    const cancelOrderMutation = useCancelOrder({ orderUUID: order?.folio! });
    if (!order) throw new Error("No se encontro la orden de pago");

    const { data, isLoading, error, refetch } = useFetchCheckoutOrder({ orderUUID: order.folio });
    if (data && data.items.filter(item => item.isChecked === true).length === 0) navigate("/carrito-de-compras");

    const handleCanceled = async () => {
        await cancelOrderMutation.mutateAsync();
        await cancelOrder();
        return navigate("/carrito-de-compras");
    };

    if (isLoading) {
        return (
            <div className="bg-base-300 p-5 sm:p-10 h-screen rounded-xl">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg sm:text-xl">Cargando datos de la orden</h1>
                    <div className="loading loading-dots text-base sm:text-lg"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-base-300 p-5 sm:p-10 h-screen rounded-xl">
                <h1 className="text-lg sm:text-xl font-semibold">Ocurrio un error al obtener los datos de la orden</h1>
                <button type="button" className="btn btn-primary btn-sm sm:btn-md mt-3" onClick={() => refetch()}>Intentar de nuevo</button>
            </div>
        )
    }

    return (
        <div className="w-full bg-base-300 px-3 sm:px-5 py-6 sm:py-10 rounded-xl">
            <p className="text-2xl sm:text-3xl font-bold">Pago de productos</p>
            <p className="text-sm sm:text-base mt-1">Folio de orden: {order.folio}</p>
            <button type="button" className="btn btn-error btn-xs sm:btn-sm md:btn-md text-white mt-2" onClick={() => showModal(cancelOrderRef.current)}>Deseo cancelar esta orden</button>
            <section className="w-full flex flex-col lg:flex-row mt-5 gap-5">
                <div className="w-full lg:w-3/4">
                    {isAuth ? (
                        <div className="w-full bg-base-100 rounded-xl px-3 sm:px-5 py-5 sm:py-7">
                            <h2 className="text-lg sm:text-xl font-bold">Dirección de envio</h2>
                            {data?.address &&
                                <div role="button" className="w-full flex flex-col sm:flex-row gap-3">
                                    <div className="w-full sm:w-85/100">
                                        <p className="text-xl sm:text-2xl font-bold">{`${data.address.recipient_name} ${data.address.recipient_last_name}`}</p>
                                        <p className="text-base sm:text-lg">{data.address.country_phone_code} {data.address.contact_number}</p>
                                        <p className="text-base sm:text-lg">{`${data.address.street_name}, #${data.address.number} EXT.${data.address.aditional_number === "N/A" ? "" : `${data.address.aditional_number} INT.`} ${data.address.neighborhood}, ${data.address.zip_code}, ${data.address.city}, ${data.address.state}, ${data.address.country}`}</p>
                                        {data.address.references_or_comments && data.address.references_or_comments !== "N/A" &&
                                            <div className="w-full mt-3 bg-gray-100 rounded-xl p-3 sm:p-5">
                                                <p className="font-bold text-base sm:text-lg">Comentarios adicionales</p>
                                                <p className="text-sm sm:text-base text-justify">{data.address.references_or_comments}</p>
                                            </div>
                                        }
                                    </div>
                                    <div className="w-full sm:w-15/100 text-left sm:text-right">
                                        <p className="font-bold text-lg sm:text-xl">{data.address.address_type}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    ) : (
                        <div className="w-full bg-base-100 rounded-xl px-3 sm:px-5 py-6 sm:py-10">
                            {showGuestForm ? (
                                <div className="w-full">
                                    <p className="text-xl sm:text-2xl font-bold">Formulario de compra</p>
                                    <p className="text-sm sm:text-base">Sus datos personales se utilizarán para procesar su pedido, respaldar su experiencia en este sitio web y para otros fines descritos en nuestra política de privacidad.</p>
                                    <p className="mb-2 text-base sm:text-lg mt-2 font-semibold">Información del comprador</p>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-stretch sm:items-center">
                                        <div className="flex-1">
                                            <label className="mr-2 text-sm sm:text-base">Correo Electronico:</label>
                                            <input type="email" className="input input-sm sm:input-md w-full" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="mr-2 text-sm sm:text-base">Nombre:</label>
                                            <input type="text" className="input input-sm sm:input-md w-full" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="mr-2 text-sm sm:text-base">Apellidos:</label>
                                            <input type="text" className="input input-sm sm:input-md w-full" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="mr-2 text-sm sm:text-base">Número telefonico:</label>
                                            <input type="tel" className="input input-sm sm:input-md w-full" />
                                        </div>
                                    </div>
                                    <p className="mt-5 mb-1 text-base sm:text-lg font-semibold">Domicilio de envio</p>
                                    <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-5">
                                        <div className="flex-1">
                                            <p className="text-sm sm:text-base">Calle:</p>
                                            <input type="email" className="input input-sm sm:input-md w-full" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm sm:text-base">Numero Ext.:</p>
                                            <input type="text" className="input input-sm sm:input-md w-full" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm sm:text-base">Numero Int.:</p>
                                            <input type="text" className="input input-sm sm:input-md w-full" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm sm:text-base">Colonia/Fraccionamiento:</p>
                                            <input type="tel" className="input input-sm sm:input-md w-full" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm sm:text-base">Código Postal:</p>
                                            <input type="tel" className="input input-sm sm:input-md w-full" />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-5 mt-5">
                                        <div className="flex-1">
                                            <p className="text-sm sm:text-base">Ciudad:</p>
                                            <input type="email" className="input input-sm sm:input-md w-full" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm sm:text-base">Estado/Entidad Federativa:</p>
                                            <input type="text" className="input input-sm sm:input-md w-full" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm sm:text-base">País:</p>
                                            <input type="text" className="input input-sm sm:input-md w-full" />
                                        </div>
                                    </div>
                                    <div className="w-full mt-5 flex flex-col gap-3">
                                        <div>
                                            <p className="text-sm sm:text-base">Referencias del domicilio:</p>
                                            <textarea className="textarea textarea-sm sm:textarea-md w-full sm:w-1/2" placeholder="Entre calles, referencias,etc... Maximo 100 caracteres"></textarea>
                                        </div>
                                        <div>
                                            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm sm:checkbox-md mr-3" />
                                            <span className="text-sm sm:text-lg">Quiero utilizar la misma dirección para facturar el pedido.</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm sm:text-lg">
                                            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm sm:checkbox-md" />
                                            <Link to={"/politica-de-privacidad"} className="underline text-primary">He leido y estoy de acuerdo con los terminos y condiciones y politica de privacidad de la web .</Link>
                                        </div>
                                    </div>


                                </div>
                            ) : (
                                <div className="w-full">
                                    <button type="button" className="text-lg sm:text-xl font-bold">¿Deseas finalizar la compra como invitado?</button>
                                    <p className="text-sm sm:text-base text-gray-500">Al obtener una cuenta accedes a varios benificios y funciones que pueden mejorar tu experiencia de compra.</p>
                                    <div className="w-full sm:w-1/2 lg:w-1/4 mt-3 flex flex-col sm:flex-row gap-3 sm:gap-5 items-stretch sm:items-center">
                                        <Link to={"/iniciar-sesion"} className="btn btn-primary btn-sm sm:btn-md">Iniciar sesión</Link>
                                        <button type="button" className="btn bg-blue-950 text-white btn-sm sm:btn-md">Continuar como invitado</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="w-full bg-base-100 rounded-xl p-3 sm:p-5 flex flex-col gap-2 mt-5">
                        <h2 className="text-xl sm:text-2xl font-bold">Resumen de pedido</h2>
                        {data && data.items.length > 0 && data.items.map((item, index) => (
                            <ShoppingCartProductResume
                                key={index}
                                data={item}
                                lock={true}
                                isAuth={isAuth ?? false}
                            />
                        ))}
                        <div className="w-full border-t border-t-gray-300 pt-3 sm:pt-5">
                            <p className="text-base sm:text-xl text-right">{`Subtotal (${data?.items.length}) productos: `}<span className="font-bold">${formatPrice((data?.resume.subtotalWithDiscount.toString()!), "es-MX")}</span> </p>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/4">
                    <div className="w-full px-3 sm:px-5 py-2 bg-base-100 rounded-xl flex justify-center">
                        <figure className="w-32 sm:w-40 md:w-50 py-3 sm:py-5">
                            <img className="w-full object-cover" src={paymentProvider[order.payment_method].image_url} alt={paymentProvider[order.payment_method].description} />
                        </figure>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-xl sm:text-2xl font-bold">Resumen de pago</h2>
                        <div className="w-full bg-base-100 p-3 sm:p-5 rounded-xl mt-2">
                            <div className="w-full flex flex-col gap-2 pb-5">
                                <div className="text-base sm:text-xl flex">
                                    <div className="w-3/5">
                                        <p>Subtotal:</p>
                                        <p className="text-xs">Antes de impuestos y descuentos</p>
                                    </div>
                                    <p className="pl-2 flex items-center"><BiPlus />${data?.resume && formatPrice((data.resume.subtotalBeforeIVA.toString()), "es-MX")}</p>
                                </div>
                                <div className="text-base sm:text-xl flex">
                                    <p className="w-3/5">IVA (16%):</p>
                                    <p className="pl-2 flex items-center"><BiPlus />${data?.resume && formatPrice((data.resume.iva.toString()), "es-MX")}</p>
                                </div>
                                <div className="text-base sm:text-xl flex">
                                    <p className="w-3/5">Envio({data?.resume && data.resume.boxesQty > 1 ? `${data && data.resume.boxesQty} cajas` : `${data && data.resume.boxesQty} caja`}):</p>
                                    <p className="pl-2 flex items-center"><BiPlus />${data?.resume && formatPrice((data.resume.shippingCost.toString()!), "es-MX")}</p>
                                </div>
                                <div className="text-base sm:text-xl flex">
                                    <p className={clsx(
                                        "w-3/5",
                                        data?.resume && data.resume.discount > 0 && "text-primary font-bold"
                                    )}>Descuento:</p>
                                    <p className={clsx(
                                        "pl-2 flex items-center",
                                        data?.resume && data.resume.discount > 0 && "text-primary font-bold"
                                    )}><BiMinus />${data?.resume && formatPrice((data.resume.discount.toString()), "es-MX")}</p>
                                </div>
                                <div className="text-xl sm:text-2xl font-bold flex">
                                    <p className="w-3/5">Total a Pagar:</p>
                                    <p className="pl-2">${data?.resume && formatPrice((data.resume.total.toString()), "es-MX")}</p>
                                </div>
                            </div>
                            <div className="mt-5 pt-5 border-t border-t-gray-300">
                                {order.payment_method === "mercado_pago" &&
                                    <div>
                                        <MercadoPagoCheckoutPro preferenceId={data?.external_id!} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CancelOrderForm ref={cancelOrderRef} onCanceled={handleCanceled} />
        </div>
    );
};

export default Checkout;