import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingBag, FaUserShield } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { useAuthStore } from "../../auth/states/authStore";
import { usePaymentStore } from "../states/paymentStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useHandleShoppingCartV3 } from "../hooks/handleShoppingCartV3";
import { useFetchCustomerAddresses } from "../../customers/hooks/useCustomer";
import AddressSection from "../components/AddressSection";
import PaymentMethod from "../components/PaymentMethod";
import CartItems from "../components/CartItems";
import OrderSummary from "../components/OrderSummary";
import TrustBadgesV3 from "../components/TrustBadgesV3";
import type { PV3CardData } from "../../products/ProductTypes";
import type { PaymentProvidersType } from "../ShoppingTypes";
import type { CustomerAddressType, GuestCreateOrderFormType } from "../../customers/CustomerTypes";

const ShoppingCartV3 = () => {
    document.title = "Iga Productos | Carrito de compras";

    const navigate = useNavigate();
    const location = useLocation();
    const { isAuth, authCustomer } = useAuthStore();
    const { order, createOrder, isLoading: orderLoading, error, clearError } = usePaymentStore();
    const { showTriggerAlert } = useTriggerAlert();

    const [selectedAddress, setSelectedAddress] = useState<CustomerAddressType | null>(null);
    const [paymentProvider, setPaymentProvider] = useState<PaymentProvidersType>(null);
    const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string | null>(null);
    const [guestAddressForm, setGuestAddressForm] = useState<GuestCreateOrderFormType | null>(null);
    const [showGuestFormEdit, setShowGuestFormEdit] = useState<boolean>(false);

    const pendingOrder = useMemo(() => !!order, [order]);

    const destination = useMemo(() => {
        if (isAuth && selectedAddress) return selectedAddress.zipCode;
        if (!isAuth && guestAddressForm) return guestAddressForm.zipCode;
        return null;
    }, [isAuth, selectedAddress, guestAddressForm]);

    const isSubmitDisabled = useMemo(() => {
        if (orderLoading) return true;
        if (!paymentProvider) return true;
        if (isAuth) return !selectedAddress;
        return !guestAddressForm || !guestAddressForm.consent;
    }, [isAuth, orderLoading, paymentProvider, selectedAddress, guestAddressForm]);

    const handleCart = useHandleShoppingCartV3({
        isAuth,
        authCustomer,
        showTriggerAlert: (type, msg, opts) => showTriggerAlert(type, msg, opts),
        destination: destination ?? undefined,
    });

    const { data: addresses } =
        useFetchCustomerAddresses({ pagination: { page: 1, limit: 10 } });

    const cardsMap = useMemo(() => {
        if (!handleCart.data?.cards) return new Map<string, PV3CardData>();
        return new Map(handleCart.data.cards.map(c => [c.version.sku.toLowerCase(), c]));
    }, [handleCart.data]);

    const allItems = useMemo(() => {
        if (!handleCart.data?.shoppingCart) return [];
        return handleCart.data.shoppingCart;
    }, [handleCart.data]);

    useEffect(() => {
        if (order) navigate("/pagar-productos");
    }, [order, navigate]);

    useEffect(() => {
        if (!addresses) return;
        const defaultAddress = addresses.data.find(d => d.defaultAddress === true);
        if (defaultAddress) setSelectedAddress(defaultAddress);
    }, [addresses]);

    useEffect(() => clearError(), [location.pathname, clearError]);

    const handleSetSelectedAddress = (selected: CustomerAddressType) => setSelectedAddress(selected);

    const handleGuestFormSave = (data: GuestCreateOrderFormType) => {
        setGuestAddressForm(data);
        setShowGuestFormEdit(false);
    };

    const handlePreValidation = () => {
        if (isAuth) {
            if (!selectedAddress) {
                showTriggerAlert("Message", "Selecciona una dirección de envío para continuar.");
                return false;
            }
        }
        if (!isAuth) {
            if (!guestAddressForm) {
                showTriggerAlert("Message", "Rellena el formulario de envío para continuar.");
                return false;
            }
            if (guestAddressForm && !guestAddressForm.consent) {
                showTriggerAlert("Message", "Debes aceptar el consentimiento antes de continuar.");
                return false;
            }
        }
        return true;
    };

    const handleCreateOrder = async () => {
        if (!handlePreValidation()) return;
        if (!paymentProvider) {
            showTriggerAlert("Message", "Selecciona un método de pago para continuar.");
            return;
        }
        if (isAuth && selectedAddress) {
            await createOrder({
                addressUUID: selectedAddress.uuid,
                paymentProvider,
                couponCode: couponCode || undefined,
            });
            handleCart.clearCart();
            return;
        }
        if (!isAuth && guestAddressForm && guestAddressForm.consent) {
            await createOrder({
                guestForm: guestAddressForm,
                paymentProvider,
                couponCode: couponCode || undefined,
            });
            handleCart.clearCart();
            return;
        }
    };

    const handlePendingPayment = () => {
        navigate("/pagar-productos");
    };

    return (
        <div className="w-full flex justify-center items-center">
            <div className="w-full md:w-80/100 px-2 sm:px-3 md:px-4 py-6 md:py-10 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MdShoppingBag className="text-primary text-lg sm:text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                                Carrito de compras
                            </h1>
                            {!isAuth && (
                                <div className="tooltip tooltip-bottom" data-tip="Estás navegando como invitado. Solo la información del pedido será persistida. Los articulos del carrito se persisten por tiempo limitado.">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-warning/50 text-warning-content text-xs font-bold tracking-widest uppercase cursor-help">
                                        <FaUserShield className="text-[10px]" />
                                        Invitado
                                    </span>
                                </div>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                            Revisa tu pedido y completa tu compra
                        </p>
                    </div>
                </div>

                {allItems.length === 0 && !handleCart.isLoading ? (
                    <div className="w-full flex flex-col items-center justify-center py-16 gap-4">
                        <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center">
                            <MdShoppingBag className="text-4xl text-base-content/30" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-base-content mb-1">Tu carrito está vacío</h2>
                            <p className="text-sm text-base-content/50">Agrega productos desde la tienda para comenzar</p>
                        </div>
                        <Link to="/homev2#tienda" className="btn btn-primary gap-2">
                            <FaShoppingBag className="text-sm" />
                            Ir a la tienda
                        </Link>
                    </div>
                ) : (
                    <section className="w-full flex flex-col lg:flex-row gap-5">
                        {/* Left Column: Address → Payment → Products */}
                        <div className="flex-1 min-w-0 flex flex-col gap-5">
                            <AddressSection
                                isAuth={isAuth}
                                selectedAddress={selectedAddress}
                                onSetSelectedAddress={handleSetSelectedAddress}
                                showGuestForm={showGuestForm}
                                setShowGuestForm={setShowGuestForm}
                                showGuestFormEdit={showGuestFormEdit}
                                setShowGuestFormEdit={setShowGuestFormEdit}
                                guestAddressForm={guestAddressForm}
                                handleGuestFormSave={handleGuestFormSave}
                            />
                            {!pendingOrder && (
                                <PaymentMethod
                                    paymentProvider={paymentProvider}
                                    setPaymentProvider={setPaymentProvider}
                                />
                            )}
                            <CartItems
                                allItems={allItems}
                                cardsMap={cardsMap}
                                handleCart={handleCart}
                                isAuth={isAuth}
                            />
                        </div>

                        {/* Right Column: Summary + Trust Badges */}
                        <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4">
                            <OrderSummary
                                allItems={allItems}
                                handleCart={handleCart}
                                destination={destination}
                                couponCode={couponCode}
                                setCouponCode={setCouponCode}
                                orderLoading={orderLoading}
                                handleCreateOrder={handleCreateOrder}
                                error={error}
                                isAuth={isAuth}
                                isSubmitDisabled={pendingOrder ? false : isSubmitDisabled}
                                pendingOrder={pendingOrder}
                                onPendingPayment={handlePendingPayment}
                            />
                            <TrustBadgesV3 />
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ShoppingCartV3;
