import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../products/Helpers";
import { useRef } from "react";
import MercadoPagoCheckoutPro from "../components/MercadoPagoCheckoutPro";
import { usePaymentStore } from "../states/paymentStoreV2";
import { BiMinus, BiPlus } from "react-icons/bi";
import clsx from "clsx";
import { paymentProvider } from "../utils/ShoppingUtils";
import CancelOrderForm from "../components/CancelOrderForm";
import { showModal } from "../../../global/GlobalHelpers";
import { useCancelOrder, useFetchCheckoutOrderV2 } from "../../orders/hooks/useFetchOrders";
import {
    FaLock,
    FaMapMarkerAlt,
    FaShippingFast,
    FaTag,
    FaExclamationTriangle,
} from "react-icons/fa";
import { MdShoppingBag, MdPayment } from "react-icons/md";
import { SiMercadopago } from "react-icons/si";
import CheckoutOrderItemV2 from "../components/CheckoutOrderItemV2";
import type { CheckoutOrderI, OrderCreatedType } from "../../orders/OrdersTypes";

const CheckoutV2 = () => {
    document.title = "Iga Productos | Resumen de pago";
    const { order, cancelOrder } = usePaymentStore();
    const cancelOrderRef = useRef<HTMLDialogElement | null>(null);
    const navigate = useNavigate();

    if (!order) throw new Error("No se encontro la orden de pago");

    const cancelOrderMutation = useCancelOrder({ orderUUID: order.orderUUID });
    const { data, isLoading, error, refetch } = useFetchCheckoutOrderV2({ orderUUID: order.orderUUID });

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

    const hasAditonalNumber = data?.shippingAddress.aditional_number && data.shippingAddress.aditional_number !== "N/A";

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
                            Folio: <span className="font-mono font-semibold text-base-content/70">{order.orderUUID}</span>
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
                            {data?.shippingAddress && (
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div className="flex-1">
                                        <p className="text-base sm:text-lg font-extrabold text-base-content">
                                            {data.shippingAddress.recipient_name} {data.shippingAddress.recipient_last_name}
                                            <span className="ml-2 badge badge-sm badge-primary badge-outline">{data.shippingAddress.address_type}</span>
                                        </p>
                                        <p className="text-sm text-base-content/70 mt-1">
                                            {data.shippingAddress.country_phone_code} {data.shippingAddress.contact_number}
                                        </p>
                                        <p className="text-sm text-base-content/60 mt-0.5 leading-relaxed">
                                            {`${data.shippingAddress.street_name}, #${data.shippingAddress.number}${hasAditonalNumber ? ` Int. ${data.shippingAddress.aditional_number}` : ""}, ${data.shippingAddress.neighborhood}, ${data.shippingAddress.zip_code}, ${data.shippingAddress.city}, ${data.shippingAddress.state}, ${data.shippingAddress.country}`}
                                        </p>
                                        {data.shippingAddress.references_or_comments && data.shippingAddress.references_or_comments !== "N/A" && (
                                            <div className="mt-3 bg-base-200 rounded-xl p-3 border border-base-300">
                                                <p className="text-xs font-bold text-base-content/50 uppercase mb-1">Comentarios adicionales</p>
                                                <p className="text-sm text-base-content/70">{data.shippingAddress.references_or_comments}</p>
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
                                <CheckoutOrderItemV2 key={index} data={item} />
                            ))}
                            {/* Subtotal footer */}
                            <div className="px-4 py-3 bg-base-200 flex items-center justify-between">
                                <span className="text-sm text-base-content/60">
                                    Subtotal ({data?.items.length} {data?.items.length === 1 ? "producto" : "productos"})
                                </span>
                                <span className="text-base sm:text-lg font-extrabold text-base-content">
                                    ${data && formatPrice(data.resume.itemsSubtotal, "es-MX")}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── Right Column ── */}
                <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                    <PaymentSummaryPanel order={order} data={data} />
                </div>
            </section>

            <CancelOrderForm ref={cancelOrderRef} onCanceled={handleCanceled} />
        </div>
    );
};

// ── Payment Summary Panel ────────────────────────────────────────────────────
const PaymentSummaryPanel = ({ order, data }: { order: OrderCreatedType; data?: CheckoutOrderI }) => {
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
                        src={paymentProvider[order.paymentProvider].image_url}
                        alt={paymentProvider[order.paymentProvider].description}
                    />
                </figure>
            </div>

            {/* Price breakdown */}
            <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                <h2 className="text-sm font-bold text-base-content uppercase">Resumen de pago</h2>
            </div>
            <div className="p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-2.5">
                    {/* Items Subtotal Before Taxes */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-base-content/60">
                            Subtotal
                            <span className="block text-[10px] text-base-content/40">Antes de impuestos</span>
                        </span>
                        <span className="font-medium flex items-center gap-0.5">
                            <BiPlus className="text-xs" />
                            ${data?.resume && formatPrice(data.resume.itemsSubtotalBeforeTaxes, "es-MX")}
                        </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex items-center justify-between text-sm rounded-lg bg-base-200 px-3 py-2">
                        <div>
                            <span className="flex items-center gap-1.5 text-base-content/70">
                                <FaShippingFast className="text-primary text-sm" />
                                Envío ({data?.resume && (
                                    data.resume.boxesCount > 1 ? `${data.resume.boxesCount} cajas` : `${data.resume.boxesCount} caja`
                                )})
                            </span>

                            <p className="text-[10px] text-base-content/40">Antes de impuestos</p>
                        </div>
                        <span className="font-medium flex items-center gap-0.5">
                            <BiPlus className="text-xs" />
                            ${data?.resume && formatPrice(data.resume.shippingCostBeforeTaxes, "es-MX")}
                        </span>
                    </div>

                    {/* IVA */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-base-content/60">IVA (16%)</span>
                        <span className="font-medium flex items-center gap-0.5">
                            <BiPlus className="text-xs" />
                            ${data?.resume && formatPrice(data.resume.iva, "es-MX")}
                        </span>
                    </div>

                    {/* Discount */}
                    {data?.resume && parseFloat(data.resume.discount) > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-primary font-bold flex items-center gap-1.5">
                                <FaTag className="text-xs" />
                                Descuento
                            </span>
                            <span className="text-primary font-bold flex items-center gap-0.5">
                                <BiMinus className="text-xs" />
                                ${formatPrice(data.resume.discount, "es-MX")}
                            </span>
                        </div>
                    )}
                </div>

                {/* Coupon Code Section */}
                {data?.couponCode && (
                    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2">
                            <FaTag className="text-primary text-xs" />
                            <span className="text-xs font-bold text-base-content uppercase">Cupón aplicado</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-mono font-bold text-primary">{data.couponCode}</span>
                            <span className="badge badge-primary badge-sm">ACTIVO</span>
                        </div>
                    </div>
                )}

                {/* Total */}
                <div className="border-t border-base-300 pt-3 flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-base-content">Total a pagar</span>
                    <span className="text-lg sm:text-xl font-extrabold text-primary">
                        ${data?.resume && formatPrice(data.resume.total, "es-MX")}
                    </span>
                </div>

                {/* Payment CTA */}
                <div className="flex flex-col gap-2 pt-1">
                    {order.paymentProvider === "mercado_pago" && (
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
                            <MercadoPagoCheckoutPro preferenceId={data?.externalId} />
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

export default CheckoutV2;
