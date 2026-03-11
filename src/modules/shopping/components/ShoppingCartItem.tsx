import ButtonQtyCounter from "./ButtonQtyCounter";
import { FaFire } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { formatPrice, makeSlug } from "../../products/Helpers";
import { Link } from "react-router-dom";
import type { ShoppingCartType } from "../ShoppingTypes";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import clsx from "clsx";
import { useEffect, useState } from "react";

type Props = {
    data: ShoppingCartType;
    onToggleCheck?: (sku: string) => void;
    onRemoveItem?: (sku: string) => void;
    onUpdateQty?: (values: { sku: string; newQuantity: number }) => void;
    isAuth?: boolean;
};

const discountBg = (discount?: number | null) => {
    if (!discount) return "";
    if (discount < 50) return "bg-error";
    if (discount < 65) return "bg-success";
    return "bg-primary";
};

const discountText = (discount?: number | null) => {
    if (!discount) return "text-base-content";
    if (discount < 50) return "text-error";
    if (discount < 65) return "text-success";
    return "text-primary";
};

const ShoppingCartItem = ({ data, onRemoveItem, onToggleCheck, onUpdateQty, isAuth }: Props) => {
    const [subtotal, setSubtotal] = useState(0);
    const [subtotalWithDisc, setSubtotalWithDisc] = useState(0);

    const debouncedOnToggleCheck = onToggleCheck
        && useDebounceCallback(() => onToggleCheck(data.product_version.sku), isAuth ? 300 : 0);

    useEffect(() => {
        if (data.isOffer && data.product_version.unit_price_with_discount) {
            setSubtotalWithDisc(parseFloat(data.product_version.unit_price_with_discount) * data.quantity);
        }
        setSubtotal(parseFloat(data.product_version.unit_price) * data.quantity);
    }, [data]);

    const mainImage = data.product_images.find(img => img.main_image)?.image_url;
    const productUrl = `/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name)}/${data.product_version.sku.toLowerCase()}`;

    return (
        <div className="w-full rounded-2xl bg-base-100 border border-base-300 hover:border-primary/30 transition-colors duration-200 p-3 sm:p-4 md:p-5">
            <div className="flex gap-3 sm:gap-4">

                {/* ── Checkbox ── */}
                <div className="flex items-start pt-1 flex-shrink-0">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm sm:checkbox-md"
                        checked={data.isChecked ?? false}
                        onChange={debouncedOnToggleCheck}
                    />
                </div>

                {/* ── Imagen ── */}
                <Link to={productUrl} className="flex-shrink-0 group">
                    <div className="
                        w-20 h-20
                        sm:w-28 sm:h-28
                        md:w-32 md:h-32
                        lg:w-36 lg:h-36
                        rounded-xl overflow-hidden border border-base-300
                        group-hover:border-primary/50 transition-colors duration-200
                    ">
                        <img
                            src={mainImage}
                            alt={data.product_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </Link>

                {/* ── Contenido principal ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">

                    {/* Nombre + badge oferta + eliminar */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                            <Link
                                to={productUrl}
                                className="text-sm sm:text-base md:text-lg font-bold text-base-content hover:text-primary hover:underline underline-offset-2 transition-colors duration-150 leading-snug"
                            >
                                {data.product_name}
                            </Link>
                            {data.isOffer && (
                                <span className={clsx(
                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold flex-shrink-0",
                                    discountBg(data.discount)
                                )}>
                                    <FaFire className="text-[10px]" />
                                    {data.discount}% OFF
                                </span>
                            )}
                        </div>

                        {/* Eliminar */}
                        <button
                            type="button"
                            title="Eliminar del carrito"
                            onClick={() => onRemoveItem?.(data.product_version.sku)}
                            className="flex-shrink-0 p-1.5 rounded-lg text-base-content/30 hover:text-error hover:bg-error/10 transition-all duration-200 active:scale-90"
                        >
                            <FiTrash2 className="text-base sm:text-lg" />
                        </button>
                    </div>

                    {/* Breadcrumbs */}
                    <div className="breadcrumbs text-xs sm:text-sm text-base-content/50 bg-base-200 w-fit rounded-lg px-2 sm:px-3 py-0.5">
                        <ul>
                            <li><strong className="text-base-content/70">{data.category}</strong></li>
                            {data.subcategories.map((bc, i) => (
                                <li key={i}><strong className="text-base-content/70">{bc}</strong></li>
                            ))}
                        </ul>
                    </div>

                    {/* Color */}
                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-base-300 flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: data.product_version.color_code }}
                        />
                        <span className="text-xs sm:text-sm text-base-content/60">
                            {data.product_version.color_line} —{" "}
                            <span className="text-base-content font-medium">{data.product_version.color_name}</span>
                        </span>
                    </div>

                    {/* Cantidad + Precios */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-1">

                        {/* Contador */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-base-content/50 uppercase">Cantidad</span>
                            <ButtonQtyCounter
                                key={1}
                                initQty={data.quantity}
                                limit={data.product_version.stock}
                                sku={data.product_version.sku}
                                onUpdateQty={onUpdateQty}
                                isAuth={isAuth}
                                disabled={false}
                            />
                            <span className="text-xs text-base-content/40">{data.product_version.stock} disponibles</span>
                        </div>

                        {/* Precios */}
                        <div className="flex gap-4 sm:gap-6 items-end">

                            {/* Precio unitario */}
                            <div className="flex flex-col items-start sm:items-end">
                                <span className="text-[10px] sm:text-xs text-base-content/40 uppercase mb-0.5">
                                    Precio unitario
                                </span>
                                {data.isOffer && data.product_version.unit_price_with_discount ? (
                                    <div className="flex flex-col items-start sm:items-end">
                                        <span className={clsx("text-base sm:text-lg font-bold", discountText(data.discount))}>
                                            ${formatPrice(data.product_version.unit_price_with_discount, "es-MX")}
                                        </span>
                                        <span className="text-xs line-through text-base-content/30">
                                            ${formatPrice(data.product_version.unit_price, "es-MX")}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-base sm:text-lg font-bold text-base-content">
                                        ${formatPrice(data.product_version.unit_price, "es-MX")}
                                    </span>
                                )}
                            </div>

                            {/* Separador */}
                            <div className="w-px h-10 bg-base-300 hidden sm:block" />

                            {/* Subtotal */}
                            <div className="flex flex-col items-start sm:items-end">
                                <span className="text-[10px] sm:text-xs text-base-content/40 uppercase mb-0.5">
                                    Subtotal
                                </span>
                                {data.isOffer && data.product_version.unit_price_with_discount ? (
                                    <div className="flex flex-col items-start sm:items-end">
                                        <span className={clsx("text-lg sm:text-xl font-extrabold", discountText(data.discount))}>
                                            ${formatPrice(subtotalWithDisc.toString(), "es-MX")}
                                        </span>
                                        <span className="text-xs line-through text-base-content/30">
                                            ${formatPrice(subtotal.toString(), "es-MX")}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-lg sm:text-xl font-extrabold text-base-content">
                                        ${formatPrice(subtotal.toString(), "es-MX")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCartItem;