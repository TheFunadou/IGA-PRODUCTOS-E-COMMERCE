import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { FaExclamationTriangle, FaLock, FaShieldAlt, FaTruck } from "react-icons/fa";
import { MdEmail, MdLock, MdSupportAgent } from "react-icons/md";

import { useAuthStore } from "../states/authStore";
import { stringStrengthEvaluator } from "../helpers";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { formatAxiosError } from "../../../api/helpers";
import {
    sendRestorePasswordToken,
    validateRestorePasswordToken,
    resendRestorePasswordToken,
    restorePasswordPublic
} from "../services/authServices";
import IGALogo from "../../../assets/logo/IGA-LOGO.webp";

/* ─────────────────────────────────────────────
   types
───────────────────────────────────────────── */
type EmailFormType = { email: string };
type VerificationFormType = { restorePasswordToken: string };
type PasswordFormType = { newPassword: string; confirm_password: string };

/* ─────────────────────────────────────────────
   constants
───────────────────────────────────────────── */
const COUNTDOWN_SECONDS = 5 * 60;

/* ─────────────────────────────────────────────
   Sub: Field wrapper reutilizable
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   Helper: clases de input
───────────────────────────────────────────── */
const inputClass = (hasError: boolean) => clsx(
    "input input-md w-full text-sm border rounded-xl bg-base-200",
    "placeholder:text-base-content/40",
    "hover:border-base-content/30",
    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
    "transition-all duration-200",
    hasError ? "border-error bg-error/5" : "border-base-300"
);

/* ─────────────────────────────────────────────
   Sub: Strength bar
───────────────────────────────────────────── */
function PasswordStrengthBar({ strength }: { strength: number }) {
    if (strength === 0) return null;

    const fillColor = clsx(
        strength < 20 && "bg-red-500",
        strength >= 20 && strength < 40 && "bg-amber-500",
        strength >= 40 && strength < 60 && "bg-yellow-400",
        strength >= 60 && strength < 80 && "bg-blue-500",
        strength >= 80 && "bg-green-500"
    );

    const textColor = clsx(
        strength < 20 && "text-red-500",
        strength >= 20 && strength < 40 && "text-amber-500",
        strength >= 40 && strength < 60 && "text-yellow-500",
        strength >= 60 && strength < 80 && "text-blue-500",
        strength >= 80 && "text-green-600"
    );

    const label =
        strength < 10 ? "Demasiado débil" :
            strength < 20 ? "Muy débil" :
                strength < 40 ? "Débil" :
                    strength < 60 ? "Regular" :
                        strength < 80 ? "Fuerte" : "Muy fuerte";

    return (
        <div className="mt-1.5 space-y-1">
            <div className="h-[3px] w-full rounded-full bg-base-200 overflow-hidden">
                <div
                    className={clsx("h-full rounded-full transition-all duration-300", fillColor)}
                    style={{ width: `${strength}%` }}
                />
            </div>
            <p className={clsx("text-[11px] font-medium", textColor)}>{label}</p>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Sub: Steps
───────────────────────────────────────────── */
function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
    return (
        <div className="flex items-center mb-6">
            <div className="flex items-center gap-2">
                <span className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all", step === 1 ? "bg-primary text-white" : "bg-success text-white")}>
                    {step > 1 ? "✓" : "1"}
                </span>
                <span className={clsx("text-[11px] font-medium hidden sm:block", step === 1 ? "text-primary" : "text-base-content/40")}>
                    Datos
                </span>
            </div>
            <div className={clsx("flex-1 h-[1.5px] mx-2 min-w-4 transition-colors duration-300", step > 1 ? "bg-success" : "bg-base-300")} />

            <div className="flex items-center gap-2">
                <span className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border transition-all", step === 2 ? "bg-primary text-white border-transparent" : step > 2 ? "bg-success text-white border-transparent" : "bg-base-100 text-base-content/40 border-base-300")}>
                    {step > 2 ? "✓" : "2"}
                </span>
                <span className={clsx("text-[11px] font-medium hidden sm:block", step === 2 ? "text-primary" : "text-base-content/40")}>
                    Verificación
                </span>
            </div>
            <div className={clsx("flex-1 h-[1.5px] mx-2 min-w-4 transition-colors duration-300", step > 2 ? "bg-success" : "bg-base-300")} />

            <div className="flex items-center gap-2">
                <span className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border transition-all", step === 3 ? "bg-primary text-white border-transparent" : "bg-base-100 text-base-content/40 border-base-300")}>
                    3
                </span>
                <span className={clsx("text-[11px] font-medium hidden sm:block", step === 3 ? "text-primary" : "text-base-content/40")}>
                    Modificar
                </span>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Sub: Countdown
───────────────────────────────────────────── */
function CountdownTimer({ initialSeconds, onComplete }: { initialSeconds: number; onComplete: () => void }) {
    const [remaining, setRemaining] = useState(initialSeconds);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => { setRemaining(initialSeconds); }, [initialSeconds]);

    useEffect(() => {
        if (remaining <= 0) { onComplete(); return; }
        intervalRef.current = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) { clearInterval(intervalRef.current!); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(intervalRef.current!);
    }, [remaining, onComplete]);

    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;

    return (
        <span className={clsx(
            "text-base font-semibold tabular-nums tracking-wide font-mono transition-colors",
            remaining < 60 ? "text-error" : "text-base-content"
        )}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
    );
}

const badgeDelay = [100, 200, 300, 400];

const trustItems = [
    { Icon: FaShieldAlt, label: "Pago 100% seguro" },
    { Icon: MdSupportAgent, label: "Soporte a tus compras" },
    { Icon: FaLock, label: "Datos protegidos" },
    { Icon: FaTruck, label: "Envíos garantizados" },
];

const submitClass =
    "btn btn-primary w-full rounded-xl h-12 font-bold gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200";

/* ─────────────────────────────────────────────
   Componente principal
───────────────────────────────────────────── */
const RestorePasswordV3 = () => {
    document.title = "Iga Productos | Recuperar contraseña";
    const { isAuth } = useAuthStore();
    const navigate = useNavigate();
    const { showTriggerAlert } = useTriggerAlert();
    const currentYear = new Date().getFullYear();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [emailTarget, setEmailTarget] = useState<string>("");
    const [validToken, setValidToken] = useState<string>("");

    const [canResend, setCanResend] = useState(false);
    const [countdownKey, setCountdownKey] = useState(0);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const { register: regEmail, handleSubmit: handleEmail, formState: { errors: errEmail } } = useForm<EmailFormType>();
    const { register: regToken, handleSubmit: handleToken, formState: { errors: errToken }, reset: resetToken } = useForm<VerificationFormType>();
    const { register: regPwd, handleSubmit: handlePwd, formState: { errors: errPwd }, watch: watchPwd } = useForm<PasswordFormType>();

    useEffect(() => {
        if (isAuth) navigate("/");
    }, [isAuth, navigate]);

    useEffect(() => {
        const sub = watchPwd((v) => {
            setPasswordStrength(v.newPassword ? stringStrengthEvaluator(v.newPassword) : 0);
        });
        return () => sub.unsubscribe();
    }, [watchPwd]);

    const sendTokenMut = useMutation({
        mutationFn: async (mail: string) => await sendRestorePasswordToken({ email: mail }),
        onSuccess: (_, mail) => {
            setEmailTarget(mail);
            setStep(2);
            setCanResend(false);
            setCountdownKey(k => k + 1);
            showTriggerAlert("Successfull", "Se ha enviado un código a tu correo electrónico", { duration: 3000 });
        },
        onError: (err) => showTriggerAlert("Error", formatAxiosError(err), { duration: 3000 })
    });

    const validateTokenMut = useMutation({
        mutationFn: async (tk: string) => {
            const isValid = await validateRestorePasswordToken({ email: emailTarget, restorePasswordToken: tk });
            return { tk, isValid };
        },
        onSuccess: ({ tk, isValid }) => {
            if (isValid) {
                setValidToken(tk);
                setStep(3);
            } else {
                showTriggerAlert("Error", "El código es inválido", { duration: 3000 });
            }
        },
        onError: (err) => showTriggerAlert("Error", formatAxiosError(err), { duration: 3000 })
    });

    const resendTokenMut = useMutation({
        mutationFn: async () => await resendRestorePasswordToken({ email: emailTarget }),
        onSuccess: () => {
            showTriggerAlert("Successfull", "Se ha reenviado tu código", { duration: 3000 });
            setCanResend(false);
            setCountdownKey(k => k + 1);
        },
        onError: (err) => showTriggerAlert("Error", formatAxiosError(err), { duration: 3000 })
    });

    const restorePwdMut = useMutation({
        mutationFn: async (data: PasswordFormType) => await restorePasswordPublic({
            email: emailTarget,
            restorePasswordToken: validToken,
            newPassword: data.newPassword,
            confirmNewPassword: data.confirm_password
        }),
        onSuccess: () => {
            showTriggerAlert("Successfull", "Tu contraseña se ha actualizado exitosamente. Inicia sesión.", { duration: 4000 });
            navigate("/iniciar-sesion");
        },
        onError: (err) => showTriggerAlert("Error", formatAxiosError(err), { duration: 3000 })
    });

    const onSubmitStep1: SubmitHandler<EmailFormType> = async (data) => {
        await sendTokenMut.mutateAsync(data.email);
    };

    const onSubmitStep2: SubmitHandler<VerificationFormType> = async (data) => {
        await validateTokenMut.mutateAsync(data.restorePasswordToken);
    };

    const onSubmitStep3: SubmitHandler<PasswordFormType> = async (data) => {
        await restorePwdMut.mutateAsync(data);
    };

    const handleResend = async () => {
        if (!emailTarget) return;
        resetToken();
        await resendTokenMut.mutateAsync();
    };

    return (
        <div className="w-full min-h-dvh flex flex-col bg-base-200">

            {/* ══ Barra superior ══ */}
            <header className="animate-slide-in-top bg-blue-950 px-6 sm:px-40 py-3 sm:py-4">
                <Link to="/" aria-label="Ir al inicio de Iga Productos" className="inline-block">
                    <img
                        src={IGALogo}
                        alt="Iga Productos"
                        className="w-32 sm:w-40 object-contain"
                    />
                </Link>
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

                        {/* Título y subtítulo */}
                        <div className="relative z-10">
                            <h1 className="animate-fade-in text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Recuperar contraseña
                            </h1>
                            <p className="animate-fade-in animate-delay-100 mt-1 text-sm text-white/70">
                                Ingresa el correo asociado a tu cuenta para continuar.
                            </p>
                        </div>

                        {/* Mensaje principal con burbuja */}
                        <div className="relative z-10 flex items-center gap-3 mt-6 lg:mt-8">
                            <span className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-blue-300">
                                <FaShieldAlt className="text-lg" />
                            </span>
                            <p className="text-xl sm:text-2xl lg:text-[2.1rem] leading-[1.18] font-normal text-white tracking-[-0.01em] font-serif">
                                Recupera el acceso a tu cuenta{" "}
                                <em className="text-blue-300 font-serif">fácil y rápido.</em>
                            </p>
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

                        <StepIndicator step={step} />

                        {/* ═══════════ PASO 1 ═══════════ */}
                        {step === 1 && (
                            <>
                                <form onSubmit={handleEmail(onSubmitStep1)} className="flex flex-col gap-4">
                                    <Field label="Correo electrónico" error={errEmail.email?.message}>
                                        <div className="relative">
                                            <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
                                            <input
                                                {...regEmail("email", {
                                                    required: "Campo requerido",
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                        message: "Ingresa un correo válido",
                                                    },
                                                })}
                                                id="email" type="email" placeholder="correo@ejemplo.com"
                                                className={clsx(inputClass(!!errEmail.email), "pl-11")}
                                            />
                                        </div>
                                    </Field>

                                    <button
                                        type="submit"
                                        disabled={sendTokenMut.isPending}
                                        aria-label="Continuar al paso de verificación"
                                        className={submitClass}
                                    >
                                        {sendTokenMut.isPending
                                            ? <><span className="loading loading-spinner loading-sm text-white" /> Enviando código…</>
                                            : "Continuar →"}
                                    </button>
                                </form>

                                {/* Footer Links */}
                                <div className="mt-5 pt-4 border-t border-base-200 flex flex-col gap-2.5">
                                    <Link
                                        to="/iniciar-sesion"
                                        className="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors duration-200"
                                    >
                                        Volver al inicio de sesión
                                    </Link>
                                    <Link
                                        to="/nueva-cuenta"
                                        className="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors duration-200"
                                    >
                                        ¿Aún no tienes cuenta? Regístrate
                                    </Link>
                                </div>
                            </>
                        )}

                        {/* ═══════════ PASO 2 ═══════════ */}
                        {step === 2 && (
                            <>
                                <h2 className="text-lg sm:text-xl font-extrabold text-base-content tracking-tight mb-1">
                                    Verifica tu identidad
                                </h2>
                                <p className="text-sm text-base-content/50 mb-4 leading-relaxed">
                                    Ingresa el código de 6 dígitos enviado a tu correo.
                                </p>

                                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-3 py-2 mb-5 text-[0.80rem] font-medium text-primary break-all">
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    {emailTarget}
                                </div>

                                <div className="flex items-center justify-between bg-base-200 border border-base-300 rounded-xl px-4 py-3 mb-5">
                                    <span className="text-[0.75rem] font-medium text-base-content/50">
                                        El código expira en
                                    </span>
                                    <CountdownTimer
                                        key={countdownKey}
                                        initialSeconds={COUNTDOWN_SECONDS}
                                        onComplete={() => setCanResend(true)}
                                    />
                                </div>

                                <form onSubmit={handleToken(onSubmitStep2)} className="flex flex-col gap-4">
                                    <Field label="Código de recuperación" error={errToken.restorePasswordToken?.message}>
                                        <input
                                            {...regToken("restorePasswordToken", {
                                                required: "El código es requerido",
                                                minLength: { value: 6, message: "Debe tener al menos 6 caracteres" },
                                            })}
                                            id="restorePasswordToken"
                                            type="text"
                                            placeholder="000000"
                                            maxLength={8}
                                            autoComplete="one-time-code"
                                            className={clsx(
                                                inputClass(!!errToken.restorePasswordToken),
                                                "text-center tracking-[0.35em] text-xl font-semibold h-[52px] tabular-nums"
                                            )}
                                        />
                                    </Field>

                                    <button
                                        type="submit"
                                        disabled={validateTokenMut.isPending}
                                        aria-label="Confirmar código y proceder"
                                        className={submitClass}
                                    >
                                        {validateTokenMut.isPending
                                            ? <><span className="loading loading-spinner loading-sm text-white" /> Verificando…</>
                                            : "Validar código →"}
                                    </button>
                                </form>

                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[0.78rem] text-base-content/40">¿No recibiste el código?</span>
                                    <button
                                        type="button"
                                        disabled={!canResend || resendTokenMut.isPending}
                                        onClick={handleResend}
                                        aria-label="Reenviar código de verificación"
                                        className="text-[0.80rem] font-medium text-primary transition-colors
                                            hover:text-primary/80 hover:underline
                                            disabled:text-base-content/30 disabled:cursor-not-allowed disabled:no-underline"
                                    >
                                        {resendTokenMut.isPending ? <span className="loading loading-spinner loading-xs" /> : "Reenviar código"}
                                    </button>
                                </div>

                                <div className="mt-5 h-px bg-base-300" />

                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setCanResend(false); }}
                                    className="mt-3 w-full h-[38px] flex items-center justify-center gap-2
                                        rounded-xl border border-base-300 bg-transparent text-base-content/60
                                        text-[0.82rem] font-medium transition-all duration-150
                                        hover:bg-base-200 hover:border-base-content/30"
                                >
                                    ← Cambiar correo electrónico
                                </button>
                            </>
                        )}

                        {/* ═══════════ PASO 3 ═══════════ */}
                        {step === 3 && (
                            <>
                                <h2 className="text-lg sm:text-xl font-extrabold text-base-content tracking-tight mb-1">
                                    Establece tu nueva contraseña
                                </h2>
                                <p className="text-sm text-base-content/50 mb-6 leading-relaxed">
                                    Ingresa aquí tu nueva contraseña de acceso.
                                </p>

                                <form onSubmit={handlePwd(onSubmitStep3)} className="flex flex-col gap-4">
                                    <Field label="Nueva contraseña" error={errPwd.newPassword?.message}>
                                        <div className="relative">
                                            <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
                                            <input
                                                {...regPwd("newPassword", {
                                                    required: "Campo requerido",
                                                    validate: (v) =>
                                                        stringStrengthEvaluator(v) >= 55 || "Ingresa una contraseña más segura",
                                                })}
                                                id="newPassword" type="password" placeholder="Mínimo 8 caracteres"
                                                className={clsx(inputClass(!!errPwd.newPassword), "pl-11")}
                                            />
                                        </div>
                                        <PasswordStrengthBar strength={passwordStrength} />
                                    </Field>

                                    <Field label="Confirmar nueva contraseña" error={errPwd.confirm_password?.message}>
                                        <div className="relative">
                                            <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
                                            <input
                                                {...regPwd("confirm_password", {
                                                    required: "Campo requerido",
                                                    validate: (v) => v === watchPwd("newPassword") || "Las contraseñas no coinciden",
                                                })}
                                                id="confirm_password" type="password" placeholder="Repite tu contraseña"
                                                className={clsx(inputClass(!!errPwd.confirm_password), "pl-11")}
                                            />
                                        </div>
                                    </Field>

                                    <button
                                        type="submit"
                                        disabled={restorePwdMut.isPending}
                                        aria-label="Restablecer contraseña"
                                        className={submitClass}
                                    >
                                        {restorePwdMut.isPending
                                            ? <><span className="loading loading-spinner loading-sm text-white" /> Actualizando…</>
                                            : "Cambiar contraseña"}
                                    </button>
                                </form>
                            </>
                        )}
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

export default RestorePasswordV3;