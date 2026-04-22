import { useEffect, useState, type RefObject } from "react";
import CountriesAreaCodesJSON from "../../../global/json/CountriesAreaCodes.json"
import type { CountriesPhoneCodeType } from "../../../global/GlobalTypes";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { NewAddressType } from "../CustomerTypes";
import { useAddAddress } from "../hooks/useCustomer";
import { formatAxiosError } from "../../../api/helpers";
import {
    FaMapMarkerAlt,
    FaUserAlt,
    FaHome,
    FaBriefcase,
    FaStar,
    FaExclamationTriangle,
} from "react-icons/fa";
import { MdApartment, MdEditNote } from "react-icons/md";
import clsx from "clsx";

type Props = {
    ref: RefObject<HTMLDialogElement | null>;
    onCreated: () => void;
};

const ADDRESS_TYPE_OPTIONS = [
    { value: "Casa", label: "Casa", icon: <FaHome className="text-xs" /> },
    { value: "Trabajo", label: "Trabajo", icon: <FaBriefcase className="text-xs" /> },
    { value: "Departamento", label: "Departamento", icon: <MdApartment className="text-sm" /> },
];

/* ── Helpers ───────────────────────────────────────────────────── */

const inputCls = (hasError?: boolean) =>
    clsx(
        "input input-sm sm:input-md w-full text-sm border rounded-lg",
        "bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
        hasError ? "border-error" : "border-base-300"
    );

// const selectCls = (hasError?: boolean) =>
//     clsx(
//         "select select-sm sm:select-md w-full text-sm border rounded-lg",
//         "bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
//         hasError ? "border-error" : "border-base-300"
//     );

const SectionHeader = ({
    icon,
    title,
}: {
    icon: React.ReactNode;
    title: string;
}) => (
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

/* ── Component ─────────────────────────────────────────────────── */

const NewAddressForm = ({ ref, onCreated }: Props) => {
    const defaultCountry: CountriesPhoneCodeType = {
        nameES: "México",
        nameEN: "Mexico",
        iso2: "MX",
        iso3: "MEX",
        phoneCode: "+52",
    };

    const [country, setCountry] = useState<CountriesPhoneCodeType>(defaultCountry);
    const [currentCountry, setCurrentCountry] = useState<string>(
        "https://flagsapi.com/MX/flat/64.png"
    );
    const [addressType, setAddressType] = useState<string>("Casa");
    const [error, setError] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<NewAddressType>({
        defaultValues: { defaultAddress: false, floor: undefined, addressType: "Casa" },
    });

    const addAddress = useAddAddress();

    const onSubmit: SubmitHandler<NewAddressType> = async (data: NewAddressType) => {
        try {
            await addAddress.mutateAsync(data);
            reset();
            setCountry(defaultCountry);
            onCreated();
        } catch (err) {
            setError(formatAxiosError(err));
        }
    };

    useEffect(() => {
        setCurrentCountry(`https://flagsapi.com/${country.iso2}/flat/64.png`);
        setValue("countryPhoneCode", country.phoneCode, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [country]);

    const isApartment = addressType === "Departamento";

    return (
        <dialog id="new_address_modal" className="modal" ref={ref}>
            <div className="modal-box w-full max-w-2xl h-auto max-h-[92vh] overflow-y-auto p-0 rounded-2xl bg-base-100 border border-base-300">

                {/* ── Modal Header ── */}
                <div className="sticky top-0 z-10 px-5 py-4 bg-base-200 border-b border-base-300 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FaMapMarkerAlt className="text-primary text-sm" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-base-content leading-none">
                                Nueva dirección de envío
                            </h3>
                            <p className="text-xs text-base-content/40 mt-0.5">
                                Completa los datos del destinatario y domicilio
                            </p>
                        </div>
                    </div>
                    {/* Close — uses native dialog method via form[method=dialog] */}
                    <form method="dialog">
                        <button
                            className="btn btn-sm btn-circle btn-ghost text-base-content/40 hover:text-base-content"
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                    </form>
                </div>

                {/* ── Form ── */}
                <form
                    id="new-address-form"
                    autoComplete="on"
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-5 flex flex-col gap-6"
                >
                    {/* ════ 1. Remitente ════ */}
                    <section aria-labelledby="section-remitente">
                        <SectionHeader icon={<FaUserAlt />} title="Datos del destinatario" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                            {/* Nombre */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="recipient_name" className="text-xs text-base-content/60">
                                    Nombre(s) *
                                </label>
                                <input
                                    id="recipient_name"
                                    type="text"
                                    placeholder="Juan"
                                    autoComplete="given-name"
                                    className={inputCls(!!errors.recipientName)}
                                    {...register("recipientName", {
                                        required: "El nombre del remitente es requerido",
                                        maxLength: { value: 40, message: "Máximo 40 caracteres" },
                                        pattern: {
                                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                            message: "Solo letras y espacios",
                                        },
                                    })}
                                />
                                <FieldError message={errors.recipientName?.message} />
                            </div>

                            {/* Apellidos */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="recipient_last_name" className="text-xs text-base-content/60">
                                    Apellidos *
                                </label>
                                <input
                                    id="recipient_last_name"
                                    type="text"
                                    placeholder="García López"
                                    autoComplete="family-name"
                                    className={inputCls(!!errors.recipientLastName)}
                                    {...register("recipientLastName", {
                                        required: "Los apellidos del remitente son requeridos",
                                        maxLength: { value: 60, message: "Máximo 60 caracteres" },
                                        pattern: {
                                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                            message: "Solo letras y espacios",
                                        },
                                    })}
                                />
                                <FieldError message={errors.recipientLastName?.message} />
                            </div>

                            {/* Teléfono */}
                            <div className="sm:col-span-2 flex flex-col gap-1">
                                <label htmlFor="contact_number" className="text-xs text-base-content/60">
                                    Número telefónico *
                                </label>
                                <div className="flex gap-2 items-center">
                                    <figure className="w-8 sm:w-10 flex-shrink-0">
                                        <img
                                            src={currentCountry}
                                            alt={country.nameES}
                                            className="w-full h-auto"
                                        />
                                    </figure>
                                    <select
                                        defaultValue={JSON.stringify(defaultCountry)}
                                        aria-label="Código de país"
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
                                        id="contact_number"
                                        type="tel"
                                        placeholder="3312345678"
                                        autoComplete="tel-national"
                                        className={clsx(inputCls(!!errors.contactNumber), "flex-1")}
                                        {...register("contactNumber", {
                                            required: "El número telefónico es requerido",
                                            pattern: {
                                                value: /^[0-9]{7,15}$/,
                                                message: "Solo números, entre 7 y 15 dígitos",
                                            },
                                        })}
                                    />
                                </div>
                                <FieldError message={errors.contactNumber?.message} />
                            </div>
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="border-t border-base-300" />

                    {/* ════ 2. Domicilio ════ */}
                    <section aria-labelledby="section-domicilio">
                        <SectionHeader icon={<FaMapMarkerAlt />} title="Domicilio de entrega" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                            {/* País */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="country" className="text-xs text-base-content/60">
                                    País *
                                </label>
                                <input
                                    id="country"
                                    type="text"
                                    placeholder="México"
                                    autoComplete="country-name"
                                    className={inputCls(!!errors.country)}
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
                                <label htmlFor="state" className="text-xs text-base-content/60">
                                    Estado *
                                </label>
                                <input
                                    id="state"
                                    type="text"
                                    placeholder="Veracruz"
                                    autoComplete="address-level1"
                                    className={inputCls(!!errors.state)}
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
                                <label htmlFor="city" className="text-xs text-base-content/60">
                                    Ciudad *
                                </label>
                                <input
                                    id="city"
                                    type="text"
                                    placeholder="Coatzacoalcos"
                                    autoComplete="address-level2"
                                    className={inputCls(!!errors.city)}
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
                                <label htmlFor="locality" className="text-xs text-base-content/60">
                                    Localidad *
                                </label>
                                <input
                                    id="locality"
                                    type="text"
                                    placeholder="Centro"
                                    autoComplete="address-level3"
                                    className={inputCls(!!errors.locality)}
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
                                <label htmlFor="street_name" className="text-xs text-base-content/60">
                                    Calle *
                                </label>
                                <input
                                    id="street_name"
                                    type="text"
                                    placeholder="Av. Insurgentes"
                                    autoComplete="address-line1"
                                    className={inputCls(!!errors.streetName)}
                                    {...register("streetName", {
                                        required: "La calle es requerida",
                                        maxLength: { value: 60, message: "Máximo 60 caracteres" },
                                        pattern: {
                                            value: /^(?=.{2,100}$)(?=.*\p{L})[\p{L}\p{N}\s.'-]+$/u,
                                            message: "Solo letras, números, espacios y puntuación básica",
                                        },
                                    })}
                                />
                                <FieldError message={errors.streetName?.message} />
                            </div>

                            {/* Colonia */}
                            <div className="sm:col-span-2 flex flex-col gap-1">
                                <label htmlFor="neighborhood" className="text-xs text-base-content/60">
                                    Colonia / Fraccionamiento *
                                </label>
                                <input
                                    id="neighborhood"
                                    type="text"
                                    placeholder="Colonia del Valle, Fraccionamiento Las Palmas…"
                                    autoComplete="address-level4"
                                    className={inputCls(!!errors.neighborhood)}
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
                                <label htmlFor="zip_code" className="text-xs text-base-content/60">
                                    Código postal *
                                </label>
                                <input
                                    id="zip_code"
                                    type="text"
                                    placeholder="96400"
                                    autoComplete="postal-code"
                                    inputMode="numeric"
                                    className={inputCls(!!errors.zipCode)}
                                    {...register("zipCode", {
                                        required: "El código postal es requerido",
                                        minLength: { value: 3, message: "Mínimo 3 caracteres" },
                                        maxLength: { value: 10, message: "Máximo 10 caracteres" },
                                        pattern: {
                                            value: /^(?!.*-.*-)[0-9-]+$/,
                                            message: "Solo números y guiones",
                                        },
                                    })}
                                />
                                <FieldError message={errors.zipCode?.message} />
                            </div>

                            {/* Tipo de dirección — pill selector */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-base-content/60">
                                    Tipo de dirección *
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {ADDRESS_TYPE_OPTIONS.map((opt) => (
                                        <label
                                            key={opt.value}
                                            className={clsx(
                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all select-none",
                                                addressType === opt.value
                                                    ? "border-primary/40 bg-primary/10 text-primary"
                                                    : "border-base-300 bg-base-200 text-base-content/60 hover:border-primary/30"
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                className="hidden"
                                                value={opt.value}
                                                {...register("addressType")}
                                                onChange={(e) => {
                                                    setAddressType(e.target.value);
                                                }}
                                            />
                                            {opt.icon}
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Números */}
                            {isApartment && (
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="floor" className="text-xs text-base-content/60">
                                        Piso <span className="text-base-content/40">(opcional)</span>
                                    </label>
                                    <input
                                        id="floor"
                                        type="number"
                                        placeholder="ej. 3"
                                        autoComplete="off"
                                        className={inputCls(!!errors.floor)}
                                        {...register("floor", {
                                            maxLength: { value: 3, message: "Máximo 3 caracteres" },
                                            setValueAs: (v) => v === "" ? undefined : v,
                                        })}
                                    />
                                    <FieldError message={errors.floor?.message} />
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <label htmlFor="number" className="text-xs text-base-content/60">
                                    Número exterior *
                                </label>
                                <input
                                    id="number"
                                    type="text"
                                    placeholder="ej. 100A"
                                    autoComplete="address-line2"
                                    className={inputCls(!!errors.number)}
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

                            <div className="flex flex-col gap-1">
                                <label htmlFor="aditional_number" className="text-xs text-base-content/60">
                                    Número interior{" "}
                                    <span className="text-base-content/40">
                                        ({isApartment ? "recomendado" : "opcional"})
                                    </span>
                                </label>
                                <input
                                    id="aditional_number"
                                    type="text"
                                    placeholder={isApartment ? "ej. 14" : "Opcional"}
                                    autoComplete="off"
                                    className={inputCls(!!errors.aditionalNumber)}
                                    {...register("aditionalNumber", {
                                        maxLength: { value: 6, message: "Máximo 6 caracteres" },
                                        pattern: {
                                            value: /^[1-9][0-9]*[A-Z]?$/,
                                            message: "Solo números y una mayúscula al final",
                                        },
                                        setValueAs: (v) => v === "" ? undefined : v,
                                    })}
                                />
                                <FieldError message={errors.aditionalNumber?.message} />
                            </div>
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="border-t border-base-300" />

                    {/* ════ 3. Información adicional ════ */}
                    <section aria-labelledby="section-adicional">
                        <SectionHeader icon={<MdEditNote />} title="Información adicional" />
                        <div className="flex flex-col gap-1">
                            <label htmlFor="references_or_comments" className="text-xs text-base-content/60">
                                Referencias o comentarios{" "}
                                <span className="text-base-content/40">(opcional, máx. 80 caracteres)</span>
                            </label>
                            <textarea
                                id="references_or_comments"
                                className={clsx(
                                    "textarea w-full text-sm border rounded-lg bg-base-200",
                                    "focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none",
                                    errors.referencesOrComments ? "border-error" : "border-base-300"
                                )}
                                placeholder="Entre calles Reforma y Morelos, casa azul con portón negro…"
                                rows={3}
                                autoComplete="off"
                                {...register("referencesOrComments", {
                                    maxLength: { value: 80, message: "Máximo 80 caracteres" },
                                    setValueAs: (v) => v === "" ? undefined : v,
                                })}
                            />
                            <FieldError message={errors.referencesOrComments?.message} />
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="border-t border-base-300" />

                    {/* ════ 4. Predeterminada ════ */}
                    <label className="flex items-start gap-3 p-3 rounded-xl border border-base-300 bg-base-200 cursor-pointer hover:border-primary/30 transition-colors">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm mt-0.5 flex-shrink-0"
                            {...register("defaultAddress")}
                        />
                        <div>
                            <p className="text-sm font-medium text-base-content flex items-center gap-1.5">
                                <FaStar className="text-primary text-xs" />
                                Usar como dirección predeterminada
                            </p>
                            <p className="text-xs text-base-content/40 mt-0.5">
                                Se seleccionará automáticamente al realizar tu próxima compra
                            </p>
                        </div>
                    </label>

                    {/* ════ Error global ════ */}
                    {error.length > 0 && (
                        <div className="alert alert-error rounded-xl py-3 px-4 text-sm">
                            <FaExclamationTriangle />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* ════ Submit ════ */}
                    <button
                        type="submit"
                        disabled={addAddress.isPending}
                        className="w-full btn btn-primary font-bold gap-2"
                    >
                        {addAddress.isPending ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            <FaMapMarkerAlt className="text-sm" />
                        )}
                        {addAddress.isPending ? "Guardando…" : "Guardar dirección de envío"}
                    </button>
                </form>
            </div>

            {/* Backdrop click closes modal */}
            <form method="dialog" className="modal-backdrop">
                <button aria-label="Cerrar modal" />
            </form>
        </dialog>
    );
};

export default NewAddressForm;