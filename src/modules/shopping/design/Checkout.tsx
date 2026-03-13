import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/states/authStore";
import { formatPrice } from "../../products/Helpers";
import { useRef, useState } from "react";
import MercadoPagoCheckoutPro from "../components/MercadoPagoCheckoutPro";
import { usePaymentStore } from "../states/paymentStore";
import { BiMinus, BiPlus } from "react-icons/bi";
import clsx from "clsx";
import { paymentProvider } from "../utils/ShoppingUtils";
import CancelOrderForm from "../components/CancelOrderForm";
import { showModal } from "../../../global/GlobalHelpers";
import { useCancelOrder, useFetchCheckoutOrder } from "../../orders/hooks/useFetchOrders";
import {
    FaLock,
    FaMapMarkerAlt,
    FaShippingFast,
    FaTag,
    FaUserPlus,
    FaGift,
    FaStar,
    FaShoppingBag,
    FaUserAlt,
    FaExclamationTriangle,
} from "react-icons/fa";
import { MdShoppingBag, MdCheckBox, MdPayment } from "react-icons/md";
import { SiMercadopago } from "react-icons/si";
import CheckoutOrderItem from "../components/CheckoutOrderItem";
import type { OrderCheckoutType, OrderCreatedType } from "../../orders/OrdersTypes";

const Checkout = () => {
    document.title = "Iga Productos | Resumen de pago";
    const [showGuestForm, _setShowGuestForm] = useState<boolean>(false);
    const { isAuth } = useAuthStore();
    const { order, cancelOrder } = usePaymentStore();
    const cancelOrderRef = useRef<HTMLDialogElement | null>(null);
    const navigate = useNavigate();
    const cancelOrderMutation = useCancelOrder({ orderUUID: order?.folio! });
    if (!order) throw new Error("No se encontro la orden de pago");

    const { data, isLoading, error, refetch } = useFetchCheckoutOrder({ orderUUID: order.folio });
    if (data && data.items.filter(item => item.isChecked === true).length === 0) navigate("/carrito-de-compras");

    const handleCanceled = async () => {
        await cancelOrderMutation.mutateAsync();
        await cancelOrder().then(() => {
            return navigate("/carrito-de-compras");
        });
    };

    // ── Loading state ────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200 min-h-64 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                    <span className="loading loading-spinner loading-md text-primary" />
                    <p className="text-base sm:text-lg text-base-content/70">Cargando datos de la orden...</p>
                </div>
            </div>
        );
    }

    // ── Error state ──────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200 min-h-64 flex flex-col items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center">
                    <FaExclamationTriangle className="text-error text-2xl" />
                </div>
                <div className="text-center">
                    <p className="text-base sm:text-lg font-bold text-base-content">Error al cargar la orden</p>
                    <p className="text-sm text-base-content/50 mt-1">No pudimos obtener los datos de tu orden de pago.</p>
                </div>
                <button type="button" className="btn btn-primary btn-sm sm:btn-md" onClick={() => refetch()}>
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    return (
        <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MdPayment className="text-primary text-lg sm:text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                            Pago de productos
                        </h1>
                        <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                            Folio: <span className="font-mono font-semibold text-base-content/70">{order.folio}</span>
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-error btn-sm text-white gap-2 w-fit"
                    onClick={() => showModal(cancelOrderRef.current)}
                >
                    Abandonar orden
                </button>
            </div>

            {/* ── Main Layout ── */}
            <section className="w-full flex flex-col lg:flex-row gap-5">

                {/* ── Left Column ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-5">

                    {/* ── Address Section ── */}
                    {isAuth ? (
                        <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                            <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                                <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" />
                                    Dirección de envío
                                </h2>
                            </div>
                            <div className="p-4 sm:p-5">
                                {data?.address && (
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="flex-1">
                                            <p className="text-base sm:text-lg font-extrabold text-base-content">
                                                {data.address.recipient_name} {data.address.recipient_last_name}
                                                <span className="ml-2 badge badge-sm badge-primary badge-outline">{data.address.address_type}</span>
                                            </p>
                                            <p className="text-sm text-base-content/70 mt-1">
                                                {data.address.country_phone_code} {data.address.contact_number}
                                            </p>
                                            <p className="text-sm text-base-content/60 mt-0.5 leading-relaxed">
                                                {`${data.address.street_name}, #${data.address.number}${data.address.aditional_number === "N/A" ? "" : ` Int. ${data.address.aditional_number}`}, ${data.address.neighborhood}, ${data.address.zip_code}, ${data.address.city}, ${data.address.state}, ${data.address.country}`}
                                            </p>
                                            {data.address.references_or_comments && data.address.references_or_comments !== "N/A" && (
                                                <div className="mt-3 bg-base-200 rounded-xl p-3 border border-base-300">
                                                    <p className="text-xs font-bold text-base-content/50 uppercase mb-1">Comentarios adicionales</p>
                                                    <p className="text-sm text-base-content/70">{data.address.references_or_comments}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                            <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                                <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" />
                                    Dirección de envío
                                </h2>
                            </div>
                            <div className="p-5 flex flex-col gap-5">
                                {showGuestForm ? (
                                    /* Guest form section — kept from original, styling updated */
                                    <div className="w-full flex flex-col gap-4">
                                        <div className="flex items-center gap-2">
                                            <FaUserAlt className="text-primary text-sm" />
                                            <p className="text-sm font-bold text-base-content uppercase">Formulario de compra como invitado</p>
                                        </div>
                                        <p className="text-xs text-base-content/50 leading-relaxed">
                                            Sus datos personales se utilizarán para procesar su pedido conforme a nuestra política de privacidad.
                                        </p>

                                        {/* Personal info */}
                                        <div>
                                            <p className="text-xs font-bold text-base-content/50 uppercase mb-2">Información del comprador</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs text-base-content/60 mb-1 block">Correo electrónico</label>
                                                    <input type="email" className="input input-sm sm:input-md w-full text-sm bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-base-content/60 mb-1 block">Nombre</label>
                                                    <input type="text" className="input input-sm sm:input-md w-full text-sm bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-base-content/60 mb-1 block">Apellidos</label>
                                                    <input type="text" className="input input-sm sm:input-md w-full text-sm bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-base-content/60 mb-1 block">Número telefónico</label>
                                                    <input type="tel" className="input input-sm sm:input-md w-full text-sm bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <p className="text-xs font-bold text-base-content/50 uppercase mb-2">Domicilio de envío</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {[
                                                    { label: "Calle", type: "text" },
                                                    { label: "Número Ext.", type: "text" },
                                                    { label: "Número Int.", type: "text" },
                                                    { label: "Colonia / Fraccionamiento", type: "text" },
                                                    { label: "Código Postal", type: "text" },
                                                    { label: "Ciudad", type: "text" },
                                                    { label: "Estado / Entidad Federativa", type: "text" },
                                                    { label: "País", type: "text" },
                                                ].map((field, i) => (
                                                    <div key={i}>
                                                        <label className="text-xs text-base-content/60 mb-1 block">{field.label}</label>
                                                        <input type={field.type} className="input input-sm sm:input-md w-full text-sm bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                                    </div>
                                                ))}
                                                <div className="sm:col-span-2">
                                                    <label className="text-xs text-base-content/60 mb-1 block">
                                                        Referencias del domicilio <span className="text-base-content/40">(opcional)</span>
                                                    </label>
                                                    <textarea
                                                        className="textarea textarea-sm sm:textarea-md w-full text-sm bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                                                        placeholder="Entre calles, referencias, etc... Máximo 100 caracteres"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Consent */}
                                        <div className="flex items-start gap-3 p-3 rounded-xl border border-base-300 bg-base-200">
                                            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="text-xs text-base-content/70 leading-relaxed">
                                                    Quiero utilizar la misma dirección para facturar el pedido.
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-xl border border-base-300 bg-base-200">
                                            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm mt-0.5 flex-shrink-0" />
                                            <Link to="/politica-de-privacidad" className="text-xs text-primary underline underline-offset-2 leading-relaxed hover:opacity-70 transition-opacity">
                                                He leído y estoy de acuerdo con los términos y condiciones y política de privacidad de la web.
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Sign in CTA */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <FaUserPlus className="text-primary text-lg" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-base-content text-sm sm:text-base">¿Ya tienes cuenta? Inicia sesión</p>
                                                <p className="text-xs text-base-content/50 mt-0.5">Accede a tus direcciones guardadas y completa tu compra más rápido</p>
                                            </div>
                                            <Link to="/iniciar-sesion" className="btn btn-primary btn-sm flex-shrink-0 w-full sm:w-auto">
                                                Iniciar sesión
                                            </Link>
                                        </div>

                                        {/* Divider */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-px bg-base-300" />
                                            <span className="text-xs text-base-content/40 font-medium">o</span>
                                            <div className="flex-1 h-px bg-base-300" />
                                        </div>

                                        {/* Benefits */}
                                        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                                            <div className="flex items-start gap-3">
                                                <FaGift className="text-warning text-lg flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-bold text-base-content mb-1.5">¡No te pierdas estos beneficios al registrarte!</p>
                                                    <ul className="flex flex-col gap-1.5">
                                                        {[
                                                            { icon: <FaStar className="text-warning text-xs" />, text: "Acumula puntos con cada compra y canjéalos por productos" },
                                                            { icon: <FaShoppingBag className="text-primary text-xs" />, text: "Guarda tus direcciones y agiliza futuros pedidos" },
                                                            { icon: <MdCheckBox className="text-info text-xs" />, text: "Historial completo de pedidos y seguimiento de envíos" },
                                                        ].map((item, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <span className="mt-0.5 flex-shrink-0">{item.icon}</span>
                                                                <span className="text-xs text-base-content/70">{item.text}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Continue as guest */}
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm border border-base-300 hover:bg-base-200 gap-2 text-base-content/60 w-full"
                                        >
                                            <FaUserAlt className="text-xs" />
                                            Continuar como invitado
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Order Items ── */}
                    <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                        <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                            <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                                <MdShoppingBag className="text-primary" />
                                Resumen de pedido
                            </h2>
                        </div>
                        <div className="flex flex-col divide-y divide-base-200">
                            {data && data.items.length > 0 && data.items.map((item, index) => (
                                <CheckoutOrderItem key={index} data={item} />
                            ))}
                            {/* Subtotal footer */}
                            <div className="px-4 py-3 bg-base-200 flex items-center justify-between">
                                <span className="text-sm text-base-content/60">
                                    Subtotal ({data?.items.length} {data?.items.length === 1 ? "producto" : "productos"})
                                </span>
                                <span className="text-base sm:text-lg font-extrabold text-base-content">
                                    ${formatPrice((data?.resume.subtotalWithDiscount.toString()!), "es-MX")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile payment summary */}
                    <div className="lg:hidden">
                        <PaymentSummaryPanel order={order} data={data} />
                    </div>
                </div>

                {/* ── Right Column ── */}
                <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                    <div className="hidden lg:block">
                        <PaymentSummaryPanel order={order} data={data} />
                    </div>
                </div>
            </section>

            <CancelOrderForm ref={cancelOrderRef} onCanceled={handleCanceled} />
        </div>
    );
};

// ── Payment Summary Panel ────────────────────────────────────────────────────
const PaymentSummaryPanel = ({ order, data }: { order: OrderCreatedType; data?: OrderCheckoutType }) => {
    return (
        <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden sticky top-5">

            {/* Provider logo */}
            <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center gap-2">
                <MdPayment className="text-primary text-sm" />
                <h2 className="text-sm font-bold text-base-content uppercase">Método de pago</h2>
            </div>
            <div className="px-4 py-4 flex justify-center border-b border-base-300">
                <figure className="w-28 sm:w-36">
                    <img
                        className="w-full object-contain"
                        src={paymentProvider[order.payment_method].image_url}
                        alt={paymentProvider[order.payment_method].description}
                    />
                </figure>
            </div>

            {/* Price breakdown */}
            <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                <h2 className="text-sm font-bold text-base-content uppercase">Resumen de pago</h2>
            </div>
            <div className="p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-base-content/60">
                            Subtotal
                            <span className="block text-[10px] text-base-content/40">Antes de impuestos</span>
                        </span>
                        <span className="font-medium flex items-center gap-0.5">
                            <BiPlus className="text-xs" />
                            ${data?.resume && formatPrice(data.resume.subtotalBeforeIVA.toString(), "es-MX")}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-base-content/60">IVA (16%)</span>
                        <span className="font-medium flex items-center gap-0.5">
                            <BiPlus className="text-xs" />
                            ${data?.resume && formatPrice(data.resume.iva.toString(), "es-MX")}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm rounded-lg bg-base-200 px-3 py-2">
                        <span className="flex items-center gap-1.5 text-base-content/70">
                            <FaShippingFast className="text-primary text-sm" />
                            Envío ({data?.resume && (
                                data.resume.boxesQty > 1 ? `${data.resume.boxesQty} cajas` : `${data.resume.boxesQty} caja`
                            )})
                        </span>
                        <span className="font-medium flex items-center gap-0.5">
                            <BiPlus className="text-xs" />
                            ${data?.resume && formatPrice(data.resume.shippingCost.toString(), "es-MX")}
                        </span>
                    </div>
                    {data?.resume && data.resume.discount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-primary font-bold flex items-center gap-1.5">
                                <FaTag className="text-xs" />
                                Descuento
                            </span>
                            <span className="text-primary font-bold flex items-center gap-0.5">
                                <BiMinus className="text-xs" />
                                ${formatPrice(data.resume.discount.toString(), "es-MX")}
                            </span>
                        </div>
                    )}
                </div>

                {/* Total */}
                <div className="border-t border-base-300 pt-3 flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-base-content">Total a pagar</span>
                    <span className="text-lg sm:text-xl font-extrabold text-primary">
                        ${data?.resume && formatPrice(data.resume.total.toString(), "es-MX")}
                    </span>
                </div>

                {/* Payment CTA */}
                <div className="flex flex-col gap-2 pt-1">
                    {order.payment_method === "mercado_pago" && (
                        <>
                            <div className={clsx(
                                "flex items-center gap-3 p-3 rounded-xl border",
                                "border-primary/40 bg-primary/5"
                            )}>
                                <SiMercadopago className="text-2xl text-primary flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-base-content">Mercado Pago</p>
                                    <p className="text-[10px] text-base-content/50">Crédito, débito, OXXO, MSI y más</p>
                                </div>
                            </div>
                            <MercadoPagoCheckoutPro preferenceId={data?.external_id} />
                        </>
                    )}
                </div>

                <p className="text-center text-[10px] text-base-content/30 flex items-center justify-center gap-1">
                    <FaLock className="text-[8px]" /> Pago seguro y encriptado
                </p>
            </div>
        </div>
    );
};

export default Checkout;