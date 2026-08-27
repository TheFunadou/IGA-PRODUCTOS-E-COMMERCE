import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaShippingFast, FaUserAlt } from "react-icons/fa";
import type { GuestCreateOrderFormType } from "../../customers/CustomerTypes";
import type { CountriesPhoneCodeType } from "../../../global/GlobalTypes";
import CountriesAreaCodesJSON from "../../../global/json/CountriesAreaCodes.json";
import clsx from "clsx";

interface GuestCheckoutFormV3Props {
    onSave: (data: GuestCreateOrderFormType) => void;
    guestAddress?: GuestCreateOrderFormType | null;
}

const GuestCheckoutFormV3 = ({ onSave, guestAddress }: GuestCheckoutFormV3Props) => {
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
        setValue("countryPhoneCode", country.phoneCode, { shouldValidate: true, shouldDirty: true });
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
                        <label className="text-xs text-base-content/60 mb-1 block">Número interior <span className="text-base-content/40">(opcional)</span></label>
                        <input
                            {...register("aditionalNumber", {
                                pattern: { value: /^[a-zA-Z0-9\-]{0,10}$/, message: "Número inválido" },
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

export default GuestCheckoutFormV3;
