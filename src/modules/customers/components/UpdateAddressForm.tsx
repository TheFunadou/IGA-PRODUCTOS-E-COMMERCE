import { useEffect, useState, type RefObject } from "react";
import CountriesAreaCodesJSON from "../../../global/json/CountriesAreaCodes.json"
import type { CountriesPhoneCodeType } from "../../../global/GlobalTypes";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { CustomerAddressType, NewAddressType } from "../CustomerTypes";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { getFormChanges } from "../../../global/GlobalHelpers";
import { useUpdateAddress } from "../hooks/useCustomer";

type Props = {
    versionData: CustomerAddressType | null;
    ref: RefObject<HTMLDialogElement | null>;
    address: string | undefined;
    customer: string | undefined;
    onUpdated: () => void;
};

const UpdateAddresssForm = ({ versionData, ref, address, onUpdated, customer }: Props) => {

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
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<Partial<NewAddressType>>({});
    const updateAddress = useUpdateAddress(customer);

    const restoreForm = () => {
        if (!versionData) return;
        reset({});
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
        const findDefaultCountry = CountriesAreaCodesJSON.find(country => country.phoneCode === versionData.country_phone_code.substring(1));
        setCurrentCountry(`https://flagsapi.com/${findDefaultCountry?.iso2!}/flat/64.png`);
        setAddressType(versionData.address_type);
    };

    useEffect(() => { if (versionData) restoreForm(); }, [versionData]);

    const onSubmit: SubmitHandler<Partial<NewAddressType>> = async (data: Partial<NewAddressType>) => {
        try {
            setError("");
            // await addAddress.mutateAsync(data);
            // onUpdated();
            if (!versionData) return;
            // Crear objeto solo con campos modificados
            const updatedFields: Partial<NewAddressType> = getFormChanges(versionData, data);
                        console.log(updatedFields);
            if (Object.keys(updatedFields).length === 0) { setError("Se necesita al menos actualizar un campo para actualizar la información"); return; }
            updateAddress.mutate({
                addressUUID: address!,
                data: updatedFields
            });
            onUpdated();
        } catch (error) {
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

    const handleClose = () => {
        restoreForm();
        setError("");
        ref.current?.close();
    };

    return (
        <dialog id="my_modal_3" className="modal" ref={ref}>
            {/* <button type="button" className="btn btn-primary" onClick={() => {console.log(address)}}>clic</button> */}
            <div className="modal-box h-200 overflow-y-scroll">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => handleClose()}>✕</button>
                </form>
                <h3 className="font-bold text-2xl">Actualizar dirección de envio</h3>
                <form className="mt-3 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="border border-gray-300 rounded-xl pt-2 pb-5 px-5">
                        <legend className="text-lg px-3" title="Persona que recibira el paquete">Información del remitente</legend>
                        <div className="w-full flex flex-col gap-2 [&_div]:flex [&_div]:flex-col">
                            <div>
                                <label htmlFor="name">Nombre</label>
                                <input
                                    type="text"
                                    className="input w-full"
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
                                {errors.recipient_name && <p className="text-error text-sm">{errors.recipient_name.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="last_names">Apellidos</label>
                                <input
                                    type="text"
                                    className="input w-full"
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
                                {errors.recipient_last_name && <p className="text-error text-sm">{errors.recipient_last_name.message}</p>}
                            </div>
                            {/* <div>
                                <label htmlFor="email">Correo electronico</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    placeholder="alguien@correo.com" 
                                    {...register("",
                                        {
                                            required: "Los apellidos del remitente es requerido",
                                            pattern: {
                                                value: /^[A-Za-z\s]+$/,
                                                message: "Solo se admiten mayusculas, minusculas y espacios"
                                            }
                                        }
                                    )}
                                    />
                            </div> */}
                            <div>
                                <label htmlFor="email">Número telefonico</label>
                                <article className="flex gap-3">
                                    <figure className="w-10/100">
                                        <img src={currentCountry} alt={country.nameES} />
                                    </figure>
                                    <select
                                        defaultValue={JSON.stringify(defualtCountry)}
                                        className="w-20/100 select"
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
                                        className="input w-65/100"
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
                                {errors.contact_number && <p className="text-error text-sm">{errors.contact_number.message}</p>}
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="border border-gray-300 rounded-xl pt-2 pb-5 px-5">
                        <legend className="text-lg px-3" title="Persona que recibira el paquete">Información del domicilio de entrega</legend>
                        <div className="w-full flex flex-col gap-2 [&_div]:flex [&_div]:flex-col">
                            <div>
                                <label htmlFor="country">País</label>
                                <input
                                    type="text"
                                    className="input w-full"
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
                                {errors.country && <p className="text-error text-sm">{errors.country.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="state">Estado</label>
                                <input
                                    type="text"
                                    className="input w-full"
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
                                {errors.state && <p className="text-error text-sm">{errors.state.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="city">Ciudad</label>
                                <input
                                    type="text"
                                    className="input w-full"
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
                                {errors.city && <p className="text-error text-sm">{errors.city.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="locality">Localidad</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    placeholder="Ingresa tu ciudad"
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
                                {errors.locality && <p className="text-error text-sm">{errors.locality.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="street">Calle</label>
                                <input
                                    type="text"
                                    className="input w-full"
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
                                {errors.street_name && <p className="text-error text-sm">{errors.street_name.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="neighborhood">Colonia/Fraccionamiento</label>
                                <input
                                    type="text"
                                    className="input w-full"
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
                                {errors.neighborhood && <p className="text-error text-sm">{errors.neighborhood.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="postal_code">Código postal</label>
                                <input
                                    type="text"
                                    className="input w-full"
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
                                {errors.zip_code && <p className="text-error text-sm">{errors.zip_code.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="address_type">Tipo de dirección</label>
                                <select
                                    className="select w-full"
                                    {...register("address_type")}
                                    onChange={(e) => setAddressType(e.target.value)}
                                    defaultValue={"Casa"}
                                >
                                    <option value="Casa">Casa</option>
                                    <option value="Trabajo">Trabajo</option>
                                    <option value="Departamento">Departamento</option>
                                </select>
                            </div>
                            <article className="flex gap-4">
                                {addressType === "Departamento" &&
                                    <div>
                                        <label htmlFor="Piso">Piso</label>
                                        <input
                                            type="number"
                                            className="input w-full"
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
                                <div className="w-2/5">
                                    <label htmlFor="num_ext">Número Exterior</label>
                                    <input
                                        type="text"
                                        className="input w-full"
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
                                <div>
                                    <label htmlFor="num_int">Número Interior</label>
                                    <input
                                        type="text"
                                        className="input w-full"
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
                            {errors.number && <p className="text-error text-sm">{errors.number.message}</p>}
                            {errors.aditional_number && <p className="text-error text-sm">{errors.aditional_number.message}</p>}
                        </div>
                    </fieldset>
                    <fieldset className="border border-gray-300 rounded-xl pt-2 pb-5 px-5">
                        <legend className="text-lg px-3" title="Persona que recibira el paquete">Información adicional</legend>
                        <div className="w-full flex flex-col gap-2 [&_div]:flex [&_div]:flex-col">
                            <div>
                                <label htmlFor="aditional_comments">Comentarios o referencias</label>
                                <textarea
                                    className="textarea w-full"
                                    placeholder="Referencias visuales, información adicional,etc..."
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
                                {errors.references_or_comments && <p className="text-error text-sm">{errors.references_or_comments.message}</p>}
                            </div>
                        </div>
                    </fieldset>
                    <article className="flex gap-2 items-center">
                        <input
                            type="checkbox"
                            className="checkbox"
                            placeholder="Veracruz"
                            {...register("default_address")}
                        />
                        <label htmlFor="state">Utilizar esta dirección de envio como predeterminada</label>
                    </article>
                    {errors.default_address && <p className="text-error text-sm">{errors.default_address.message}</p>}
                    <button type="submit" className="btn btn-primary mt-5">Guardar dirección de envio</button>
                    {error && error.length > 0 && <p className="text-error">{error}</p>}
                </form>
            </div>
        </dialog>
    );
};

export default UpdateAddresssForm;