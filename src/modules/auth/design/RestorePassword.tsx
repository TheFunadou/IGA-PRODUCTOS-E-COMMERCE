import IGALogo from "../../../assets/logo/IGA-LOGO.webp";
import IMG1 from "../../../assets/info/IMG1.webp";
import IMG2 from "../../../assets/info/IMG2.webp";
import IMG3 from "../../../assets/info/IMG3.webp";
import IMG4 from "../../../assets/info/IMG4.webp";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";

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

/* ─────────────────────────────────────────────
   Helper: clases de input
───────────────────────────────────────────── */
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
            <div className="h-[3px] w-full rounded-full bg-slate-100 overflow-hidden">
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
        <div className="flex items-center mb-8">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
                <span className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all", step === 1 ? "bg-primary text-white" : "bg-green-500 text-white")}>
                    {step > 1 ? "✓" : "1"}
                </span>
                <span className={clsx("text-[11px] font-medium hidden sm:block", step === 1 ? "text-primary" : "text-slate-400")}>
                    Datos
                </span>
            </div>
            <div className={clsx("flex-1 h-[1.5px] mx-2 min-w-4 transition-colors duration-300", step > 1 ? "bg-green-500" : "bg-slate-200")} />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
                <span className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border transition-all", step === 2 ? "bg-blue-600 text-white border-transparent" : step > 2 ? "bg-green-500 text-white border-transparent" : "bg-white text-slate-400 border-slate-200")}>
                    {step > 2 ? "✓" : "2"}
                </span>
                <span className={clsx("text-[11px] font-medium hidden sm:block", step === 2 ? "text-blue-600" : "text-slate-400")}>
                    Verificación
                </span>
            </div>
            <div className={clsx("flex-1 h-[1.5px] mx-2 min-w-4 transition-colors duration-300", step > 2 ? "bg-green-500" : "bg-slate-200")} />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
                <span className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border transition-all", step === 3 ? "bg-blue-600 text-white border-transparent" : "bg-white text-slate-400 border-slate-200")}>
                    3
                </span>
                <span className={clsx("text-[11px] font-medium hidden sm:block", step === 3 ? "text-blue-600" : "text-slate-400")}>
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
            remaining < 60 ? "text-red-500" : "text-slate-800"
        )}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
    );
}

/* ─────────────────────────────────────────────
   Sub: Spinner
───────────────────────────────────────────── */
function Spinner({ dark = false }: { dark?: boolean }) {
    return (
        <span className={clsx(
            "inline-block w-4 h-4 rounded-full border-2 animate-spin",
            dark ? "border-blue-200 border-t-blue-600" : "border-white/30 border-t-white"
        )} />
    );
}

/* ─────────────────────────────────────────────
   Componente principal
───────────────────────────────────────────── */
const RestorePassword = () => {
    const { isAuth, sessionId } = useAuthStore();
    const navigate = useNavigate();
    const { showTriggerAlert } = useTriggerAlert();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [emailTarget, setEmailTarget] = useState<string>("");
    const [validToken, setValidToken] = useState<string>("");

    const [canResend, setCanResend] = useState(false);
    const [countdownKey, setCountdownKey] = useState(0);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Form Steps setups
    const { register: regEmail, handleSubmit: handleEmail, formState: { errors: errEmail } } = useForm<EmailFormType>();
    const { register: regToken, handleSubmit: handleToken, formState: { errors: errToken }, reset: resetToken } = useForm<VerificationFormType>();
    const { register: regPwd, handleSubmit: handlePwd, formState: { errors: errPwd }, watch: watchPwd } = useForm<PasswordFormType>();

    if (isAuth) navigate("/");

    // Strength updater
    useEffect(() => {
        const sub = watchPwd((v) => {
            setPasswordStrength(v.newPassword ? stringStrengthEvaluator(v.newPassword) : 0);
        });
        return () => sub.unsubscribe();
    }, [watchPwd]);

    // Mutations
    const sendTokenMut = useMutation({
        mutationFn: async (mail: string) => await sendRestorePasswordToken({ sessionId: sessionId!, email: mail }),
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
            const isValid = await validateRestorePasswordToken({ sessionId: sessionId!, email: emailTarget, restorePasswordToken: tk });
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
        mutationFn: async () => await resendRestorePasswordToken({ sessionId: sessionId!, email: emailTarget }),
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
            sessionId: sessionId!,
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

    const trustItems = [
        { url: IMG1, label: "Pago 100% seguro" },
        { url: IMG2, label: "Soporte a tus compras" },
        { url: IMG3, label: "Datos protegidos" },
        { url: IMG4, label: "Envíos garantizados" },
    ];

    /* ══ Clases reutilizables de botón primario ══ */
    const btnPrimary =
        "mt-2 w-full h-[42px] flex items-center justify-center gap-2 rounded-md " +
        "bg-primary text-white text-sm font-semibold tracking-wide transition-all duration-150 " +
        "hover:bg-blue-700 hover:shadow-[0_4px_12px_rgba(29,78,216,0.3)] " +
        "active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed";

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
                        Recupera el acceso a tu cuenta{" "}
                        <em className=" text-blue-300 font-serif">fácil y rápido.</em>
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

                {/* ══ Panel derecho: formulario ══ */}
                <div className="w-[48%] bg-white px-10 py-12 flex flex-col overflow-y-auto">

                    <StepIndicator step={step} />

                    {/* ═══════════ PASO 1 ═══════════ */}
                    {step === 1 && (
                        <>
                            <h2 className="text-[1.35rem] font-semibold text-slate-900 tracking-tight mb-1">
                                Recuperar cuenta
                            </h2>
                            <p className="text-[0.82rem] text-slate-400 mb-6 leading-relaxed">
                                Ingresa el correo asociado a tu cuenta para continuar.
                            </p>

                            <form onSubmit={handleEmail(onSubmitStep1)} className="flex flex-col gap-4">
                                <Field label="Correo electrónico" error={errEmail.email?.message}>
                                    <input
                                        {...regEmail("email", {
                                            required: "Campo requerido",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "Ingresa un correo válido",
                                            },
                                        })}
                                        id="email" type="email" placeholder="correo@ejemplo.com"
                                        className={inputCls(!!errEmail.email)}
                                    />
                                </Field>

                                <button
                                    type="submit"
                                    disabled={sendTokenMut.isPending}
                                    aria-label="Continuar al paso de verificación"
                                    className={btnPrimary}
                                >
                                    {sendTokenMut.isPending
                                        ? <><Spinner /> Enviando código…</>
                                        : "Continuar →"}
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col gap-2">
                                <Link
                                    to="/iniciar-sesion"
                                    className="text-[0.80rem] font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Volver al inicio de sesión
                                </Link>
                                <Link
                                    to="/nueva-cuenta"
                                    className="text-[0.80rem] font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    ¿Aún no tienes cuenta? Regístrate
                                </Link>
                            </div>
                        </>
                    )}

                    {/* ═══════════ PASO 2 ═══════════ */}
                    {step === 2 && (
                        <>
                            <h2 className="text-[1.35rem] font-semibold text-slate-900 tracking-tight mb-1">
                                Verifica tu identidad
                            </h2>
                            <p className="text-[0.82rem] text-slate-400 mb-4 leading-relaxed">
                                Ingresa el código de 6 dígitos enviado a tu correo.
                            </p>

                            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/60
                rounded-md px-3 py-2 mb-5 text-[0.80rem] font-medium text-blue-700 break-all">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                    <rect x="1" y="3" width="14" height="10" rx="2" stroke="#1d4ed8" strokeWidth="1.5" />
                                    <path d="M1 5l7 5 7-5" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                {emailTarget}
                            </div>

                            <div className="flex items-center justify-between bg-slate-50 border border-slate-200
                rounded-md px-4 py-3 mb-5">
                                <span className="text-[0.75rem] font-medium text-slate-500">
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
                                            inputCls(!!errToken.restorePasswordToken),
                                            "text-center tracking-[0.35em] text-xl font-semibold h-[52px] tabular-nums"
                                        )}
                                    />
                                </Field>

                                <button
                                    type="submit"
                                    disabled={validateTokenMut.isPending}
                                    aria-label="Confirmar código y proceder"
                                    className={btnPrimary}
                                >
                                    {validateTokenMut.isPending
                                        ? <><Spinner /> Verificando…</>
                                        : "Validar código →"}
                                </button>
                            </form>

                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-[0.78rem] text-slate-400">¿No recibiste el código?</span>
                                <button
                                    type="button"
                                    disabled={!canResend || resendTokenMut.isPending}
                                    onClick={handleResend}
                                    aria-label="Reenviar código de verificación"
                                    className="text-[0.80rem] font-medium text-blue-600 transition-colors
                    hover:text-blue-700 hover:underline
                    disabled:text-slate-400 disabled:cursor-not-allowed disabled:no-underline"
                                >
                                    {resendTokenMut.isPending ? <Spinner dark /> : "Reenviar código"}
                                </button>
                            </div>

                            <div className="mt-5 h-px bg-slate-100" />

                            <button
                                type="button"
                                onClick={() => { setStep(1); setCanResend(false); }}
                                className="mt-3 w-full h-[38px] flex items-center justify-center gap-2
                  rounded-md border border-slate-200 bg-transparent text-slate-600
                  text-[0.82rem] font-medium transition-all duration-150
                  hover:bg-slate-50 hover:border-slate-300"
                            >
                                ← Cambiar correo electrónico
                            </button>
                        </>
                    )}

                    {/* ═══════════ PASO 3 ═══════════ */}
                    {step === 3 && (
                        <>
                            <h2 className="text-[1.35rem] font-semibold text-slate-900 tracking-tight mb-1">
                                Establece tu nueva contraseña
                            </h2>
                            <p className="text-[0.82rem] text-slate-400 mb-6 leading-relaxed">
                                Ingresa aquí tu nueva contraseña de acceso.
                            </p>

                            <form onSubmit={handlePwd(onSubmitStep3)} className="flex flex-col gap-4">
                                <Field label="Nueva contraseña" error={errPwd.newPassword?.message}>
                                    <input
                                        {...regPwd("newPassword", {
                                            required: "Campo requerido",
                                            validate: (v) =>
                                                stringStrengthEvaluator(v) >= 55 || "Ingresa una contraseña más segura",
                                        })}
                                        id="newPassword" type="password" placeholder="Mínimo 8 caracteres"
                                        className={inputCls(!!errPwd.newPassword)}
                                    />
                                    <PasswordStrengthBar strength={passwordStrength} />
                                </Field>

                                <Field label="Confirmar nueva contraseña" error={errPwd.confirm_password?.message}>
                                    <input
                                        {...regPwd("confirm_password", {
                                            required: "Campo requerido",
                                            validate: (v) => v === watchPwd("newPassword") || "Las contraseñas no coinciden",
                                        })}
                                        id="confirm_password" type="password" placeholder="Repite tu contraseña"
                                        className={inputCls(!!errPwd.confirm_password)}
                                    />
                                </Field>

                                <button
                                    type="submit"
                                    disabled={restorePwdMut.isPending}
                                    aria-label="Restablecer contraseña"
                                    className={btnPrimary}
                                >
                                    {restorePwdMut.isPending
                                        ? <><Spinner /> Actualizando…</>
                                        : "Cambiar contraseña"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestorePassword;