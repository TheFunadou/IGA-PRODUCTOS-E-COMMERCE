import { useEffect, useState, type RefObject } from "react";
import CountriesAreaCodesJSON from "../../../global/json/CountriesAreaCodes.json"
import type { CountriesPhoneCodeType } from "../../../global/GlobalTypes";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { CustomerAddressType, NewAddressType, UpdateAddressType } from "../CustomerTypes";
import { getFormChanges } from "../../../global/GlobalHelpers";
import { useUpdateAddress } from "../hooks/useCustomer";
import {
    FaMapMarkerAlt,
    FaUserAlt,
    FaHome,
    FaBriefcase,
    FaStar,
    FaExclamationTriangle,
    FaEdit,
} from "react-icons/fa";
import { MdApartment, MdEditNote } from "react-icons/md";
import clsx from "clsx";

type Props = {
    versionData: CustomerAddressType | null;
    ref: RefObject<HTMLDialogElement | null>;
    address: string | undefined;
    customer: string | undefined;
    onUpdated: () => void;
};

/* ── Shared helpers (same as NewAddressForm) ───────────────────── */

const ADDRESS_TYPE_OPTIONS = [
    { value: "Casa", label: "Casa", icon: <FaHome className="text-xs" /> },
    { value: "Trabajo", label: "Trabajo", icon: <FaBriefcase className="text-xs" /> },
    { value: "Departamento", label: "Departamento", icon: <MdApartment className="text-sm" /> },
];

const inputCls = (hasError?: boolean, isModified?: boolean) =>
    clsx(
        "input input-sm sm:input-md w-full text-sm border rounded-lg",
        "bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
        hasError
            ? "border-error text-error"
            : isModified
                ? "border-success text-success"
                : "border-base-300"
    );

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary text-xs">{icon}</span>
        </div>
        <h3 className="text-xs font-bold text-base-content/60 uppercase tracking-wide">{title}</h3>
    </div>
);

const FieldError = ({ message }: { message?: string }) =>
    message ? (
        <p className="text-error text-xs mt-1 flex items-center gap-1">
            <FaExclamationTriangle className="text-[10px] flex-shrink-0" />
            {message}
        </p>
    ) : null;

/* ── Helper: compara un valor del form con el original ─────────── */
/**
 * Devuelve true si el campo ha cambiado respecto a versionData.
 * Normaliza undefined/null/"" como equivalentes a "N/A" en los campos opcionales.
 */
function isFieldModified(
    fieldName: keyof UpdateAddressType,
    watchedValue: unknown,
    versionData: CustomerAddressType | null,
    naFields: Array<keyof UpdateAddressType> = []
): boolean {
    if (!versionData) return false;

    const original = versionData[fieldName as keyof CustomerAddressType];

    // Para campos que en BD se guardan como "N/A" cuando están vacíos
    const watched = watchedValue === "" || watchedValue === undefined || watchedValue === null
        ? (naFields.includes(fieldName) ? "N/A" : watchedValue)
        : watchedValue;

    const orig = (original === "N/A" && naFields.includes(fieldName)) ? "N/A" : original;

    // Comparación estricta con coerción de tipo para números/strings
    return String(watched ?? "") !== String(orig ?? "");
}

/* ── Component ─────────────────────────────────────────────────── */

// Campos que en BD se almacenan como "N/A" si están vacíos
const NA_FIELDS: Array<keyof UpdateAddressType> = [
    "floor",
    "aditional_number",
    "references_or_comments",
];

const UpdateAddresssForm = ({ versionData, ref, address, onUpdated, customer }: Props) => {

    const defaultCountry: CountriesPhoneCodeType = {
        nameES: "México",
        nameEN: "Mexico",
        iso2: "MX",
        iso3: "MEX",
        phoneCode: "+52",
    };

    const [country, setCountry] = useState<CountriesPhoneCodeType>(defaultCountry);
    const [currentCountry, setCurrentCountry] = useState<string>("https://flagsapi.com/MX/flat/64.png");
    const [addressType, setAddressType] = useState<string>("Casa");
    const [error, setError] = useState<string>("");

    const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<UpdateAddressType>({});
    const updateAddress = useUpdateAddress(customer);

    // Observa todos los campos para detectar cambios en tiempo real
    const watchedValues = watch();

    // Función auxiliar para saber si un campo específico está modificado
    const modified = (field: keyof UpdateAddressType) =>
        isFieldModified(field, watchedValues[field], versionData, NA_FIELDS);

    const restoreForm = () => {
        if (!versionData) return;
        reset({
            recipient_name: versionData.recipient_name,
            recipient_last_name: versionData.recipient_last_name!,
            country: versionData.country,
            state: versionData.state,
            city: versionData.city,
            locality: versionData.locality,
            street_name: versionData.street_name,
            neighborhood: versionData.neighborhood,
            zip_code: versionData.zip_code,
            address_type: versionData.address_type,
            floor: versionData.floor === "N/A" ? "" : versionData.floor,
            number: versionData.number,
            aditional_number: versionData.aditional_number === "N/A" ? "" : versionData.aditional_number,
            references_or_comments: versionData.references_or_comments === "N/A" ? "" : versionData.references_or_comments,
            country_phone_code: versionData.country_phone_code,
            contact_number: versionData.contact_number,
            default_address: versionData.default_address,
        });
        const findDefaultCountry = CountriesAreaCodesJSON.find(
            (c) => c.phoneCode === versionData.country_phone_code.substring(1)
        );
        setCurrentCountry(`https://flagsapi.com/${findDefaultCountry?.iso2!}/flat/64.png`);
        setAddressType(versionData.address_type);
    };

    useEffect(() => { if (versionData) restoreForm(); }, [versionData]);

    const onSubmit: SubmitHandler<Partial<NewAddressType>> = async (data: Partial<NewAddressType>) => {
        try {
            setError("");
            if (!versionData) return;
            const updatedFields: Partial<NewAddressType> = getFormChanges(versionData, data);
            if (Object.keys(updatedFields).length === 0) {
                setError("Se necesita al menos actualizar un campo para guardar los cambios");
                return;
            }
            updateAddress.mutate({ addressUUID: address!, data: updatedFields });
            onUpdated();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setCurrentCountry(`https://flagsapi.com/${country.iso2}/flat/64.png`);
        setValue("country_phone_code", country.phoneCode, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [country]);

    const handleClose = () => {
        restoreForm();
        setError("");
        ref.current?.close();
    };

    const isApartment = addressType === "Departamento";

    return (
        <dialog id="update_address_modal" className="modal" ref={ref}>
            <div className="modal-box w-full max-w-2xl h-auto max-h-[92vh] overflow-y-auto p-0 rounded-2xl bg-base-100 border border-base-300">

                {/* ── Modal Header ── */}
                <div className="sticky top-0 z-10 px-5 py-4 bg-base-200 border-b border-base-300 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FaEdit className="text-primary text-sm" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-base-content leading-none">
                                Actualizar dirección de envío
                            </h3>
                            <p className="text-xs text-base-content/40 mt-0.5">
                                Modifica los campos que desees actualizar
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost text-base-content/40 hover:text-base-content"
                        aria-label="Cerrar"
                        onClick={handleClose}
                    >
                        ✕
                    </button>
                </div>

                {/* ── Form ── */}
                <form
                    id="update-address-form"
                    autoComplete="on"
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-5 flex flex-col gap-6"
                >
                    {/* ════ 1. Remitente ════ */}
                    <section aria-labelledby="section-remitente-update">
                        <SectionHeader icon={<FaUserAlt />} title="Datos del destinatario" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                            {/* Nombre */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="u_recipient_name"
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("recipient_name") ? "text-success font-medium" : "text-base-content/60"
                                    )}
                                >
                                    Nombre(s) *
                                </label>
                                <input
                                    id="u_recipient_name"
                                    type="text"
                                    placeholder="Juan"
                                    autoComplete="given-name"
                                    className={inputCls(!!errors.recipient_name, modified("recipient_name"))}
                                    {...register("recipient_name", {
                                        required: "El nombre del remitente es requerido",
                                        maxLength: { value: 40, message: "Máximo 40 caracteres" },
                                        pattern: {
                                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                            message: "Solo letras y espacios",
                                        },
                                    })}
                                />
                                <FieldError message={errors.recipient_name?.message} />
                            </div>

                            {/* Apellidos */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="u_recipient_last_name"
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("recipient_last_name") ? "text-success font-medium" : "text-base-content/60"
                                    )}
                                >
                                    Apellidos *
                                </label>
                                <input
                                    id="u_recipient_last_name"
                                    type="text"
                                    placeholder="García López"
                                    autoComplete="family-name"
                                    className={inputCls(!!errors.recipient_last_name, modified("recipient_last_name"))}
                                    {...register("recipient_last_name", {
                                        required: "Los apellidos del remitente son requeridos",
                                        maxLength: { value: 60, message: "Máximo 60 caracteres" },
                                        pattern: {
                                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                            message: "Solo letras y espacios",
                                        },
                                    })}
                                />
                                <FieldError message={errors.recipient_last_name?.message} />
                            </div>

                            {/* Teléfono */}
                            <div className="sm:col-span-2 flex flex-col gap-1">
                                <label
                                    htmlFor="u_contact_number"
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("contact_number") || modified("country_phone_code")
                                            ? "text-success font-medium"
                                            : "text-base-content/60"
                                    )}
                                >
                                    Número telefónico *
                                </label>
                                <div className="flex gap-2 items-center">
                                    <figure className="w-8 sm:w-10 flex-shrink-0">
                                        <img src={currentCountry} alt={country.nameES} className="w-full h-auto" />
                                    </figure>
                                    <select
                                        defaultValue={JSON.stringify(defaultCountry)}
                                        aria-label="Código de país"
                                        className={clsx(
                                            "w-20 sm:w-24 select select-sm sm:select-md text-xs sm:text-sm flex-shrink-0 border bg-base-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
                                            modified("country_phone_code")
                                                ? "border-success text-success"
                                                : "border-base-300"
                                        )}
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
                                        id="u_contact_number"
                                        type="tel"
                                        placeholder="3312345678"
                                        autoComplete="tel-national"
                                        className={clsx(inputCls(!!errors.contact_number, modified("contact_number")), "flex-1")}
                                        {...register("contact_number", {
                                            required: "El número telefónico es requerido",
                                            pattern: {
                                                value: /^[0-9]{7,15}$/,
                                                message: "Solo números, entre 7 y 15 dígitos",
                                            },
                                        })}
                                    />
                                </div>
                                <FieldError message={errors.contact_number?.message} />
                            </div>
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="border-t border-base-300" />

                    {/* ════ 2. Domicilio ════ */}
                    <section aria-labelledby="section-domicilio-update">
                        <SectionHeader icon={<FaMapMarkerAlt />} title="Domicilio de entrega" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                            {/* País */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="u_country"
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("country") ? "text-success font-medium" : "text-base-content/60"
                                    )}
                                >
                                    País *
                                </label>
                                <input
                                    id="u_country"
                                    type="text"
                                    placeholder="México"
                                    autoComplete="country-name"
                                    className={inputCls(!!errors.country, modified("country"))}
                                    {...register("country", {
                                        required: "El país es requerido",
                                        maxLength: { value: 40, message: "Máximo 40 caracteres" },
                                        pattern: {
                                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                            message: "Solo letras y espacios",
                                        },
                                    })}
                                />
                                <FieldError message={errors.country?.message} />
                            </div>

                            {/* Estado */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="u_state"
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("state") ? "text-success font-medium" : "text-base-content/60"
                                    )}
                                >
                                    Estado *
                                </label>
                                <input
                                    id="u_state"
                                    type="text"
                                    placeholder="Veracruz"
                                    autoComplete="address-level1"
                                    className={inputCls(!!errors.state, modified("state"))}
                                    {...register("state", {
                                        required: "El estado es requerido",
                                        maxLength: { value: 40, message: "Máximo 40 caracteres" },
                                        pattern: {
                                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                            message: "Solo letras y espacios",
                                        },
                                    })}
                                />
                                <FieldError message={errors.state?.message} />
                            </div>

                            {/* Ciudad */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="u_city"
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("city") ? "text-success font-medium" : "text-base-content/60"
                                    )}
                                >
                                    Ciudad *
                                </label>
                                <input
                                    id="u_city"
                                    type="text"
                                    placeholder="Coatzacoalcos"
                                    autoComplete="address-level2"
                                    className={inputCls(!!errors.city, modified("city"))}
                                    {...register("city", {
                                        required: "La ciudad es requerida",
                                        maxLength: { value: 50, message: "Máximo 50 caracteres" },
                                        pattern: {
                                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                            message: "Solo letras y espacios",
                                        },
                                    })}
                                />
                                <FieldError message={errors.city?.message} />
                            </div>

                            {/* Localidad */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="u_locality"
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("locality") ? "text-success font-medium" : "text-base-content/60"
                                    )}
                                >
                                    Localidad *
                                </label>
                                <input
                                    id="u_locality"
                                    type="text"
                                    placeholder="Centro"
                                    autoComplete="address-level3"
                                    className={inputCls(!!errors.locality, modified("locality"))}
                                    {...register("locality", {
                                        required: "La localidad es requerida",
                                        maxLength: { value: 50, message: "Máximo 50 caracteres" },
                                        pattern: {
                                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                            message: "Solo letras y espacios",
                                        },
                                    })}
                                />
                                <FieldError message={errors.locality?.message} />
                            </div>

                            {/* Calle */}
                            <div className="sm:col-span-2 flex flex-col gap-1">
                                <label
                                    htmlFor="u_street_name"
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("street_name") ? "text-success font-medium" : "text-base-content/60"
                                    )}
                                >
                                    Calle *
                                </label>
                                <input
                                    id="u_street_name"
                                    type="text"
                                    placeholder="Av. Insurgentes"
                                    autoComplete="address-line1"
                                    className={inputCls(!!errors.street_name, modified("street_name"))}
                                    {...register("street_name", {
                                        required: "La calle es requerida",
                                        maxLength: { value: 60, message: "Máximo 60 caracteres" },
                                        pattern: {
                                            value: /^(?=.{2,100}$)(?=.*\p{L})[\p{L}\p{N}\s.'-]+$/u,
                                            message: "Solo letras, números, espacios y puntuación básica",
                                        },
                                    })}
                                />
                                <FieldError message={errors.street_name?.message} />
                            </div>

                            {/* Colonia */}
                            <div className="sm:col-span-2 flex flex-col gap-1">
                                <label
                                    htmlFor="u_neighborhood"
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("neighborhood") ? "text-success font-medium" : "text-base-content/60"
                                    )}
                                >
                                    Colonia / Fraccionamiento *
                                </label>
                                <input
                                    id="u_neighborhood"
                                    type="text"
                                    placeholder="Colonia del Valle, Fraccionamiento Las Palmas…"
                                    autoComplete="address-level4"
                                    className={inputCls(!!errors.neighborhood, modified("neighborhood"))}
                                    {...register("neighborhood", {
                                        required: "La colonia o fraccionamiento es requerida",
                                        maxLength: { value: 60, message: "Máximo 60 caracteres" },
                                        pattern: {
                                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                            message: "Solo letras y espacios",
                                        },
                                    })}
                                />
                                <FieldError message={errors.neighborhood?.message} />
                            </div>

                            {/* CP */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="u_zip_code"
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("zip_code") ? "text-success font-medium" : "text-base-content/60"
                                    )}
                                >
                                    Código postal *
                                </label>
                                <input
                                    id="u_zip_code"
                                    type="text"
                                    placeholder="96400"
                                    autoComplete="postal-code"
                                    inputMode="numeric"
                                    className={inputCls(!!errors.zip_code, modified("zip_code"))}
                                    {...register("zip_code", {
                                        required: "El código postal es requerido",
                                        minLength: { value: 3, message: "Mínimo 3 caracteres" },
                                        maxLength: { value: 10, message: "Máximo 10 caracteres" },
                                        pattern: {
                                            value: /^(?!.*-.*-)[0-9-]+$/,
                                            message: "Solo números y guiones",
                                        },
                                    })}
                                />
                                <FieldError message={errors.zip_code?.message} />
                            </div>

                            {/* Tipo de dirección — pill selector */}
                            <div className="flex flex-col gap-1">
                                <label
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("address_type") ? "text-success font-medium" : "text-base-content/60"
                                    )}
                                >
                                    Tipo de dirección *
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {ADDRESS_TYPE_OPTIONS.map((opt) => {
                                        const isSelected = addressType === opt.value;
                                        const isTypeModified = modified("address_type");
                                        return (
                                            <label
                                                key={opt.value}
                                                className={clsx(
                                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all select-none",
                                                    isSelected
                                                        ? isTypeModified
                                                            ? "border-success/40 bg-success/10 text-success"
                                                            : "border-primary/40 bg-primary/10 text-primary"
                                                        : "border-base-300 bg-base-200 text-base-content/60 hover:border-primary/30"
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    value={opt.value}
                                                    {...register("address_type")}
                                                    onChange={(e) => setAddressType(e.target.value)}
                                                />
                                                {opt.icon}
                                                {opt.label}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Piso — solo Departamento */}
                            {isApartment && (
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="u_floor"
                                        className={clsx(
                                            "text-xs transition-colors",
                                            modified("floor") ? "text-success font-medium" : "text-base-content/60"
                                        )}
                                    >
                                        Piso <span className="text-base-content/40">(opcional)</span>
                                    </label>
                                    <input
                                        id="u_floor"
                                        type="number"
                                        placeholder="ej. 3"
                                        autoComplete="off"
                                        className={inputCls(!!errors.floor, modified("floor"))}
                                        {...register("floor", {
                                            maxLength: { value: 3, message: "Máximo 3 caracteres" },
                                            setValueAs: (v) => v === "" ? undefined : v,
                                        })}
                                    />
                                    <FieldError message={errors.floor?.message} />
                                </div>
                            )}

                            {/* Número exterior */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="u_number"
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("number") ? "text-success font-medium" : "text-base-content/60"
                                    )}
                                >
                                    Número exterior *
                                </label>
                                <input
                                    id="u_number"
                                    type="text"
                                    placeholder="ej. 100A"
                                    autoComplete="address-line2"
                                    className={inputCls(!!errors.number, modified("number"))}
                                    {...register("number", {
                                        required: "El número exterior es requerido",
                                        maxLength: { value: 6, message: "Máximo 6 caracteres" },
                                        pattern: {
                                            value: /^[1-9][0-9]*[A-Z]?$/,
                                            message: "Solo números y una mayúscula al final",
                                        },
                                    })}
                                />
                                <FieldError message={errors.number?.message} />
                            </div>

                            {/* Número interior */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="u_aditional_number"
                                    className={clsx(
                                        "text-xs transition-colors",
                                        modified("aditional_number") ? "text-success font-medium" : "text-base-content/60"
                                    )}
                                >
                                    Número interior{" "}
                                    <span className="text-base-content/40">
                                        ({isApartment ? "recomendado" : "opcional"})
                                    </span>
                                </label>
                                <input
                                    id="u_aditional_number"
                                    type="text"
                                    placeholder={isApartment ? "ej. 14" : "Opcional"}
                                    autoComplete="off"
                                    className={inputCls(!!errors.aditional_number, modified("aditional_number"))}
                                    {...register("aditional_number", {
                                        maxLength: { value: 6, message: "Máximo 6 caracteres" },
                                        pattern: {
                                            value: /^[1-9][0-9]*[A-Z]?$/,
                                            message: "Solo números y una mayúscula al final",
                                        },
                                        setValueAs: (v) => v === "" ? undefined : v,
                                    })}
                                />
                                <FieldError message={errors.aditional_number?.message} />
                            </div>
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="border-t border-base-300" />

                    {/* ════ 3. Información adicional ════ */}
                    <section aria-labelledby="section-adicional-update">
                        <SectionHeader icon={<MdEditNote />} title="Información adicional" />
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="u_references_or_comments"
                                className={clsx(
                                    "text-xs transition-colors",
                                    modified("references_or_comments") ? "text-success font-medium" : "text-base-content/60"
                                )}
                            >
                                Referencias o comentarios{" "}
                                <span className="text-base-content/40">(opcional, máx. 80 caracteres)</span>
                            </label>
                            <textarea
                                id="u_references_or_comments"
                                className={clsx(
                                    "textarea w-full text-sm border rounded-lg bg-base-200",
                                    "focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none",
                                    errors.references_or_comments
                                        ? "border-error text-error"
                                        : modified("references_or_comments")
                                            ? "border-success text-success"
                                            : "border-base-300"
                                )}
                                placeholder="Entre calles Reforma y Morelos, casa azul con portón negro…"
                                rows={3}
                                autoComplete="off"
                                {...register("references_or_comments", {
                                    maxLength: { value: 80, message: "Máximo 80 caracteres" },
                                    setValueAs: (v) => v === "" ? undefined : v,
                                })}
                            />
                            <FieldError message={errors.references_or_comments?.message} />
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="border-t border-base-300" />

                    {/* ════ 4. Predeterminada ════ */}
                    <label
                        className={clsx(
                            "flex items-start gap-3 p-3 rounded-xl border bg-base-200 cursor-pointer transition-colors",
                            modified("default_address")
                                ? "border-success/40 hover:border-success/60"
                                : "border-base-300 hover:border-primary/30"
                        )}
                    >
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm mt-0.5 flex-shrink-0"
                            {...register("default_address")}
                        />
                        <div>
                            <p
                                className={clsx(
                                    "text-sm font-medium flex items-center gap-1.5 transition-colors",
                                    modified("default_address") ? "text-success" : "text-base-content"
                                )}
                            >
                                <FaStar className={clsx("text-xs", modified("default_address") ? "text-success" : "text-primary")} />
                                Usar como dirección predeterminada
                            </p>
                            <p className="text-xs text-base-content/40 mt-0.5">
                                Se seleccionará automáticamente al realizar tu próxima compra
                            </p>
                        </div>
                    </label>

                    {/* ════ Error global ════ */}
                    {error && error.length > 0 && (
                        <div className="alert alert-error rounded-xl py-3 px-4 text-sm">
                            <FaExclamationTriangle />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* ════ Submit ════ */}
                    <button
                        type="submit"
                        disabled={updateAddress.isPending}
                        className="w-full btn btn-primary font-bold gap-2"
                    >
                        {updateAddress.isPending ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            <FaEdit className="text-sm" />
                        )}
                        {updateAddress.isPending ? "Guardando cambios…" : "Guardar cambios"}
                    </button>
                </form>
            </div>

            {/* Backdrop click closes modal */}
            <form method="dialog" className="modal-backdrop">
                <button aria-label="Cerrar modal" onClick={handleClose} />
            </form>
        </dialog>
    );
};

export default UpdateAddresssForm;