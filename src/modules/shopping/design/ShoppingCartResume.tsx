import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/states/authStore";
import ShoppingCartProductResume from "../components/ShoppingCartProductResume";
import { useShoppingCartStore } from "../states/shoppingCartStore";
import { formatPrice } from "../../products/Helpers";
import { useEffect, useRef, useState } from "react";
import GuestAdvertisement from "../components/GuestAdvertisement";
import type { PaymentMethodsType, ShoppingCartType } from "../ShoppingTypes";
import { useFetchCustomerAddresses } from "../../customers/hooks/useCustomer";
import AddressesModal from "../components/AddressesModal";
import type { CustomerAddressType } from "../../customers/CustomerTypes";
import { closeModal, showModal } from "../../../global/GlobalHelpers";
import { SiMercadopago } from "react-icons/si";
import { FaCcPaypal } from "react-icons/fa";
import { usePaymentStore } from "../states/paymentStore";
import type { PaymentShoppingCart } from "../PaymentTypes";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";

const ShoppingCartResume = () => {
    const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
    const guestAdvertisementModal = useRef<HTMLDialogElement>(null);
    const { isAuth, authCustomer } = useAuthStore();
    const [selectedAddress, setSelectedAddress] = useState<CustomerAddressType | null>(null);
    const { items, toogleCheckItem, updateItemQty, removeItem } = useShoppingCartStore();
    const addressesModal = useRef<HTMLDialogElement>(null);
    const { showTriggerAlert } = useTriggerAlert();
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodsType>(null);
    const { order, createOrder, isLoading: orderLoading } = usePaymentStore();
    const navigate = useNavigate();
    const {
        data: addresses,
        isLoading,
        error,
        refetch
    } = useFetchCustomerAddresses(authCustomer?.uuid);
    if (!items || items.length === 0 || items.filter(item => item.isChecked === true).length < 1) navigate("/carrito-de-compras");
    const handleSetSelectedAddress = (selected: CustomerAddressType) => setSelectedAddress(selected);
    const modalResponse = (response: boolean) => {
        if (response) {
            const modal = guestAdvertisementModal.current;
            if (modal) { modal.close(); };
            setShowGuestForm(true);
        };
    };
    const subtotal: number = items.filter(items => items.isChecked === true).reduce((accumulator: number, product: ShoppingCartType) => {
        const itemTotal = parseFloat(product.product_version.unit_price) * product.quantity;
        return accumulator + itemTotal;
    }, 0);
    const IVA: number = subtotal * 0.16;
    const subtotalBeforeIVA: number = subtotal - IVA;
    const shipping: number = 0;
    const total: number = subtotal + shipping;
    const selectedProducts: ShoppingCartType[] = items && items.filter(item => item.isChecked === true);
    useEffect(() => {
        if (!addresses) return;
        const defaultAddress = addresses.find(data => data.default_address === true);
        if (!defaultAddress) return;
        setSelectedAddress(defaultAddress);
    }, [addresses]);

    const handleCreateOrder = async () => {
        if (selectedAddress) {
            const products: PaymentShoppingCart[] = selectedProducts.map(item => {
                return {
                    product: item.product_version.sku,
                    quantity: item.quantity
                }
            });
            await createOrder({
                shopping_cart: products,
                address: selectedAddress.uuid,
                payment_method: paymentMethod
            });
        };
        showTriggerAlert("Message", "Seleccionar una dirección de envío para continuar.");
    };

    // If the order exists 
    if (order) navigate("/pagar-productos");

    return (
        <div className="w-full bg-base-300 px-5 py-10 rounded-xl">
            <p className="text-3xl font-bold">Resumen del carrito</p>
            <section className="w-full flex mt-5">
                <div className="w-3/4">
                    {isAuth ? (
                        <div className="w-full bg-white rounded-xl px-5 py-7">
                            {selectedAddress &&
                                <div className="w-full flex">
                                    <div className="w-90/100">
                                        <p className="text-xl font-bold">Enviar a</p>
                                        <p className="text-2xl font-bold">{`${selectedAddress.recipient_name} ${selectedAddress.recipient_last_name}`}</p>
                                        <p className="text-lg">{selectedAddress.country_phone_code} {selectedAddress.contact_number}</p>
                                        <p className="text-lg">{`${selectedAddress.street_name}, #${selectedAddress.number} EXT.${selectedAddress.aditional_number === "N/A" ? "" : `${selectedAddress.aditional_number} INT.`} ${selectedAddress.neighborhood}, ${selectedAddress.zip_code}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`}</p>
                                        {selectedAddress.default_address === true && <p className="text-xl font-bold">Dirección predeterminada</p>}
                                    </div>
                                    <div className="w-10/100">
                                        <button
                                            type="button"
                                            className="underline text-primary cursor-pointer text-lg text-right"
                                            onClick={() => showModal(addressesModal.current)}
                                        >
                                            Escoger otra
                                        </button>
                                        <p className="mt-2 text-lg font-bold">{selectedAddress.address_type}</p>
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
                                        <button type="button" className="btn bg-blue-950 text-white" onClick={() => showModal(guestAdvertisementModal.current)}>Continuar como invitado</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="w-full bg-white rounded-xl p-5 flex flex-col gap-2 mt-5">
                        {/* Product */}
                        {selectedProducts.map((item, index) => (
                            <ShoppingCartProductResume
                                key={index}
                                data={item}
                                onToggleCheck={toogleCheckItem}
                                onUpdateQty={updateItemQty}
                                onRemoveItem={removeItem}
                                isAuth={isAuth ?? false}
                            />
                        ))}
                        <div className="w-full border-t border-t-gray-300 pt-5">
                            <p className="text-xl text-right">{`Subtotal (${items && items.filter(item => item.isChecked === true).length}) productos: `}<span className="font-bold">${formatPrice((subtotal.toString()), "es-MX")}</span> </p>
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
                            <div className="text-xl flex">
                                <p className="w-3/5">Descuento:</p>
                                <p className="pl-2">${formatPrice(("0".toString()), "es-MX")}</p>
                            </div>
                            <div className="text-2xl font-bold flex">
                                <p className="w-3/5 ">Total:</p>
                                <p className="pl-2">${formatPrice((total.toString()), "es-MX")}</p>
                            </div>
                        </div>

                        <div className="mt-5">
                            <p className="text-xl">Cupón de descuento</p>
                            <input type="text" className="w-full input text-lg placeholder:text-sm mt-1" placeholder="Introduce el código de descuento" />
                            <button type="button" className="w-full btn bg-blue-900 text-white mt-3 text-lg">Aplicar descuento</button>
                        </div>
                        <div className="mt-5">
                            <p className="text-xl font-bold">Selecciona un metodo de pago</p>
                            <div className="flex flex-col gap-4 pt-2">
                                <div className="w-full flex items-center gap-5">
                                    <input type="radio" name="payment_method" id="" className="radio radio-primary" onClick={() => setPaymentMethod("mercado_pago")} />
                                    <div className="relative w-full">
                                        <button className="cursor-pointer mb-10">
                                            <p className="flex items-center gap-2 text-blue-500 font-bold text-xl"><SiMercadopago className="text-5xl" />Mercado pago</p>
                                        </button>
                                        <p className="text-sm text-blue-500 absolute bottom-0">Pagos con tarjetas de crédito, debito, OXXO, MSI y mas...</p>
                                    </div>
                                </div>
                                <div className="w-full flex items-center gap-5">
                                    <input type="radio" name="payment_method" id="" className="radio radio-primary" onClick={() => setPaymentMethod("paypal")} />
                                    <div className="relative w-full">
                                        <button className="cursor-pointer mb-6">
                                            <p className="flex items-center gap-2 text-blue-500 font-bold text-xl"><FaCcPaypal className="text-5xl" />Paypal</p>
                                        </button>
                                        <p className="text-sm text-primary absolute bottom-0">Pagos con tarjetas de crédito y debito</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="mt-10 btn btn-primary w-full text-lg cursor-pointer"
                                disabled={paymentMethod === null || orderLoading === true}
                                onClick={handleCreateOrder}
                            >
                                {orderLoading ? ("Cargando...") : ("Proceder al pago")}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <GuestAdvertisement refName={guestAdvertisementModal} onResponse={modalResponse} />
            {addresses && selectedAddress && <AddressesModal ref={addressesModal} addresses={addresses} onSetSelected={handleSetSelectedAddress} selectedAddress={selectedAddress} onClose={() => closeModal(addressesModal.current)} />}
        </div>
    );
};

export default ShoppingCartResume;