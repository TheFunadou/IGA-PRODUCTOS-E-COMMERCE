import { FaCcPaypal } from "react-icons/fa";
import { SiMercadopago } from "react-icons/si";
import type { PaymentMethodDetails, PaymentMethodsType } from "../ShoppingTypes";
import { LiaMinusSolid, LiaPlusSolid } from "react-icons/lia";
import { MdOutlinePending } from "react-icons/md";
import { formatPrice } from "../../products/Helpers";


const PaymentPending = () => {
    const paymentMethods: Record<Exclude<PaymentMethodsType, null>, PaymentMethodDetails> = {
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
        <div className="w-full animate-fade-in-up">
            <div className="w-full bg-base-300 px-5 py-10 rounded-xl ">
                <p className="text-3xl font-bold bg-warning flex items-center gap-2 rounded-xl p-3"><MdOutlinePending className=" text-white" />Pago pendiente</p>
                <p className="mt-1 text-lg">Tu pedido esta en proceso de pago</p>
                <section className="w-full flex gap-5 mt-5">
                    <div className="w-1/4 p-5 bg-white rounded-xl">
                        <p className="text-2xl font-bold">Información de envio</p>
                        <div className="flex flex-col gap-3 text-lg mt-5">
                            <fieldset className="p-4 flex flex-col gap-2 border border-gray-300 rounded-xl">
                                <legend className="px-3">Información general</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2">Destinatario</p>
                                    <p>Joel Baez Cortez</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2" >Contacto</p>
                                    <p>+529211443695</p>
                                    <p>joelbaez@correo.com</p>
                                </div>
                            </fieldset>
                            <fieldset className="p-4 flex flex-col gap-2  border border-gray-300  rounded-xl">
                                <legend className="px-3">Domicilio de envio</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2" >Calle:</p>
                                    <p>7 de Noviembre #102 EXT.</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2" >Colonia/Fraccionamiento:</p>
                                    <p>Esfuerzos de los Hermanos del Trabajo, C.P. 96430</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2" >Ciudad y Estado</p>
                                    <p>Coatzacoalcos, Veracruz.</p>
                                </div>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2" >País</p>
                                    <p>México</p>
                                </div>
                            </fieldset>
                            <fieldset className="p-4 flex flex-col gap-2 border border-gray-300  rounded-xl">
                                <legend className="px-3">Comentarios adicionales</legend>
                                <div>
                                    <p className="bg-gray-100 rounded-xl px-2" >Comentarios adicionales/referencias:</p>
                                    <p>Casa blanca 3 pisos porton cafe</p>
                                </div>
                            </fieldset>

                        </div>
                    </div>
                    <div className="w-3/4 p-5 bg-white rounded-xl">
                        <p className="font-bold text-2xl">Resumén de pedido</p>
                        <section className="w-full mt-5 bg-base-200 rounded-xl px-5 pt-5">
                            <div className="w-full">
                                <p className="text-2xl font-bold">Casco de seguridad industrial tipo coraza a dilectrico</p>
                                <p className="text-lg text-gray-500">Cascos de seguridad industrial - tipo coraza a - ajuste de matraca - clase e</p>
                                <div className="w-full flex mt-2">
                                    <figure className="w-15/100 rounded-xl">
                                        <img className="rounded-xl border border-gray-300" src="https://igaproductos.com.mx/wp-content/uploads/2024/07/hit_intervalo_amarillo-e1722380739491.jpg" alt="" />
                                    </figure>
                                    <div className="w-65/100 text-xl ml-4 flex flex-col gap-3">
                                        <p className="w-1/6 bg-gray-200 rounded-xl px-2">Linea básica</p>
                                        <p>Color: <span className="rounded-full px-3 bg-primary mr-2"></span>Azul</p>
                                        <p className="w-1/6 bg-primary px-2 rounded-xl text-white text-center">x 2pz</p>
                                    </div>
                                    <div className="w-20/100">
                                        <div>
                                            <p className="text-xl  bg-gray-200 rounded-xl px-2">Precio unitario</p>
                                            <p className="text-2xl">$220.00</p>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-xl font-bold bg-gray-200 rounded-xl px-2">Subtotal de producto</p>
                                            <p className="text-2xl font-bold">$440.00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-t-gray-300 mt-5 py-5">
                                <p className="text-right text-xl font-bold">Subtotal(n) productos: $440.00</p>
                            </div>
                        </section>
                        <p className="text-2xl font-bold mt-5">Deglose de pago</p>
                        <div className="mt-5">
                            <div className="w-full bg-white rounded-xl">
                                <p className="text-xl font-bold">Método de pago</p>
                                <div className="w-1/2 flex gap-3 items-center ">
                                    <div>
                                        <p className="flex items-center gap-2 text-primary font-bold text-2xl"><span className="text-6xl">{paymentMethods["mercado_pago"].icon}</span> {paymentMethods["mercado_pago"].description}</p>
                                    </div>                                    
                                    <figure className="w-1/5 border-l-2 pl-4 border-l-gray-300">
                                        <img  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Oxxo_Logo.svg/1280px-Oxxo_Logo.svg.png" alt="" />
                                    </figure>
                                </div>
                            </div>
                            <div className="w-full bg-white rounded-xl mt-3">
                                <div className="w-full flex flex-col gap-2">
                                    <div className="text-xl flex">
                                        <p className="w-3/5 ">Subtotal antes de IVA:</p>
                                        <p className="pl-2 flex items-center"><LiaPlusSolid />${formatPrice(("0".toString()), "es-MX")}</p>
                                    </div>
                                    <div className="text-xl flex">
                                        <p className="w-3/5 ">IVA (16%):</p>
                                        <p className="pl-2 flex items-center"><LiaPlusSolid />${formatPrice(("0".toString()), "es-MX")}</p>
                                    </div>
                                    <div className="text-xl flex">
                                        <p className="w-3/5">Envio:</p>
                                        <p className="pl-2 flex items-center"><LiaPlusSolid />${formatPrice(("0".toString()), "es-MX")}</p>
                                    </div>
                                    <div className="text-xl flex text-green-700">
                                        <p className="w-3/5">Descuento aplicado:</p>
                                        <p className="pl-2 flex items-center"><LiaMinusSolid />${formatPrice(("0.00"), "es-MX")}</p>
                                    </div>
                                    <div className="text-xl flex">
                                        <p className="w-3/5">Meses sin intereses (3):</p>
                                        <p className="pl-2 flex items-center">3 x ${formatPrice(("146.67".toString()), "es-MX")}</p>
                                    </div>
                                    <div className="text-2xl font-bold flex border-t border-gray-300 pt-5">
                                        <p className="w-3/5 text-primary">Total:</p>
                                        <p className="pl-2 text-primary">${formatPrice(("0".toString()), "es-MX")}</p>
                                    </div>
                                </div>
                                <p className="btn btn-primary mt-3" >Descargar pdf de pago</p>
                                <p className="mt-5 text-sm">Todos nuestros productos ya tienen el IVA incluido.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PaymentPending;