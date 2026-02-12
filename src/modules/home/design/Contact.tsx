import { useForm } from "react-hook-form";
import type { CountriesPhoneCodeType } from "../../../global/GlobalTypes";
import CountriesAreaCodesJSON from "../../../global/json/CountriesAreaCodes.json"
import { useEffect, useState } from "react";

const Contact = () => {
    const defualtCountry: CountriesPhoneCodeType = {
        "nameES": "México",
        "nameEN": "Mexico",
        "iso2": "MX",
        "iso3": "MEX",
        "phoneCode": "+52"
    };
    const [country, setCountry] = useState<CountriesPhoneCodeType>(defualtCountry);
    const [currentCountry, setCurrentCountry] = useState<string>("https://flagsapi.com/MX/flat/64.png");

    useEffect(() => {
        setCurrentCountry(`https://flagsapi.com/${country.iso2}/flat/64.png`);
        // setValue("country_phone_code", country.phoneCode, {
        //     shouldValidate: true,
        //     shouldDirty: true
        // });
    }, [country]);

    const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<ContactForm>();

    return (
        <div className="w-full bg-base-300 px-3 sm:px-5 py-6 sm:py-10 rounded-xl flex flex-col lg:flex-row gap-6 lg:gap-0">
            {/* Form Section */}
            <div className="w-full lg:w-1/2 lg:pr-10">
                <p className="text-2xl sm:text-3xl font-bold">Contacto</p>
                <p className="mt-3 sm:mt-5 text-base sm:text-lg leading-6 sm:leading-8 text-justify">
                    ¡Llámanos o si lo deseas, completa el siguiente formulario con todos tus datos, recuerda completar todos los campos.
                    <br />
                    Selecciona un motivo para darte mejor una atención personalizada o si lo prefieres selecciona ser distribuidor, a fin de que un ejecutivo de ventas corporativas te ofrezca una propuesta de acuerdo a tu perfil.
                    <br />
                    <strong>¡Con tus respuestas nos ayudas a conocerte mejor!</strong>
                </p>

                {/* Form - Responsive */}
                <form action="" className="w-full md:w-4/5 lg:w-3/5 flex flex-col gap-3 sm:gap-3 [&_div]:flex [&_div]:flex-col [&_input]:w-full mt-4 sm:mt-5">
                    {/* Name and Last Name - Responsive */}
                    <div>
                        <section className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                            <article className="w-full sm:w-1/2">
                                <label htmlFor="name" className="text-sm sm:text-base">Nombre</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="input text-sm sm:text-base"
                                    placeholder="Ingresa tu nombre"
                                />
                            </article>
                            <article className="w-full sm:w-1/2">
                                <label htmlFor="last_name" className="text-sm sm:text-base">Apellidos</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    className="input text-sm sm:text-base"
                                    placeholder="Ingresa tus apellidos"
                                />
                            </article>
                        </section>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm sm:text-base">Correo electronico</label>
                        <input
                            type="email"
                            id="email"
                            className="input text-sm sm:text-base"
                            placeholder="ejem: alguien@correo.com"
                        />
                    </div>

                    {/* Phone Number - Responsive */}
                    <div>
                        <label htmlFor="telephone" className="text-sm sm:text-base">Número telefonico</label>
                        <section className="flex gap-2 sm:gap-3 items-center">
                            <figure className="w-10 sm:w-12 flex-shrink-0">
                                <img
                                    src={currentCountry}
                                    alt={country.nameES}
                                    className="w-full h-auto"
                                />
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
                                className="input input-sm sm:input-md flex-1 text-sm sm:text-base"
                                placeholder="Ingresa tu número"
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
                        </section>
                    </div>

                    {/* Company */}
                    <div>
                        <label htmlFor="company" className="text-sm sm:text-base">Empresa</label>
                        <input
                            type="text"
                            id="company"
                            className="input text-sm sm:text-base"
                            placeholder="Ingresa el nombre de tu empresa"
                        />
                    </div>

                    {/* Reason */}
                    <div>
                        <label htmlFor="reason" className="text-sm sm:text-base">Motivo</label>
                        <select
                            defaultValue={"select"}
                            id="reason"
                            className="select w-full text-sm sm:text-base"
                        >
                            <option value="select" hidden>Elige un motivo</option>
                            <option value="Atención a cliente">Atención a cliente</option>
                            <option value="Quejas y sugerencias">Quejas y sugerencias</option>
                            <option value="Quiero ser distribuidor">Quiero ser distribuidor</option>
                            <option value="Quiero una cotización">Quiero una cotización</option>
                            <option value="Ventas">Ventas</option>
                            <option value="Facturación">Facturación</option>
                        </select>
                    </div>

                    {/* Message */}
                    <div>
                        <label htmlFor="message" className="text-sm sm:text-base">Mensaje</label>
                        <textarea
                            id="message"
                            className="textarea w-full text-sm sm:text-base"
                            placeholder="Escribe un mensaje que desees transmitir"
                            rows={4}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full text-sm sm:text-base"
                    >
                        Enviar formulario
                    </button>
                </form>
            </div>

            {/* Map Section - Responsive */}
            <div className="w-full lg:w-1/2 h-64 sm:h-96 lg:h-auto">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3792.2139536792088!2d-94.45189435!3d18.10790835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85e98343453e5afd%3A0x22e09f3a6b82a914!2sIga%20Productos!5e0!3m2!1ses-419!2smx!4v1761233007110!5m2!1ses-419!2smx"
                    className="w-full h-full rounded-xl shadow-xl"
                    allowFullScreen
                    loading="lazy"
                    title="Ubicación de IGA Productos"
                >
                </iframe>
            </div>
        </div>
    );
};

export default Contact;