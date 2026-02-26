import { Link, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { SiMercadopago } from "react-icons/si";
import { useAuthStore } from "../../auth/states/authStore";
import { usePaymentStore } from "../states/paymentStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useFetchCustomerAddresses } from "../../customers/hooks/useCustomer";
import { formatPrice } from "../../products/Helpers";
import { calcShippingCost, closeModal, showModal } from "../../../global/GlobalHelpers";
import ShoppingCartProductResume from "../components/ShoppingCartProductResume";
import GuestAdvertisement from "../components/GuestAdvertisement";
import AddressesModal from "../components/AddressesModal";
import type { PaymentProvidersType } from "../ShoppingTypes";
import type { CustomerAddressType, GuestFormType } from "../../customers/CustomerTypes";
import GuestAddressFormModal from "../components/GuestAddressFormModal";
import clsx from "clsx";
import { useThemeStore } from "../../../layouts/states/themeStore";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useFetchBuyNowItem } from "../../orders/hooks/useFetchOrders";

/**
 * Shopping Cart Resume Component
 * 
 * Displays the checkout summary including:
 * - Selected products from cart
 * - Shipping address selection (for authenticated users)
 * - Guest checkout form (for non-authenticated users)
 * - Price breakdown (subtotal, IVA, shipping, total)
 * - Payment method selection
 * - Order creation and payment processing
 */
const BuyNow = () => {
    document.title = "Iga Productos | Comprar ahora";
    // ============================================================================
    // Constants
    // ============================================================================
    const IVA = 0.16;

    // ============================================================================
    // Global Stores / Router
    // ============================================================================
    const { theme } = useThemeStore();
    const { isAuth } = useAuthStore();
    const { order, createOrder, isLoading: orderLoading, buyNow } = usePaymentStore();
    const { showTriggerAlert } = useTriggerAlert();

    // ============================================================================
    // Data Fetching 
    // ============================================================================
    const { data, isLoading, error, refetch } = useFetchBuyNowItem({ sku: buyNow?.sku });

    // ============================================================================
    // State
    // ============================================================================
    const [quantity, setQuantity] = useState<number>(buyNow?.quantity ?? 1);
    const [selectedAddress, setSelectedAddress] = useState<CustomerAddressType | null>(null);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [boxQty, setBoxQty] = useState<number>(1);
    const [paymentMethod, setPaymentMethod] = useState<PaymentProvidersType>(null);
    const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
    const [guestBillingAddressChecked, setGuestBillingAddressChecked] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string | null>(null);
    const [guestAddressForm, setGuestAddressForm] = useState<GuestFormType | null>(null);
    const [billingGuestAddress, _setBillingGuestAddress] = useState<GuestFormType | null>(null);

    const [discount, setDiscount] = useState<number>(0);
    const [subtotalWithDisc, setSubtotalWithDisc] = useState<number>(0);
    const [subtotalBeforeIva, setSubtotalBeforeIva] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [iva, setIva] = useState<number>(0);

    // ============================================================================
    // Refs (modals)
    // ============================================================================
    const guestAdvertisementModal = useRef<HTMLDialogElement>(null);
    const addressesModal = useRef<HTMLDialogElement>(null);
    const guestAddressFormModal = useRef<HTMLDialogElement>(null);
    const guestFormBillingModal = useRef<HTMLDialogElement>(null);

    // ============================================================================
    // Fetch customer addresses
    // ============================================================================
    const {
        data: addresses,
        isLoading: addressesLoading,
        error: addressesError,
        refetch: addressesRefetch
    } = useFetchCustomerAddresses({ pagination: { page: 1, limit: 10 } });

    // ============================================================================
    // Effects
    // ============================================================================

    useEffect(() => {
        if (!addresses) return;
        const defaultAddress = addresses.data.find(a => a.default_address);
        if (defaultAddress) setSelectedAddress(defaultAddress);
    }, [addresses]);

    const calcShipping = () => {
        const { boxesQty, shippingCost } = calcShippingCost({ itemQty: quantity });
        setBoxQty(boxesQty);
        setShippingCost(shippingCost);
        return shippingCost;
    };

    useEffect(() => {
        if (!data) return;

        const shipping = calcShipping();
        const subtotal = parseFloat(data.product_version.unit_price) * quantity;
        const discountValue = data.isOffer && data.product_version.unit_price_with_discount
            ? parseFloat(data.product_version.unit_price_with_discount) * quantity
            : 0;

        const ivaCalc = subtotal * IVA;
        const subtotalBefore = subtotal - ivaCalc;
        const subtotalWithDiscount = subtotal - discountValue;
        const totalCalc = subtotalWithDiscount + shipping;

        setSubtotalWithDisc(subtotalWithDiscount);
        setSubtotalBeforeIva(subtotalBefore);
        setDiscount(discountValue);
        setIva(ivaCalc);
        setTotal(totalCalc);
    }, [data, quantity]);

    useEffect(() => {
        calcShipping();
    }, [quantity]);


    // ============================================================================
    // Guards (DESPUÉS de todos los hooks)
    // ============================================================================

    if (!buyNow) return <Navigate to="/" />;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">
                    Cargando<span className="loading loading-dots"></span>
                </h1>
                <h3 className="text-lg">
                    Estamos cargando el item para realizar tu compra
                </h3>
            </div>
        );
    }

    if (!data) throw new Error("No se pudo obtener la información del producto");
    if (order) return <Navigate to="/pagar-productos" />;
    if (error) {
        return (
            <div className="h-screen">
                <h1>Ocurrio un error inesperado</h1>
                <h3>No pudimos obtener la información del producto</h3>
                <button onClick={() => refetch()} className="btn btn-primary w-fit">Intentar de nuevo</button>
            </div>
        )
    }

    // ============================================================================
    // Handlers
    // ============================================================================

    const handleSetSelectedAddress = (selected: CustomerAddressType) => {
        setSelectedAddress(selected);
    };

    const modalResponse = (response: boolean) => {
        if (!response) return;
        guestAdvertisementModal.current?.close();
        setShowGuestForm(true);
    };

    const handleCreateOrder = async () => {
        if (!selectedAddress) {
            showTriggerAlert("Message", "Seleccionar una dirección de envío para continuar.");
            return;
        }

        await createOrder({
            shopping_cart: [{
                product: data.product_version.sku,
                quantity
            }],
            address: selectedAddress.uuid,
            payment_method: paymentMethod,
            coupon_code: couponCode || undefined
        });
    };

    const handleGuestAddressForm = (savedAddress: GuestFormType) => {
        setGuestAddressForm(savedAddress);
    };

    const handleUpdateQuantity = (values: { sku: string, newQuantity: number }) => {
        const newQuantity = values.newQuantity > data.product_version.stock ? data.product_version.stock : values.newQuantity;
        setQuantity(newQuantity);
    };


    return (
        <div className="w-full px-5 py-10 rounded-xl bg-base-300">
            <p className="text-3xl font-bold">Comprar ahora</p>

            <section className="w-full flex mt-5">
                {/* Left Column - Address & Products */}
                <div className="w-3/4">
                    {/* Address Selection / Guest Form */}
                    {isAuth ? (
                        <div className="w-full px-5 py-7 rounded-xl bg-base-100">
                            {/* Loading State */}
                            {addressesLoading && !addresses && !addressesError && "Cargando direcciones de envio..."}

                            {/* Selected Address Display */}
                            {!addressesLoading && !addressesError && selectedAddress &&
                                <div className="w-full flex">
                                    <div className="w-full">
                                        <p className="text-xl font-bold">Enviar a</p>
                                        <p className="text-2xl font-bold">{`${selectedAddress.recipient_name} ${selectedAddress.recipient_last_name} (${selectedAddress.address_type})`}</p>
                                        <p className="text-lg">{selectedAddress.country_phone_code} {selectedAddress.contact_number}</p>
                                        <p className="text-lg">{`${selectedAddress.street_name}, #${selectedAddress.number} EXT.${selectedAddress.aditional_number === "N/A" ? "" : `${selectedAddress.aditional_number} INT.`} ${selectedAddress.neighborhood}, ${selectedAddress.zip_code}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`}</p>
                                        {selectedAddress.default_address === true && <p className="text-xl font-bold">Dirección predeterminada</p>}
                                        <button
                                            type="button"
                                            className="btn btn-primary cursor-pointer text-sm mt-3 text-right"
                                            onClick={() => showModal(addressesModal.current)}
                                        >
                                            Elegir una dirección diferente
                                        </button>
                                    </div>
                                </div>
                            }

                            {/* Error State */}
                            {!addressesLoading && !addresses && addressesError &&
                                <div>
                                    <p>Error al cargar las direcciones de envio</p>
                                    <button type="button" className="btn btn-primary" onClick={() => addressesRefetch()}>Cargar otra vez</button>
                                </div>
                            }

                            {!addressesLoading && addresses && addresses.data.length === 0 &&
                                <div>
                                    <h2>No tienes direcciones de envio registradas</h2>
                                    <Link to={"/mi-cuenta/direcciones-de-envio"} type="button" className="underline text-primary" >Crea una nueva dirección de envio ahora</Link>
                                </div>
                            }
                        </div>
                    ) : (
                        <div className="w-full bg-base-100 rounded-xl px-5 py-10">
                            {/* Guest Checkout Form */}
                            {showGuestForm ? (
                                <div className="w-full flex flex-col gap-5">
                                    <div className="flex flex-col gap-2">
                                        {!guestAddressForm && "No has agregado una dirección de envio aun"}
                                        {guestAddressForm && (
                                            <div>
                                                <p className="text-xl font-bold">Enviar a</p>
                                                <p className="text-2xl font-bold">{`${guestAddressForm.recipient_name} ${guestAddressForm.recipient_last_name}`}</p>
                                                <p className="text-lg">{guestAddressForm.country_phone_code} {guestAddressForm.contact_number}</p>
                                                <p className="text-lg">{`${guestAddressForm.street_name}, #${guestAddressForm.number} EXT.${!guestAddressForm.aditional_number ? "" : `${guestAddressForm.aditional_number} INT.`} ${guestAddressForm.neighborhood}, ${guestAddressForm.zip_code}, ${guestAddressForm.city}, ${guestAddressForm.state}, ${guestAddressForm.country}`}</p>
                                                {guestAddressForm.references_or_comments && <p>{guestAddressForm.references_or_comments}</p>}
                                            </div>
                                        )}
                                        <button type="button" className="btn btn-primary w-fit px-2" onClick={() => showModal(guestAddressFormModal.current)}>{guestAddressForm ? "Editar dirección" : "Agregar dirección"}</button>
                                    </div>
                                    {guestBillingAddressChecked && (
                                        <div className="flex flex-col gap-2">
                                            {!billingGuestAddress && ("No has agregado una dirección de facturación aun")}
                                            {billingGuestAddress && (
                                                <div>
                                                    <p className="text-xl font-bold">Facturar a</p>
                                                    <p className="text-2xl font-bold">{`${billingGuestAddress.recipient_name} ${billingGuestAddress.recipient_last_name}`}</p>
                                                    <p className="text-lg">{billingGuestAddress.country_phone_code} {billingGuestAddress.contact_number}</p>
                                                    <p className="text-lg">{`${billingGuestAddress.street_name}, #${billingGuestAddress.number} EXT.${!billingGuestAddress.aditional_number ? "" : `${billingGuestAddress.aditional_number} INT.`} ${billingGuestAddress.neighborhood}, ${billingGuestAddress.zip_code}, ${billingGuestAddress.city}, ${billingGuestAddress.state}, ${billingGuestAddress.country}`}</p>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-2">
                                                <input type="checkbox" className="checkbox checkbox-primary" />
                                                <p>Utilizar la misma dirección para facturación</p>
                                            </div>
                                            <button type="button" className="btn btn-primary w-fit px-2 mt-2" onClick={() => showModal(guestFormBillingModal.current)}>Agregar dirección de facturación</button>
                                        </div>
                                    )}
                                    {guestAddressForm && (
                                        <div>
                                            <input type="checkbox" className="checkbox checkbox-primary mr-3" onChange={(e) => setGuestBillingAddressChecked(e.target.checked)} />
                                            <span className="text-lg">Necesito facturar este pedido.</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-lg">
                                        <input type="checkbox" className="checkbox checkbox-primary" />
                                        <Link to={"/politica-de-privacidad"} className="underline text-primary">He leido y estoy de acuerdo con los terminos y condiciones y politica de privacidad de la web .</Link>
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

                    {/* Selected Products List */}
                    <div className="w-full flex flex-col gap-2 rounded-xl pt-5 pb-6 px-5 mt-5 bg-base-100">
                        <ShoppingCartProductResume
                            data={data}
                            isAuth={isAuth ?? false}
                            onUpdateQty={handleUpdateQuantity}
                        />
                        <div className="w-full border-t border-t-gray-300 pt-5">
                            <p className="text-xl text-right">{`Subtotal (1) producto: `}<span className="font-bold">${formatPrice((subtotalWithDisc.toString()), "es-MX")}</span> </p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Price Summary & Payment */}
                <div className="w-1/4 pl-4">
                    <div className="w-full p-5 rounded-xl bg-base-100">
                        <h2 className="pb-2">Desglose</h2>

                        {/* Price Breakdown */}
                        <div className="w-full flex flex-col gap-2 border-b border-b-gray-400 pb-5">
                            <div className="text-xl flex">
                                <div className="w-3/5 ">
                                    <p>Subtotal:</p>
                                    <p className="text-xs">Antes de impuestos y descuentos</p>
                                </div>
                                <p className="pl-2 flex items-center "><BiPlus />${formatPrice((subtotalBeforeIva.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-xl flex">
                                <p className="w-3/5 ">IVA (16%):</p>
                                <p className="pl-2 flex items-center "><BiPlus />${formatPrice((iva.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-xl flex">
                                <p className="w-3/5">Envio({boxQty > 1 ? `${boxQty} cajas` : `${boxQty} caja`}):</p>
                                <p className="pl-2 flex items-center "><BiPlus />${formatPrice((shippingCost.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-xl flex">
                                <p className={clsx(
                                    "w-3/5",
                                    discount > 0 && "text-primary font-bold"
                                )}>Descuento:</p>
                                <p className={clsx(
                                    "pl-2 flex items-center",
                                    discount > 0 && "text-primary font-bold"
                                )}><BiMinus />${formatPrice((discount.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-2xl font-bold flex">
                                <p className="w-3/5 ">Total:</p>
                                <p className="pl-2">${formatPrice((total.toString()), "es-MX")}</p>
                            </div>
                        </div>

                        {/* Discount Coupon */}
                        <div className="mt-5">
                            <p className="text-xl">Cupón de descuento</p>
                            <input onChange={(e) => setCouponCode(e.target.value)} type="text" className="w-full input text-lg placeholder:text-sm mt-1" placeholder="Introduce el código de descuento" />
                        </div>

                        {/* Payment Method Selection */}
                        <div className="mt-5">
                            <p className="text-xl font-bold">Selecciona un metodo de pago</p>
                            <div className="flex flex-col gap-4 pt-2">
                                {/* Mercado Pago */}
                                <div className="w-full flex items-center gap-5">
                                    <input type="radio" name="payment_method" id="" className={clsx(
                                        "radio",
                                        theme === "ligth" ? "radio-primary" : "radio-white"
                                    )} onClick={() => setPaymentMethod("mercado_pago")} />
                                    <div className="relative w-full">
                                        <button className="cursor-pointer mb-10">
                                            <p className={clsx(
                                                "flex items-center gap-2 font-bold text-xl",
                                                theme === "ligth" ? "text-blue-500" : "text-white"
                                            )}><SiMercadopago className="text-5xl" />Mercado pago</p>
                                        </button>
                                        <p className={clsx(
                                            "text-sm absolute bottom-0",
                                            theme === "ligth" ? "text-blue-500" : "text-white"
                                        )}>Pagos con tarjetas de crédito, debito, OXXO, MSI y mas...</p>
                                    </div>
                                </div>
                            </div>

                            {/* Proceed to Payment Button */}
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

            {/* Modals */}
            <GuestAdvertisement refName={guestAdvertisementModal} onResponse={modalResponse} />
            {addresses && selectedAddress && <AddressesModal ref={addressesModal} addresses={addresses.data} onSetSelected={handleSetSelectedAddress} selectedAddress={selectedAddress} onClose={() => closeModal(addressesModal.current)} />}
            <GuestAddressFormModal ref={guestAddressFormModal} onClose={() => closeModal(guestAddressFormModal.current)} title={guestAddressForm ? "Editar dirección" : "Agregar dirección"} onSave={handleGuestAddressForm} />
        </div>
    );
};

export default BuyNow;