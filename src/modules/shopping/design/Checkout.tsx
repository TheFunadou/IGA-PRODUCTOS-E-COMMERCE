import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/states/authStore";
import ShoppingCartProductResume from "../components/ShoppingCartProductResume";
import { formatPrice } from "../../products/Helpers";
import { useState } from "react";
import type { PaymentMethodDetails, PaymentProvidersType, ShoppingCartType } from "../ShoppingTypes";
import { LiaPlusSolid } from "react-icons/lia";
import { LiaMinusSolid } from "react-icons/lia";
import { SiMercadopago } from "react-icons/si";
import { FaCcPaypal } from "react-icons/fa";
import MercadoPagoCheckoutPro from "../components/MercadoPagoCheckoutPro";
import { usePaymentStore } from "../states/paymentStore";

const Checkout = () => {
    const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
    const { isAuth } = useAuthStore();
    const { order } = usePaymentStore();
    const navigate = useNavigate();
    const payment_method = "mercado_pago";
    if (!order || order.items.filter(item => item.isChecked === true).length === 0) {
        navigate("/carrito-de-compras");
    };

    if (!order) { throw new Error("No se encontro la orden de pago") };

    const subtotal: number = order.items.filter(items => items.isChecked === true).reduce((accumulator: number, product: ShoppingCartType) => {
        const itemTotal = parseFloat(product.product_version.unit_price) * product.quantity;
        return accumulator + itemTotal;
    }, 0);

    const IVA: number = subtotal * 0.16;
    const subtotalBeforeIVA: number = subtotal - IVA;
    const shipping: number = 0;
    const total: number = subtotal + shipping;

    const paymentMethods: Record<Exclude<PaymentProvidersType, null>, PaymentMethodDetails> = {
        paypal: {
            icon: <FaCcPaypal />,
            description: "PayPal"
        },
        mercado_pago: {
            icon: <SiMercadopago />,
            description: "Mercado Pago"
        }
    };

    return (
        <div className="w-full bg-base-300 px-5 py-10 rounded-xl">
            <p className="text-3xl font-bold">Pago de productos</p>
            <button type="button" className="text-error underline mt-2">Deseo cancelar esta orden</button>
            <section className="w-full flex mt-5">
                <div className="w-3/4">
                    {isAuth ? (
                        <div className="w-full bg-white rounded-xl px-5 py-7">
                            <p className="text-xl font-bold">Dirección de envio</p>
                            {order.receiver_address &&
                                <div role="button" className="w-full flex">
                                    <div className="w-85/100">
                                        <p className="text-2xl font-bold">{`${order.receiver_address.recipient_name} ${order.receiver_address.recipient_last_name}`}</p>
                                        <p className="text-lg">{order.receiver_address.country_phone_code} {order.receiver_address.contact_number}</p>
                                        <p className="text-lg">{`${order.receiver_address.street_name}, #${order.receiver_address.number} EXT.${order.receiver_address.aditional_number === "N/A" ? "" : `${order.receiver_address.aditional_number} INT.`} ${order.receiver_address.neighborhood}, ${order.receiver_address.zip_code}, ${order.receiver_address.city}, ${order.receiver_address.state}, ${order.receiver_address.country}`}</p>
                                        {/* {order.receiver_address.default_address === true && <p className="text-xl font-bold">Dirección predeterminada</p>} */}
                                        {order.receiver_address.references_or_comments && order.receiver_address.references_or_comments !== "N/A" &&
                                            <div className="m-5 p-5 bg-base-300">
                                                <p className="font-bold text-lg">Comentarios adicionales</p>
                                                <p className="text-justify">{order.receiver_address.references_or_comments}</p>
                                            </div>
                                        }
                                    </div>
                                    <div className="w-15/100 text-right">
                                        <p className="font-bold text-xl">{order.receiver_address.address_type}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    ) : (
                        <div className="w-full bg-white rounded-xl px-5 py-10">
                            {showGuestForm ? (
                                <div className="w-full">
                                    <p className="text-2xl font-bold">Formulario de compra</p>
                                    <p className="text-base">Sus datos personales se utilizarán para procesar su pedido, respaldar su experiencia en este sitio web y para otros fines descritos en nuestra política de privacidad.</p>
                                    <p className="mb-2 text-lg mt-2 font-semibold">Información del comprador</p>
                                    <div className="flex gap-5 items-center">
                                        <div>
                                            <label className="mr-2">Correo Electronico:</label>
                                            <input type="email" className="input" />
                                        </div>
                                        <div>
                                            <label className="mr-2">Nombre:</label>
                                            <input type="text" className="input" />
                                        </div>
                                        <div>
                                            <label className="mr-2">Apellidos:</label>
                                            <input type="text" className="input" />
                                        </div>
                                        <div>
                                            <label className="mr-2">Número telefonico:</label>
                                            <input type="tel" className="input" />
                                        </div>
                                    </div>
                                    <p className="mt-5 mb-1 text-lg font-semibold">Domicilio de envio</p>
                                    <div className="w-full flex gap-5">
                                        <div className="w-1/4">
                                            <p>Calle:</p>
                                            <input type="email" className="input" />
                                        </div>
                                        <div>
                                            <p>Numero Ext.:</p>
                                            <input type="text" className="input" />
                                        </div>
                                        <div>
                                            <p>Numero Int.:</p>
                                            <input type="text" className="input" />
                                        </div>
                                        <div className="w-1/4">
                                            <p>Colonia/Fraccionamiento:</p>
                                            <input type="tel" className="input" />
                                        </div>
                                        <div>
                                            <p>Código Postal:</p>
                                            <input type="tel" className="input" />
                                        </div>
                                    </div>
                                    <div className="w-full flex gap-5 mt-5">
                                        <div className="w-1/5">
                                            <p>Ciudad:</p>
                                            <input type="email" className="input" />
                                        </div>
                                        <div className="w-1/5">
                                            <p>Estado/Entidad Federativa:</p>
                                            <input type="text" className="input" />
                                        </div>
                                        <div>
                                            <p>País:</p>
                                            <input type="text" className="input" />
                                        </div>
                                    </div>
                                    <div className="w-full mt-5 flex flex-col gap-3">
                                        <div>
                                            <p>Referencias del domicilio:</p>
                                            <textarea className="textarea w-1/2" placeholder="Entre calles, referencias,etc... Maximo 100 caracteres"></textarea>
                                        </div>
                                        <div>
                                            <input type="checkbox" className="checkbox checkbox-primary mr-3" />
                                            <span className="text-lg">Quiero utilizar la misma dirección para facturar el pedido.</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-lg">
                                            <input type="checkbox" className="checkbox checkbox-primary" />
                                            <Link to={"/politica-de-privacidad"} className="underline text-primary">He leido y estoy de acuerdo con los terminos y condiciones y politica de privacidad de la web .</Link>
                                        </div>
                                    </div>


                                </div>
                            ) : (
                                <div className="w-full">
                                    <button type="button" className="text-xl font-bold">¿Deseas finalizar la compra como invitado?</button>
                                    <p className=" text-gray-500">Al obtener una cuenta accedes a varios benificios y funciones que pueden mejorar tu experiencia de compra.</p>
                                    <div className="w-1/4 mt-3 flex gap-5 items-center">
                                        <Link to={"/iniciar-sesion"} className="btn btn-primary">Iniciar sesión</Link>
                                        <button type="button" className="btn bg-blue-950 text-white" >Continuar como invitado</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="w-full bg-white rounded-xl p-5 flex flex-col gap-2 mt-5">
                        <p className="text-2xl font-bold">Resumen de pedido</p>
                        {order && order.items.length > 0 && order.items.map((item, index) => (
                            <ShoppingCartProductResume
                                key={index}
                                data={item}
                                lock={true}
                                isAuth={isAuth ?? false}
                            />
                        ))}
                        <div className="w-full border-t border-t-gray-300 pt-5">
                            <p className="text-xl text-right">{`Subtotal (${order.items && order.items.filter(item => item.isChecked === true).length}) productos: `}<span className="font-bold">${formatPrice((subtotal.toString()), "es-MX")}</span> </p>
                        </div>
                    </div>
                </div>
                <div className="w-1/4 pl-4">
                    <div className="w-full bg-white rounded-xl p-5">
                        <p className="text-xl font-bold">Método de pago</p>
                        <p className="flex items-center gap-2 text-primary font-bold mt-3 text-2xl"><span className="text-6xl">{paymentMethods[order.payment_method].icon}</span> {paymentMethods[payment_method].description}</p>
                    </div>

                    <div className="w-full bg-white p-5 rounded-xl mt-5">
                        <div className="w-full flex flex-col gap-2">
                            <div className="text-xl flex">
                                <p className="w-3/5 ">Subtotal antes de IVA:</p>
                                <p className="pl-2 flex items-center"><LiaPlusSolid />${formatPrice((subtotalBeforeIVA.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-xl flex">
                                <p className="w-3/5 ">IVA (16%):</p>
                                <p className="pl-2 flex items-center"><LiaPlusSolid />${formatPrice((IVA.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-xl flex">
                                <p className="w-3/5">Envio:</p>
                                <p className="pl-2 flex items-center"><LiaPlusSolid />${formatPrice((shipping.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-xl flex text-green-700">
                                <p className="w-3/5">Descuento aplicado:</p>
                                <p className="pl-2 flex items-center"><LiaMinusSolid />${formatPrice(("0.00"), "es-MX")}</p>
                            </div>
                            <div className="text-2xl font-bold flex border-t border-gray-300 pt-5">
                                <p className="w-3/5 text-primary">Total:</p>
                                <p className="pl-2 text-primary">${formatPrice((total.toString()), "es-MX")}</p>
                            </div>
                        </div>
                        <div className="mt-5 pt-5 border-t border-t-gray-300">
                            <p className="text-xl pb-2">Pagar</p>
                            {order.payment_method === "mercado_pago" &&
                                <MercadoPagoCheckoutPro preferenceId={order.order_id} />
                            }
                        </div>
                        <p className="mt-5 text-sm">Todos nuestros productos ya tienen el IVA incluido.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Checkout;