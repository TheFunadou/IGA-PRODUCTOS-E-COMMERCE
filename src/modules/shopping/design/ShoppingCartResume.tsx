import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { SiMercadopago } from "react-icons/si";
import { useAuthStore } from "../../auth/states/authStore";
import { usePaymentStore } from "../states/paymentStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useFetchCustomerAddresses } from "../../customers/hooks/useCustomer";
import { closeModal, showModal } from "../../../global/GlobalHelpers";
import GuestAdvertisement from "../components/GuestAdvertisement";
import AddressesModal from "../components/AddressesModal";
import type { PaymentProvidersType } from "../ShoppingTypes";
import type { CustomerAddressType, GuestCreateOrderFormType } from "../../customers/CustomerTypes";
import GuestAddressFormModal from "../components/GuestAddressFormModal";
import clsx from "clsx";
import { useThemeStore } from "../../../layouts/states/themeStore";
import { useHandleShoppingCart } from "../hooks/handleShoppingCart";
import { BiMinus, BiPlus } from "react-icons/bi";
import ShoppingCartItemV2 from "../components/ShoppingCartItem";
import CountriesAreaCodesJSON from "../../../global/json/CountriesAreaCodes.json";
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
    FaExclamationTriangle,
} from "react-icons/fa";
import { MdShoppingBag, MdCheckBox } from "react-icons/md";
import type { CountriesPhoneCodeType } from "../../../global/GlobalTypes";
import type { ProductVersionCardI } from "../../products/ProductTypes";

interface GuestCheckoutFormProps {
    onSave: (data: GuestCreateOrderFormType) => void;
    guestAddress?: GuestCreateOrderFormType | null;
}

const GuestCheckoutFormComponent = ({ onSave, guestAddress }: GuestCheckoutFormProps) => {

    const defaultCountry: CountriesPhoneCodeType = {
        nameES: "México",
        nameEN: "Mexico",
        iso2: "MX",
        iso3: "MEX",
        phoneCode: "+52",
    };

    const [country, setCountry] = useState<CountriesPhoneCodeType>(defaultCountry);
    const [currentCountryFlag, setCurrentCountryFlag] = useState<string>("https://flagsapi.com/MX/flat/64.png");

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<GuestCreateOrderFormType>({
        defaultValues: {
            consent: guestAddress?.consent || false,
            email: guestAddress?.email || "",
            firstName: guestAddress?.firstName || "",
            lastName: guestAddress?.lastName || "",
            recipientName: guestAddress?.recipientName || "",
            recipientLastName: guestAddress?.recipientLastName || "",
            country: guestAddress?.country || "",
            state: guestAddress?.state || "",
            city: guestAddress?.city || "",
            locality: guestAddress?.locality || "",
            neighborhood: guestAddress?.neighborhood || "",
            streetName: guestAddress?.streetName || "",
            number: guestAddress?.number || "",
            aditionalNumber: guestAddress?.aditionalNumber || undefined,
            zipCode: guestAddress?.zipCode || "",
            addressType: guestAddress?.addressType || "Casa",
            floor: guestAddress?.floor || undefined,
            countryPhoneCode: guestAddress?.countryPhoneCode || "+52",
            contactNumber: guestAddress?.contactNumber || "",
            referencesOrComments: guestAddress?.referencesOrComments || undefined,
        },
    });

    useEffect(() => {
        setCurrentCountryFlag(`https://flagsapi.com/${country.iso2}/flat/64.png`);
        setValue("countryPhoneCode", country.phoneCode, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [country]);

    const inputClass = (hasError: boolean) =>
        clsx(
            "input input-sm sm:input-md w-full text-sm border rounded-lg bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
            hasError ? "border-error" : "border-base-300"
        );

    const selectClass = (hasError: boolean) =>
        clsx(
            "select select-sm sm:select-md w-full text-sm border rounded-lg bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
            hasError ? "border-error" : "border-base-300"
        );

    return (
        <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-5">
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <FaUserAlt className="text-primary text-sm" />
                    <h3 className="text-sm font-bold text-base-content uppercase">Datos personales</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Nombre(s) *</label>
                        <input
                            {...register("firstName", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/, message: "Solo letras, 2-50 caracteres" },
                            })}
                            placeholder="Juan"
                            className={inputClass(!!errors.firstName)}
                        />
                        {errors.firstName && <p className="text-error text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Apellidos *</label>
                        <input
                            {...register("lastName", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,80}$/, message: "Solo letras, 2-80 caracteres" },
                            })}
                            placeholder="García López"
                            className={inputClass(!!errors.lastName)}
                        />
                        {errors.lastName && <p className="text-error text-xs mt-1">{errors.lastName.message}</p>}
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

            <div>
                <div className="flex items-center gap-2 mb-3">
                    <FaUserAlt className="text-primary text-sm" />
                    <h3 className="text-sm font-bold text-base-content uppercase">Datos del destinatario</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Nombre del destinatario *</label>
                        <input
                            {...register("recipientName", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/, message: "Solo letras, 2-50 caracteres" },
                            })}
                            placeholder="Juan"
                            className={inputClass(!!errors.recipientName)}
                        />
                        {errors.recipientName && <p className="text-error text-xs mt-1">{errors.recipientName.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Apellidos del destinatario *</label>
                        <input
                            {...register("recipientLastName", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,80}$/, message: "Solo letras, 2-80 caracteres" },
                            })}
                            placeholder="García López"
                            className={inputClass(!!errors.recipientLastName)}
                        />
                        {errors.recipientLastName && <p className="text-error text-xs mt-1">{errors.recipientLastName.message}</p>}
                    </div>

                    <div className="sm:col-span-2">
                        <label className="text-xs text-base-content/60 mb-1 block">Teléfono de contacto *</label>
                        <div className="flex gap-2 items-center">
                            <figure className="w-8 sm:w-10 flex-shrink-0">
                                <img src={currentCountryFlag} alt={country.nameES} className="w-full h-auto" />
                            </figure>
                            <select
                                defaultValue={JSON.stringify(defaultCountry)}
                                className="w-20 sm:w-24 select select-sm sm:select-md text-xs sm:text-sm flex-shrink-0 border border-base-300 bg-base-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                onChange={(e) => setCountry(JSON.parse(e.target.value))}
                            >
                                {CountriesAreaCodesJSON.map((data, index) => (
                                    <option
                                        key={index}
                                        value={JSON.stringify({
                                            nameES: data.nameES,
                                            nameEN: data.nameEN,
                                            iso2: data.iso2,
                                            iso3: data.iso3,
                                            phoneCode: `+${data.phoneCode}`,
                                        })}
                                    >
                                        {data.iso3}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="tel"
                                {...register("contactNumber", {
                                    required: "Campo requerido",
                                    pattern: { value: /^\d{7,15}$/, message: "Solo números, 7-15 dígitos" },
                                })}
                                placeholder="3312345678"
                                className={clsx(inputClass(!!errors.contactNumber), "flex-1")}
                            />
                        </div>
                        {errors.contactNumber && (
                            <p className="text-error text-xs mt-1">{errors.contactNumber.message}</p>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-3">
                    <FaMapMarkerAlt className="text-primary text-sm" />
                    <h3 className="text-sm font-bold text-base-content uppercase">Dirección de envío</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Tipo de dirección *</label>
                        <select
                            {...register("addressType", { required: "Campo requerido" })}
                            className={selectClass(!!errors.addressType)}
                        >
                            <option value="Casa">Casa</option>
                            <option value="Departamento">Departamento</option>
                            <option value="Oficina">Oficina</option>
                        </select>
                        {errors.addressType && <p className="text-error text-xs mt-1">{errors.addressType.message}</p>}
                    </div>

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
                        <label className="text-xs text-base-content/60 mb-1 block">Código postal *</label>
                        <input
                            {...register("zipCode", {
                                required: "Campo requerido",
                                pattern: { value: /^\d{4,10}$/, message: "Código postal inválido" },
                            })}
                            placeholder="44100"
                            className={inputClass(!!errors.zipCode)}
                        />
                        {errors.zipCode && <p className="text-error text-xs mt-1">{errors.zipCode.message}</p>}
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
                            {...register("streetName", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s0-9.#°',-]{2,120}$/, message: "Calle inválida" },
                            })}
                            placeholder="Av. Juárez"
                            className={inputClass(!!errors.streetName)}
                        />
                        {errors.streetName && <p className="text-error text-xs mt-1">{errors.streetName.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Número exterior *</label>
                        <input
                            {...register("number", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-Z0-9\-]{1,10}$/, message: "Número inválido (máx. 10 caracteres)" },
                            })}
                            placeholder="123"
                            className={inputClass(!!errors.number)}
                        />
                        {errors.number && <p className="text-error text-xs mt-1">{errors.number.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">
                            Número interior <span className="text-base-content/40">(opcional)</span>
                        </label>
                        <input
                            {...register("aditionalNumber", {
                                pattern: { value: /^[a-zA-Z0-9\-]{0,10}$/, message: "Número inválido" },
                                setValueAs: (value) => value === "" ? undefined : value
                            })}
                            placeholder="Depto. 4B"
                            className={inputClass(!!errors.aditionalNumber)}
                        />
                        {errors.aditionalNumber && <p className="text-error text-xs mt-1">{errors.aditionalNumber.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">
                            Piso <span className="text-base-content/40">(opcional)</span>
                        </label>
                        <input
                            {...register("floor", {
                                pattern: { value: /^[a-zA-Z0-9\-\s]{0,10}$/, message: "Piso inválido" },
                                setValueAs: (value) => value === "" ? undefined : value
                            })}
                            placeholder="2"
                            className={inputClass(!!errors.floor)}
                        />
                        {errors.floor && <p className="text-error text-xs mt-1">{errors.floor.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="text-xs text-base-content/60 mb-1 block">
                            Referencias o comentarios <span className="text-base-content/40">(opcional)</span>
                        </label>
                        <input
                            {...register("referencesOrComments", {
                                maxLength: { value: 255, message: "Máximo 255 caracteres" },
                                setValueAs: (value) => value === "" ? undefined : value
                            })}
                            placeholder="Entre calles Reforma y Morelos, casa azul"
                            className={inputClass(!!errors.referencesOrComments)}
                        />
                        {errors.referencesOrComments && <p className="text-error text-xs mt-1">{errors.referencesOrComments.message}</p>}
                    </div>
                </div>
            </div>

            <div className={clsx(
                "flex items-start gap-3 p-3 rounded-xl border",
                errors.consent ? "border-error bg-error/5" : "border-base-300 bg-base-200"
            )}>
                <input
                    type="checkbox"
                    {...register("consent", {
                        required: "Debes aceptar el consentimiento para continuar"
                    })}
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

interface AuthPromptProps {
    onContinueAsGuest: () => void;
}

const AuthPrompt = ({ onContinueAsGuest }: AuthPromptProps) => {
    return (
        <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
            <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    Dirección de envío
                </h2>
            </div>

            <div className="p-5 flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FaUserPlus className="text-primary text-lg" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-base-content text-sm sm:text-base">¿Ya tienes cuenta? Inicia sesión</p>
                        <p className="text-xs text-base-content/50 mt-0.5">Accede a tus direcciones guardadas y completa tu compra más rápido</p>
                    </div>
                    <Link
                        to="/iniciar-sesion"
                        className="btn btn-primary btn-sm flex-shrink-0 w-full sm:w-auto"
                    >
                        Iniciar sesión
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-base-300" />
                    <span className="text-xs text-base-content/40 font-medium">o</span>
                    <div className="flex-1 h-px bg-base-300" />
                </div>

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
};

interface OrderSummaryProps {
    subtotalBeforeIva: string;
    iva: string;
    shippingCost: string;
    boxQty: number;
    discount: string;
    total: string;
    selectedProductsCount: number;
    couponCode: string | null;
    onCouponChange: (code: string) => void;
    paymentProvider: PaymentProvidersType;
    onPaymentProviderChange: (method: PaymentProvidersType) => void;
    onCreateOrder: () => void;
    orderLoading: boolean;
    theme: string;
    error: string | null;
}

const OrderSummaryPanel = ({
    subtotalBeforeIva, iva, shippingCost, boxQty, discount, total,
    selectedProductsCount, couponCode, onCouponChange,
    paymentProvider, onPaymentProviderChange, onCreateOrder, orderLoading, theme, error
}: OrderSummaryProps) => {
    return (
        <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden sticky top-5">
            <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                <h2 className="text-sm font-bold text-base-content uppercase">Resumen del pedido</h2>
            </div>

            <div className="p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <span className="text-base-content/60">Subtotal ({selectedProductsCount} {selectedProductsCount === 1 ? "producto" : "productos"})</span>
                            <p className="text-xs text-base-content/60">Antes de impuestos</p>
                        </div>
                        <span className="font-medium">${subtotalBeforeIva}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm rounded-lg bg-base-200 px-3 py-2">
                        <div>
                            <span className="flex items-center gap-1.5 text-base-content/70">
                                <FaShippingFast className="text-primary text-sm" />
                                Envío ({boxQty} {boxQty === 1 ? "caja" : "cajas"})
                            </span>
                            <p className="text-xs text-base-content/60">Antes de impuestos</p>
                        </div>
                        <span className="font-medium flex items-center gap-0.5"><BiPlus className="text-xs" />${shippingCost}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-base-content/60">IVA (16%)</span>
                        <span className="font-medium flex items-center gap-0.5"><BiPlus className="text-xs" />${iva}</span>
                    </div>
                    {parseFloat(discount) > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-primary font-bold flex items-center gap-1.5">
                                <FaTag className="text-xs" />
                                Descuento
                            </span>
                            <span className="text-primary font-bold flex items-center gap-0.5"><BiMinus className="text-xs" />${discount}</span>
                        </div>
                    )}
                </div>

                <div className="border-t border-base-300 pt-3 flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-base-content">Total estimado</span>
                    <span className="text-lg sm:text-xl font-extrabold text-primary">
                        ${total}
                    </span>
                </div>

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

                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold text-base-content/60 uppercase">Método de pago</p>
                    <label
                        className={clsx(
                            "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                            paymentProvider === "mercado_pago"
                                ? "border-primary/40 bg-primary/5"
                                : "border-base-300 bg-base-200 hover:border-primary/30"
                        )}
                    >
                        <input
                            type="radio"
                            name="payment_method"
                            className="radio radio-primary radio-sm"
                            onClick={() => onPaymentProviderChange("mercado_pago")}
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

                <button
                    className="w-full btn btn-primary font-bold gap-2 mt-1"
                    disabled={paymentProvider === null || orderLoading}
                    onClick={onCreateOrder}
                >
                    {orderLoading ? (
                        <span className="loading loading-spinner loading-sm" />
                    ) : (
                        <FaLock className="text-sm" />
                    )}
                    {orderLoading ? "Procesando..." : "Proceder al pago"}
                </button>

                {error && (
                    <div className="bg-soft alert alert-error">
                        <FaExclamationTriangle className="text-lg" />
                        <span>{error}</span>
                    </div>
                )}

                <p className="text-center text-[10px] text-base-content/30 flex items-center justify-center gap-1">
                    <FaLock className="text-[8px]" /> Pago seguro y encriptado
                </p>
            </div>
        </div>
    );
};

const ShoppingCartResumeV2 = () => {
    document.title = "Iga Productos | Resumen de carrito";

    const { theme } = useThemeStore();
    const navigate = useNavigate();
    const { isAuth, authCustomer } = useAuthStore();
    const { order, createOrder, isLoading: orderLoading, error, clearError } = usePaymentStore();
    const { showTriggerAlert } = useTriggerAlert();
    const location = useLocation();

    const handleCart = useHandleShoppingCart({
        isAuth,
        authCustomer,
        showTriggerAlert: (type, message, options) =>
            showTriggerAlert(type, message, options),
    });

    const [selectedAddress, setSelectedAddress] = useState<CustomerAddressType | null>(null);
    const [paymentProvider, setPaymentProvider] = useState<PaymentProvidersType>(null);
    const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string | null>(null);
    const [guestAddressForm, setGuestAddressForm] = useState<GuestCreateOrderFormType | null>(null);
    const [showGuestFormEdit, setShowGuestFormEdit] = useState<boolean>(false);

    const guestAdvertisementModal = useRef<HTMLDialogElement>(null);
    const addressesModal = useRef<HTMLDialogElement>(null);
    const guestAddressFormModal = useRef<HTMLDialogElement>(null);

    const { data: addresses, isLoading: addressesLoading, error: addressesError, refetch: addressesRefetch } =
        useFetchCustomerAddresses({ pagination: { page: 1, limit: 10 } });

    const selectedProducts = useMemo(() => {
        if (!handleCart.data?.shoppingCart) return [];
        return handleCart.data.shoppingCart.filter(item => item.isChecked === true);
    }, [handleCart.data]);

    const cardsMap = useMemo(() => {
        if (!handleCart.data?.cards) return new Map<string, ProductVersionCardI>();
        return new Map(
            handleCart.data.cards.map(c => [c.sku.toLowerCase(), c])
        );
    }, [handleCart.data]);

    useEffect(() => {
        if (handleCart.isLoading) return;
        if (!handleCart.data?.shoppingCart || handleCart.data.shoppingCart.length === 0 || selectedProducts.length < 1) {
            navigate("/carrito-de-compras");
        }
    }, [handleCart.isLoading, handleCart.data, selectedProducts, navigate]);

    useEffect(() => {
        if (order) navigate("/pagar-productos");
    }, [order, navigate]);

    const handleSetSelectedAddress = (selected: CustomerAddressType) => setSelectedAddress(selected);

    const modalResponse = (response: boolean) => {
        if (response) {
            guestAdvertisementModal.current?.close();
            setShowGuestForm(true);
        }
    };

    const handlePreValidation = () => {
        if (isAuth) {
            if (!selectedAddress) {
                showTriggerAlert("Message", "Seleccionar una dirección de envío para continuar.");
                return false;
            };
        };

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
    }

    const handleCreateOrder = async () => {
        if (!handlePreValidation()) return;

        if (!paymentProvider) {
            showTriggerAlert("Message", "Seleccionar un método de pago para continuar.");
            return;
        };

        if (isAuth && selectedAddress) {
            await createOrder({
                addressUUID: selectedAddress.uuid,
                paymentProvider,
                couponCode: couponCode || undefined,
            });
            return;
        };

        if (!isAuth && guestAddressForm && guestAddressForm.consent) {
            await createOrder({
                guestForm: guestAddressForm,
                paymentProvider,
                couponCode: couponCode || undefined,
            });
            return;
        }
    };

    const handleGuestFormSave = (data: GuestCreateOrderFormType) => {
        setGuestAddressForm(data);
        setShowGuestFormEdit(false);
    };

    useEffect(() => {
        if (!addresses) return;
        const defaultAddress = addresses.data.find(d => d.defaultAddress === true);
        if (defaultAddress) setSelectedAddress(defaultAddress);
    }, [addresses]);

    useEffect(() => clearError(), [location.pathname, clearError]);

    const orderSummaryProps: OrderSummaryProps = {
        subtotalBeforeIva: handleCart.data?.resume?.itemsSubtotalBeforeTaxes || "0.00",
        iva: handleCart.data?.resume?.iva || "0.00",
        shippingCost: handleCart.data?.resume?.shippingCostBeforeTaxes || "0.00",
        boxQty: handleCart.data?.resume?.boxesCount || 0,
        discount: handleCart.data?.resume?.discount || "0.00",
        total: handleCart.data?.resume?.total || "0.00",
        selectedProductsCount: selectedProducts.length,
        couponCode,
        onCouponChange: setCouponCode,
        paymentProvider,
        onPaymentProviderChange: setPaymentProvider,
        onCreateOrder: handleCreateOrder,
        orderLoading: orderLoading ?? false,
        theme: theme!,
        error
    };

    return (
        <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MdShoppingBag className="text-primary text-lg sm:text-xl" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                        Resumen del carrito
                    </h1>
                    <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                        Revisa tu pedido antes de pagar
                    </p>
                </div>
            </div>

            <section className="w-full flex flex-col lg:flex-row gap-5">
                <div className="flex-1 min-w-0 flex flex-col gap-5">
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
                                                {selectedAddress.recipientName} {selectedAddress.recipientLastName}
                                                <span className="ml-2 badge badge-sm badge-primary badge-outline">{selectedAddress.addressType}</span>
                                            </p>
                                            <p className="text-sm text-base-content/70 mt-1">
                                                {selectedAddress.countryPhoneCode} {selectedAddress.contactNumber}
                                            </p>
                                            <p className="text-sm text-base-content/60 mt-0.5 leading-relaxed">
                                                {`${selectedAddress.streetName} #${selectedAddress.number}${selectedAddress.aditionalNumber !== "N/A" && selectedAddress.aditionalNumber !== "" ? ` Int. ${selectedAddress.aditionalNumber}` : ""}, ${selectedAddress.neighborhood}, ${selectedAddress.zipCode}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`}
                                            </p>
                                            {selectedAddress.defaultAddress && (
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
                        ) : guestAddressForm && !showGuestFormEdit ? (
                            <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                                <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-primary" />
                                        Dirección de envío (Invitado)
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowGuestFormEdit(true)}
                                        className="text-xs text-base-content/50 hover:text-primary transition-colors underline underline-offset-2"
                                    >
                                        Editar
                                    </button>
                                </div>
                                <div className="p-4 sm:p-5 flex flex-col gap-2">
                                    <p className="text-base font-extrabold text-base-content">
                                        {guestAddressForm.firstName} {guestAddressForm.lastName}
                                    </p>
                                    <p className="text-sm text-base-content/70">{guestAddressForm.email}</p>
                                    <p className="text-sm text-base-content/60 leading-relaxed">
                                        {`${guestAddressForm.streetName} #${guestAddressForm.number}${guestAddressForm.aditionalNumber ? ` Int. ${guestAddressForm.aditionalNumber}` : ""}, ${guestAddressForm.neighborhood}, ${guestAddressForm.locality}, ${guestAddressForm.city}, ${guestAddressForm.state}, ${guestAddressForm.country}`}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-xs text-success font-bold mt-1">
                                        <MdCheckBox /> Dirección guardada correctamente
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                                <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                                        <FaUserAlt className="text-primary text-xs" />
                                        Datos de envío (Invitado)
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (guestAddressForm) {
                                                setShowGuestFormEdit(false);
                                            } else {
                                                setShowGuestForm(false);
                                            }
                                        }}
                                        className="text-xs text-base-content/50 hover:text-primary transition-colors underline underline-offset-2"
                                    >
                                        Volver
                                    </button>
                                </div>
                                <div className="p-4 sm:p-5">
                                    <GuestCheckoutFormComponent onSave={handleGuestFormSave} guestAddress={guestAddressForm} />
                                </div>
                            </div>
                        )
                    )}

                    <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                        <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                            <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                                <MdShoppingBag className="text-primary" />
                                Productos seleccionados
                            </h2>
                        </div>

                        <div className="flex flex-col divide-y divide-base-200">
                            {selectedProducts?.map((item, index) => {
                                const cardData = cardsMap.get(item.item.sku.toLowerCase());
                                if (!cardData) return null;
                                return (
                                    <div key={index} className="p-3 sm:p-4">
                                        <ShoppingCartItemV2
                                            cartItem={item}
                                            cardData={cardData!}
                                            stockLimit={cardData!.stock ?? 0}
                                            onToggleCheck={handleCart.toggleCheck}
                                            onRemoveItem={handleCart.removeItem}
                                            onUpdateQty={handleCart.setItem}
                                            isAuth={isAuth}
                                        />
                                    </div>
                                );
                            })}

                            <div className="px-4 py-3 bg-base-200 flex items-center justify-between">
                                <span className="text-sm text-base-content/60">
                                    Subtotal ({selectedProducts?.length ?? 0} {selectedProducts?.length === 1 ? "producto" : "productos"})
                                </span>
                                <span className="text-base sm:text-lg font-extrabold text-base-content">
                                    ${handleCart.data?.resume?.itemsSubtotal || "0.00"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:hidden">
                        <OrderSummaryPanel {...orderSummaryProps} />
                    </div>
                </div>

                <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                    <div className="hidden lg:block">
                        <OrderSummaryPanel {...orderSummaryProps} />
                    </div>
                </div>
            </section>

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

export default ShoppingCartResumeV2;
