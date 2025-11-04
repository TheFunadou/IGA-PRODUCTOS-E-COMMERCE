import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../../auth/states/authStore";
import ShoppingCartProductResume from "../components/ShoppingCartProductResume";
import { useShoppingCartStore } from "../states/shoppingCartStore";
import { formatPrice } from "../../products/Helpers";
import { FaCartArrowDown } from "react-icons/fa";
import { useRef, useState } from "react";
import GuestAdvertisement from "../components/GuestAdvertisement";

const BuyNow = () => {
    const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
    const guestAdvertisementModal = useRef<HTMLDialogElement>(null);
    const { isAuth } = useAuthStore();
    const { itemBuyNow, toogleCheckItem, updateItemQty, removeItem } = useShoppingCartStore();

    if (!itemBuyNow) {
        return <Navigate to={"/carrito-de-compras"} />
    };

    const handleShowAdvertisementModal = () => {
        const modal = guestAdvertisementModal.current;
        if (modal) { modal.showModal(); }
    };

    const modalResponse = (response: boolean) => {
        if (response) {
            const modal = guestAdvertisementModal.current;
            if (modal) { modal.close(); };
            setShowGuestForm(true);
        };
    };

    const subtotal: number = itemBuyNow.quantity * parseFloat(itemBuyNow.product_version.unit_price);
    const IVA: number = subtotal * 0.16;
    const subtotalBeforeIVA: number = subtotal - IVA;
    const shipping: number = 0;
    const total: number = subtotal + shipping;


    return (
        <div className="w-full bg-base-300 px-5 py-10 rounded-xl">
            <p className="text-3xl font-bold">Pago de producto</p>
            <section className="w-full flex mt-5">
                <div className="w-3/4">
                    {isAuth ? (
                        <div className="w-full bg-white rounded-xl px-2 py-10">

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
                                        <button type="button" className="btn bg-blue-950 text-white" onClick={handleShowAdvertisementModal}>Continuar como invitado</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="w-full bg-white rounded-xl p-5 flex flex-col gap-2 mt-5">
                        {/* Product */}
                        {itemBuyNow &&
                            <ShoppingCartProductResume
                                key={1}
                                data={itemBuyNow}
                                onToggleCheck={toogleCheckItem}
                                onUpdateQty={updateItemQty}
                                onRemoveItem={removeItem}
                                isAuth={isAuth ?? false}
                            />
                        }
                        <div className="w-full border-t border-t-gray-300 pt-5">
                            <p className="text-xl text-right">{`Subtotal (1) producto: `}<span className="font-bold">${formatPrice((subtotal.toString()), "es-MX")}</span> </p>
                        </div>
                    </div>
                </div>
                <div className="w-1/4 pl-4">
                    <div className="w-full bg-white p-5 rounded-xl">
                        <div className="w-full flex flex-col gap-2 border-b border-b-gray-400 pb-5">
                            <div className="text-xl flex">
                                <p className="w-3/5 ">Subtotal antes de IVA:</p>
                                <p className="pl-2">${formatPrice((subtotalBeforeIVA.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-xl flex">
                                <p className="w-3/5 ">IVA:</p>
                                <p className="pl-2">${formatPrice((IVA.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-xl flex">
                                <p className="w-3/5">Envio:</p>
                                <p className="pl-2">${formatPrice((shipping.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-2xl font-bold flex">
                                <p className="w-3/5 ">Total:</p>
                                <p className="pl-2">${formatPrice((total.toString()), "es-MX")}</p>
                            </div>
                        </div>

                        <div className="mt-5">
                            <p className="text-xl">Cupón de descuento</p>
                            <input type="text" className="w-full input text-lg placeholder:text-sm mt-1" placeholder="Introduce el código de descuento" />
                            <button type="button" className="w-full btn bg-blue-900 text-white mt-3">Aplicar descuento</button>
                        </div>
                        <div className="mt-10">
                            <Link to={"/resumen-de-carrito"} className="w-full btn btn-primary text-lg">Continuar<FaCartArrowDown className="text-lg" /></Link>
                        </div>
                    </div>
                </div>
            </section>
            <GuestAdvertisement refName={guestAdvertisementModal} onResponse={modalResponse} />
        </div>
    );
};

export default BuyNow;