import IGALogo from "../../../assets/logo/IGA-LOGO.webp"
import IMG1 from "../../../assets/info/IMG1.webp"
import IMG2 from "../../../assets/info/IMG2.webp"
import IMG3 from "../../../assets/info/IMG3.webp"
import IMG4 from "../../../assets/info/IMG4.webp"
import { Link, useNavigate } from "react-router-dom"
import { useForm, type SubmitHandler } from "react-hook-form"
import type { NewCustomerType } from "../AuthTypes"
import { useState } from "react"
import { useTriggerAlert } from "../../alerts/states/TriggerAlert"
import { getErrorMessage } from "../../../global/GlobalUtils"
import { registerCustomer } from "../services/authServices"

const CreateAccount = () => {
    const [error, setError] = useState<string>("");
    const { showTriggerAlert } = useTriggerAlert();
    const [loading, setLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<NewCustomerType>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<NewCustomerType> = async (data: NewCustomerType): Promise<void> => {
        try {
            setLoading(true);
            const response: string = await registerCustomer(data);
            showTriggerAlert("Successfull", response, { duration: 3500 });
            navigate("/iniciar-sesion");
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const images = [
        { url: IMG1, description: "Pago seguro" },
        { url: IMG2, description: "Soporte a compras" },
        { url: IMG3, description: "Protegemos tu información" },
        { url: IMG4, description: "Envio seguros a domicilio" }
    ];

    return (
        <div className="animate-fade-in-up flex item-center justify-center">
            <div className="w-60/100 bg-white rounded-xl shadow-lg py-10 px-5 items-start flex gap-10">
                <div className="w-65/100 h-full border-r border-r-gray-300 px-5 flex flex-col gap-10">
                    <h1 className="text-4xl/12 font-bold">Crea una cuenta en Iga Productos y realiza mas comoda tu experiencia de compra.</h1>
                    <div className="flex gap-15 mt-5">
                        {images.map((image, index) => (
                            <figure key={index}>
                                <img src={image.url} alt={`image-${index}`} />
                                <figcaption className="text-center">{image.description}</figcaption>
                            </figure>
                        ))}
                    </div>
                    <div className="bg-blue-950/90 rounded-xl p-5">
                        <img src={IGALogo} alt="IGA Logo" />
                    </div>
                </div>
                <div className="w-35/100">
                    <h1>Crear cuenta</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-5  [&_input]:w-full">
                        <section>
                            <label htmlFor="name">Nombre</label>
                            <input
                                {...register("name", {
                                    required: "El nombre es requerido",
                                    pattern: {
                                        value: /^[a-zA-Z ]+$/,
                                        message: "El nombre debe contener solo letras"
                                    }
                                })}
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nombre"
                                className="input input-bordered" />
                            <p className="text-red-500">{errors.name?.message}</p>
                        </section>
                        <section>
                            <label htmlFor="last_name">Apellidos</label>
                            <input
                                {...register("last_name", {
                                    required: "El apellido es requerido",
                                    pattern: {
                                        value: /^[a-zA-Z ]+$/,
                                        message: "El apellido debe contener solo letras"
                                    }
                                })}
                                type="text"
                                name="last_name"
                                id="last_name"
                                placeholder="Apellidos"
                                className="input input-bordered" />
                            <p className="text-red-500">{errors.last_name?.message}</p>
                        </section>
                        <section>
                            <label htmlFor="email">Correo Electronico</label>
                            <input
                                {...register("email", {
                                    required: "El correo es requerido",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "El correo debe ser valido"
                                    }
                                })}
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Correo Electronico"
                                className="input input-bordered" />
                            <p className="text-red-500">{errors.email?.message}</p>
                        </section>
                        <section>
                            <label htmlFor="password">Contraseña</label>
                            <input
                                {...register("password", {
                                    required: "La contraseña es requerida",
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
                                        message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
                                    }
                                })}
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Contraseña"
                                className="input input-bordered" />
                            <p className="text-red-500">{errors.password?.message}</p>
                        </section>
                        <section>
                            <label htmlFor="confirm_password">Confirmar Contraseña</label>
                            <input
                                {...register("confirm_password", {
                                    required: "La confirmación de la contraseña es requerida",
                                    validate: (value) => value === watch("password") || "Las contraseñas no coinciden"
                                })}
                                type="password"
                                name="confirm_password"
                                id="confirm_password"
                                placeholder="Confirmar Contraseña"
                                className="input input-bordered" />
                            <p className="text-red-500">{errors.confirm_password?.message}</p>
                        </section>
                        <button
                            className="btn btn-primary"
                            type="submit"
                            aria-label="Crear Cuenta">Crear Cuenta
                        </button>
                    </form>
                    <div className="mt-3 flex flex-col gap-2">
                        <p className="underline text-primary">¿Ya tienes una cuenta? <Link to="/iniciar-sesion">Iniciar sesión</Link></p>
                        <p className="underline text-primary">¿Olvidaste tu contraseña? <Link to="/recuperar-contraseña">Recuperar contraseña</Link></p>
                        <p className="text-xs">Al crear una cuenta en Iga Productos estas aceptando la poltica de privacidad y terminos y condiciones de la página.</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CreateAccount;