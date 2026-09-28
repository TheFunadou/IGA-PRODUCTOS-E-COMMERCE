import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaBoxOpen, FaEnvelope, FaReceipt } from "react-icons/fa";
import clsx from "clsx";
import { useAuthStore } from "../../auth/states/authStore";
import { useGuestOrderLookup } from "../hooks/useFetchOrders";

type GuestOrderLookupFormType = {
    email: string;
    folio: string;
};

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const GuestOrderLookup = () => {
    document.title = "Iga Productos | Consultar mi orden de compra";

    const navigate = useNavigate();
    const { isAuth } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm<GuestOrderLookupFormType>();
    const lookupMutation = useGuestOrderLookup();

    // Los clientes con sesión usan "Mis órdenes": esta consulta es solo para invitados
    useEffect(() => {
        if (isAuth) navigate("/mis-ordenes", { replace: true });
    }, [isAuth, navigate]);

    const onSubmit: SubmitHandler<GuestOrderLookupFormType> = async (data) => {
        try {
            const result = await lookupMutation.mutateAsync({
                orderUUID: data.folio.trim(),
                email: data.email.trim().toLowerCase(),
            });
            navigate(`/consultar-mi-orden/detalle/${result.orderUUID}`);
        } catch {
            // El error ya se muestra con showTriggerAlert en el hook
        }
    };

    return (
        <div className="w-full flex justify-center items-start">
            <div className="w-full max-w-2xl px-2 sm:px-3 md:px-4 py-6 md:py-10">

                {/* ── Page Header ── */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FaSearch className="text-primary text-lg sm:text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                            Consultar mi orden de compra
                        </h1>
                        <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                            Consulta libre para compras realizadas como invitado, en el momento que desees.
                        </p>
                    </div>
                </div>

                {/* ── Form Card ── */}
                <div className="rounded-2xl bg-base-100 border border-base-300 px-5 sm:px-8 py-6 sm:py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm shrink-0">
                            <FaBoxOpen />
                        </div>
                        <h2 className="text-xs font-black text-base-content uppercase tracking-widest">
                            Datos de tu compra
                        </h2>
                    </div>
                    <p className="text-sm text-base-content/60 leading-relaxed mb-6">
                        Escribe el <strong className="text-base-content">correo electrónico</strong> que registraste
                        al comprar y tu <strong className="text-base-content">folio de compra</strong> (lo recibiste
                        por correo al confirmar tu pedido). Aunque alguien conozca tu folio, sin tu correo no podrá
                        consultar tu orden.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="guest-email" className="text-sm font-bold text-base-content flex items-center gap-2">
                                <FaEnvelope className="text-primary/60 text-xs" />
                                Correo electrónico de la compra
                            </label>
                            <input
                                {...register("email", {
                                    required: "Campo requerido",
                                    pattern: { value: EMAIL_REGEX, message: "Ingresa un correo válido" },
                                })}
                                id="guest-email"
                                type="email"
                                autoComplete="email"
                                placeholder="correo@ejemplo.com"
                                className={clsx(
                                    "input input-bordered w-full rounded-xl",
                                    errors.email && "input-error",
                                )}
                            />
                            {errors.email && (
                                <p className="text-error text-xs font-semibold">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="guest-folio" className="text-sm font-bold text-base-content flex items-center gap-2">
                                <FaReceipt className="text-primary/60 text-xs" />
                                Folio de compra
                            </label>
                            <input
                                {...register("folio", {
                                    required: "Campo requerido",
                                    pattern: { value: UUID_V4_REGEX, message: "El folio no tiene un formato válido" },
                                })}
                                id="guest-folio"
                                type="text"
                                autoComplete="off"
                                spellCheck={false}
                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                className={clsx(
                                    "input input-bordered w-full rounded-xl font-mono text-sm",
                                    errors.folio && "input-error",
                                )}
                            />
                            {errors.folio && (
                                <p className="text-error text-xs font-semibold">{errors.folio.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={lookupMutation.isPending}
                            className="btn btn-primary btn-lg rounded-xl text-white font-bold hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-70"
                        >
                            {lookupMutation.isPending ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />
                                    Consultando tu orden...
                                </>
                            ) : (
                                <>
                                    <FaSearch />
                                    Consultar mi orden de compra
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* ── Ayuda ── */}
                <div className="mt-4 rounded-2xl bg-base-200 border border-base-300 px-5 sm:px-8 py-5">
                    <p className="text-sm text-base-content/60 leading-relaxed text-justify">
                        ¿Compraste con una cuenta registrada?{" "}
                        <Link to="/iniciar-sesion" className="text-primary font-bold hover:underline">
                            Inicia sesión para visualizar el detalle de tu orden
                        </Link>{" "}
                        desde "Mis Órdenes". ¿No encuentras tu folio? Revisa el correo de confirmación o{" "}
                        <Link to="/contacto" className="text-primary font-bold hover:underline">
                            contacta a soporte
                        </Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GuestOrderLookup;
