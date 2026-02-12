import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { AuthCustomerCredentialsType } from "../AuthTypes";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { FaGoogle } from "react-icons/fa";
import { useAuthStore } from "../states/authStore";
import { useThemeStore } from "../../../layouts/states/themeStore";
import clsx from "clsx";


const Login = () => {
    const { theme } = useThemeStore();
    const [loading, setLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm<AuthCustomerCredentialsType>();
    const { login, error, isAuth, clearError } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<AuthCustomerCredentialsType> = async (data: AuthCustomerCredentialsType): Promise<void> => {
        try {
            console.log(error)
            setLoading(true);
            await login(data);
        } catch (error) {
            console.error("Inicio de sesión fallido")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuth) navigate("/");
    }, [isAuth, navigate]);

    useEffect(() => { clearError(); }, [location.pathname])

    return (
        <div className="w-full py-10 flex items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="md:w-1/5 shadow-lg px-5 pt-15 pb-30 rounded-xl bg-base-100">
                <p className="font-bold text-3xl border-b border-b-gray-400 pb-5">Inicio de Sesión</p>

                <div className="mt-5 flex flex-col gap-5">
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
                    <button type="submit" className="w-full mt-5 btn btn-primary cursor-pointer">
                        {loading ?
                            (
                                <p>Cargando <span className="loading loading-dots loading-base"></span></p>
                            ) : (
                                "Iniciar Sesión"
                            )}
                    </button>
                    {error && <p className="text-error">{error}</p>}
                </div>
                <div>
                    <Link to="/restaurar-contraseña"><p className="mt-3 underline text-blue-500 cursor-pointer">¿Olvidaste tu constraseña?</p></Link>
                    <Link to="/nueva-cuenta"><p className="mt-1 underline text-blue-500">¿Aun no tienes una cuenta? Crea una ahora mismo</p></Link>
                    <p className="mt-10 text-sm">Al continuar aceptas los <Link to="/politica-de-privacidad" className="underline text-blue-500 font-bold">terminos y condiciones</Link> y la politica de <Link to="/politica-de-privacidad" className="underline text-blue-500 font-bold">privacidad</Link> de la web.</p>
                </div>

            </form>
        </div>
    );
};

export default Login;