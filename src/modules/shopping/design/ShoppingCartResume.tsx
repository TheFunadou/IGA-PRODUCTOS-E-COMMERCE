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
    document.title = "Iga Productos | Resumen de carrito";
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
    const [_showGuestForm, setShowGuestForm] = useState<boolean>(false);
    const [_guestBillingAddressChecked, _setGuestBillingAddressChecked] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string | null>(null);

    // Modal references
    const guestAdvertisementModal = useRef<HTMLDialogElement>(null);
    const addressesModal = useRef<HTMLDialogElement>(null);
    const guestAddressFormModal = useRef<HTMLDialogElement>(null);

    // Guest address form
    const [guestAddressForm, setGuestAddressForm] = useState<GuestFormType | null>(null);
    const [_billingGuestAddress, _setBillingGuestAddress] = useState<GuestFormType | null>(null);

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
        if (!isAuth) {
            showTriggerAlert("Message", "Registrate para poder continuar con tu compra ✨");
            return;
        }
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
        <div className="w-full px-3 sm:px-5 py-6 sm:py-10 rounded-xl bg-base-300">
            <p className="text-2xl sm:text-3xl font-bold">Resumen del carrito</p>

            <section className="w-full flex flex-col lg:flex-row mt-5 gap-5">
                {/* Left Column - Address & Products */}
                <div className="w-full lg:w-3/4">
                    {/* Address Selection / Guest Form */}
                    {isAuth ? (
                        <div className="w-full px-3 sm:px-5 py-5 sm:py-7 rounded-xl bg-base-100">
                            {/* Loading State */}
                            {addressesLoading && !addresses && !addressesError && "Cargando direcciones de envio..."}

                            {/* Selected Address Display */}
                            {!addressesLoading && !addressesError && selectedAddress &&
                                <div className="w-full flex">
                                    <div className="w-full">
                                        <p className="text-lg sm:text-xl font-bold">Enviar a</p>
                                        <p className="text-xl sm:text-2xl font-bold">{`${selectedAddress.recipient_name} ${selectedAddress.recipient_last_name} (${selectedAddress.address_type})`}</p>
                                        <p className="text-base sm:text-lg">{selectedAddress.country_phone_code} {selectedAddress.contact_number}</p>
                                        <p className="text-base sm:text-lg">{`${selectedAddress.street_name}, #${selectedAddress.number} EXT.${selectedAddress.aditional_number === "N/A" ? "" : `${selectedAddress.aditional_number} INT.`} ${selectedAddress.neighborhood}, ${selectedAddress.zip_code}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`}</p>
                                        {selectedAddress.default_address === true && <p className="text-lg sm:text-xl font-bold">Dirección predeterminada</p>}
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm sm:btn-md cursor-pointer text-xs sm:text-sm mt-3 text-right"
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
                                    <p className="text-base sm:text-lg">Error al cargar las direcciones de envio</p>
                                    <button type="button" className="btn btn-primary btn-sm sm:btn-md mt-2" onClick={() => addressesRefetch()}>Cargar otra vez</button>
                                </div>
                            }

                            {!addressesLoading && addresses && addresses.data.length === 0 &&
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold">No tienes direcciones de envio registradas</h2>
                                    <Link to={"/mi-cuenta/direcciones-de-envio"} type="button" className="underline text-primary text-sm sm:text-base">Crea una nueva dirección de envio ahora</Link>
                                </div>
                            }
                        </div>
                    ) : (
                        <div className="bg-base-100 rounded-xl px-3 sm:px-5 py-6 sm:py-10">
                            <h3 className="text-base sm:text-lg">Inicia sesión para poder continuar con tu compra y añade mas comodidad y seguridad a tus compras 📦</h3>
                            <Link to={"/iniciar-sesion"} className="btn btn-primary btn-sm sm:btn-md mt-3">Iniciar sesión</Link>
                        </div>
                    )}

                    {/* Selected Products List */}
                    <div className="w-full flex flex-col gap-2 rounded-xl pt-3 sm:pt-5 pb-4 sm:pb-6 px-3 sm:px-5 mt-5 bg-base-100">
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
                        <div className="w-full border-t border-t-gray-300 pt-3 sm:pt-5">
                            <p className="text-base sm:text-xl text-right">{`Subtotal (${shoppingCart && shoppingCart.filter(item => item.isChecked === true).length}) productos: `}<span className="font-bold">${formatPrice((subtotalWithDisc.toString()), "es-MX")}</span> </p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Price Summary & Payment */}
                <div className="w-full lg:w-1/4">
                    <div className="w-full p-3 sm:p-5 rounded-xl bg-base-100">
                        <h2 className="text-xl sm:text-2xl font-bold pb-5">Desglose</h2>
                        {/* Price Breakdown */}
                        <div className="w-full flex flex-col gap-2 border-b border-b-gray-400 pb-5">
                            <div className="text-base sm:text-xl flex">
                                <div className="w-3/5">
                                    <p>Subtotal:</p>
                                    <p className="text-xs">Antes de impuestos y descuentos</p>
                                </div>
                                <p className="pl-2 flex items-center"><BiPlus />${formatPrice((subtotalBeforeIva.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-base sm:text-xl flex">
                                <p className="w-3/5">IVA (16%):</p>
                                <p className="pl-2 flex items-center"><BiPlus />${formatPrice((iva.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-base sm:text-xl flex">
                                <p className="w-3/5">Envio({boxQty > 1 ? `${boxQty} cajas` : `${boxQty} caja`}):</p>
                                <p className="pl-2 flex items-center"><BiPlus />${formatPrice((shippingCost.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-base sm:text-xl flex">
                                <p className={clsx(
                                    "w-3/5",
                                    discount > 0 && "text-primary font-bold"
                                )}>Descuento:</p>
                                <p className={clsx(
                                    "pl-2 flex items-center",
                                    discount > 0 && "text-primary font-bold"
                                )}><BiMinus />${formatPrice((discount.toString()), "es-MX")}</p>
                            </div>
                            <div className="text-xl sm:text-2xl font-bold flex">
                                <p className="w-3/5">Total:</p>
                                <p className="pl-2">${formatPrice((total.toString()), "es-MX")}</p>
                            </div>
                        </div>

                        {/* Discount Coupon */}
                        <div className="mt-5">
                            <p className="text-base sm:text-xl">Cupón de descuento</p>
                            <input onChange={(e) => setCouponCode(e.target.value)} type="text" className="w-full input input-sm sm:input-md text-sm sm:text-lg placeholder:text-xs sm:placeholder:text-sm mt-1" placeholder="Introduce el código de descuento" />
                        </div>

                        {/* Payment Method Selection */}
                        <div className="mt-5">
                            <p className="text-base sm:text-xl font-bold">Selecciona un metodo de pago</p>
                            <div className="flex flex-col gap-4 pt-2">
                                {/* Mercado Pago */}
                                <div className="w-full flex items-center gap-3 sm:gap-5">
                                    <input type="radio" name="payment_method" id="" className={clsx(
                                        "radio radio-sm sm:radio-md",
                                        theme === "ligth" ? "radio-primary" : "radio-white"
                                    )} onClick={() => setPaymentMethod("mercado_pago")} />
                                    <div className="relative w-full">
                                        <button className="cursor-pointer mb-8 sm:mb-10">
                                            <p className={clsx(
                                                "flex items-center gap-2 font-bold text-base sm:text-xl",
                                                theme === "ligth" ? "text-blue-500" : "text-white"
                                            )}><SiMercadopago className="text-3xl sm:text-5xl" />Mercado pago</p>
                                        </button>
                                        <p className={clsx(
                                            "text-xs sm:text-sm absolute bottom-0",
                                            theme === "ligth" ? "text-blue-500" : "text-white"
                                        )}>Pagos con tarjetas de crédito, debito, OXXO, MSI y mas...</p>
                                    </div>
                                </div>
                            </div>

                            {/* Proceed to Payment Button */}
                            <button
                                className="mt-6 sm:mt-10 btn btn-primary btn-sm sm:btn-md w-full text-sm sm:text-lg cursor-pointer"
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