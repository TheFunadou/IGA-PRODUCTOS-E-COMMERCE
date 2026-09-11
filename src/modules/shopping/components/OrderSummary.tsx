import { Link } from "react-router-dom";
import { FaTag, FaShippingFast, FaShoppingBag, FaClipboardList, FaExclamation } from "react-icons/fa";
import { BiMinus, BiPlus } from "react-icons/bi";
import { formatPrice } from "../../products/Helpers";
import type { ShoppingCartI, ShoppingCartResumeI } from "../ShoppingTypes";

interface OrderSummaryProps {
    allItems: ShoppingCartI[];
    handleCart: {
        data?: { shoppingCart: ShoppingCartI[]; resume?: ShoppingCartResumeI };
    };
    destination: string | null;
    couponCode: string | null;
    setCouponCode: (code: string | null) => void;
    orderLoading: boolean;
    handleCreateOrder: () => void;
    error: string | null;
    isAuth: boolean;
    isSubmitDisabled: boolean;
    pendingOrder?: boolean;
    onPendingPayment?: () => void;
}

const OrderSummary = ({
    allItems,
    handleCart,
    destination,
    couponCode,
    setCouponCode,
    orderLoading,
    handleCreateOrder,
    error,
    isAuth,
    isSubmitDisabled,
    pendingOrder = false,
    onPendingPayment,
}: OrderSummaryProps) => (
    <div className="w-full rounded-2xl bg-base-100 border border-base-300">
        <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex gap-1 items-center">
            <FaClipboardList className="text-primary" />
            <h2 className="text-sm font-bold text-base-content uppercase">Resumen del pedido</h2>
        </div>
        <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                        <FaShoppingBag className="text-primary" />
                        <span className="text-base-content/60">
                            Subtotal ({allItems.length} {allItems.length === 1 ? "producto" : "productos"})
                        </span>
                        <div className="tooltip tooltip-right" data-tip="Precio unitario × cantidad, antes de impuestos y descuentos">
                            <span className="w-3.5 h-3.5 rounded-full bg-base-300 text-base-content/50 flex items-center justify-center text-[8px] font-bold cursor-help">?</span>
                        </div>
                    </div>
                    <span className="font-medium">+ ${handleCart.data?.resume?.itemsSubtotalBeforeTaxes || "0.00"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                        <FaShippingFast className="text-primary" />
                        <span className="text-base-content/60">
                            Envío ({handleCart.data?.resume?.boxesCount || 0} {(handleCart.data?.resume?.boxesCount || 0) === 1 ? "caja" : "cajas"})
                        </span>
                        <div className="tooltip tooltip-right" data-tip="Costo de envío antes de impuestos. El IVA del envío se incluye en la línea de IVA">
                            <span className="w-3.5 h-3.5 rounded-full bg-base-300 text-base-content/50 flex items-center justify-center text-[8px] font-bold cursor-help">?</span>
                        </div>
                    </div>
                    {destination ? (
                        <span className="font-medium flex items-center gap-0.5"><BiPlus className="text-xs" />${handleCart.data?.resume?.shippingCostBeforeTaxes || "0.00"}</span>
                    ) : (
                        <span className="text-xs text-base-content italic bg-warning/50 px-2 rounded-xl">{isAuth ? "Seleccionar dirección de envío" : "Rellenar formulario de envío"}</span>
                    )}
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                        <span className="text-base-content/60">IVA (16%)</span>
                        <div className="tooltip tooltip-right" data-tip="Impuesto del 16% calculado sobre subtotal + envío. Los descuentos se aplican sobre precio + IVA">
                            <span className="w-3.5 h-3.5 rounded-full bg-base-300 text-base-content/50 flex items-center justify-center text-[8px] font-bold cursor-help">?</span>
                        </div>
                    </div>
                    <span className="font-medium flex items-center gap-0.5"><BiPlus className="text-xs" />${handleCart.data?.resume?.iva || "0.00"}</span>
                </div>
                {(parseFloat(handleCart.data?.resume?.discount || "0") + parseFloat(handleCart.data?.resume?.automaticDiscount || "0")) > 0 && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-primary font-bold flex items-center gap-1.5">
                            <FaTag className="text-xs" />Descuento
                        </span>
                        <span className="text-primary font-bold flex items-center gap-0.5">
                            <BiMinus className="text-xs" />${formatPrice((parseFloat(handleCart.data?.resume?.discount?.replace(/,/g, "") || "0") + parseFloat(handleCart.data?.resume?.automaticDiscount?.replace(/,/g, "") || "0")).toString(), "es-MX")}
                        </span>
                    </div>
                )}
            </div>

            <div className="border-t border-base-300 pt-3 flex items-center justify-between">
                <span className="text-sm sm:text-base font-bold text-base-content">
                    {!destination ? (
                        <div className="flex items-center gap-2 tooltip tooltip-bottom" data-tip="El precio final junto con costos de envio se calcula despues de rellenar el formulario de envio.">
                            <p>Total Parcial</p>
                            <span className="w-3.5 h-3.5 rounded-full bg-warning/30 text-base-content/50 flex items-center justify-center text-[8px] font-bold cursor-help">?</span>
                        </div>
                    ) : (
                        <div>
                            Total Final
                        </div>
                    )}</span>
                <span className="text-lg sm:text-xl font-extrabold text-primary">
                    ${handleCart.data?.resume?.total || "0.00"}
                </span>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-base-content/60 uppercase flex items-center gap-1.5">
                    <FaTag className="text-xs text-primary" />
                    Cupón de descuento
                </label>
                <input
                    onChange={(e) => setCouponCode(e.target.value)}
                    type="text"
                    className="input input-sm w-full text-sm bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Introduce tu código"
                    defaultValue={couponCode ?? ""}
                />
            </div>

            <button
                className={`w-full btn rounded-2xl font-bold gap-2 tracking-wide tooltip tooltip-bottom ${pendingOrder
                        ? "bg-warning hover:bg-warning/90 text-white border-0"
                        : "btn-primary"
                    }`}
                data-tip={pendingOrder ? "Continúa con el pago de tu orden pendiente." : "Realiza las acciones indicadas para continuar."}
                disabled={pendingOrder ? !onPendingPayment : isSubmitDisabled}
                onClick={pendingOrder ? onPendingPayment : handleCreateOrder}
                onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
            >
                {orderLoading && <span className="loading loading-spinner loading-sm" />}
                {orderLoading ? "Procesando..." : pendingOrder ? "Terminar compra" : "Proceder al pago"}
            </button>

            <p className="text-[11px] text-base-content/50 text-center leading-relaxed">
                Al hacer click en "Proceder al pago" confirmo haber leído y aceptado los{" "}
                <Link to="/terminos-y-condiciones" className="text-primary underline underline-offset-2 hover:text-primary/80" target="_blank">
                    términos y condiciones
                </Link>
            </p>

            {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">
                    <span className="text-lg flex-shrink-0"><FaExclamation /></span>
                    <span>{error}</span>
                </div>
            )}
        </div>
    </div>
);

export default OrderSummary;
