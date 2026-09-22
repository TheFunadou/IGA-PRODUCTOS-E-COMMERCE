import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useAuthStore } from "../states/authStore";
import { sendVerificationToken, verifyEmail as verifyEmailService } from "../services/authServices";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { formatAxiosError } from "../../../api/helpers";
import IGALogo from "../../../assets/logo/IGA-LOGO.webp";

type VerificationFormType = { verificationToken: string };

const VerifyEmailV3 = () => {
    document.title = "Iga Productos | Verificar correo";
    const { authCustomer, getProfile } = useAuthStore();
    const navigate = useNavigate();
    const { showTriggerAlert } = useTriggerAlert();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const currentYear = new Date().getFullYear();

    const { register, handleSubmit, formState: { errors } } = useForm<VerificationFormType>();
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);

    // Si el correo ya está verificado no hay nada que hacer
    if (authCustomer?.verified) {
        return (
            <div className="w-full min-h-dvh flex flex-col bg-base-200">
                <header className="bg-blue-950 px-6 sm:px-40 py-3 sm:py-4">
                    <Link to="/" aria-label="Ir al inicio de Iga Productos" className="inline-block">
                        <img src={IGALogo} alt="Iga Productos" className="w-32 sm:w-40 object-contain" />
                    </Link>
                </header>
                <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
                    <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-8 text-center">
                        <FaCheckCircle className="mx-auto mb-3 text-4xl text-success" />
                        <h1 className="text-xl font-extrabold text-base-content">Correo ya verificado</h1>
                        <p className="mt-2 text-sm text-base-content/60">
                            Tu correo electrónico ya está verificado, puedes continuar con tus compras.
                        </p>
                        <Link to="/" className="btn btn-primary mt-6 w-full rounded-xl h-12 font-bold">
                            Ir al inicio
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    if (!authCustomer) {
        return (
            <div className="w-full min-h-dvh flex flex-col bg-base-200">
                <header className="bg-blue-950 px-6 sm:px-40 py-3 sm:py-4">
                    <Link to="/" aria-label="Ir al inicio de Iga Productos" className="inline-block">
                        <img src={IGALogo} alt="Iga Productos" className="w-32 sm:w-40 object-contain" />
                    </Link>
                </header>
                <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
                    <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-8 text-center">
                        <h1 className="text-xl font-extrabold text-base-content">Inicia sesión</h1>
                        <p className="mt-2 text-sm text-base-content/60">
                            Para verificar tu correo electrónico primero debes iniciar sesión.
                        </p>
                        <Link to="/iniciar-sesion" className="btn btn-primary mt-6 w-full rounded-xl h-12 font-bold">
                            Iniciar sesión
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const handleResend = async () => {
        if (!authCustomer) return;
        setSending(true);
        try {
            let _recaptchaToken = "";
            if (executeRecaptcha) {
                _recaptchaToken = await executeRecaptcha('resend_verification_token');
            }
            await sendVerificationToken({ email: authCustomer.email, recaptchaToken: _recaptchaToken });
            showTriggerAlert("Successfull", "Hemos enviado un código de verificación a tu correo", { duration: 3500 });
        } catch (err) {
            showTriggerAlert("Error", formatAxiosError(err), { duration: 3500 });
        } finally {
            setSending(false);
        }
    };

    const onSubmit: SubmitHandler<VerificationFormType> = async ({ verificationToken }) => {
        if (!authCustomer) return;
        setVerifying(true);
        try {
            await verifyEmailService({ verificationToken });
            await getProfile();
            showTriggerAlert("Successfull", "Tu correo electrónico ha sido verificado exitosamente", { duration: 3500 });
            navigate("/");
        } catch (err) {
            showTriggerAlert("Error", formatAxiosError(err), { duration: 3500 });
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="w-full min-h-dvh flex flex-col bg-base-200">
            <header className="bg-blue-950 px-6 sm:px-40 py-3 sm:py-4">
                <Link to="/" aria-label="Ir al inicio de Iga Productos" className="inline-block">
                    <img src={IGALogo} alt="Iga Productos" className="w-32 sm:w-40 object-contain" />
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
                <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <MdEmail className="text-lg" />
                        </span>
                        <h1 className="text-xl font-extrabold text-base-content tracking-tight">Verifica tu correo</h1>
                    </div>

                    <p className="text-sm text-base-content/60 mb-6 leading-relaxed">
                        Te enviamos un código de 8 caracteres a{" "}
                        <span className="font-semibold text-primary break-all">{authCustomer?.email}</span>.
                        Si no lo recibiste, solicita uno nuevo.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-base-content">Código de verificación</label>
                            <input
                                {...register("verificationToken", {
                                    required: "El código es requerido",
                                    minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
                                })}
                                id="verificationToken"
                                type="text"
                                placeholder="00000000"
                                maxLength={8}
                                autoComplete="one-time-code"
                                className={clsx(
                                    "input input-md w-full text-sm border rounded-xl bg-base-200",
                                    "placeholder:text-base-content/40",
                                    "text-center tracking-[0.35em] text-xl font-semibold h-[52px] tabular-nums",
                                    errors.verificationToken ? "border-error bg-error/5" : "border-base-300"
                                )}
                            />
                            {errors.verificationToken && (
                                <p className="flex items-center gap-1.5 text-xs font-medium text-error" role="alert">
                                    <FaExclamationTriangle className="text-[10px] shrink-0" />
                                    {errors.verificationToken.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={verifying}
                            className="btn btn-primary w-full rounded-xl h-12 font-bold shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {verifying
                                ? <><span className="loading loading-spinner loading-sm text-white" /> Verificando…</>
                                : "Verificar correo"}
                        </button>
                    </form>

                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-[0.78rem] text-base-content/40">¿No recibiste el código?</span>
                        <button
                            type="button"
                            disabled={sending}
                            onClick={handleResend}
                            className="text-[0.80rem] font-medium text-primary transition-colors hover:text-primary/80 hover:underline disabled:text-base-content/30 disabled:cursor-not-allowed"
                        >
                            {sending ? <span className="loading loading-spinner loading-xs" /> : "Reenviar código"}
                        </button>
                    </div>

                    <div className="mt-5 pt-4 border-t border-base-200 flex flex-col gap-2.5">
                        <Link
                            to="/"
                            className="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors duration-200"
                        >
                            Ir al inicio
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="bg-base-300 px-6 sm:px-40 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <p className="text-xs text-base-content/60 leading-relaxed">
                    © {currentYear} Iga Productos. Todos los derechos reservados.
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

export default VerifyEmailV3;