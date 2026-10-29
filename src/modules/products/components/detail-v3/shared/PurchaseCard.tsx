import clsx from "clsx";
import { formatPrice } from "../../../Helpers";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { IoShareSocialOutline } from "react-icons/io5";
import {
    FaBoxOpen, FaCircleCheck, FaCirclePause, FaTriangleExclamation
} from "react-icons/fa6";
import { MdAddShoppingCart } from "react-icons/md";
import StockIndicator from "./StockIndicator";

export interface PurchaseCardProps {
    unitPrice: string;
    finalPrice: string;
    isOffer: boolean;
    discount?: number | null;
    stock: number;
    productQty: number;
    selectProductQty: string;
    stockError: string;
    isFavorite: boolean;
    isAuth: boolean;
    onQtySelect: (v: string) => void;
    onQtySet: (v: string) => void;
    onQtyLimit: (v: string) => void;
    onAddCart: () => void;
    onBuyNow: () => void;
    onToggleFavorite: (e: React.MouseEvent) => void;
    onShare: () => void;
    maxStock: number;
    status: string;
}

const PurchaseCard = ({
    unitPrice, finalPrice, isOffer, discount, stock,
    productQty, selectProductQty, stockError, isFavorite, isAuth,
    onQtySelect, onQtySet, onQtyLimit,
    onAddCart, onBuyNow, onToggleFavorite, onShare, maxStock, status
}: PurchaseCardProps) => {
    const isOutOfStock = stock <= 0;
    const isPaused = /PAUSED|PAUSADO/i.test(status);
    const isUnavailable = isPaused || isOutOfStock;
    const outOfStockTooltip = "Sin stock por el momento, puedes ver más detalles y contactarte con nosotros para consultar disponibilidad";
    const pausedTooltip = "Este producto está pausado, contáctanos para consultar su disponibilidad";
    const unavailableTooltip = isPaused ? pausedTooltip : outOfStockTooltip;
    const actionLabel = isPaused ? "Pausado" : "AGOTADO";
    return (
        <div className="w-full rounded-2xl border border-base-300 bg-base-100 shadow-xl overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-base-200 bg-base-200/30">
                {isOffer && (
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full text-white bg-error shadow-sm">
                            -{discount}%
                        </span>
                        <span className="text-xs text-base-content/45 line-through font-medium">${unitPrice}</span>
                    </div>
                )}
                <div className="flex items-baseline gap-1">
                    <span className="text-sm text-base-content/60 font-bold mb-0.5">$</span>
                    <span className="text-4xl font-black text-base-content tracking-tight">
                        {(isOffer ? finalPrice : unitPrice).slice(0, -3)}
                    </span>
                    <span className="text-lg font-bold self-start mt-1.5 text-base-content">
                        {(isOffer ? finalPrice : unitPrice).slice(-3)}
                    </span>
                    <span className="text-[10px] text-base-content/50 ml-1 font-bold uppercase tracking-widest">MXN / pza.</span>
                </div>
                <div>
                    <span className={clsx(
                        "badge badge-sm font-bold gap-1 border-0",
                        isPaused
                            ? "bg-warning/15 text-warning"
                            : status === 'DISPONIBLE'
                                ? "bg-success/15 text-success"
                                : "bg-error/15 text-error"
                    )}>
                        {isPaused ? <FaCirclePause className="text-[10px]" /> : <FaCircleCheck className="text-[10px]" />}
                        {isPaused ? "Pausado" : status}
                    </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <StockIndicator stock={stock} isPaused={isPaused} />
                </div>
            </div>

            <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="qty-v3" className="text-[11px] font-bold text-base-content/50 uppercase tracking-widest flex items-center gap-1.5">
                        <FaBoxOpen className="text-primary" /> Cantidad
                    </label>
                    <select
                        id="qty-v3"
                        className="select select-bordered select-sm w-full font-bold bg-base-100"
                        onChange={(e) => { onQtySelect(e.target.value); onQtySet(e.target.value); }}
                        value={selectProductQty}
                        disabled={isUnavailable}
                    >
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} pieza{n > 1 ? "s" : ""}</option>)}
                        <option value="more">Más de 5 piezas...</option>
                    </select>
                    {selectProductQty === "more" && !isUnavailable && (
                        <>
                            <input
                                type="number"
                                inputMode="numeric"
                                placeholder={`Máximo ${maxStock} piezas`}
                                className="input input-bordered input-sm w-full font-bold"
                                onChange={(e) => { onQtyLimit(e.target.value); onQtySet(e.target.value); }}
                            />
                            {stockError && (
                                <p className="text-error text-[11px] flex items-center gap-1 font-bold">
                                    <FaTriangleExclamation />{stockError}
                                </p>
                            )}
                        </>
                    )}
                    {isUnavailable && (
                        <p className={clsx("text-[11px] flex items-center gap-1 font-bold", isPaused ? "text-warning" : "text-error")}>
                            <FaTriangleExclamation /> {isPaused ? "Producto pausado, no disponible para compra" : "Producto sin stock disponible"}
                        </p>
                    )}
                </div>

                {productQty > 1 && !isUnavailable && (
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-primary/5 rounded-xl border border-primary/10">
                        <span className="text-[11px] font-bold text-primary/80 uppercase tracking-widest">Total ({productQty} pzas)</span>
                        <span className="text-base font-black text-primary">
                            ${formatPrice((parseFloat(unitPrice.replace(/,/g, "")) * productQty).toString(), "es-MX")} MXN
                        </span>
                    </div>
                )}

                <div className="flex flex-col gap-2.5">
                    <div className={clsx(isUnavailable && "tooltip tooltip-top")} data-tip={isUnavailable ? unavailableTooltip : undefined}>
                        <button
                            type="button"
                            className={clsx(
                                "btn w-full rounded-xl h-12 font-bold transition-all",
                                isUnavailable
                                    ? "btn-disabled bg-base-300 text-base-content/50 border-base-300 cursor-not-allowed"
                                    : "btn-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                            )}
                            onClick={onAddCart}
                            disabled={isUnavailable || productQty > maxStock}
                            aria-disabled={isUnavailable || productQty > maxStock}
                            title={isUnavailable ? unavailableTooltip : undefined}
                        >
                            <MdAddShoppingCart className="text-lg" /> {isUnavailable ? actionLabel : "Agregar al carrito"}
                        </button>
                    </div>
                    <div className={clsx(isUnavailable && "tooltip tooltip-top")} data-tip={isUnavailable ? unavailableTooltip : undefined}>
                        <button
                            type="button"
                            className={clsx(
                                "btn w-full rounded-xl h-12 font-bold",
                                isUnavailable
                                    ? "btn-disabled bg-base-200 text-base-content/50 border-base-300 cursor-not-allowed"
                                    : "btn-outline btn-primary"
                            )}
                            onClick={onBuyNow}
                            disabled={isUnavailable}
                            aria-disabled={isUnavailable}
                            title={isUnavailable ? unavailableTooltip : undefined}
                        >
                            {isUnavailable ? actionLabel : "Comprar ahora"}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-around p-1.5 rounded-xl bg-base-200/40 border border-base-200">
                    {isAuth && (
                        <>
                            <button
                                type="button"
                                className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg text-[11px] font-bold hover:bg-base-100 transition-colors active:scale-95"
                                onClick={onToggleFavorite}
                            >
                                {isFavorite
                                    ? <IoMdHeart className="text-lg text-error" />
                                    : <IoIosHeartEmpty className="text-lg text-base-content/60 hover:text-error" />}
                                <span className={isFavorite ? "text-error" : "text-base-content/60"}>
                                    {isFavorite ? "Guardado" : "Favorito"}
                                </span>
                            </button>
                            <div className="w-px h-6 bg-base-300" />
                        </>
                    )}
                    <button
                        type="button"
                        className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg text-base-content/60 text-[11px] font-bold hover:text-base-content hover:bg-base-100 transition-colors active:scale-95"
                        onClick={onShare}
                    >
                        <IoShareSocialOutline className="text-lg" />
                        <span>Compartir</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCard;
