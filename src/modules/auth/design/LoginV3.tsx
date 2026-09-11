import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { AuthCustomerCredentialsType } from "../AuthTypes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../states/authStore";
import { GoogleLogin } from "@react-oauth/google";
import clsx from "clsx";
import { trackCompleteRegistration } from "../../analytics/MetaEvents";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { MdEmail, MdLock } from "react-icons/md";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaShieldHalved, FaLock, FaTruck } from "react-icons/fa6";
import { MdSupportAgent } from "react-icons/md";
import IGALogo from "../../../assets/logo/igalogo-2.webp";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-base-content">
                {label}
            </label>
            {children}
            {error && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-error" role="alert">
                    <FaExclamationTriangle className="text-[10px] shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

const inputClass = (hasError: boolean) => clsx(
    "input input-md w-full text-sm border rounded-xl bg-base-200",
    "placeholder:text-base-content/40",
    "hover:border-base-content/30",
    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
    "transition-all duration-200",
    hasError ? "border-error bg-error/5" : "border-base-300"
);

const trustItems = [
    { icon: <FaShieldHalved className="text-primary text-base" />, label: "Pago 100% seguro" },
    { icon: <MdSupportAgent className="text-primary text-base" />, label: "Soporte a tus compras" },
    { icon: <FaLock className="text-primary text-base" />, label: "Datos protegidos" },
    { icon: <FaTruck className="text-primary text-base" />, label: "Envíos garantizados" },
];

const LoginV3 = () => {
    document.title = "Iga Productos | Iniciar sesión";
    const { register, handleSubmit, formState: { errors } } = useForm<AuthCustomerCredentialsType>();
    const { login, loginWithGoogle, error, isAuth, clearError } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const { showTriggerAlert } = useTriggerAlert();
    const [submitting, setSubmitting] = useState(false);
    const { executeRecaptcha } = useGoogleReCaptcha();

    const onSubmit: SubmitHandler<AuthCustomerCredentialsType> = async (data: AuthCustomerCredentialsType) => {
        try {
            setSubmitting(true);
            let _recaptchaToken = "";
            if (executeRecaptcha) {
                _recaptchaToken = await executeRecaptcha('login');
            }
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
                trackCompleteRegistration();
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

    return (
        <div className="w-full flex justify-center items-start lg:items-center min-h-[calc(100vh-80px)] px-4 py-6 sm:py-8 lg:py-10">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden rounded-2xl border border-base-300 shadow-xl shadow-base-content/5">

                {/* ── Branding Panel ── */}
                <div className="relative w-full lg:w-[42%] bg-base-200 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 flex flex-col justify-between overflow-hidden">

                    {/* Ambient gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_90%,oklch(var(--p)/0.12)_0%,transparent_60%)]" />

                    {/* Logo + Headline */}
                    <div className="relative z-10">
                        <img
                            src={IGALogo}
                            alt="Iga Productos"
                            className="w-28 sm:w-32 lg:w-36 object-contain"
                        />
                        <h1 className="mt-6 lg:mt-10 text-xl sm:text-2xl lg:text-3xl font-extrabold text-base-content leading-snug tracking-tight">
                            Bienvenido de nuevo a tu tienda en línea
                        </h1>
                    </div>

                    {/* Trust Badges — vertical on desktop */}
                    <div className="relative z-10 mt-8 lg:mt-12 hidden lg:flex flex-col gap-3">
                        {trustItems.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl border border-base-300 bg-base-100/80 backdrop-blur-sm hover:border-primary/30 transition-colors duration-200"
                            >
                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    {item.icon}
                                </div>
                                <span className="text-xs font-semibold text-base-content/70 leading-snug">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Form Panel ── */}
                <div className="w-full lg:w-[58%] bg-base-100 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 flex flex-col">

                    {/* Header */}
                    <div className="mb-6 lg:mb-8">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-base-content leading-tight">
                            Iniciar sesión
                        </h2>
                        <p className="text-sm text-base-content/50 mt-1">
                            Ingresa tus datos para continuar.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Field label="Correo electrónico" error={errors.email?.message}>
                            <div className="relative">
                                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
                                <input
                                    {...register("email", {
                                        required: "Campo requerido",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Ingresa un correo válido",
                                        },
                                    })}
                                    id="email" type="email" placeholder="correo@ejemplo.com"
                                    className={clsx(inputClass(!!errors.email), "pl-11")}
                                />
                            </div>
                        </Field>

                        <Field label="Contraseña" error={errors.password?.message}>
                            <div className="relative">
                                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
                                <input
                                    {...register("password", { required: "Campo requerido" })}
                                    id="password" type="password" placeholder="Ingresa tu contraseña"
                                    className={clsx(inputClass(!!errors.password), "pl-11")}
                                />
                            </div>
                        </Field>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary w-full rounded-xl h-12 font-bold gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {submitting
                                ? <><span className="loading loading-spinner loading-sm text-white" /> Iniciando sesión…</>
                                : "Iniciar sesión"
                            }
                        </button>

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm" role="alert">
                                <FaExclamationTriangle className="shrink-0" />
                                <span>{String(error)}</span>
                            </div>
                        )}
                    </form>

                    {/* Separator */}
                    <div className="flex items-center gap-3 py-5">
                        <div className="h-px bg-base-300 flex-1" />
                        <span className="text-xs font-medium text-base-content/40 uppercase tracking-wide">o continúa con</span>
                        <div className="h-px bg-base-300 flex-1" />
                    </div>

                    {/* Google Login */}
                    <div className="w-full flex justify-center h-12 overflow-hidden rounded-xl items-center border border-base-300 bg-base-100 hover:bg-base-200 transition-colors duration-200 cursor-pointer">
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
                    <div className="mt-auto pt-6 lg:pt-8 flex flex-col gap-2.5">
                        <Link
                            to="/nueva-cuenta"
                            className="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors duration-200"
                        >
                            ¿No tienes una cuenta? Regístrate
                        </Link>
                        <Link
                            to="/restablecer-contraseña"
                            className="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors duration-200"
                        >
                            ¿Olvidaste tu contraseña? Recupérala
                        </Link>
                        <p className="mt-2 text-xs text-base-content/40 leading-relaxed">
                            Al continuar, aceptas la{" "}
                            <Link to="/politica-de-privacidad" className="text-base-content/60 underline hover:text-primary transition-colors">política de privacidad</Link>
                            {" "}y los{" "}
                            <Link to="/terminos-y-condiciones" className="text-base-content/60 underline hover:text-primary transition-colors">términos y condiciones</Link>
                            {" "}de Iga Productos.
                        </p>
                        <p className="text-[11px] text-base-content/30 leading-tight">
                            Este sitio está protegido por reCAPTCHA y se aplican la{" "}
                            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-primary/60 hover:text-primary hover:underline transition-colors">Política de Privacidad</a>{" "}
                            y los{" "}
                            <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="text-primary/60 hover:text-primary hover:underline transition-colors">Términos de Servicio</a>{" "}
                            de Google.
                        </p>
                    </div>
                </div>

            </div>

            {/* ── Trust Badges (Mobile — below card) ── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-gradient-to-t from-base-100 via-base-100 to-transparent pointer-events-none">
                <div className="grid grid-cols-2 gap-2 pointer-events-auto">
                    {trustItems.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-base-200/80 backdrop-blur-sm border border-base-300"
                        >
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                {item.icon}
                            </div>
                            <span className="text-[11px] font-semibold text-base-content/60 leading-tight">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoginV3;
