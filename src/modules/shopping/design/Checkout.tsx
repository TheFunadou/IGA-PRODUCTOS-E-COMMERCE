import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../products/Helpers";
import { useRef } from "react";
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
    FaExclamationTriangle,
} from "react-icons/fa";
import { MdShoppingBag, MdPayment } from "react-icons/md";
import { SiMercadopago } from "react-icons/si";
import CheckoutOrderItem from "../components/CheckoutOrderItem";
import type { OrderCheckoutType, OrderCreatedType } from "../../orders/OrdersTypes";

const Checkout = () => {
    document.title = "Iga Productos | Resumen de pago";
    const { order, cancelOrder } = usePaymentStore();
    const cancelOrderRef = useRef<HTMLDialogElement | null>(null);
    const navigate = useNavigate();
    const cancelOrderMutation = useCancelOrder({ orderUUID: order?.folio! });
    if (!order) throw new Error("No se encontro la orden de pago");

    const { data, isLoading, error, refetch } = useFetchCheckoutOrder({ orderUUID: order.folio });
    if (data && data.items.length === 0) navigate("/carrito-de-compras");

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
    };

    const hasAditonalNumber = data?.address.aditional_number && data.address.aditional_number !== "N/A";

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
                                            {`${data.address.street_name}, #${data.address.number}${hasAditonalNumber ? ` Int. ${data.address.aditional_number}` : ""}, ${data.address.neighborhood}, ${data.address.zip_code}, ${data.address.city}, ${data.address.state}, ${data.address.country}`}
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

                </div>

                {/* ── Right Column ── */}
                {/* Panel único — el flex-col / lg:flex-row del <section> lo posiciona
                    automáticamente debajo en mobile y a la derecha en desktop */}
                <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                    <PaymentSummaryPanel order={order} data={data} />
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