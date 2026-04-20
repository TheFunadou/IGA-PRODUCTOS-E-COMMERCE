import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaFire } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { formatPrice, makeSlug } from "../../products/Helpers";
import type { ShoppingCartI } from "../ShoppingTypes";
import type { ProductVersionCardI } from "../../products/ProductTypes";
import ButtonQtyCounterV2 from "./ButtonQtyCounter";
import clsx from "clsx";

type Props = {
    cartItem: ShoppingCartI;
    cardData: ProductVersionCardI;
    stockLimit: number;
    onToggleCheck: (sku: string) => void;
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

const ShoppingCartItemV2 = ({
    cartItem,
    cardData,
    stockLimit,
    onToggleCheck,
    onRemoveItem,
    onUpdateQty,
    isAuth,
    isBuyNow = false,
}: Props) => {
    const sku = cardData.sku;
    const quantity = cartItem.quantity;
    const isChecked = cartItem.isChecked;

    const subtotal = useMemo(
        () => parseFloat(cardData.unitPrice) * quantity,
        [cardData.unitPrice, quantity]
    );
    const subtotalWithDisc = useMemo(
        () => parseFloat(cardData.finalPrice) * quantity,
        [cardData.finalPrice, quantity]
    );

    const images = useMemo(() => {
        if (!cardData.images || cardData.images.length === 0) return [NotFoundSVG];
        return [...cardData.images]
            .sort((a, b) => a.mainImage === b.mainImage ? 0 : a.mainImage ? -1 : 1)
            .map(img => img.url);
    }, [cardData.images]);

    const productUrl = `/tienda/${cardData.category.name.toLowerCase()}/${makeSlug(cardData.name)}/${sku.toLowerCase()}`;

    const buildSubcategoryUrl = (clickedIndex: number): string => {
        const category = cardData.category.name.toLowerCase();
        const slice = cardData.subcategories.slice(0, clickedIndex + 1);
        const params = slice.map(s => `&sub=${s.uuid}`).join("");
        return `/tienda?category=${category}${params}&page=1`;
    };

    if (!cartItem) return null;

    return (
        <div className="w-full rounded-2xl bg-base-100 border border-base-300 hover:border-primary/30 transition-colors duration-200 p-3 sm:p-4 md:p-5">
            <div className="flex gap-3 sm:gap-4">
                {!isBuyNow && (
                    <div className="flex items-start pt-1 flex-shrink-0">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm sm:checkbox-md"
                            checked={isChecked}
                            onChange={() => onToggleCheck(sku)}
                        />
                    </div>
                )}

                <Link to={productUrl} className="flex-shrink-0 group">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-xl overflow-hidden border border-base-300 group-hover:border-primary/50 transition-colors duration-200 aspect-square group/images relative">
                        {/* Mobile version (single image) */}
                        <img
                            src={images[0]}
                            alt={cardData.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block sm:hidden"
                            loading="lazy"
                        />

                        {/* Desktop Version */}
                        <div className="w-full h-full hidden sm:block">
                            {images.length > 1 ? (
                                <figure className="hover-gallery w-full h-full">
                                    {images.slice(0, 4).map((imgUrl, i) => (
                                        <img
                                            key={i}
                                            src={imgUrl}
                                            alt={`${cardData.name} - Imagen ${i + 1}`}
                                            className="object-cover"
                                            loading="lazy"
                                        />
                                    ))}
                                </figure>
                            ) : (
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={images[0]}
                                    alt={cardData.name}
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
                                {cardData.name}
                            </Link>
                            {cardData.offer.isOffer && (
                                <span className={clsx(
                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold flex-shrink-0",
                                    discountBg(cardData.offer.discount)
                                )}>
                                    <FaFire className="text-[10px]" />
                                    {cardData.offer.discount}% OFF
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

                    <div className="breadcrumbs text-xs sm:text-sm text-base-content/50 bg-base-200 w-fit rounded-lg px-2 sm:px-3 py-0.5">
                        <ul>
                            <li>
                                <Link
                                    to={`/tienda?category=${cardData.category.name.toLowerCase()}&page=1`}
                                    className="font-semibold text-base-content/70 hover:text-primary"
                                >
                                    {cardData.category.name}
                                </Link>
                            </li>
                            {cardData.subcategories.map((sc, i) => (
                                <li key={sc.uuid}>
                                    <Link
                                        to={buildSubcategoryUrl(i)}
                                        className="font-semibold text-base-content/70 hover:text-primary"
                                    >
                                        {sc.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-base-300 flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: cardData.color.code }}
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
                                item={{ productUUID: cartItem.item.productUUID, sku: cartItem.item.sku }}
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
                                {cardData.offer.isOffer ? (
                                    <div className="flex flex-col items-start sm:items-end">
                                        <span className={clsx("text-base sm:text-lg font-bold", discountText(cardData.offer.discount))}>
                                            ${formatPrice(cardData.finalPrice, "es-MX")}
                                        </span>
                                        <span className="text-xs line-through text-base-content/30">
                                            ${formatPrice(cardData.unitPrice, "es-MX")}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-base sm:text-lg font-bold text-base-content">
                                        ${formatPrice(cardData.unitPrice, "es-MX")}
                                    </span>
                                )}
                            </div>

                            <div className="w-px h-10 bg-base-300 hidden sm:block" />

                            <div className="flex flex-col items-start sm:items-end">
                                <span className="text-[10px] sm:text-xs text-base-content/40 uppercase mb-0.5">
                                    Subtotal
                                </span>
                                {cardData.offer.isOffer ? (
                                    <div className="flex flex-col items-start sm:items-end">
                                        <span className={clsx("text-lg sm:text-xl font-extrabold", discountText(cardData.offer.discount))}>
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

export default ShoppingCartItemV2;