import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../auth/states/authStore";
import { usePaymentStore } from "../states/paymentStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useHandleShoppingCartV3 } from "./handleShoppingCartV3";
import { useFetchCustomerAddresses } from "../../customers/hooks/useCustomer";
import type { PV3CardData } from "../../products/ProductTypes";
import type { PaymentProvidersType } from "../ShoppingTypes";
import type { CustomerAddressType, GuestCreateOrderFormType } from "../../customers/CustomerTypes";

/* Controlador de la página del carrito V3: toda la lógica (estado, handlers,
   datos derivados) vive aquí, extraída verbatim del design original para que
   el orquestador sea solo composición de subcomponentes. */
export const useShoppingCartV3Controller = () => {
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

    return {
        navigate,
        isAuth,
        pendingOrder,
        destination,
        isSubmitDisabled,
        handleCart,
        cardsMap,
        allItems,
        addressSectionRef,

        selectedAddress,
        handleSetSelectedAddress,
        showGuestForm,
        setShowGuestForm,
        showGuestFormEdit,
        setShowGuestFormEdit,
        guestAddressForm,
        handleGuestFormSave,
        clearErrorBadge,

        paymentProvider,
        setPaymentProvider,

        couponCode,
        setCouponCode,
        orderLoading,
        error,
        handleCreateOrder,
        handlePendingPayment,
        handleOpenAddress,
    };
};

export type ShoppingCartV3Controller = ReturnType<typeof useShoppingCartV3Controller>;
