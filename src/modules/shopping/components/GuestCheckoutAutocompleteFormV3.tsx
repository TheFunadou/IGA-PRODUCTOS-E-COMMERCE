import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaShippingFast, FaUserAlt } from "react-icons/fa";
import type { GuestCreateOrderFormType } from "../../customers/CustomerTypes";
import type { CountriesPhoneCodeType } from "../../../global/GlobalTypes";
import CountriesAreaCodesJSON from "../../../global/json/CountriesAreaCodes.json";
import { useSepomexZipCodes } from "../../../global/sepomex/useSepomexZipCodes";
import clsx from "clsx";

interface GuestCheckoutAutocompleteFormV3Props {
    onSave: (data: GuestCreateOrderFormType) => void;
    guestAddress?: GuestCreateOrderFormType | null;
}

const GuestCheckoutAutocompleteFormV3 = ({
    onSave,
    guestAddress,
}: GuestCheckoutAutocompleteFormV3Props) => {
    const defaultCountry: CountriesPhoneCodeType = {
        nameES: "México",
        nameEN: "Mexico",
        iso2: "MX",
        iso3: "MEX",
        phoneCode: "+52",
    };

    const findCountryByESName = (nameES: string): CountriesPhoneCodeType | undefined => {
        const found = CountriesAreaCodesJSON.find((data) => data.nameES === nameES);
        return found
            ? {
                nameES: found.nameES,
                nameEN: found.nameEN,
                iso2: found.iso2,
                iso3: found.iso3,
                phoneCode: `+${found.phoneCode}`,
            }
            : undefined;
    };

    const [phoneCountry, setPhoneCountry] = useState<CountriesPhoneCodeType>(defaultCountry);
    const [currentCountryFlag, setCurrentCountryFlag] = useState<string>("https://flagsapi.com/MX/flat/64.png");
    const [addressCountry, setAddressCountry] = useState<CountriesPhoneCodeType>(
        () => (guestAddress?.country ? findCountryByESName(guestAddress.country) : undefined) || defaultCountry
    );
    const [addressCountryFlag, setAddressCountryFlag] = useState<string>(`https://flagsapi.com/${addressCountry.iso2}/flat/64.png`);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        clearErrors,
    } = useForm<GuestCreateOrderFormType>({
        defaultValues: {
            consent: guestAddress?.consent || false,
            email: guestAddress?.email || "",
            firstName: guestAddress?.firstName || "",
            lastName: guestAddress?.lastName || "",
            recipientName: guestAddress?.recipientName || "",
            recipientLastName: guestAddress?.recipientLastName || "",
            country: guestAddress?.country || "México",
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

    const countryField = register("country", {
        required: "Campo requerido",
        pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,60}$/, message: "Nombre de país inválido" },
    });

    useEffect(() => {
        setCurrentCountryFlag(`https://flagsapi.com/${phoneCountry.iso2}/flat/64.png`);
        setValue("countryPhoneCode", phoneCountry.phoneCode, { shouldValidate: true, shouldDirty: true });
    }, [phoneCountry]);

    useEffect(() => {
        setAddressCountryFlag(`https://flagsapi.com/${addressCountry.iso2}/flat/64.png`);
    }, [addressCountry]);

    const watchedZipCode = watch("zipCode");
    const isMexico = addressCountry.iso2 === "MX";

    const { data: sepomexData, isFetching: sepomexFetching, isError: sepomexError } =
        useSepomexZipCodes({
            zipCode: watchedZipCode,
            enabled: isMexico,
        });

    const colonias = useMemo(() => {
        if (!sepomexData) return [];
        return Array.from(
            new Set(
                sepomexData.zip_codes.map((entry) => entry.d_asenta.trim()).filter(Boolean)
            )
        );
    }, [sepomexData]);

    const lastZipRef = useRef<string>("");
    useEffect(() => {
        if (lastZipRef.current === watchedZipCode) return;
        lastZipRef.current = watchedZipCode;
        if (!isMexico) return;
        setValue("state", "", { shouldValidate: false });
        setValue("city", "", { shouldValidate: false });
        setValue("locality", "", { shouldValidate: false });
        setValue("neighborhood", "", { shouldValidate: false });
    }, [watchedZipCode, isMexico, setValue]);

    useEffect(() => {
        if (!sepomexData || sepomexData.zip_codes.length === 0) return;
        const first = sepomexData.zip_codes[0];
        setValue("state", first.d_estado.trim(), { shouldValidate: true });
        setValue("city", first.d_ciudad?.trim() || first.d_mnpio.trim(), { shouldValidate: true });
        setValue("locality", first.d_mnpio.trim(), { shouldValidate: true });
    }, [sepomexData, setValue]);

    useEffect(() => {
        if (!sepomexData) return;
        if (colonias.length === 1) {
            setValue("neighborhood", colonias[0], { shouldValidate: true });
        } else if (colonias.length > 1) {
            setValue("neighborhood", "", { shouldValidate: true });
        }
    }, [sepomexData, colonias, setValue]);

    const showColoniaSelect = isMexico && !!sepomexData && !sepomexFetching && colonias.length >= 2;
    const showZipError = isMexico && watchedZipCode?.length >= 5 && sepomexError;

    const cpSearchable = /^\d{5}$/.test(watchedZipCode || "");
    const autocompleteReady =
        isMexico &&
        cpSearchable &&
        !sepomexFetching &&
        (!!sepomexData || sepomexError);
    const addressLocked = isMexico && !autocompleteReady;

    useEffect(() => {
        if (isMexico && addressLocked) {
            setValue("state", "", { shouldValidate: false });
            setValue("city", "", { shouldValidate: false });
            setValue("locality", "", { shouldValidate: false });
            setValue("neighborhood", "", { shouldValidate: false });
            clearErrors(["state", "city", "locality", "neighborhood"]);
        }
    }, [isMexico, addressLocked, setValue, clearErrors]);

    const neighborhoodField = register("neighborhood", {
        required: showColoniaSelect ? "Selecciona una colonia" : "Campo requerido",
        pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s0-9]{2,100}$/, message: "Colonia inválida" },
    });
    const handleNeighborhoodChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        neighborhoodField.onChange(e);
        setValue("neighborhood", e.target.value, { shouldValidate: true });
    };

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
                                pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Correo inválido" },
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
                                <img src={currentCountryFlag} alt={phoneCountry.nameES} className="w-full h-auto" />
                            </figure>
                            <select
                                defaultValue={JSON.stringify(defaultCountry)}
                                aria-label="Código de país telefónico"
                                className="w-20 sm:w-24 select select-sm sm:select-md text-xs sm:text-sm flex-shrink-0 border border-base-300 bg-base-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                onChange={(e) => setPhoneCountry(JSON.parse(e.target.value))}
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
                        {errors.contactNumber && <p className="text-error text-xs mt-1">{errors.contactNumber.message}</p>}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-3">
                    <FaMapMarkerAlt className="text-primary text-sm" />
                    <h3 className="text-sm font-bold text-base-content uppercase">Dirección de envío</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                            <div className="flex gap-2 items-center">
                                <figure className="w-8 sm:w-10 flex-shrink-0">
                                    <img src={addressCountryFlag} alt={addressCountry.nameES} className="w-full h-auto" />
                                </figure>
                                <select
                                    {...countryField}
                                    value={addressCountry.nameES}
                                    onChange={(e) => {
                                        const selected = findCountryByESName(e.target.value);
                                        if (selected) {
                                            setAddressCountry(selected);
                                        }
                                        countryField.onChange(e);
                                    }}
                                    aria-label="País de la dirección de envío"
                                    className="flex-1 select select-sm sm:select-md text-sm border border-base-300 bg-base-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                >
                                    {CountriesAreaCodesJSON.map((data, index) => (
                                        <option key={index} value={data.nameES}>
                                            {data.nameES}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.country && <p className="text-error text-xs mt-1">{errors.country.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs text-base-content/60 mb-1 block">Código postal *</label>
                            <div className={clsx("relative", isMexico && "flex items-center gap-2")}>
                                <input
{...register("zipCode", {
                                    required: "Campo requerido",
                                    pattern: {
                                        value: isMexico ? /^\d{5}$/ : /^\d{4,10}$/,
                                        message: isMexico ? "El código postal de México debe tener 5 dígitos" : "Código postal inválido",
                                    },
                                })}
                                    placeholder="44100"
                                    inputMode="numeric"
                                    className={inputClass(!!errors.zipCode)}
                                />
                                {isMexico && sepomexFetching && (
                                    <span className="loading loading-spinner loading-xs text-primary flex-shrink-0" aria-label="Buscando código postal" />
                                )}
                            </div>
                            {errors.zipCode && <p className="text-error text-xs mt-1">{errors.zipCode.message}</p>}
                            {showZipError && (
                                <p className="text-warning text-xs mt-1">
                                    No encontramos tu código postal, captura tus datos manualmente.
                                </p>
                            )}
                            {isMexico && sepomexData && sepomexData.zip_codes.length > 0 && !sepomexFetching && (
                                <p className="text-success text-xs mt-1">
                                    Autocompletamos tus datos con tu código postal.
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Estado *</label>
                        <input
                            disabled={addressLocked}
                            {...register("state", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,60}$/, message: "Nombre de estado inválido" },
                            })}
                            placeholder="Jalisco"
                            className={clsx(inputClass(!!errors.state), "disabled:opacity-60 disabled:cursor-not-allowed")}
                        />
                        {errors.state && <p className="text-error text-xs mt-1">{errors.state.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Ciudad *</label>
                        <input
                            disabled={addressLocked}
                            {...register("city", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,80}$/, message: "Nombre de ciudad inválido" },
                            })}
                            placeholder="Guadalajara"
                            className={clsx(inputClass(!!errors.city), "disabled:opacity-60 disabled:cursor-not-allowed")}
                        />
                        {errors.city && <p className="text-error text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Localidad *</label>
                        <input
                            disabled={addressLocked}
                            {...register("locality", {
                                required: "Campo requerido",
                                pattern: { value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s0-9]{2,80}$/, message: "Localidad inválida" },
                            })}
                            placeholder="Centro"
                            className={clsx(inputClass(!!errors.locality), "disabled:opacity-60 disabled:cursor-not-allowed")}
                        />
                        {errors.locality && <p className="text-error text-xs mt-1">{errors.locality.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-base-content/60 mb-1 block">Colonia *</label>
                        {showColoniaSelect ? (
<select
                            disabled={addressLocked}
                            {...neighborhoodField}
                            onChange={handleNeighborhoodChange}
                            className={clsx(
                                "select select-sm sm:select-md w-full text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition disabled:opacity-60 disabled:cursor-not-allowed",
                                errors.neighborhood
                                    ? "border-warning"
                                    : "bg-base-200 border-base-300"
                            )}
                        >
                                <option value="">Selecciona tu colonia</option>
                                {colonias.map((colonia) => (
                                    <option key={colonia} value={colonia}>
                                        {colonia}
                                    </option>
                                ))}
                            </select>
                        ) : (
<input
                            disabled={addressLocked}
                            {...neighborhoodField}
                            onChange={handleNeighborhoodChange}
                            placeholder="Colonia Americana"
                            className={clsx(inputClass(!!errors.neighborhood), "disabled:opacity-60 disabled:cursor-not-allowed")}
                        />
                        )}
                        {errors.neighborhood && (
                            <p className={clsx(
                                "text-xs mt-1",
                                showColoniaSelect ? "text-warning" : "text-error"
                            )}>
                                {errors.neighborhood.message}
                            </p>
                        )}
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
                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs text-base-content/60 mb-1 block">Número exterior *</label>
                            <input
                                {...register("number", {
                                    required: "Campo requerido",
                                    pattern: { value: /^[a-zA-Z0-9-]{1,10}$/, message: "Número inválido (máx. 10 caracteres)" },
                                })}
                                placeholder="123"
                                className={inputClass(!!errors.number)}
                            />
                            {errors.number && <p className="text-error text-xs mt-1">{errors.number.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs text-base-content/60 mb-1 block">Número interior <span className="text-base-content/40">(opcional)</span></label>
                            <input
                                {...register("aditionalNumber", {
                                    pattern: { value: /^[a-zA-Z0-9-]{0,10}$/, message: "Número inválido" },
                                    setValueAs: (value) => value === "" ? undefined : value,
                                })}
                                placeholder="Depto. 4B"
                                className={inputClass(!!errors.aditionalNumber)}
                            />
                            {errors.aditionalNumber && <p className="text-error text-xs mt-1">{errors.aditionalNumber.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs text-base-content/60 mb-1 block">Piso <span className="text-base-content/40">(opcional)</span></label>
                            <input
                                {...register("floor", {
                                    pattern: { value: /^[a-zA-Z0-9\-\s]{0,10}$/, message: "Piso inválido" },
                                    setValueAs: (value) => value === "" ? undefined : value,
                                })}
                                placeholder="2"
                                className={inputClass(!!errors.floor)}
                            />
                            {errors.floor && <p className="text-error text-xs mt-1">{errors.floor.message}</p>}
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="text-xs text-base-content/60 mb-1 block">Referencias o comentarios <span className="text-base-content/40">(opcional)</span></label>
                        <input
                            {...register("referencesOrComments", {
                                maxLength: { value: 255, message: "Máximo 255 caracteres" },
                                setValueAs: (value) => value === "" ? undefined : value,
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
                Guardar y continuar con pago
            </button>
        </form>
    );
};

export default GuestCheckoutAutocompleteFormV3;