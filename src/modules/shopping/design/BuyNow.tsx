// import { Link, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../auth/states/authStore";
// import ShoppingCartProductResume from "../components/ShoppingCartProductResume";
// import { useShoppingCartStore } from "../states/shoppingCartStore";
// import { formatPrice } from "../../products/Helpers";
// import { useEffect, useRef, useState } from "react";
// import GuestAdvertisement from "../components/GuestAdvertisement";
// import type { ShoppingCartType } from "../ShoppingTypes";
// import { useFetchCustomerAddresses } from "../../customers/hooks/useCustomer";
// import AddressesModal from "../components/AddressesModal";
// import type { CustomerAddressType } from "../../customers/CustomerTypes";
// import { closeModal, showModal } from "../../../global/GlobalHelpers";
// import { SiMercadopago } from "react-icons/si";
// import { FaCcPaypal } from "react-icons/fa";
// import { usePaymentStore } from "../states/paymentStore";
// import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
// import type { PaymentShoppingCart } from "../../orders/OrdersTypes";

// const ShoppingCartResume = () => {
//     const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
//     const guestAdvertisementModal = useRef<HTMLDialogElement>(null);
//     const { isAuth, authCustomer } = useAuthStore();
//     const [selectedAddress, setSelectedAddress] = useState<CustomerAddressType | null>(null);
//     const { itemBuyNow, toogleCheckItem, updateItemQty, removeItem } = useShoppingCartStore();
//     const addressesModal = useRef<HTMLDialogElement>(null);
//     const { showTriggerAlert } = useTriggerAlert();
//     // const [paymentMethod, setPaymentMethod] = useState<PaymentMethodsType>(null);
//     const { order, createOrder, isLoading: orderLoading } = usePaymentStore();
//     const navigate = useNavigate();
//     const {
//         data: addresses,
//         isLoading,
//         error,
//         refetch
//     } = useFetchCustomerAddresses();
//     if (!itemBuyNow) {
//         navigate("/carrito-de-compras");
//         throw new Error("Ocurrio un error inesperado")
//     };
//     const handleSetSelectedAddress = (selected: CustomerAddressType) => setSelectedAddress(selected);
//     const modalResponse = (response: boolean) => {
//         if (response) {
//             const modal = guestAdvertisementModal.current;
//             if (modal) { modal.close(); };
//             setShowGuestForm(true);
//         };
//     };

//     const subtotal: number = itemBuyNow.quantity * parseFloat(itemBuyNow.product_version.unit_price);
//     const IVA: number = subtotal * 0.16;
//     const subtotalBeforeIVA: number = subtotal - IVA;
//     const shipping: number = 0;
//     const total: number = subtotal + shipping;

//     useEffect(() => {
//         if (!addresses) return;
//         const defaultAddress = addresses.find(data => data.default_address === true);
//         if (!defaultAddress) return;
//         setSelectedAddress(defaultAddress);
//     }, [addresses]);

//     const handleCreateOrder = async () => {
//         if (!selectedAddress) showTriggerAlert("Message", "Seleccionar una dirección de envío para continuar.");
//         if (selectedAddress) {
//             const product: PaymentShoppingCart = {
//                 product: itemBuyNow.product_version.sku,
//                 quantity: itemBuyNow.quantity
//             };

//             await createOrder({
//                 shopping_cart: [product],
//                 address: selectedAddress.uuid,
//                 payment_method: paymentMethod
//             });
//         };
//     };

//     // If the order exists
//     if (order) navigate("/pagar-productos");

//     return (
//         <div className="w-full bg-base-300 px-5 py-10 rounded-xl">
//             <p className="text-3xl font-bold">Resumen del carrito</p>
//             <section className="w-full flex mt-5">
//                 <div className="w-3/4">
//                     {isAuth ? (
//                         <div className="w-full bg-white rounded-xl px-5 py-7">
//                             {selectedAddress &&
//                                 <div className="w-full flex">
//                                     <div className="w-90/100">
//                                         <p className="text-xl font-bold">Enviar a</p>
//                                         <p className="text-2xl font-bold">{`${selectedAddress.recipient_name} ${selectedAddress.recipient_last_name}`}</p>
//                                         <p className="text-lg">{selectedAddress.country_phone_code} {selectedAddress.contact_number}</p>
//                                         <p className="text-lg">{`${selectedAddress.street_name}, #${selectedAddress.number} EXT.${selectedAddress.aditional_number === "N/A" ? "" : `${selectedAddress.aditional_number} INT.`} ${selectedAddress.neighborhood}, ${selectedAddress.zip_code}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`}</p>
//                                         {selectedAddress.default_address === true && <p className="text-xl font-bold">Dirección predeterminada</p>}
//                                     </div>
//                                     <div className="w-10/100">
//                                         <button
//                                             type="button"
//                                             className="underline text-primary cursor-pointer text-lg text-right"
//                                             onClick={() => showModal(addressesModal.current)}
//                                         >
//                                             Escoger otra
//                                         </button>
//                                         <p className="mt-2 text-lg font-bold">{selectedAddress.address_type}</p>
//                                     </div>
//                                 </div>
//                             }
//                         </div>
//                     ) : (
//                         <div className="w-full bg-white rounded-xl px-5 py-10">
//                             {showGuestForm ? (
//                                 <div className="w-full">
//                                     <p className="text-2xl font-bold">Formulario de compra</p>
//                                     <p className="text-base">Sus datos personales se utilizarán para procesar su pedido, respaldar su experiencia en este sitio web y para otros fines descritos en nuestra política de privacidad.</p>
//                                     <p className="mb-2 text-lg mt-2 font-semibold">Información del comprador</p>
//                                     <div className="flex gap-5 items-center">
//                                         <div>
//                                             <label className="mr-2">Correo Electronico:</label>
//                                             <input type="email" className="input" />
//                                         </div>
//                                         <div>
//                                             <label className="mr-2">Nombre:</label>
//                                             <input type="text" className="input" />
//                                         </div>
//                                         <div>
//                                             <label className="mr-2">Apellidos:</label>
//                                             <input type="text" className="input" />
//                                         </div>
//                                         <div>
//                                             <label className="mr-2">Número telefonico:</label>
//                                             <input type="tel" className="input" />
//                                         </div>
//                                     </div>
//                                     <p className="mt-5 mb-1 text-lg font-semibold">Domicilio de envio</p>
//                                     <div className="w-full flex gap-5">
//                                         <div className="w-1/4">
//                                             <p>Calle:</p>
//                                             <input type="email" className="input" />
//                                         </div>
//                                         <div>
//                                             <p>Numero Ext.:</p>
//                                             <input type="text" className="input" />
//                                         </div>
//                                         <div>
//                                             <p>Numero Int.:</p>
//                                             <input type="text" className="input" />
//                                         </div>
//                                         <div className="w-1/4">
//                                             <p>Colonia/Fraccionamiento:</p>
//                                             <input type="tel" className="input" />
//                                         </div>
//                                         <div>
//                                             <p>Código Postal:</p>
//                                             <input type="tel" className="input" />
//                                         </div>
//                                     </div>
//                                     <div className="w-full flex gap-5 mt-5">
//                                         <div className="w-1/5">
//                                             <p>Ciudad:</p>
//                                             <input type="email" className="input" />
//                                         </div>
//                                         <div className="w-1/5">
//                                             <p>Estado/Entidad Federativa:</p>
//                                             <input type="text" className="input" />
//                                         </div>
//                                         <div>
//                                             <p>País:</p>
//                                             <input type="text" className="input" />
//                                         </div>
//                                     </div>
//                                     <div className="w-full mt-5 flex flex-col gap-3">
//                                         <div>
//                                             <p>Referencias del domicilio:</p>
//                                             <textarea className="textarea w-1/2" placeholder="Entre calles, referencias,etc... Maximo 100 caracteres"></textarea>
//                                         </div>
//                                         <div>
//                                             <input type="checkbox" className="checkbox checkbox-primary mr-3" />
//                                             <span className="text-lg">Quiero utilizar la misma dirección para facturar el pedido.</span>
//                                         </div>
//                                         <div className="flex items-center gap-3 text-lg">
//                                             <input type="checkbox" className="checkbox checkbox-primary" />
//                                             <Link to={"/politica-de-privacidad"} className="underline text-primary">He leido y estoy de acuerdo con los terminos y condiciones y politica de privacidad de la web .</Link>
//                                         </div>
//                                     </div>


//                                 </div>
//                             ) : (
//                                 <div className="w-full">
//                                     <button type="button" className="text-xl font-bold">¿Deseas finalizar la compra como invitado?</button>
//                                     <p className=" text-gray-500">Al obtener una cuenta accedes a varios benificios y funciones que pueden mejorar tu experiencia de compra.</p>
//                                     <div className="w-1/4 mt-3 flex gap-5 items-center">
//                                         <Link to={"/iniciar-sesion"} className="btn btn-primary">Iniciar sesión</Link>
//                                         <button type="button" className="btn bg-blue-950 text-white" onClick={() => showModal(guestAdvertisementModal.current)}>Continuar como invitado</button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     <div className="w-full bg-white rounded-xl p-5 flex flex-col gap-2 mt-5">
//                         {/* Product */}
//                         <ShoppingCartProductResume
//                             data={itemBuyNow}
//                             onToggleCheck={toogleCheckItem}
//                             onUpdateQty={updateItemQty}
//                             onRemoveItem={removeItem}
//                             isAuth={isAuth ?? false}
//                             lock={true}
//                         />
//                         <div className="w-full border-t border-t-gray-300 pt-5">
//                             <p className="text-xl text-right">{`Subtotal (1) productos: `}<span className="font-bold">${formatPrice((subtotal.toString()), "es-MX")}</span> </p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="w-1/4 pl-4">
//                     <div className="w-full bg-white p-5 rounded-xl">
//                         <div className="w-full flex flex-col gap-2 border-b border-b-gray-400 pb-5">
//                             <div className="text-xl flex">
//                                 <p className="w-3/5 ">Subtotal antes de IVA:</p>
//                                 <p className="pl-2">${formatPrice((subtotalBeforeIVA.toString()), "es-MX")}</p>
//                             </div>
//                             <div className="text-xl flex">
//                                 <p className="w-3/5 ">IVA:</p>
//                                 <p className="pl-2">${formatPrice((IVA.toString()), "es-MX")}</p>
//                             </div>
//                             <div className="text-xl flex">
//                                 <p className="w-3/5">Envio:</p>
//                                 <p className="pl-2">${formatPrice((shipping.toString()), "es-MX")}</p>
//                             </div>
//                             <div className="text-xl flex">
//                                 <p className="w-3/5">Descuento:</p>
//                                 <p className="pl-2">${formatPrice(("0".toString()), "es-MX")}</p>
//                             </div>
//                             <div className="text-2xl font-bold flex">
//                                 <p className="w-3/5 ">Total:</p>
//                                 <p className="pl-2">${formatPrice((total.toString()), "es-MX")}</p>
//                             </div>
//                         </div>

//                         <div className="mt-5">
//                             <p className="text-xl">Cupón de descuento</p>
//                             <input type="text" className="w-full input text-lg placeholder:text-sm mt-1" placeholder="Introduce el código de descuento" />
//                             <button type="button" className="w-full btn bg-blue-900 text-white mt-3 text-lg">Aplicar descuento</button>
//                         </div>
//                         <div className="mt-5">
//                             <p className="text-xl font-bold">Selecciona un metodo de pago</p>
//                             <div className="flex flex-col gap-4 pt-2">
//                                 <div className="w-full flex items-center gap-5">
//                                     {/* <input type="radio" name="payment_method" id="" className="radio radio-primary" onClick={() => setPaymentMethod("mercado_pago")} /> */}
//                                     <div className="relative w-full">
//                                         <button className="cursor-pointer mb-10">
//                                             <p className="flex items-center gap-2 text-blue-500 font-bold text-xl"><SiMercadopago className="text-5xl" />Mercado pago</p>
//                                         </button>
//                                         <p className="text-sm text-blue-500 absolute bottom-0">Pagos con tarjetas de crédito, debito, OXXO, MSI y mas...</p>
//                                     </div>
//                                 </div>
//                                 {/* <div className="w-full flex items-center gap-5">
//                                     <input type="radio" name="payment_method" id="" className="radio radio-primary" onClick={() => setPaymentMethod("paypal")} />
//                                     <div className="relative w-full">
//                                         <button className="cursor-pointer mb-6">
//                                             <p className="flex items-center gap-2 text-blue-500 font-bold text-xl"><FaCcPaypal className="text-5xl" />Paypal</p>
//                                         </button>
//                                         <p className="text-sm text-primary absolute bottom-0">Pagos con tarjetas de crédito y debito</p>
//                                     </div>
//                                 </div> */}
//                             </div>
//                             <button
//                                 className="mt-10 btn btn-primary w-full text-lg cursor-pointer"
//                                 disabled={paymentMethod === null || orderLoading === true}
//                                 onClick={handleCreateOrder}
//                             >
//                                 {orderLoading ? ("Cargando...") : ("Proceder al pago")}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <GuestAdvertisement refName={guestAdvertisementModal} onResponse={modalResponse} />
//             {addresses && selectedAddress && <AddressesModal ref={addressesModal} addresses={addresses} onSetSelected={handleSetSelectedAddress} selectedAddress={selectedAddress} onClose={() => closeModal(addressesModal.current)} />}
//         </div>
//     );
// };

// export default ShoppingCartResume;


import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { SiMercadopago } from "react-icons/si";
import { useAuthStore } from "../../auth/states/authStore";
import { usePaymentStore } from "../states/paymentStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useFetchCustomerAddresses } from "../../customers/hooks/useCustomer";
import { formatPrice, makeSlug } from "../../products/Helpers";
import { closeModal, showModal } from "../../../global/GlobalHelpers";
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
import ButtonQtyCounter from "../components/ButtonQtyCounter";

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
    const IVA: number = 0.16;
    // ============================================================================
    // Constants
    // ============================================================================
    /** Maximum number of items that fit in one shipping box */
    const MAX_ITEMS_PER_BOX = 10;

    /** Cost per shipping box in MXN */
    const BOX_SHIPPING_COST = 264.00;

    // ============================================================================
    // Hooks & State Management
    // ============================================================================

    const { theme } = useThemeStore();
    const navigate = useNavigate();
    const { isAuth } = useAuthStore();
    const { itemBuyNow } = useShoppingCart();
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
    const [subtotal, setSubtotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    // Modal references
    const guestAdvertisementModal = useRef<HTMLDialogElement>(null);
    const addressesModal = useRef<HTMLDialogElement>(null);
    const guestAddressFormModal = useRef<HTMLDialogElement>(null);
    const guestFormBillingModal = useRef<HTMLDialogElement>(null);

    // Guest address form
    const [guestAddressForm, setGuestAddressForm] = useState<GuestFormType | null>(null);
    const [billingGuestAddress, setBillingGuestAddress] = useState<GuestFormType | null>(null);

    // ============================================================================
    // Data Fetching
    // ============================================================================

    /** Fetch customer addresses if authenticated */
    const {
        data: addresses,
        isLoading: addressesLoading,
        error: addressesError,
        refetch: addressesRefetch
    } = useFetchCustomerAddresses();

    // ============================================================================
    // Computed Values
    // ============================================================================
    if (!itemBuyNow) { navigate("/carrito-de-compras"); return; };

    /** Products that are checked/selected for purchase */
    useEffect(() => {
        const calcSubtotal = itemBuyNow.quantity * parseFloat(itemBuyNow.product_version.unit_price);
        const calcIVA = calcSubtotal * IVA;
        const calcTotal = calcSubtotal + calcIVA + shippingCost;
        setSubtotal(calcSubtotal);
        setTotal(calcTotal);

    }, [itemBuyNow]);

    // ============================================================================
    // Navigation Guard
    // ============================================================================

    /** Redirect to cart if no items are selected */

    /** Redirect to payment page if order was successfully created */
    if (order) navigate("/pagar-productos");

    // ============================================================================
    // Helper Functions
    // ============================================================================

    /**
     * Calculates shipping cost based on total item quantity
     * Determines how many boxes are needed and calculates total shipping cost
     */
    const calcShippingCost = () => {
        const itemsCount = itemBuyNow.quantity;
        const calcBoxes = Math.ceil(itemsCount / MAX_ITEMS_PER_BOX);
        setBoxQty(calcBoxes);
        setShippingCost(calcBoxes * BOX_SHIPPING_COST);
    };

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
            const products: PaymentShoppingCart[] = [
                {
                    product: itemBuyNow.product_version.sku,
                    quantity: itemBuyNow.quantity
                }
            ];

            await createOrder({
                shopping_cart: products,
                address: selectedAddress.uuid,
                payment_method: paymentMethod
            });
        }
    };

    const handleGuestAddressForm = (savedAddress: GuestFormType) => {
        setGuestAddressForm(savedAddress);
    };

    const handleUpdateQty = (values: { sku: string, newQuantity: number }) => {
        if (itemBuyNow.product_version.sku !== values.sku) return;
        itemBuyNow.quantity = values.newQuantity;
        const calcSubtotal = itemBuyNow.quantity * parseFloat(itemBuyNow.product_version.unit_price);
        const calcIVA = calcSubtotal * IVA;
        const calcTotal = calcSubtotal + calcIVA + shippingCost;
        setSubtotal(calcSubtotal);
        setTotal(calcTotal);
    };


    // ============================================================================
    // Effects
    // ============================================================================

    /** Recalculate shipping cost when items or quantities change */
    useEffect(() => { calcShippingCost(); }, [handleUpdateQty]);

    /** Set default address when addresses are loaded */
    useEffect(() => {
        if (!addresses) return;
        const defaultAddress = addresses.find(data => data.default_address === true);
        if (!defaultAddress) return;
        setSelectedAddress(defaultAddress);
    }, [addresses]);


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
                        {itemBuyNow ? (
                            <div className="w-full flex py-2">
                                <div className="w-95/100">
                                    <div className="w-full flex">
                                        <div className="w-95/100">
                                            <Link
                                                to={`/tienda/${itemBuyNow.category.toLowerCase()}/${makeSlug(itemBuyNow.product_name)}/${itemBuyNow.product_version.sku.toLowerCase()}`}
                                                className="text-2xl font-bold hover:underline hover:text-primary">
                                                {itemBuyNow.product_name}
                                            </Link>
                                            <div className="breadcrumbs">
                                                <ul>
                                                    <li className={clsx(
                                                        "text-lg",
                                                        theme === "ligth" ? "text-gray-500" : "text-gray-200"
                                                    )}>{itemBuyNow.category}</li>
                                                    {itemBuyNow.product_attributes.map((breadcrumb, index) => (
                                                        <li
                                                            className={clsx(
                                                                "text-lg",
                                                                theme === "ligth" ? "text-gray-500" : "text-gray-200"
                                                            )}
                                                            key={index}>{breadcrumb.category_attribute.description}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="w-full flex mt-1">
                                        <figure className="w-50 h-50">
                                            <Link to={`/tienda/${itemBuyNow.category.toLowerCase()}/${makeSlug(itemBuyNow.product_name)}/${itemBuyNow.product_version.sku.toLowerCase()}`}>
                                                <img className="w-full h-full object-cover rounded-xl border border-gray-300" src={itemBuyNow.product_images.find(img => img.main_image === true)?.image_url} alt={itemBuyNow.product_name} />
                                            </Link>
                                        </figure>
                                        <div className=" w-65/100 flex px-5">
                                            <div className="w-1/2  text-xl flex flex-col gap-4">
                                                <p>{itemBuyNow.product_version.color_line}</p>
                                                <p><span className={clsx("mr-2 px-4 py-1 rounded-full", theme === "dark" && "border border-slate-500")} style={{ backgroundColor: itemBuyNow.product_version.color_code }}></span>{itemBuyNow.product_version.color_name}</p>
                                                <div>
                                                    <p>Cantidad</p>
                                                    <ButtonQtyCounter
                                                        initQty={itemBuyNow.quantity}
                                                        limit={itemBuyNow.product_version.stock}
                                                        sku={itemBuyNow.product_version.sku}
                                                        onUpdateQty={handleUpdateQty}
                                                        isAuth
                                                        disabled={false}
                                                        className="w-1/2 bg-primary flex items-center justify-center text-white p-1 rounded-lg mt-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" w-20/100">
                                            <div className="mb-2">
                                                <p className="text-xl">Precio unitario</p>
                                                <p className="text-2xl">${formatPrice(itemBuyNow.product_version.unit_price, "es-MX")}</p>
                                            </div>
                                            <div>
                                                <p className="text-xl">Subtotal producto</p>
                                                <p className="font-bold text-2xl underline">${formatPrice(subtotal.toString(), "es-MX")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center">No hay productos seleccionados</p>
                        )}
                        <div className="w-full border-t border-t-gray-300 pt-5">
                            <p className="text-xl text-right">{`Subtotal (1) productos: `}<span className="font-bold">${formatPrice((subtotal.toString()), "es-MX")}</span> </p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Price Summary & Payment */}
                <div className="w-1/4 pl-4">
                    <div className={clsx(
                        "w-full p-5 rounded-xl",
                        theme === "ligth" ? "bg-white" : "bg-slate-950"
                    )}>
                        {/* Price Breakdown */}
                        <div className="w-full flex flex-col gap-2 border-b border-b-gray-400 pb-5">
                            <div className="text-xl flex">
                                <p className="w-3/5 ">Subtotal antes de IVA:</p>
                                <p className="pl-2">${formatPrice(((subtotal - (subtotal * IVA)).toString()), "es-MX")}</p>
                            </div>
                            <div className="text-xl flex">
                                <p className="w-3/5 ">IVA:</p>
                                <p className="pl-2">${formatPrice(((subtotal * IVA).toString()), "es-MX")}</p>
                            </div>
                            <div className="text-xl flex">
                                <p className="w-3/5">Envio({`${boxQty} caja/s`}):</p>
                                <p className="pl-2">${formatPrice((shippingCost.toString()), "es-MX")}</p>
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

                        {/* Discount Coupon */}
                        <div className="mt-5">
                            <p className="text-xl">Cupón de descuento</p>
                            <input type="text" className="w-full input text-lg placeholder:text-sm mt-1" placeholder="Introduce el código de descuento" />
                            <button type="button" className="w-full btn bg-blue-900 text-white mt-3 text-lg">Aplicar descuento</button>
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
            {addresses && selectedAddress && <AddressesModal ref={addressesModal} addresses={addresses} onSetSelected={handleSetSelectedAddress} selectedAddress={selectedAddress} onClose={() => closeModal(addressesModal.current)} />}
            <GuestAddressFormModal ref={guestAddressFormModal} onClose={() => closeModal(guestAddressFormModal.current)} title={guestAddressForm ? "Editar dirección" : "Agregar dirección"} onSave={handleGuestAddressForm} />
        </div>
    );
};

export default BuyNow;