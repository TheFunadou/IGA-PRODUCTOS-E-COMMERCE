import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaFire, FaTag } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { formatPrice, makeSlug } from "../../products/Helpers";
import type { ShoppingCartI } from "../ShoppingTypes";
import type { PV3CardData } from "../../products/ProductTypes";
import ButtonQtyCounterV2 from "./ButtonQtyCounter";
import clsx from "clsx";

type Props = {
    cartItem: ShoppingCartI;
    cardData: PV3CardData;
    stockLimit: number;
    onRemoveItem: (sku: string) => void;
    onUpdateQty: (item: ShoppingCartI) => void;
    isAuth: boolean;
    isBuyNow?: boolean;
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

const ShoppingCartItemV3 = ({
    cartItem,
    cardData,
    stockLimit,
    onRemoveItem,
    onUpdateQty,
    isAuth,
    isBuyNow = false,
}: Props) => {
    const { product, version } = cardData;
    const sku = version.sku;
    const quantity = cartItem.quantity;

    const subtotal = useMemo(
        () => parseFloat(version.unit_price) * quantity,
        [version.unit_price, quantity]
    );
    const subtotalWithDisc = useMemo(
        () => parseFloat(version.final_price) * quantity,
        [version.final_price, quantity]
    );

    const images = useMemo(() => {
        if (!version.images || version.images.length === 0) return [NotFoundSVG];
        return [...version.images]
            .sort((a, b) => a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1)
            .map(img => img.url);
    }, [version.images]);

    const productUrl = `/tienda/${product.category.name.toLowerCase()}/${makeSlug(product.product_name)}/${sku.toLowerCase()}`;

    const tagNames = useMemo(() => {
        return (product.tags ?? []).map(t => t.name);
    }, [product.tags]);

    if (!cartItem) return null;

    return (
        <div className="w-full rounded-2xl bg-base-100 transition-colors duration-200 p-3 sm:p-4 md:p-5">
            <div className="flex gap-2 sm:gap-3">
                <Link to={productUrl} className="flex-shrink-0 group">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-xl overflow-hidden border border-base-300 group-hover:border-primary/50 transition-colors duration-200 aspect-square group/images relative">
                        <img
                            src={images[0]}
                            alt={product.product_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block sm:hidden"
                            loading="lazy"
                        />
                        <div className="w-full h-full hidden sm:block">
                            {images.length > 1 ? (
                                <figure className="hover-gallery w-full h-full">
                                    {images.slice(0, 4).map((imgUrl, i) => (
                                        <img
                                            key={i}
                                            src={imgUrl}
                                            alt={`${product.product_name} - Imagen ${i + 1}`}
                                            className="object-cover"
                                            loading="lazy"
                                        />
                                    ))}
                                </figure>
                            ) : (
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={images[0]}
                                    alt={product.product_name}
                                    loading="lazy"
                                />
                            )}
                        </div>
                    </div>
                </Link>

                <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                            <Link
                                to={productUrl}
                                className="text-sm sm:text-base md:text-lg font-bold text-base-content hover:text-primary hover:underline underline-offset-2 transition-colors duration-150 leading-snug"
                            >
                                {product.product_name}
                            </Link>
                            {version.offer.isOffer && (
                                <span className={clsx(
                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold flex-shrink-0",
                                    discountBg(version.offer.discount)
                                )}>
                                    <FaFire className="text-[10px]" />
                                    {version.offer.discount}% OFF
                                </span>
                            )}
                            {quantity >= 60 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold flex-shrink-0 bg-primary">
                                    <FaTag className="text-[10px]" />
                                    -10% aplicado por mayoreo
                                </span>
                            )}
                        </div>
                        {!isBuyNow && (
                            <button
                                type="button"
                                title="Eliminar del carrito"
                                onClick={() => onRemoveItem(sku)}
                                className="flex-shrink-0 p-1.5 rounded-lg text-base-content/30 hover:text-error hover:bg-error/10 transition-all duration-200 active:scale-90"
                            >
                                <FiTrash2 className="text-base sm:text-lg" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-base-content/50 mt-1">
                        <Link
                            to={`/?category=${encodeURIComponent(product.category.uuid)}`}
                            className="inline-flex items-center px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                        >
                            {product.category.name}
                        </Link>
                        {tagNames.map((tag, i) => (
                            <span key={i} className="inline-flex items-center gap-0.5">
                                <span className="text-base-content/30">
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </span>
                                <span className="px-2 py-0.5 rounded-lg bg-base-200 text-base-content/70 font-medium">
                                    {tag}
                                </span>
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-base-300 flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: version.color_code }}
                        />
                        <span className="text-xs sm:text-sm text-base-content/60">
                            SKU — <span className="text-base-content font-medium uppercase">{sku}</span>
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-1">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-base-content/50 uppercase">Cantidad</span>
                            <ButtonQtyCounterV2
                                initQty={quantity}
                                limit={stockLimit}
                                item={{ productUUID: product.uuid, sku: cartItem.item.sku }}
                                onUpdateQty={onUpdateQty}
                                isAuth={isAuth}
                            />
                            <span className="text-xs text-base-content/40">{stockLimit} disponibles</span>
                        </div>

                        <div className="flex gap-4 sm:gap-6 items-end">
                            <div className="flex flex-col items-start sm:items-end">
                                <span className="text-[10px] sm:text-xs text-base-content/40 uppercase mb-0.5">
                                    Precio unitario
                                </span>
                                {version.offer.isOffer ? (
                                    <div className="flex flex-col items-start sm:items-end">
                                        <span className={clsx("text-base sm:text-lg font-bold", discountText(version.offer.discount))}>
                                            ${formatPrice(version.final_price, "es-MX")}
                                        </span>
                                        <span className="text-xs line-through text-base-content/30">
                                            ${formatPrice(version.unit_price, "es-MX")}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-base sm:text-lg font-bold text-base-content">
                                        ${formatPrice(version.unit_price, "es-MX")}
                                    </span>
                                )}
                            </div>

                            <div className="w-px h-10 bg-base-300 hidden sm:block" />

                            <div className="flex flex-col items-start sm:items-end">
                                <span className="text-[10px] sm:text-xs text-base-content/40 uppercase mb-0.5">
                                    Subtotal
                                </span>
                                {version.offer.isOffer ? (
                                    <div className="flex flex-col items-start sm:items-end">
                                        <span className={clsx("text-lg sm:text-xl font-extrabold", discountText(version.offer.discount))}>
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

export default ShoppingCartItemV3;
