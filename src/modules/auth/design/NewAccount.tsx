import { FaGoogle } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../global/GlobalUtils";
import type { NewCustomerType } from "../AuthTypes";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { createCustomerService } from "../services/authServices";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";


const NewAccount = () => {

    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<NewCustomerType>();
    const { showTriggerAlert } = useTriggerAlert();
    const navigate = useNavigate();

    setValue("is_guest", false);

    const onSubmit: SubmitHandler<NewCustomerType> = async (data: NewCustomerType): Promise<void> => {
        try {
            setLoading(true);
            const response: string = await createCustomerService(data);
            showTriggerAlert("Successfull", response, { duration: 3500 });
            navigate("/iniciar-sesion");
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full py-10 flex flex-col items-center justify-center">

            <form onSubmit={handleSubmit(onSubmit)} className="w-2/5 bg-white shadow-lg px-5 pt-15 pb-30 rounded-xl">
                <p className="font-bold text-3xl text-center mb-5">Nueva cuenta</p>
                <div className="w-full flex">
                    <div className="w-1/2">
                        <div className="h-full flex flex-col gap-5 pr-5 border-r border-r-gray-300" >
                            <p className="font-bold">Información Personal</p>
                            <div className="w-full flex flex-col gap-2">
                                <label id="name" htmlFor="name">Nombre</label>
                                <input
                                    {
                                    ...register("name", {
                                        required: "El correo electronico es requerido"
                                    })
                                    }
                                    type="text"
                                    className="input w-full"
                                    placeholder="John" />
                            </div>
                            {errors && errors.name && <p>{errors.name.message}</p>}
                            <div className="w-full flex flex-col gap-2">
                                <label id="last_name" htmlFor="last_name">Apellidos</label>
                                <input
                                    {
                                    ...register("last_name", {
                                        required: "Los apellidos son requeridos"
                                    })
                                    }
                                    type="text"
                                    className="input w-full"
                                    placeholder="Doe" />
                            </div>
                            {errors && errors.last_name && <p>{errors.last_name.message}</p>}
                            <div className="w-full flex flex-col gap-2">
                                <label id="telephone" htmlFor="telephone">Número telefonico</label>
                                <input
                                    {
                                    ...register("contact_number", {
                                        required: "El numero telefonico es requerido"
                                    })
                                    }
                                    type="text"
                                    className="input w-full"
                                    placeholder="+52 ..." />
                            </div>
                            {errors && errors.contact_number && <p>{errors.contact_number.message}</p>}

                        </div>
                    </div>
                    <div className="w-1/2 pl-5">
                        <div className="w-full flex flex-col gap-5">
                            <p className="font-bold">Información de registro</p>
                            <div className="w-full flex flex-col gap-2">
                                <label id="email" htmlFor="email">Correo Electronico</label>
                                <input
                                    {
                                    ...register("email", {
                                        required: "El correo electronico es requerido"
                                    })
                                    }
                                    type="text"
                                    className="input w-full"
                                    placeholder="alguien@correo.com" />
                            </div>
                            {errors && errors.email && <p>{errors.email.message}</p>}
                            <div className="w-full flex flex-col gap-2">
                                <label id="email" htmlFor="email">Contraseña</label>
                                <input
                                    {
                                    ...register("password", {
                                        required: "La contraseña es requerida"
                                    })
                                    }
                                    type="password"
                                    className="input w-full"
                                    placeholder="contraseña" />
                            </div>
                            {errors && errors.password && <p>{errors.password.message}</p>}
                        </div>

                    </div>
                </div>
                <button type="submit" className="w-full mt-5 btn btn-primary cursor-pointer">
                    {loading ?
                        (
                            <p>Cargando <span className="loading loading-spinner loading-lg"></span></p>
                        ) : (
                            "Crear cuenta"
                        )}
                </button>
                {error.length > 0 && <p className="text-sm text-error mt-2">{error}</p>}
                <div className="text-xs">
                    <Link to="/iniciar-sesion"><p className="mt-3 underline text-blue-500">¿Ya tienes una cuenta?, Inicia sesión ahora</p></Link>
                    <p className="mt-5">Al continuar aceptas los <Link to="/politica-de-privacidad" className="underline text-blue-500 font-bold">terminos y condiciones</Link> y la politica de <Link to="/politica-de-privacidad" className="underline text-blue-500 font-bold">privacidad</Link> de la web.</p>
                </div>
            </form>
        </div>
    );
};

export default NewAccount;