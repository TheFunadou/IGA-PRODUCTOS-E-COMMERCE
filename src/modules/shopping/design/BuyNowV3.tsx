import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FaShoppingBag, FaUserShield } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { useAuthStore } from "../../auth/states/authStore";
import { usePaymentStore } from "../states/paymentStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useFetchBuyNowItemV3 } from "../../orders/hooks/useFetchOrders";
import { useFetchCustomerAddresses } from "../../customers/hooks/useCustomer";
import AddressSection from "../components/AddressSection";
import PaymentMethod from "../components/PaymentMethod";
import OrderSummary from "../components/OrderSummary";
import TrustBadgesV3 from "../components/TrustBadgesV3";
import SideAdBanner from "../components/SideAdBanner";
import ShoppingCartItemV3 from "../components/ShoppingCartItemV3";
import RecentlyViewed from "../components/RecentlyViewed";
import FavoritesSectionV3 from "../components/FavoritesSectionV3";
import type { PV3CardData } from "../../products/ProductTypes";
import type { PaymentProvidersType, ShoppingCartI } from "../ShoppingTypes";
import type { CustomerAddressType, GuestCreateOrderFormType } from "../../customers/CustomerTypes";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";

const BuyNowV3 = () => {
    document.title = "Iga Productos | Comprar ahora";

    const navigate = useNavigate();
    const location = useLocation();
    const { isAuth } = useAuthStore();
    const { order, createOrder, isLoading: orderLoading, error, clearError, clearErrorBadge, duplicateGuestEmail } = usePaymentStore();
    const { showTriggerAlert } = useTriggerAlert();

    const { "product-uuid": productUUID, sku } = useParams();
    const currentSku = sku?.toUpperCase() ?? "";
    const [searchParams, setSearchParams] = useSearchParams();
    const urlQuantity = parseInt(searchParams.get("quantity") || "1");

    const [selectedAddress, setSelectedAddress] = useState<CustomerAddressType | null>(null);
    const [paymentProvider, setPaymentProvider] = useState<PaymentProvidersType>(null);
    const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string | null>(null);
    const [guestAddressForm, setGuestAddressForm] = useState<GuestCreateOrderFormType | null>(null);
    const [showGuestFormEdit, setShowGuestFormEdit] = useState<boolean>(false);
    const [localQuantity, setLocalQuantity] = useState(urlQuantity);

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

    const buyNowItem = useMemo<ShoppingCartI>(() => ({
        item: { productUUID: productUUID!, sku: currentSku },
        quantity: urlQuantity,
        isChecked: true,
    }), [productUUID, currentSku, urlQuantity]);

    const { data, isLoading, error: fetchError, refetch } = useFetchBuyNowItemV3({
        item: buyNowItem,
        destination: destination ?? undefined,
        city: destinationCity,
        state: destinationState,
    });

    const { data: addresses } =
        useFetchCustomerAddresses({ pagination: { page: 1, limit: 10 } });

    const cardsMap = useMemo(() => {
        if (!data?.cards) return new Map<string, PV3CardData>();
        return new Map(data.cards.map(c => [c.version.sku.toLowerCase(), c]));
    }, [data]);

    const singleItem = useMemo(() => data?.shoppingCart?.[0] ?? null, [data]);

    // Sync local quantity when URL changes
    useEffect(() => {
        setLocalQuantity(urlQuantity);
    }, [urlQuantity]);

    // Sync local quantity from server response (handles stock limits)
    useEffect(() => {
        const item = data?.shoppingCart?.[0];
        if (item) {
            const serverQty = Number(item.quantity);
            if (!isNaN(serverQty) && serverQty !== localQuantity) {
                setLocalQuantity(serverQty);
            }
        }
    }, [data, localQuantity]);

    useEffect(() => {
        if (order) navigate("/pagar-productos");
    }, [order, navigate]);

    useEffect(() => clearError(), [location.pathname, clearError]);

    useEffect(() => {
        if (!addresses) return;
        const defaultAddress = addresses.data.find(a => a.defaultAddress === true);
        if (defaultAddress) setSelectedAddress(defaultAddress);
    }, [addresses]);

    const debouncedSetSearchParams = useDebounceCallback((q: number) => {
        setSearchParams({ quantity: q.toString() }, { replace: true });
    }, 500);

    const handleQuantityChange = (newQty: number) => {
        const qty = Number(newQty);
        if (isNaN(qty) || qty < 1) return;
        setLocalQuantity(qty);
        debouncedSetSearchParams(qty);
    };

    if (isLoading) {
        return (
            <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200 flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <span className="loading loading-spinner loading-lg text-primary" />
                <div className="text-center">
                    <p className="text-lg font-bold text-base-content">Cargando producto</p>
                    <p className="text-sm text-base-content/50 mt-1">Estamos preparando tu compra...</p>
                </div>
            </div>
        );
    }

    if (fetchError || !data || !data.shoppingCart || data.shoppingCart.length === 0) {
        return (
            <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200 flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center">
                    <MdShoppingBag className="text-error text-3xl" />
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-base-content">Ocurrió un error inesperado</p>
                    <p className="text-sm text-base-content/50 mt-1">No pudimos obtener la información del producto</p>
                </div>
                <button onClick={() => refetch()} className="btn btn-primary btn-sm gap-2">
                    Intentar de nuevo
                </button>
            </div>
        );
    }

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
        const currentItem: ShoppingCartI = {
            item: { productUUID: productUUID!, sku: currentSku },
            quantity: localQuantity,
            isChecked: true,
        };
        if (isAuth && selectedAddress) {
            const ok = await createOrder({
                buyNowItem: currentItem,
                addressUUID: selectedAddress.uuid,
                paymentProvider,
                couponCode: couponCode || undefined,
            });
            if (!ok) {
                showTriggerAlert("OrderError", usePaymentStore.getState().error ?? "No pudimos procesar tu pago, intenta nuevamente.", { duration: 4000 });
            }
            return;
        }
        if (!isAuth && guestAddressForm && guestAddressForm.consent) {
            const ok = await createOrder({
                buyNowItem: currentItem,
                guestForm: guestAddressForm,
                paymentProvider,
                couponCode: couponCode || undefined,
            });
            if (!ok) {
                showTriggerAlert("OrderError", usePaymentStore.getState().error ?? "No pudimos procesar tu pago, intenta nuevamente.", { duration: 4000 });
            }
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

    const cardData = singleItem ? cardsMap.get(singleItem.item.sku.toLowerCase()) as PV3CardData | undefined : undefined;

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
                                Comprar ahora
                            </h1>
                            {!isAuth && (
                                <div className="tooltip tooltip-bottom" data-tip="Estás comprando como invitado. Solo la información del pedido será persistida.">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-warning/50 text-warning-content text-xs font-bold tracking-widest uppercase cursor-help">
                                        <FaUserShield className="text-[10px]" />
                                        Invitado
                                    </span>
                                </div>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                            Finaliza tu compra de forma rápida y segura
                        </p>
                    </div>
                </div>

                <section className="w-full flex flex-col lg:flex-row gap-5">
                    {/* Left Column: Address → Payment → Product */}
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
                        <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                            <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                                    <FaShoppingBag className="text-primary" />
                                    Producto (1)
                                </h2>
                            </div>
                            <div className="flex flex-col divide-y divide-base-200">
                                {singleItem && cardData && (
                                    <div className="p-3 sm:p-4">
                                        <ShoppingCartItemV3
                                            cartItem={singleItem}
                                            cardData={cardData}
                                            stockLimit={cardData.version.stock ?? 0}
                                            onRemoveItem={() => { }}
                                            onUpdateQty={(item) => handleQuantityChange(item.quantity)}
                                            isAuth={isAuth}
                                            isBuyNow
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <RecentlyViewed excludeSkus={[currentSku]} />
                        <FavoritesSectionV3 />
                    </div>

                    {/* Right Column: Summary + Trust Badges */}
                    <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4">
                        <OrderSummary
                            allItems={singleItem ? [singleItem] : []}
                            handleCart={{ data }}
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
            </div>
        </div>
    );
};

export default BuyNowV3;