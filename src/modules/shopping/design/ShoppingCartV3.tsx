import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { useAuthStore } from "../../auth/states/authStore";
import { usePaymentStore } from "../states/paymentStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useHandleShoppingCartV3 } from "../hooks/handleShoppingCartV3";
import { useFetchCustomerAddresses } from "../../customers/hooks/useCustomer";
import AddressSection from "../components/AddressSection";
import PaymentMethod from "../components/PaymentMethod";
import CartItems from "../components/CartItems";
import RecentlyViewed from "../components/RecentlyViewed";
import FavoritesSectionV3 from "../components/FavoritesSectionV3";
import OrderSummary from "../components/OrderSummary";
import TrustBadgesV3 from "../components/TrustBadgesV3";
import SideAdBanner from "../components/SideAdBanner";
import EmptyCartV3 from "../components/EmptyCartV3";
import type { PV3CardData } from "../../products/ProductTypes";
import type { PaymentProvidersType } from "../ShoppingTypes";
import type { CustomerAddressType, GuestCreateOrderFormType } from "../../customers/CustomerTypes";

const ShoppingCartV3 = () => {
    document.title = "Iga Productos | Carrito de compras";

    const navigate = useNavigate();
    const location = useLocation();
    const { isAuth, authCustomer } = useAuthStore();
    const { order, createOrder, isLoading: orderLoading, error, clearError, clearErrorBadge, duplicateGuestEmail } = usePaymentStore();
    const { showTriggerAlert } = useTriggerAlert();

    const [selectedAddress, setSelectedAddress] = useState<CustomerAddressType | null>(null);
    const [paymentProvider, setPaymentProvider] = useState<PaymentProvidersType>(null);
    const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string | null>(null);
    const [guestAddressForm, setGuestAddressForm] = useState<GuestCreateOrderFormType | null>(null);
    const [showGuestFormEdit, setShowGuestFormEdit] = useState<boolean>(false);

    const addressSectionRef = useRef<HTMLDivElement>(null);

    const pendingOrder = useMemo(() => !!order, [order]);

    const addressForShipping = useMemo(() => {
        if (isAuth && selectedAddress) return selectedAddress;
        if (!isAuth && guestAddressForm) return guestAddressForm;
        return null;
    }, [isAuth, selectedAddress, guestAddressForm]);

    const destination = useMemo(() => addressForShipping?.zipCode ?? null, [addressForShipping]);
    const destinationCity = useMemo(() => addressForShipping?.city ?? undefined, [addressForShipping]);
    const destinationState = useMemo(() => addressForShipping?.state ?? undefined, [addressForShipping]);

    const isSubmitDisabled = useMemo(() => {
        if (orderLoading) return true;
        if (!paymentProvider) return true;
        if (isAuth) return !selectedAddress;
        return !guestAddressForm || !guestAddressForm.consent
            || (!!duplicateGuestEmail && guestAddressForm.email === duplicateGuestEmail);
    }, [isAuth, orderLoading, paymentProvider, selectedAddress, guestAddressForm, duplicateGuestEmail]);

    const handleCart = useHandleShoppingCartV3({
        isAuth,
        authCustomer,
        showTriggerAlert: (type, msg, opts) => showTriggerAlert(type, msg, opts),
        destination: destination ?? undefined,
        destinationCity,
        destinationState,
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
        clearError();
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
            const ok = await createOrder({
                addressUUID: selectedAddress.uuid,
                paymentProvider,
                couponCode: couponCode || undefined,
            });
            if (!ok) {
                showTriggerAlert("OrderError", usePaymentStore.getState().error ?? "No pudimos procesar tu pago, intenta nuevamente.", { duration: 4000 });
                return;
            }
            handleCart.clearCart();
            return;
        }
        if (!isAuth && guestAddressForm && guestAddressForm.consent) {
            const ok = await createOrder({
                guestForm: guestAddressForm,
                paymentProvider,
                couponCode: couponCode || undefined,
            });
            if (!ok) {
                showTriggerAlert("OrderError", usePaymentStore.getState().error ?? "No pudimos procesar tu pago, intenta nuevamente.", { duration: 4000 });
                return;
            }
            handleCart.clearCart();
            return;
        }
    };

    const handlePendingPayment = () => {
        navigate("/pagar-productos");
    };

    const handleOpenAddress = () => {
        if (!isAuth) setShowGuestForm(true);
        addressSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
                    <EmptyCartV3 />
                ) : (
                    <section className="w-full flex flex-col lg:flex-row gap-5">
                        {/* Left Column: Address → Payment → Products */}
                        <div className="flex-1 min-w-0 flex flex-col gap-5">
                            <div ref={addressSectionRef}>
                                <AddressSection
                                    isAuth={isAuth}
                                    selectedAddress={selectedAddress}
                                    onSetSelectedAddress={handleSetSelectedAddress}
                                    showGuestForm={showGuestForm}
                                    setShowGuestForm={setShowGuestForm}
                                    showGuestFormEdit={showGuestFormEdit}
                                    setShowGuestFormEdit={(v) => { clearErrorBadge(); setShowGuestFormEdit(v); }}
                                    guestAddressForm={guestAddressForm}
                                    handleGuestFormSave={handleGuestFormSave}
                                />
                            </div>
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
                            <RecentlyViewed excludeSkus={allItems.map((item) => item.item.sku)} />
                            <FavoritesSectionV3 />
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
                                onOpenAddress={handleOpenAddress}
                            />
                            <TrustBadgesV3 />
                            <SideAdBanner />
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ShoppingCartV3;
