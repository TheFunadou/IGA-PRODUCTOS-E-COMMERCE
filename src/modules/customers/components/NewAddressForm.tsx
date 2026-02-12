import { useEffect, useState, type RefObject } from "react";
import CountriesAreaCodesJSON from "../../../global/json/CountriesAreaCodes.json"
import type { CountriesPhoneCodeType } from "../../../global/GlobalTypes";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { NewAddressType } from "../CustomerTypes";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { useAddAddress } from "../hooks/useCustomer";

type Props = {
    ref: RefObject<HTMLDialogElement | null>;
    onCreated: () => void;
};

const NewAddressForm = ({ ref, onCreated }: Props) => {
    const defualtCountry: CountriesPhoneCodeType = {
        "nameES": "México",
        "nameEN": "Mexico",
        "iso2": "MX",
        "iso3": "MEX",
        "phoneCode": "+52"
    };
    const [country, setCountry] = useState<CountriesPhoneCodeType>(defualtCountry);
    const [currentCountry, setCurrentCountry] = useState<string>("https://flagsapi.com/MX/flat/64.png");
    const [addressType, setAddressType] = useState<string>("Casa");
    const [error, setError] = useState<string>("");
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<NewAddressType>({ defaultValues: { default_address: false, floor: undefined } });
    const addAddress = useAddAddress();

    const onSubmit: SubmitHandler<NewAddressType> = async (data: NewAddressType) => {
        try {
            console.log("Data", JSON.stringify(data, null, 2))
            await addAddress.mutateAsync(data);
            reset();
            setCountry(defualtCountry);
            onCreated();
        } catch (error) {
            console.log("Error", error);
            setError(getErrorMessage(error));
        };
    };

    useEffect(() => {
        setCurrentCountry(`https://flagsapi.com/${country.iso2}/flat/64.png`);
        setValue("country_phone_code", country.phoneCode, {
            shouldValidate: true,
            shouldDirty: true
        });
    }, [country]);

    return (
        <dialog id="my_modal_3" className="modal" ref={ref}>
            <div className="modal-box max-w-full sm:max-w-2xl lg:max-w-4xl h-auto max-h-[90vh] overflow-y-scroll px-4 sm:px-6 py-6">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>

                <h3 className="font-bold text-xl sm:text-2xl mb-4">Nueva dirección de envio</h3>

                <form className="mt-3 flex flex-col gap-4 sm:gap-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Información del Remitente */}
                    <fieldset className="border border-gray-300 rounded-xl pt-2 pb-4 sm:pb-5 px-3 sm:px-5">
                        <legend className="text-base sm:text-lg px-2 sm:px-3" title="Persona que recibira el paquete">
                            Información del remitente
                        </legend>
                        <div className="w-full flex flex-col gap-3 sm:gap-2 [&_div]:flex [&_div]:flex-col">
                            {/* Nombre y Apellidos */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="name" className="text-sm sm:text-base">Nombre</label>
                                    <input
                                        type="text"
                                        className="input w-full text-sm sm:text-base"
                                        placeholder="Nombre del remitente"
                                        {...register("recipient_name",
                                            {
                                                required: "El nombre del remitente es requerido",
                                                maxLength: { value: 40, message: "Solo se admiten un máximo de 40 caracteres" },
                                                pattern: {
                                                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                                    message: "Solo se admiten mayusculas, minusculas y espacios"
                                                }
                                            }
                                        )}
                                    />
                                    {errors.recipient_name && <p className="text-error text-xs sm:text-sm mt-1">{errors.recipient_name.message}</p>}
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="last_names" className="text-sm sm:text-base">Apellidos</label>
                                    <input
                                        type="text"
                                        className="input w-full text-sm sm:text-base"
                                        placeholder="Apellidos del destinatario"
                                        {...register("recipient_last_name",
                                            {
                                                required: "Los apellidos del remitente son requeridos",
                                                maxLength: { value: 60, message: "Solo se admiten un máximo de 60 caracteres" },
                                                pattern: {
                                                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                                    message: "Solo se admiten mayusculas, minusculas y espacios"
                                                }
                                            }
                                        )}
                                    />
                                    {errors.recipient_last_name && <p className="text-error text-xs sm:text-sm mt-1">{errors.recipient_last_name.message}</p>}
                                </div>
                            </div>

                            {/* Número Telefónico */}
                            <div>
                                <label htmlFor="email" className="text-sm sm:text-base">Número telefonico</label>
                                <article className="flex gap-2 sm:gap-3 items-center">
                                    <figure className="w-10 sm:w-12 flex-shrink-0">
                                        <img src={currentCountry} alt={country.nameES} className="w-full h-auto" />
                                    </figure>
                                    <select
                                        defaultValue={JSON.stringify(defualtCountry)}
                                        className="w-20 sm:w-24 select select-sm sm:select-md text-xs sm:text-base flex-shrink-0"
                                        onChange={(e) => { setCountry(JSON.parse(e.target.value)) }}
                                    >
                                        {CountriesAreaCodesJSON.map((data, index) => (
                                            <option
                                                key={index}
                                                value={JSON.stringify({
                                                    nameES: data.nameES,
                                                    nameEN: data.nameEN,
                                                    iso2: data.iso2,
                                                    iso3: data.iso3,
                                                    phoneCode: `+${data.phoneCode}`
                                                })}>
                                                {data.iso3}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        className="input flex-1 text-sm sm:text-base"
                                        placeholder="Número"
                                        {...register("contact_number",
                                            {
                                                required: "El número telefonico del remitente es requerido",
                                                pattern: {
                                                    value: /^[0-9]{7,15}$/,
                                                    message: "Solo se admiten valores númericos y el número debe tener entre 7 y 15 digitos"
                                                }
                                            }
                                        )}
                                    />
                                </article>
                                {errors.contact_number && <p className="text-error text-xs sm:text-sm mt-1">{errors.contact_number.message}</p>}
                            </div>
                        </div>
                    </fieldset>

                    {/* Información del Domicilio */}
                    <fieldset className="border border-gray-300 rounded-xl pt-2 pb-4 sm:pb-5 px-3 sm:px-5">
                        <legend className="text-base sm:text-lg px-2 sm:px-3" title="Persona que recibira el paquete">
                            Información del domicilio de entrega
                        </legend>
                        <div className="w-full flex flex-col gap-3 sm:gap-2 [&_div]:flex [&_div]:flex-col">
                            {/* País y Estado */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="country" className="text-sm sm:text-base">País</label>
                                    <input
                                        type="text"
                                        className="input w-full text-sm sm:text-base"
                                        placeholder="México"
                                        {...register("country",
                                            {
                                                required: "El país es requerido",
                                                maxLength: { value: 40, message: "Solo se admiten un máximo de 40 caracteres" },
                                                pattern: {
                                                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                                    message: "Solo se admiten mayusculas, minusculas y espacios"
                                                }
                                            }
                                        )}
                                    />
                                    {errors.country && <p className="text-error text-xs sm:text-sm mt-1">{errors.country.message}</p>}
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="state" className="text-sm sm:text-base">Estado</label>
                                    <input
                                        type="text"
                                        className="input w-full text-sm sm:text-base"
                                        placeholder="Veracruz"
                                        {...register("state",
                                            {
                                                required: "El estado/departamento es requerido",
                                                maxLength: { value: 40, message: "Solo se admiten un máximo de 40 caracteres" },
                                                pattern: {
                                                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                                    message: "Solo se admiten mayusculas, minusculas y espacios"
                                                }
                                            }
                                        )}
                                    />
                                    {errors.state && <p className="text-error text-xs sm:text-sm mt-1">{errors.state.message}</p>}
                                </div>
                            </div>

                            {/* Ciudad y Localidad */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="city" className="text-sm sm:text-base">Ciudad</label>
                                    <input
                                        type="text"
                                        className="input w-full text-sm sm:text-base"
                                        placeholder="Ingresa tu ciudad"
                                        {...register("city",
                                            {
                                                required: "La ciudad/alcaldia es requerida",
                                                maxLength: { value: 50, message: "Solo se admiten un máximo de 50 caracteres" },
                                                pattern: {
                                                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                                    message: "Solo se admiten mayusculas, minusculas y espacios"
                                                }
                                            }
                                        )}
                                    />
                                    {errors.city && <p className="text-error text-xs sm:text-sm mt-1">{errors.city.message}</p>}
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="locality" className="text-sm sm:text-base">Localidad</label>
                                    <input
                                        type="text"
                                        className="input w-full text-sm sm:text-base"
                                        placeholder="Ingresa tu localidad"
                                        {...register("locality",
                                            {
                                                required: "La localidad es requerida",
                                                maxLength: { value: 50, message: "Solo se admiten un máximo de 50 caracteres" },
                                                pattern: {
                                                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                                    message: "Solo se admiten mayusculas, minusculas y espacios"
                                                }
                                            }
                                        )}
                                    />
                                    {errors.locality && <p className="text-error text-xs sm:text-sm mt-1">{errors.locality.message}</p>}
                                </div>
                            </div>

                            {/* Calle */}
                            <div>
                                <label htmlFor="street" className="text-sm sm:text-base">Calle</label>
                                <input
                                    type="text"
                                    className="input w-full text-sm sm:text-base"
                                    placeholder="Ingresa tu calle"
                                    {...register("street_name",
                                        {
                                            required: "La calle es requerida",
                                            maxLength: { value: 60, message: "Solo se admiten un máximo de 60 caracteres" },
                                            pattern: {
                                                value: /^(?=.{2,100}$)(?=.*\p{L})[\p{L}\p{N}\s.'-]+$/u,
                                                message: "Solo se admiten mayusculas, minusculas, espacios y numeros"
                                            }
                                        }
                                    )}
                                />
                                {errors.street_name && <p className="text-error text-xs sm:text-sm mt-1">{errors.street_name.message}</p>}
                            </div>

                            {/* Colonia */}
                            <div>
                                <label htmlFor="neighborhood" className="text-sm sm:text-base">Colonia/Fraccionamiento</label>
                                <input
                                    type="text"
                                    className="input w-full text-sm sm:text-base"
                                    placeholder="Ingresa tu colonia, fraccionamiento, barrio, etc..."
                                    {...register("neighborhood",
                                        {
                                            required: "La colonia/fracccionamiento/barrio es requerido",
                                            maxLength: { value: 60, message: "Solo se admiten un máximo de 60 caracteres" },
                                            pattern: {
                                                value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
                                                message: "Solo se admiten mayusculas, minusculas, espacios y numeros"
                                            }
                                        }
                                    )}
                                />
                                {errors.neighborhood && <p className="text-error text-xs sm:text-sm mt-1">{errors.neighborhood.message}</p>}
                            </div>

                            {/* Código Postal y Tipo de Dirección */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="postal_code" className="text-sm sm:text-base">Código postal</label>
                                    <input
                                        type="text"
                                        className="input w-full text-sm sm:text-base"
                                        placeholder="Ingresa tu código postal"
                                        {...register("zip_code",
                                            {
                                                required: "El código postal es requerido",
                                                minLength: 3,
                                                maxLength: { value: 10, message: "Solo se admiten un máximo de 10 caracteres" },
                                                pattern: {
                                                    value: /^(?!.*-.*-)[0-9-]+$/,
                                                    message: "Solo se admiten números y guiones"
                                                }
                                            }
                                        )}
                                    />
                                    {errors.zip_code && <p className="text-error text-xs sm:text-sm mt-1">{errors.zip_code.message}</p>}
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="address_type" className="text-sm sm:text-base">Tipo de dirección</label>
                                    <select
                                        className="select w-full text-sm sm:text-base"
                                        {...register("address_type")}
                                        onChange={(e) => setAddressType(e.target.value)}
                                        defaultValue={"Casa"}
                                    >
                                        <option value="Casa">Casa</option>
                                        <option value="Trabajo">Trabajo</option>
                                        <option value="Departamento">Departamento</option>
                                    </select>
                                </div>
                            </div>

                            {/* Números Exterior e Interior */}
                            <article className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                {addressType === "Departamento" &&
                                    <div className="w-full sm:w-1/3">
                                        <label htmlFor="Piso" className="text-sm sm:text-base">Piso</label>
                                        <input
                                            type="number"
                                            className="input w-full text-sm sm:text-base"
                                            placeholder="ejem: 1"
                                            {...register("floor",
                                                {
                                                    maxLength: { value: 3, message: "Solo se admiten un máximo de 3 caracteres" },
                                                    setValueAs: (value) => value === "" ? undefined : value
                                                }
                                            )}
                                        />
                                    </div>
                                }
                                <div className={`w-full ${addressType === "Departamento" ? "sm:w-1/3" : "sm:w-1/2"}`}>
                                    <label htmlFor="num_ext" className="text-sm sm:text-base">Número Exterior</label>
                                    <input
                                        type="text"
                                        className="input w-full text-sm sm:text-base"
                                        placeholder="ejem: 100A"
                                        {...register("number",
                                            {
                                                required: "El número del domicilio es requerido",
                                                maxLength: { value: 6, message: "Solo se admiten un máximo de 6 caracteres" },
                                                pattern: {
                                                    value: /^[1-9][0-9]*[A-Z]?$/,
                                                    message: "Número: solo se admiten números y una sola mayuscula"
                                                }
                                            }
                                        )}
                                    />
                                </div>
                                <div className={`w-full ${addressType === "Departamento" ? "sm:w-1/3" : "sm:w-1/2"}`}>
                                    <label htmlFor="num_int" className="text-sm sm:text-base">Número Interior</label>
                                    <input
                                        type="text"
                                        className="input w-full text-sm sm:text-base"
                                        placeholder={addressType === "Departamento" ? "ejem: 14" : "Opcional"}
                                        {...register("aditional_number",
                                            {
                                                maxLength: { value: 6, message: "Solo se admiten un máximo de 6 caracteres" },
                                                pattern: {
                                                    value: /^[1-9][0-9]*[A-Z]?$/,
                                                    message: "Número interior: solo se admiten números y una sola mayuscula"
                                                },
                                                setValueAs: (value) => value === "" ? undefined : value
                                            }
                                        )}
                                    />
                                </div>
                            </article>
                            {errors.number && <p className="text-error text-xs sm:text-sm mt-1">{errors.number.message}</p>}
                            {errors.aditional_number && <p className="text-error text-xs sm:text-sm mt-1">{errors.aditional_number.message}</p>}
                        </div>
                    </fieldset>

                    {/* Información Adicional */}
                    <fieldset className="border border-gray-300 rounded-xl pt-2 pb-4 sm:pb-5 px-3 sm:px-5">
                        <legend className="text-base sm:text-lg px-2 sm:px-3" title="Persona que recibira el paquete">
                            Información adicional
                        </legend>
                        <div className="w-full flex flex-col gap-3 sm:gap-2 [&_div]:flex [&_div]:flex-col">
                            <div>
                                <label htmlFor="aditional_comments" className="text-sm sm:text-base">Comentarios o referencias</label>
                                <textarea
                                    className="textarea w-full text-sm sm:text-base"
                                    placeholder="Referencias visuales, información adicional,etc..."
                                    rows={3}
                                    {...register("references_or_comments",
                                        {
                                            maxLength: {
                                                value: 80,
                                                message: "Solo se permiten un máximo de 80 caracteres"
                                            },
                                            setValueAs: (value) => value === "" ? undefined : value
                                        }
                                    )}
                                />
                                {errors.references_or_comments && <p className="text-error text-xs sm:text-sm mt-1">{errors.references_or_comments.message}</p>}
                            </div>
                        </div>
                    </fieldset>

                    {/* Checkbox Dirección Predeterminada */}
                    <article className="flex gap-2 items-start sm:items-center">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-sm sm:checkbox-md mt-1 sm:mt-0 flex-shrink-0"
                            {...register("default_address")}
                        />
                        <label htmlFor="state" className="text-sm sm:text-base">
                            Utilizar esta dirección de envio como predeterminada
                        </label>
                    </article>
                    {errors.default_address && <p className="text-error text-xs sm:text-sm">{errors.default_address.message}</p>}

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary mt-3 sm:mt-5 w-full text-sm sm:text-base">
                        Guardar dirección de envio
                    </button>
                    {error.length > 0 && <p className="text-error text-sm sm:text-base">{error}</p>}
                </form>
            </div>
        </dialog>
    );
};

export default NewAddressForm;