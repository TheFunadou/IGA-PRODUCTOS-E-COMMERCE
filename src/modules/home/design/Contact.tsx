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
        <div className="w-full bg-base-300 px-5 py-10 rounded-xl flex">
            <div className="w-1/2 pr-10">
                <p className="text-3xl font-bold">Contacto</p>
                <p className="mt-5 text-lg/8 text-justify">
                    ¡Llámanos o si lo deseas, completa el siguiente formulario con todos tus datos, recuerda completar todos los campos.
                    <br />
                    Selecciona un motivo para darte mejor una atención personalizada o si lo prefieres selecciona ser distribuidor, a fin de que un ejecutivo de ventas corporativas te ofrezca una propuesta de acuerdo a tu perfil.
                    <br />
                    <strong>¡Con tus respuestas nos ayudas a conocerte mejor!</strong>
                </p>
                <form action="" className="w-3/5 flex flex-col gap-3 [&_div]:flex [&_div]:flex-col [&_input]:w-full mt-5">
                    <div>
                        <section className="flex gap-2">
                            <article>
                                <label htmlFor="name">Nombre</label>
                                <input type="text" id="name" className="input"
                                    placeholder="Ingresa tu nombre" />
                            </article>
                            <article>
                                <label htmlFor="last_name">Apellidos</label>
                                <input type="text" id="last_name" className="input"
                                    placeholder="Ingresa tus apellidos" />
                            </article>
                        </section>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email">Correo electronico</label>
                        <input type="text" id="name" className="input" placeholder="ejem: alguien@correo.com" />
                    </div>
                    <div>
                        <label htmlFor="telephone">Número telefonico</label>
                        <section className="flex gap-3 items-center">
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
                                placeholder="Ingresa tu número telefonico"
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
                    <div>
                        <label htmlFor="company">Empresa</label>
                        <input type="text" id="company" className="input" placeholder="Ingresa el nombre de tu empresa" />
                    </div>
                    <div>
                        <label htmlFor="reason">Motivo</label>
                        <select defaultValue={"select"} id="reason" className="select w-full">
                            <option value="select" hidden>Elige un motivo</option>
                            <option value="Atención a cliente">Atención a cliente</option>
                            <option value="Quejas y sugerencias">Quejas y sugerencias</option>
                            <option value="Quiero ser distribuidor">Quiero ser distribuidor</option>
                            <option value="Quiero una cotización">Quiero una cotización</option>
                            <option value="Ventas">Ventas</option>
                            <option value="Facturación">Facturación</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="message">Mensaje</label>
                        <textarea id="message" className="textarea w-full" placeholder="Escribe un mensaje que desees transmitir" />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Enviar formulario</button>
                </form>
            </div>
            <div className="w-1/2">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3792.2139536792088!2d-94.45189435!3d18.10790835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85e98343453e5afd%3A0x22e09f3a6b82a914!2sIga%20Productos!5e0!3m2!1ses-419!2smx!4v1761233007110!5m2!1ses-419!2smx"
                    className="w-full h-full rounded-xl shadow-xl"
                    allowFullScreen
                    loading="lazy"
                >
                </iframe>
            </div>
        </div>
    );
};

export default Contact;