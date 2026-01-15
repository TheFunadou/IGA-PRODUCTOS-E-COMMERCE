import { Link, useNavigate } from "react-router-dom";
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
import type { PaymentProvidersType, ShoppingCartType } from "../ShoppingTypes";
import type { CustomerAddressType, GuestFormType } from "../../customers/CustomerTypes";
import type { PaymentShoppingCart } from "../../orders/OrdersTypes";
import GuestAddressFormModal from "../components/GuestAddressFormModal";
import clsx from "clsx";
import { useThemeStore } from "../../../layouts/states/themeStore";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { BiMinus, BiPlus } from "react-icons/bi";

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
const ShoppingCartResume = () => {
    // ============================================================================
    // Constants
    // ============================================================================
    const IVA = 0.16;
    // ============================================================================
    // Hooks & State Management
    // ============================================================================

    const { theme } = useThemeStore();
    const navigate = useNavigate();
    const { isAuth } = useAuthStore();
    // const { items, toogleCheckItem, updateItemQty, removeItem } = useShoppingCartStore();
    const { shoppingCart, toogleCheck, updateQty, remove } = useShoppingCart();
    const { order, createOrder, isLoading: orderLoading } = usePaymentStore();
    const { showTriggerAlert } = useTriggerAlert();

    /** Selected shipping address for the order */
    const [selectedAddress, setSelectedAddress] = useState<CustomerAddressType | null>(null);

    /** Calculated shipping cost based on number of boxes needed */
    const [shippingCost, setShippingCost] = useState<number>(0);

    /** Number of boxes required for shipping */
    const [boxQty, setBoxQty] = useState<number>(1);

    /** Selected payment provider (mercado_pago, paypal, etc.) */
    const [paymentMethod, setPaymentMethod] = useState<PaymentProvidersType>(null);

    /** Whether to show the guest checkout form */
    const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
    const [guestBillingAddressChecked, setGuestBillingAddressChecked] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string | null>(null);

    // Modal references
    const guestAdvertisementModal = useRef<HTMLDialogElement>(null);
    const addressesModal = useRef<HTMLDialogElement>(null);
    const guestAddressFormModal = useRef<HTMLDialogElement>(null);
    const guestFormBillingModal = useRef<HTMLDialogElement>(null);

    // Guest address form
    const [guestAddressForm, setGuestAddressForm] = useState<GuestFormType | null>(null);
    const [billingGuestAddress, setBillingGuestAddress] = useState<GuestFormType | null>(null);

    const [discount, setDiscount] = useState<number>(0);
    const [subtotalWithDisc, setSubtotalWithDisc] = useState<number>(0);
    const [subtotalBeforeIva, setSubtotalBeforeIva] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [iva, setIva] = useState<number>(0);


    // ============================================================================
    // Data Fetching
    // ============================================================================

    /** Fetch customer addresses if authenticated */
    const {
        data: addresses,
        isLoading: addressesLoading,
        error: addressesError,
        refetch: addressesRefetch
    } = useFetchCustomerAddresses({ pagination: { page: 1, limit: 10 } });

    // ============================================================================
    // Computed Values
    // ============================================================================

    /** Products that are checked/selected for purchase */
    const selectedProducts: ShoppingCartType[] = shoppingCart && shoppingCart.filter(item => item.isChecked === true);

    // /** Subtotal including IVA (sum of all selected products) */
    // const subtotal: number = shoppingCart.filter(items => items.isChecked === true).reduce((accumulator: number, product: ShoppingCartType) => {
    //     const itemTotal = parseFloat(product.product_version.unit_price) * product.quantity;
    //     return accumulator + itemTotal;
    // }, 0);

    // /** IVA tax amount (16% of subtotal) */
    // const calcSubtotalIVA: number = subtotal * IVA;

    // /** Subtotal before IVA tax */
    // const subtotalBeforeIVA: number = subtotal - calcSubtotalIVA;

    // /** Final total including subtotal and shipping */
    // const total: number = subtotal + shippingCost;

    // ============================================================================
    // Navigation Guard
    // ============================================================================

    /** Redirect to cart if no items are selected */
    if (!shoppingCart || shoppingCart.length === 0 || shoppingCart.filter(item => item.isChecked === true).length < 1) {
        navigate("/carrito-de-compras");
    }

    /** Redirect to payment page if order was successfully created */
    if (order) navigate("/pagar-productos");

    // ============================================================================
    // Helper Functions
    // ============================================================================

    // ============================================================================
    // Event Handlers
    // ============================================================================

    /**
     * Sets the selected shipping address
     * @param selected - The address selected by the user
     */
    const handleSetSelectedAddress = (selected: CustomerAddressType) => setSelectedAddress(selected);

    /**
     * Handles the response from the guest advertisement modal
     * If user confirms, shows the guest checkout form
     * @param response - Whether user wants to continue as guest
     */
    const modalResponse = (response: boolean) => {
        if (response) {
            const modal = guestAdvertisementModal.current;
            if (modal) { modal.close(); }
            setShowGuestForm(true);
        }
    };

    /**
     * Creates an order and initiates payment process
     * Validates that an address is selected before proceeding
     */
    const handleCreateOrder = async () => {
        if (!selectedAddress) {
            showTriggerAlert("Message", "Seleccionar una dirección de envío para continuar.");
            return;
        }

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
                payment_method: paymentMethod,
                coupon_code: couponCode || undefined
            });
        }
    };

    const handleGuestAddressForm = (savedAddress: GuestFormType) => setGuestAddressForm(savedAddress);

    const calcShipping = (): { boxesQty: number, shippingCost: number } => {
        const totalItems = shoppingCart.reduce((acc, current) => { return acc + current.quantity }, 0);
        const { boxesQty, shippingCost } = calcShippingCost({ itemQty: totalItems });
        setBoxQty(boxesQty);
        setShippingCost(shippingCost);
        return { boxesQty, shippingCost };
    };

    // ============================================================================
    // Effects
    // ============================================================================

    /** Set default address when addresses are loaded */
    useEffect(() => {
        if (!addresses) return;
        const defaultAddress = addresses.data.find(data => data.default_address === true);
        if (!defaultAddress) return;
        setSelectedAddress(defaultAddress);
    }, [addresses]);

    useEffect(() => {
        if (shoppingCart) {
            const { shippingCost } = calcShipping();
            /** Products that are checked/selected for purchase */
            const onlyChecked = shoppingCart.filter(item => item.isChecked === true);

            /** Subtotal including IVA (sum of all selected products) */
            const subtotal = onlyChecked.reduce((acc, item) => {
                const itemTotal = parseFloat(item.product_version.unit_price) * item.quantity;
                return acc + itemTotal;
            }, 0);

            const discount = onlyChecked.reduce((acc, item) => {
                if (item.isOffer && item.product_version.unit_price_with_discount) {
                    return acc + (parseFloat(item.product_version.unit_price) - parseFloat(item.product_version.unit_price_with_discount)) * item.quantity;
                } else {
                    return acc;
                }
            }, 0);

            const calcIva = subtotal * IVA;
            const calcSubtotalBeforeIVA: number = subtotal - calcIva;
            const subtotalWithDiscount = subtotal - discount;
            const total: number = subtotalWithDiscount + shippingCost;

            setSubtotalWithDisc(subtotalWithDiscount);
            setSubtotalBeforeIva(calcSubtotalBeforeIVA);
            setDiscount(discount);
            setIva(calcIva);
            setTotal(total);
        }
    }, [shoppingCart]);

    /** Recalculate shipping cost when items or quantities change */
    useEffect(() => { calcShipping(); }, [updateQty]);

    // ============================================================================
    // Render
    // ============================================================================

    return (
        <div className={clsx(
            "w-full px-5 py-10 rounded-xl",
            theme === "ligth" ? "bg-base-300" : "bg-slate-900"
        )}>
            <p className="text-3xl font-bold">Resumen del carrito</p>

            <section className="w-full flex mt-5">
                {/* Left Column - Address & Products */}
                <div className="w-3/4">
                    {/* Address Selection / Guest Form */}
                    {isAuth ? (
                        <div className={clsx(
                            "w-full px-5 py-7 rounded-xl",
                            theme === "ligth" ? "bg-white" : "bg-slate-950"
                        )}>
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
                        </div>
                    ) : (
                        <div className="w-full bg-white rounded-xl px-5 py-10">
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
                    <div className={clsx(
                        "w-full flex flex-col gap-2 rounded-xl pt-5 pb-6 px-5 mt-5",
                        theme === "ligth" ? "bg-white" : "bg-slate-950"
                    )}>
                        {selectedProducts.map((item, index) => (
                            <ShoppingCartProductResume
                                key={index}
                                data={item}
                                onToggleCheck={toogleCheck}
                                onUpdateQty={updateQty}
                                onRemoveItem={remove}
                                isAuth={isAuth ?? false}
                            />
                        ))}
                        <div className="w-full border-t border-t-gray-300 pt-5">
                            <p className="text-xl text-right">{`Subtotal (${shoppingCart && shoppingCart.filter(item => item.isChecked === true).length}) productos: `}<span className="font-bold">${formatPrice((subtotalWithDisc.toString()), "es-MX")}</span> </p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Price Summary & Payment */}
                <div className="w-1/4 pl-4">
                    <h2>Desglose</h2>
                    <div className={clsx(
                        "w-full p-5 rounded-xl mt-2",
                        theme === "ligth" ? "bg-white" : "bg-slate-950"
                    )}>
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
                                {/* PayPal - Commented out */}
                                {/* <div className="w-full flex items-center gap-5">
                                    <input type="radio" name="payment_method" id="" className="radio radio-primary" onClick={() => setPaymentMethod("paypal")} />
                                    <div className="relative w-full">
                                        <button className="cursor-pointer mb-6">
                                            <p className="flex items-center gap-2 text-blue-500 font-bold text-xl"><FaCcPaypal className="text-5xl" />Paypal</p>
                                        </button>
                                        <p className="text-sm text-primary absolute bottom-0">Pagos con tarjetas de crédito y debito</p>
                                    </div>
                                </div> */}
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

export default ShoppingCartResume;