import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { AuthCustomerCredentialsType } from "../AuthTypes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../states/authStore";
import { GoogleLogin } from "@react-oauth/google";
import clsx from "clsx";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import IGALogo from "../../../assets/logo/IGA-LOGO.webp";
import IMG1 from "../../../assets/info/IMG1.webp";
import IMG2 from "../../../assets/info/IMG2.webp";
import IMG3 from "../../../assets/info/IMG3.webp";
import IMG4 from "../../../assets/info/IMG4.webp";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode; }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600 tracking-wide">
                {label}
            </label>
            {children}
            {error && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-error">
                    <span className="text-[10px]">⚠</span>
                    {error}
                </p>
            )}
        </div>
    );
}

function inputCls(hasError?: boolean) {
    return clsx(
        "w-full h-10 px-4 rounded-md text-sm text-slate-900 outline-none transition-all duration-150",
        "border bg-slate-50 placeholder:text-slate-400",
        "hover:border-slate-400",
        "focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10",
        hasError
            ? "border-red-400 bg-red-50 focus:ring-red-400/10 focus:border-red-400"
            : "border-slate-200"
    );
}

function Spinner({ dark = false }: { dark?: boolean }) {
    return (
        <span className={clsx(
            "inline-block w-4 h-4 rounded-full border-2 animate-spin",
            dark ? "border-blue-200 border-t-blue-600" : "border-white/30 border-t-white"
        )} />
    );
}

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<AuthCustomerCredentialsType>();
    const { login, loginWithGoogle, error, isAuth, clearError } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const { showTriggerAlert } = useTriggerAlert();
    const [submitting, setSubmitting] = useState(false);

    // Recaptcha hook
    const { executeRecaptcha } = useGoogleReCaptcha();

    const onSubmit: SubmitHandler<AuthCustomerCredentialsType> = async (data: AuthCustomerCredentialsType) => {
        try {
            setSubmitting(true);

            // Execute recaptcha si está disponible
            let _recaptchaToken = "";
            if (executeRecaptcha) {
                _recaptchaToken = await executeRecaptcha('login');
            }
            // Enviamos el data modificado con el token
            await login({ ...data, recaptchaToken: _recaptchaToken });
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setSubmitting(true);
            const { credential } = credentialResponse;
            if (credential) {
                await loginWithGoogle(credential);
            }
        } catch (err) {
            console.error("Error with Google Login", err);
            showTriggerAlert("Error", "Error al iniciar sesión con Google", { duration: 3000 });
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (isAuth) navigate("/");
    }, [isAuth, navigate]);

    useEffect(() => { clearError(); }, [location.pathname, clearError]);

    const btnPrimary =
        "mt-2 w-full h-[42px] flex items-center justify-center gap-2 rounded-md " +
        "bg-primary text-white text-sm font-semibold tracking-wide transition-all duration-150 " +
        "hover:bg-blue-700 hover:shadow-[0_4px_12px_rgba(29,78,216,0.3)] " +
        "active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed";

    const trustItems = [
        { url: IMG1, label: "Pago 100% seguro" },
        { url: IMG2, label: "Soporte a tus compras" },
        { url: IMG3, label: "Datos protegidos" },
        { url: IMG4, label: "Envíos garantizados" },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-base-300 rounded-xl">
            <div className="w-full max-w-[960px] flex overflow-hidden rounded-2xl
        shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06),0_20px_40px_rgba(0,0,0,0.06)]">

                <div className="relative w-[52%] bg-slate-900 px-10 py-12 flex flex-col justify-between overflow-hidden">
                    {/* Gradiente ambiental */}
                    <div className="pointer-events-none absolute inset-0 opacity-100
            bg-[radial-gradient(ellipse_70%_50%_at_20%_80%,rgba(29,78,216,0.45)_0%,transparent_60%)]" />
                    <div className="pointer-events-none absolute inset-0
            bg-[radial-gradient(ellipse_40%_40%_at_85%_10%,rgba(59,130,246,0.18)_0%,transparent_55%)]" />

                    {/* Logo */}
                    <img src={IGALogo} alt="IGA Productos" className="relative z-10 w-20" />

                    {/* Headline editorial */}
                    <h1 className="relative z-10 mt-10 text-[2.1rem] leading-[1.18] font-normal
            text-white tracking-[-0.01em] font-serif">
                        Bienvenido de nuevo a tu tienda en línea{" "}
                    </h1>

                    {/* Trust badges */}
                    <div className="relative z-10 mt-8 grid grid-cols-2 gap-3">
                        {trustItems.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 rounded-xl
                  border border-white/10 bg-white/[0.06] backdrop-blur-sm
                  px-4 py-3 transition-colors duration-150 hover:bg-white/[0.09]"
                            >
                                <div className="w-9 h-9 rounded-md overflow-hidden flex-shrink-0 bg-white/10">
                                    <img
                                        src={item.url}
                                        alt={item.label}
                                        className="w-full h-full object-cover brightness-110"
                                    />
                                </div>
                                <span className="text-[0.74rem] font-medium text-slate-200/80 leading-snug">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Panel derecho: formulario */}
                <div className="w-[48%] bg-white px-10 py-12 flex flex-col overflow-y-auto">

                    <h2 className="text-[1.35rem] font-semibold text-slate-900 tracking-tight mb-1">
                        Iniciar sesión
                    </h2>
                    <p className="text-[0.82rem] text-slate-400 mb-6 leading-relaxed">
                        Ingresa tus datos para continuar.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Field label="Correo electrónico" error={errors.email?.message}>
                            <input
                                {...register("email", {
                                    required: "Campo requerido",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Ingresa un correo válido",
                                    },
                                })}
                                id="email" type="email" placeholder="correo@ejemplo.com"
                                className={inputCls(!!errors.email)}
                            />
                        </Field>

                        <Field label="Contraseña" error={errors.password?.message}>
                            <input
                                {...register("password", {
                                    required: "Campo requerido"
                                })}
                                id="password" type="password" placeholder="Ingresa tu contraseña"
                                className={inputCls(!!errors.password)}
                            />
                        </Field>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={btnPrimary}
                        >
                            {submitting
                                ? <><Spinner /> Iniciando sesión…</>
                                : "Iniciar sesión"}
                        </button>

                        {error && (
                            <div className="mt-2 text-[11px] font-medium text-red-500 bg-red-50 border border-red-200 p-2 rounded-md">
                                {String(error)}
                            </div>
                        )}

                    </form>

                    <div className="my-5 flex items-center justify-center gap-2">
                        <div className="h-px bg-slate-200 flex-1" />
                        <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">o continúa con</span>
                        <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    {/* Google Login Component */}
                    <div className="w-full flex justify-center h-10 overflow-hidden rounded-md items-center shadow-sm border border-slate-200">
                        <GoogleLogin
                            logo_alignment="center"
                            theme="filled_blue"
                            shape="rectangular"
                            width="500"
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                showTriggerAlert("Error", "Ocurrió un error con el inicio de sesión de Google", { duration: 3000 });
                            }}
                        />
                    </div>

                    {/* Footer Links */}
                    <div className="mt-7 pt-5 border-t border-slate-100 flex flex-col gap-2">
                        <Link
                            to="/nueva-cuenta"
                            className="text-[0.80rem] font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            ¿No tienes una cuenta? Regístrate
                        </Link>
                        <Link
                            to="/restablecer-contraseña"
                            className="text-[0.80rem] font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            ¿Olvidaste tu contraseña? Recupérala
                        </Link>
                        <p className="mt-1 text-[0.70rem] text-slate-400 leading-relaxed">
                            Al continuar, aceptas la{" "}
                            <Link to="/politica-de-privacidad" className="text-slate-500 underline">política de privacidad</Link>
                            {" "}y los{" "}
                            <Link to="/politica-de-privacidad" className="text-slate-500 underline">términos y condiciones</Link>
                            {" "}de IGA Productos.
                        </p>
                    </div>

                    <div className="mt-4 text-[0.65rem] text-slate-400 leading-tight">
                        Este sitio está protegido por reCAPTCHA y se aplican la
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mx-1">Política de Privacidad</a> y los
                        <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mx-1">Términos de Servicio</a> de Google.
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;