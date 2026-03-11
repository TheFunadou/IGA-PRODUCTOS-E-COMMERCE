import { Link, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SiMercadopago } from "react-icons/si";
import { useAuthStore } from "../../auth/states/authStore";
import { usePaymentStore } from "../states/paymentStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useFetchCustomerAddresses } from "../../customers/hooks/useCustomer";
import { formatPrice } from "../../products/Helpers";
import { calcShippingCost, closeModal, showModal } from "../../../global/GlobalHelpers";
import GuestAdvertisement from "../components/GuestAdvertisement";
import AddressesModal from "../components/AddressesModal";
import type { PaymentProvidersType } from "../ShoppingTypes";
import type { CustomerAddressType, GuestFormType } from "../../customers/CustomerTypes";
import GuestAddressFormModal from "../components/GuestAddressFormModal";
import clsx from "clsx";
import { useThemeStore } from "../../../layouts/states/themeStore";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useFetchBuyNowItem } from "../../orders/hooks/useFetchOrders";
import {
    FaLock,
    FaMapMarkerAlt,
    FaShippingFast,
    FaUserAlt,
    FaTag,
    FaGift,
    FaStar,
    FaUserPlus,
    FaShoppingBag,
    FaMinus,
    FaPlus,
} from "react-icons/fa";
import { MdShoppingBag, MdCheckBox } from "react-icons/md";
import ShoppingCartItem from "../components/ShoppingCartItem";

// ── Types ────────────────────────────────────────────────────────────────────

type GuestCheckoutForm = {
    first_name: string;
    last_name: string;
    email: string;
    country: string;
    state: string;
    city: string;
    locality: string;
    neighborhood: string;
    street: string;
    ext_number: string;
    int_number?: string;
    consent: boolean;
};

// ── Guest Form Component ─────────────────────────────────────────────────────

interface GuestCheckoutFormProps {
    onSave: (data: GuestCheckoutForm) => void;
}

const GuestCheckoutFormComponent = ({ onSave }: GuestCheckoutFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<GuestCheckoutForm>();

    const inputClass = (hasError: boolean) =>
        clsx(
            "input input-sm sm:input-md w-full text-sm border rounded-lg bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
            hasError ? "border-error" : "border-base-300"
        );

    return (
        <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-5">
            {/* Personal Data */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <FaUserAlt className="text-primary text-sm" />
                    <h3 className="text-sm font-bold text-base-content uppercase">Datos personales</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Nombre(s) *</label>
                        <input
                            {...register("first_name", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/, message: "Solo letras, 2-50 caracteres" },
                            })}
                            placeholder="Juan"
                            className={inputClass(!!errors.first_name)}
                        />
                        {errors.first_name && <p className="text-error text-xs mt-1">{errors.first_name.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Apellidos *</label>
                        <input
                            {...register("last_name", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,80}$/, message: "Solo letras, 2-80 caracteres" },
                            })}
                            placeholder="García López"
                            className={inputClass(!!errors.last_name)}
                        />
                        {errors.last_name && <p className="text-error text-xs mt-1">{errors.last_name.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="text-xs text-base-content/60 mb-1 block">Correo electrónico *</label>
                        <input
                            {...register("email", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/, message: "Correo inválido" },
                            })}
                            type="email"
                            placeholder="juan@ejemplo.com"
                            className={inputClass(!!errors.email)}
                        />
                        {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
                    </div>
                </div>
            </div>

            {/* Address */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <FaMapMarkerAlt className="text-primary text-sm" />
                    <h3 className="text-sm font-bold text-base-content uppercase">Dirección de envío</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">País *</label>
                        <input
                            {...register("country", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,60}$/, message: "Nombre de país inválido" },
                            })}
                            placeholder="México"
                            className={inputClass(!!errors.country)}
                        />
                        {errors.country && <p className="text-error text-xs mt-1">{errors.country.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Estado *</label>
                        <input
                            {...register("state", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,60}$/, message: "Nombre de estado inválido" },
                            })}
                            placeholder="Jalisco"
                            className={inputClass(!!errors.state)}
                        />
                        {errors.state && <p className="text-error text-xs mt-1">{errors.state.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Ciudad *</label>
                        <input
                            {...register("city", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,80}$/, message: "Nombre de ciudad inválido" },
                            })}
                            placeholder="Guadalajara"
                            className={inputClass(!!errors.city)}
                        />
                        {errors.city && <p className="text-error text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Localidad *</label>
                        <input
                            {...register("locality", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s0-9]{2,80}$/, message: "Localidad inválida" },
                            })}
                            placeholder="Centro"
                            className={inputClass(!!errors.locality)}
                        />
                        {errors.locality && <p className="text-error text-xs mt-1">{errors.locality.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Colonia *</label>
                        <input
                            {...register("neighborhood", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s0-9]{2,100}$/, message: "Colonia inválida" },
                            })}
                            placeholder="Colonia Americana"
                            className={inputClass(!!errors.neighborhood)}
                        />
                        {errors.neighborhood && <p className="text-error text-xs mt-1">{errors.neighborhood.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Calle *</label>
                        <input
                            {...register("street", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s0-9.#°',-]{2,120}$/, message: "Calle inválida" },
                            })}
                            placeholder="Av. Juárez"
                            className={inputClass(!!errors.street)}
                        />
                        {errors.street && <p className="text-error text-xs mt-1">{errors.street.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Número exterior *</label>
                        <input
                            {...register("ext_number", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-Z0-9\-]{1,10}$/, message: "Número inválido (máx. 10 caracteres)" },
                            })}
                            placeholder="123"
                            className={inputClass(!!errors.ext_number)}
                        />
                        {errors.ext_number && <p className="text-error text-xs mt-1">{errors.ext_number.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">
                            Número interior <span className="text-base-content/40">(opcional)</span>
                        </label>
                        <input
                            {...register("int_number", {
                                pattern: { value: /^[a-zA-Z0-9\-]{0,10}$/, message: "Número inválido" },
                            })}
                            placeholder="Depto. 4B"
                            className={inputClass(!!errors.int_number)}
                        />
                        {errors.int_number && <p className="text-error text-xs mt-1">{errors.int_number.message}</p>}
                    </div>
                </div>
            </div>

            {/* Consent */}
            <div className={clsx(
                "flex items-start gap-3 p-3 rounded-xl border",
                errors.consent ? "border-error bg-error/5" : "border-base-300 bg-base-200"
            )}>
                <input
                    type="checkbox"
                    {...register("consent", { required: "Debes aceptar el consentimiento para continuar" })}
                    className="checkbox checkbox-primary checkbox-sm mt-0.5 flex-shrink-0"
                />
                <div>
                    <p className="text-xs text-base-content/70 leading-relaxed">
                        Acepto el tratamiento de mis datos personales conforme al aviso de privacidad y autorizo el uso de mi información para procesar este pedido y enviarme actualizaciones relacionadas.
                    </p>
                    {errors.consent && <p className="text-error text-xs mt-1">{errors.consent.message}</p>}
                </div>
            </div>

            <button type="submit" className="btn btn-primary btn-sm sm:btn-md w-full gap-2 font-bold">
                <FaShippingFast />
                Guardar y continuar con envío
            </button>
        </form>
    );
};

// ── Auth Prompt Component ────────────────────────────────────────────────────

interface AuthPromptProps {
    onContinueAsGuest: () => void;
}

const AuthPrompt = ({ onContinueAsGuest }: AuthPromptProps) => (
    <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
        <div className="px-4 py-3 bg-base-200 border-b border-base-300">
            <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" />
                Dirección de envío
            </h2>
        </div>
        <div className="p-5 flex flex-col gap-5">
            {/* Sign in CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FaUserPlus className="text-primary text-lg" />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-base-content text-sm sm:text-base">¿Ya tienes cuenta? Inicia sesión</p>
                    <p className="text-xs text-base-content/50 mt-0.5">Accede a tus direcciones guardadas y completa tu compra más rápido</p>
                </div>
                <Link to="/iniciar-sesion" className="btn btn-primary btn-sm flex-shrink-0 w-full sm:w-auto">
                    Iniciar sesión
                </Link>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-base-300" />
                <span className="text-xs text-base-content/40 font-medium">o</span>
                <div className="flex-1 h-px bg-base-300" />
            </div>

            {/* Guest benefits warning */}
            <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                <div className="flex items-start gap-3">
                    <FaGift className="text-warning text-lg flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-base-content mb-1.5">
                            ¡No te pierdas estos beneficios al registrarte!
                        </p>
                        <ul className="flex flex-col gap-1.5">
                            {[
                                { icon: <FaStar className="text-warning text-xs" />, text: "Acumula puntos con cada compra y canjéalos por productos" },
                                { icon: <FaShoppingBag className="text-primary text-xs" />, text: "Guarda tus direcciones y agiliza futuros pedidos" },
                                { icon: <MdCheckBox className="text-info text-xs" />, text: "Historial completo de pedidos y seguimiento de envíos" },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="mt-0.5 flex-shrink-0">{item.icon}</span>
                                    <span className="text-xs text-base-content/70">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Continue as guest */}
            <button
                type="button"
                onClick={onContinueAsGuest}
                className="btn btn-ghost btn-sm border border-base-300 hover:bg-base-200 gap-2 text-base-content/60 w-full"
            >
                <FaUserAlt className="text-xs" />
                Continuar como invitado
            </button>
        </div>
    </div>
);

// ── Order Summary Panel ──────────────────────────────────────────────────────

interface OrderSummaryPanelProps {
    subtotalBeforeIva: number;
    iva: number;
    shippingCost: number;
    boxQty: number;
    discount: number;
    total: number;
    quantity: number;
    couponCode: string | null;
    onCouponChange: (code: string) => void;
    paymentMethod: PaymentProvidersType;
    onPaymentMethodChange: (method: PaymentProvidersType) => void;
    onCreateOrder: () => void;
    orderLoading: boolean;
    theme: string;
}

const OrderSummaryPanel = ({
    subtotalBeforeIva, iva, shippingCost, boxQty, discount, total,
    quantity, couponCode, onCouponChange,
    paymentMethod, onPaymentMethodChange, onCreateOrder, orderLoading, theme,
}: OrderSummaryPanelProps) => (
    <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden sticky top-5">
        {/* Header */}
        <div className="px-4 py-3 bg-base-200 border-b border-base-300">
            <h2 className="text-sm font-bold text-base-content uppercase">Resumen del pedido</h2>
        </div>

        <div className="p-4 flex flex-col gap-4">
            {/* Price breakdown */}
            <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-base-content/60">Subtotal ({quantity} {quantity === 1 ? "pieza" : "piezas"})</span>
                    <span className="font-medium">${formatPrice(subtotalBeforeIva.toString(), "es-MX")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-base-content/60">IVA (16%)</span>
                    <span className="font-medium flex items-center gap-0.5">
                        <BiPlus className="text-xs" />${formatPrice(iva.toString(), "es-MX")}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm rounded-lg bg-base-200 px-3 py-2">
                    <span className="flex items-center gap-1.5 text-base-content/70">
                        <FaShippingFast className="text-primary text-sm" />
                        Envío ({boxQty} {boxQty === 1 ? "caja" : "cajas"})
                    </span>
                    <span className="font-medium flex items-center gap-0.5">
                        <BiPlus className="text-xs" />${formatPrice(shippingCost.toString(), "es-MX")}
                    </span>
                </div>
                {discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-primary font-bold flex items-center gap-1.5">
                            <FaTag className="text-xs" />
                            Descuento
                        </span>
                        <span className="text-primary font-bold flex items-center gap-0.5">
                            <BiMinus className="text-xs" />${formatPrice(discount.toString(), "es-MX")}
                        </span>
                    </div>
                )}
            </div>

            {/* Total */}
            <div className="border-t border-base-300 pt-3 flex items-center justify-between">
                <span className="text-sm sm:text-base font-bold text-base-content">Total estimado</span>
                <span className="text-lg sm:text-xl font-extrabold text-primary">
                    ${formatPrice(total.toString(), "es-MX")}
                </span>
            </div>

            {/* Coupon */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-base-content/60 uppercase flex items-center gap-1.5">
                    <FaTag className="text-xs text-primary" />
                    Cupón de descuento
                </label>
                <input
                    onChange={(e) => onCouponChange(e.target.value)}
                    type="text"
                    className="input input-sm w-full text-sm bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Introduce tu código"
                    defaultValue={couponCode ?? ""}
                />
            </div>

            {/* Payment method */}
            <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-base-content/60 uppercase">Método de pago</p>
                <label className={clsx(
                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                    paymentMethod === "mercado_pago"
                        ? "border-primary/40 bg-primary/5"
                        : "border-base-300 bg-base-200 hover:border-primary/30"
                )}>
                    <input
                        type="radio"
                        name="payment_method"
                        className="radio radio-primary radio-sm"
                        onClick={() => onPaymentMethodChange("mercado_pago")}
                    />
                    <div className="flex flex-col gap-0.5">
                        <span className={clsx(
                            "flex items-center gap-1.5 font-bold text-sm",
                            theme === "ligth" ? "text-blue-500" : "text-base-content"
                        )}>
                            <SiMercadopago className="text-2xl" />
                            Mercado Pago
                        </span>
                        <span className="text-[10px] text-base-content/50">
                            Crédito, débito, OXXO, MSI y más
                        </span>
                    </div>
                </label>
            </div>

            {/* CTA */}
            <button
                className="w-full btn btn-primary font-bold gap-2 mt-1"
                disabled={paymentMethod === null || orderLoading}
                onClick={onCreateOrder}
            >
                {orderLoading
                    ? <span className="loading loading-spinner loading-sm" />
                    : <FaLock className="text-sm" />
                }
                {orderLoading ? "Procesando..." : "Proceder al pago"}
            </button>

            <p className="text-center text-[10px] text-base-content/30 flex items-center justify-center gap-1">
                <FaLock className="text-[8px]" /> Pago seguro y encriptado
            </p>
        </div>
    </div>
);

// ── Main Component ───────────────────────────────────────────────────────────

const BuyNow = () => {
    document.title = "Iga Productos | Comprar ahora";

    const IVA = 0.16;

    const { theme } = useThemeStore();
    const { isAuth } = useAuthStore();
    const { order, createOrder, isLoading: orderLoading, buyNow } = usePaymentStore();
    const { showTriggerAlert } = useTriggerAlert();

    const { data, isLoading, error, refetch } = useFetchBuyNowItem({ sku: buyNow?.sku });

    const [quantity, setQuantity] = useState<number>(buyNow?.quantity ?? 1);
    const [selectedAddress, setSelectedAddress] = useState<CustomerAddressType | null>(null);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [boxQty, setBoxQty] = useState<number>(1);
    const [paymentMethod, setPaymentMethod] = useState<PaymentProvidersType>(null);
    const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string | null>(null);
    const [guestAddressForm, setGuestAddressForm] = useState<GuestFormType | null>(null);
    const [discount, setDiscount] = useState<number>(0);
    const [subtotalWithDisc, setSubtotalWithDisc] = useState<number>(0);
    const [subtotalBeforeIva, setSubtotalBeforeIva] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [iva, setIva] = useState<number>(0);

    const guestAdvertisementModal = useRef<HTMLDialogElement>(null);
    const addressesModal = useRef<HTMLDialogElement>(null);
    const guestAddressFormModal = useRef<HTMLDialogElement>(null);

    const {
        data: addresses,
        isLoading: addressesLoading,
        error: addressesError,
        refetch: addressesRefetch,
    } = useFetchCustomerAddresses({ pagination: { page: 1, limit: 10 } });

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
            ? (parseFloat(data.product_version.unit_price) - parseFloat(data.product_version.unit_price_with_discount)) * quantity
            : 0;
        const ivaCalc = subtotal * IVA;
        const subtotalBefore = subtotal - ivaCalc;
        const subtotalWithDiscount = subtotal - discountValue;
        const totalCalc = subtotalWithDiscount + shipping;
        setSubtotalBeforeIva(subtotalBefore);
        setDiscount(discountValue);
        setIva(ivaCalc);
        setSubtotalWithDisc(subtotalWithDiscount);
        setTotal(totalCalc);
    }, [data, quantity]);

    useEffect(() => { calcShipping(); }, [quantity]);

    // ── Guards (after all hooks) ──
    if (!buyNow) return <Navigate to="/" />;

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

    if (error) {
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

    if (!data) throw new Error("No se pudo obtener la información del producto");
    if (order) return <Navigate to="/pagar-productos" />;

    // ── Handlers ──

    const handleSetSelectedAddress = (selected: CustomerAddressType) => setSelectedAddress(selected);

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
            shopping_cart: [{ product: data.product_version.sku, quantity }],
            address: selectedAddress.uuid,
            payment_method: paymentMethod,
            coupon_code: couponCode || undefined,
        });
    };

    const handleGuestFormSave = (savedData: GuestCheckoutForm) => {
        setGuestAddressForm(savedData as unknown as GuestFormType);
    };

    const handleUpdateQuantity = (values: { sku: string; newQuantity: number }) => {
        const newQty = Math.min(values.newQuantity, data.product_version.stock);
        setQuantity(Math.max(1, newQty));
    };

    const orderSummaryProps: OrderSummaryPanelProps = {
        subtotalBeforeIva, iva, shippingCost, boxQty, discount, total,
        quantity, couponCode,
        onCouponChange: setCouponCode,
        paymentMethod,
        onPaymentMethodChange: setPaymentMethod,
        onCreateOrder: handleCreateOrder,
        orderLoading: orderLoading ?? false,
        theme: theme!,
    };

    return (
        <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MdShoppingBag className="text-primary text-lg sm:text-xl" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                        Comprar ahora
                    </h1>
                    <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                        Revisa tu pedido antes de pagar
                    </p>
                </div>
            </div>

            <section className="w-full flex flex-col lg:flex-row gap-5">

                {/* ── Left Column ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-5">

                    {/* Address Section */}
                    {isAuth ? (
                        <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                            <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                                <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" />
                                    Dirección de envío
                                </h2>
                            </div>
                            <div className="p-4 sm:p-5">
                                {addressesLoading && !addresses && !addressesError && (
                                    <div className="flex items-center gap-3 py-4">
                                        <span className="loading loading-spinner loading-sm text-primary" />
                                        <span className="text-sm text-base-content/60">Cargando direcciones...</span>
                                    </div>
                                )}

                                {!addressesLoading && !addressesError && selectedAddress && (
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="flex-1">
                                            <p className="text-base sm:text-lg font-extrabold text-base-content">
                                                {selectedAddress.recipient_name} {selectedAddress.recipient_last_name}
                                                <span className="ml-2 badge badge-sm badge-primary badge-outline">{selectedAddress.address_type}</span>
                                            </p>
                                            <p className="text-sm text-base-content/70 mt-1">
                                                {selectedAddress.country_phone_code} {selectedAddress.contact_number}
                                            </p>
                                            <p className="text-sm text-base-content/60 mt-0.5 leading-relaxed">
                                                {`${selectedAddress.street_name} #${selectedAddress.number}${selectedAddress.aditional_number !== "N/A" ? ` Int. ${selectedAddress.aditional_number}` : ""}, ${selectedAddress.neighborhood}, ${selectedAddress.zip_code}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`}
                                            </p>
                                            {selectedAddress.default_address && (
                                                <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-bold">
                                                    <MdCheckBox /> Dirección predeterminada
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm border border-base-300 hover:bg-base-200 text-xs flex-shrink-0 gap-1.5"
                                            onClick={() => showModal(addressesModal.current)}
                                        >
                                            <FaMapMarkerAlt className="text-primary text-xs" />
                                            Cambiar dirección
                                        </button>
                                    </div>
                                )}

                                {!addressesLoading && !addresses && addressesError && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm text-base-content/70">Error al cargar las direcciones de envío</p>
                                        <button type="button" className="btn btn-primary btn-sm w-fit" onClick={() => addressesRefetch()}>
                                            Reintentar
                                        </button>
                                    </div>
                                )}

                                {!addressesLoading && addresses && addresses.data.length === 0 && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-semibold text-base-content">No tienes direcciones de envío registradas</p>
                                        <Link to="/mi-cuenta/direcciones-de-envio" className="text-primary text-sm underline underline-offset-2 hover:opacity-70 transition-opacity">
                                            Crea una nueva dirección ahora
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        !showGuestForm ? (
                            <AuthPrompt onContinueAsGuest={() => setShowGuestForm(true)} />
                        ) : (
                            <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                                <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                                        <FaUserAlt className="text-primary text-xs" />
                                        Datos de envío (Invitado)
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowGuestForm(false)}
                                        className="text-xs text-base-content/50 hover:text-primary transition-colors underline underline-offset-2"
                                    >
                                        Volver
                                    </button>
                                </div>
                                <div className="p-4 sm:p-5">
                                    <GuestCheckoutFormComponent onSave={handleGuestFormSave} />
                                </div>
                            </div>
                        )
                    )}

                    {/* Product */}
                    <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                        <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                            <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                                <MdShoppingBag className="text-primary" />
                                Producto seleccionado
                            </h2>
                        </div>

                        <div className="flex flex-col divide-y divide-base-200">
                            <div className="p-3 sm:p-4">
                                <ShoppingCartItem
                                    data={data}
                                    onUpdateQty={handleUpdateQuantity}
                                    isAuth={isAuth ?? false}
                                />
                            </div>

                            {/* Quantity control */}
                            <div className="px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-base-content/60">Cantidad:</span>
                                    <div className="flex items-center gap-1 rounded-lg border border-base-300 bg-base-200 p-0.5">
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-xs rounded-md"
                                            disabled={quantity <= 1}
                                            onClick={() => handleUpdateQuantity({ sku: data.product_version.sku, newQuantity: quantity - 1 })}
                                        >
                                            <FaMinus className="text-xs" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-xs rounded-md"
                                            disabled={quantity >= data.product_version.stock}
                                            onClick={() => handleUpdateQuantity({ sku: data.product_version.sku, newQuantity: quantity + 1 })}
                                        >
                                            <FaPlus className="text-xs" />
                                        </button>
                                    </div>
                                    <span className="text-xs text-base-content/40">
                                        {data.product_version.stock} disponibles
                                    </span>
                                </div>
                            </div>

                            {/* Subtotal footer */}
                            <div className="px-4 py-3 bg-base-200 flex items-center justify-between">
                                <span className="text-sm text-base-content/60">
                                    Subtotal ({quantity} {quantity === 1 ? "pieza" : "piezas"})
                                </span>
                                <span className="text-base sm:text-lg font-extrabold text-base-content">
                                    ${formatPrice(subtotalWithDisc.toString(), "es-MX")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Order Summary */}
                    <div className="lg:hidden">
                        <OrderSummaryPanel {...orderSummaryProps} />
                    </div>
                </div>

                {/* ── Right Column ── */}
                <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                    <div className="hidden lg:block">
                        <OrderSummaryPanel {...orderSummaryProps} />
                    </div>
                </div>
            </section>

            {/* Modals */}
            <GuestAdvertisement refName={guestAdvertisementModal} onResponse={modalResponse} />
            {addresses && selectedAddress && (
                <AddressesModal
                    ref={addressesModal}
                    addresses={addresses.data}
                    onSetSelected={handleSetSelectedAddress}
                    selectedAddress={selectedAddress}
                    onClose={() => closeModal(addressesModal.current)}
                />
            )}
            <GuestAddressFormModal
                ref={guestAddressFormModal}
                onClose={() => closeModal(guestAddressFormModal.current)}
                title={guestAddressForm ? "Editar dirección" : "Agregar dirección"}
                onSave={handleGuestFormSave as any}
            />
        </div>
    );
};

export default BuyNow;