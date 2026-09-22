import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { AuthCustomerCredentialsType } from "../AuthTypes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../states/authStore";
import { usePaymentStore } from "../../shopping/states/paymentStore";
import { getPendingOrder } from "../../orders/OrdersServices";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import clsx from "clsx";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { MdEmail, MdLock, MdSupportAgent } from "react-icons/md";
import { FaExclamationTriangle, FaHome, FaLock, FaShieldAlt, FaTruck } from "react-icons/fa";
import IGALogo from "../../../assets/logo/IGA-LOGO.webp";
import { FaShop } from "react-icons/fa6";

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

const badgeDelay = [100, 200, 300, 400];

const trustItems = [
    { Icon: FaShieldAlt, label: "Pago 100% seguro" },
    { Icon: MdSupportAgent, label: "Soporte a tus compras" },
    { Icon: FaLock, label: "Datos protegidos" },
    { Icon: FaTruck, label: "Envíos garantizados" },
];

const LoginV3 = () => {
    document.title = "Iga Productos | Iniciar sesión";
    const { register, handleSubmit, formState: { errors } } = useForm<AuthCustomerCredentialsType>();
    const { login, loginWithGoogle, error, isAuth, clearError } = useAuthStore();
    const { setOrder } = usePaymentStore();
    const location = useLocation();
    const navigate = useNavigate();
    const { showTriggerAlert } = useTriggerAlert();
    const [submitting, setSubmitting] = useState(false);
    const navigationTargetRef = useRef<string | null>(null);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const currentYear = new Date().getFullYear();

    const resolvePostAuthNavigation = async () => {
        // Reconciliar la orden IN_PROCESS del cliente tras autenticarse
        try {
            const pending = await getPendingOrder();
            if (pending?.order) {
                navigationTargetRef.current = "/pagar-productos";
                setOrder({
                    orderUUID: pending.order.orderUUID,
                    paymentProvider: pending.order.paymentProvider,
                });
            } else {
                navigationTargetRef.current = "/";
                setOrder(null);
            }
        } catch (err) {
            console.error(err);
            navigationTargetRef.current = "/";
            setOrder(null);
        }
        navigate(navigationTargetRef.current);
    };

    const onSubmit: SubmitHandler<AuthCustomerCredentialsType> = async (data: AuthCustomerCredentialsType) => {
        try {
            setSubmitting(true);
            let _recaptchaToken = "";
            if (executeRecaptcha) {
                _recaptchaToken = await executeRecaptcha('login');
            }
            await login({ ...data, recaptchaToken: _recaptchaToken });
            await resolvePostAuthNavigation();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            setSubmitting(true);
            const { credential } = credentialResponse;
            if (credential) {
                const response = await loginWithGoogle(credential);
                // H7: solo se registra el píxel de registro cuando es una cuenta nueva
                if (response?.isNewCustomer) {
                    const { trackCompleteRegistration } = await import("../../analytics/MetaEvents");
                    trackCompleteRegistration();
                }
                await resolvePostAuthNavigation();
            }
        } catch (err) {
            console.error("Error with Google Login", err);
            showTriggerAlert("Error", "Error al iniciar sesión con Google", { duration: 3000 });
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (isAuth && !navigationTargetRef.current) navigate("/");
    }, [isAuth, navigate]);

    useEffect(() => { clearError(); }, [location.pathname, clearError]);

    return (
        <div className="w-full min-h-dvh flex flex-col bg-base-200">

            {/* ══ Barra superior ══ */}
            <header className="flex justify-between animate-slide-in-top bg-blue-950 px-6 sm:px-40 py-3 sm:py-4">
                <Link to="/" aria-label="Ir al inicio de Iga Productos" className="inline-block">
                    <img
                        src={IGALogo}
                        alt="Iga Productos"
                        className="w-32 sm:w-35 object-contain"
                    />
                </Link>
                <div className="flex items-center text-white/70 text-xs md:text-md xl:text-base">
                    <div className="flex items-center gap-2 px-5 border-r border-white/50">
                        <FaHome />
                        <Link to="/">
                            Inicio
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 px-5 ">
                        <FaShop />
                        <Link to="/#tienda">
                            Tienda
                        </Link>
                    </div>
                </div>
            </header>

            {/* ══ Main ══ */}
            <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10">

                {/* Card contenedor */}
                <div className="w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden rounded-2xl border border-base-300 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06),0_20px_40px_rgba(0,0,0,0.06)]">

                    {/* ── Panel izquierdo: branding ── */}
                    <div className="animate-fade-in-left relative w-full lg:w-[52%] bg-slate-900 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 flex flex-col justify-between overflow-hidden min-h-[200px] lg:min-h-0">

                        {/* Gradientes ambientales */}
                        <div className="pointer-events-none absolute inset-0 opacity-100 bg-[radial-gradient(ellipse_70%_50%_at_20%_80%,rgba(29,78,216,0.45)_0%,transparent_60%)]" />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_85%_10%,rgba(59,130,246,0.18)_0%,transparent_55%)]" />

                        {/* Título y subtítulo (movidos del form) */}
                        <div className="relative z-10">
                            <h1 className="animate-fade-in text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Iniciar sesión
                            </h1>
                            <p className="animate-fade-in animate-delay-100 mt-1 text-sm text-white/70">
                                Ingresa tus datos para continuar.
                            </p>
                        </div>

                        {/* Mensaje principal con burbuja */}
                        <div className="relative z-10 flex items-center gap-3 mt-6 lg:mt-8">
                            <div className="flex gap-3 items-center">
                                <span className="w-13 h-13 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-blue-300">
                                    <FaShieldAlt className="text-lg" />
                                </span>
                                <p className="text-xl sm:text-2xl lg:text-[2.3rem] leading-[1.18] font-light text-white tracking-[-0.01em] font-serif">
                                    Tu mejor aliado en<br /><span className="underline">Seguridad</span>
                                </p>

                            </div>
                        </div>

                        {/* Botón glass: problema con mi cuenta */}
                        <a
                            href="mailto:atencionaclientes@igaproductos.com"
                            className="animate-fade-in animate-delay-150 relative z-10 mt-6 lg:mt-8 inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-slate-200/90 hover:bg-white/[0.09] transition-colors duration-200"
                        >
                            <MdSupportAgent className="text-base shrink-0" />
                            Tengo un problema con mi cuenta
                        </a>

                        {/* Trust badges con iconos (md+) */}
                        <div className="relative z-10 mt-8 grid-cols-2 gap-2 hidden md:grid">
                            {trustItems.map((item, i) => (
                                <div
                                    key={i}
                                    className="animate-slide-in-bottom flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-sm px-3 py-2 transition-colors duration-150 hover:bg-white/[0.09]"
                                    style={{ animationDelay: `${badgeDelay[i]}ms` }}
                                >
                                    <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center shrink-0 text-blue-300">
                                        <item.Icon className="text-sm" />
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-200/80 leading-snug">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Trust badges con iconos compactos (sm) */}
                        <div className="relative z-10 mt-5 flex-wrap gap-2 md:hidden sm:flex hidden">
                            {trustItems.map((item, i) => (
                                <div
                                    key={i}
                                    className="animate-fade-in flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] backdrop-blur-sm px-2.5 py-1.5"
                                    style={{ animationDelay: `${badgeDelay[i]}ms` }}
                                >
                                    <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0 text-blue-300">
                                        <item.Icon className="text-xs" />
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-200/80 leading-snug">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Panel derecho: formulario ── */}
                    <div className="animate-fade-in-right w-full lg:w-[48%] bg-base-100 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 flex flex-col">

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
                        <div className="flex items-center gap-3 py-4">
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
                        <div className="mt-5 pt-4 border-t border-base-200 flex flex-col gap-2.5">
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
                        </div>
                    </div>

                </div>
            </main>

            {/* ══ Footer ══ */}
            <footer className="animate-fade-in bg-base-300 px-6 sm:px-40 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <p className="text-xs text-base-content/60 leading-relaxed">
                    © {currentYear} Iga Productos. Todos los derechos reservados.{" "}
                    Al continuar, aceptas la{" "}
                    <Link to="/politica-de-privacidad" className="text-base-content/70 underline hover:text-primary transition-colors">política de privacidad</Link>
                    {" "}y los{" "}
                    <Link to="/terminos-y-condiciones" className="text-base-content/70 underline hover:text-primary transition-colors">términos y condiciones</Link>
                    {" "}de Iga Productos.
                </p>
                <p className="text-[11px] text-base-content/50 leading-tight max-w-md sm:text-right">
                    Este sitio está protegido por reCAPTCHA y se aplican la{" "}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-base-content/70 underline hover:text-primary transition-colors">Política de Privacidad</a>{" "}
                    y los{" "}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="text-base-content/70 underline hover:text-primary transition-colors">Términos de Servicio</a>{" "}
                    de Google.
                </p>
            </footer>
        </div>
    );
};

export default LoginV3;