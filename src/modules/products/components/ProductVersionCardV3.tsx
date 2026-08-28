import { FaFire, FaPlus } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import type { PV3CardData, ProductVersionCardI, ProductVersionCardType } from "../ProductTypes";
import { useFavorite } from "../hooks/useProductFavorites";
import { useEffect, useMemo, useState } from "react";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { formatPrice, makeSlug } from "../Helpers";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../../layouts/states/themeStore";
import clsx from "clsx";
import { TbShoppingCartDown } from "react-icons/tb";
import { useHandleShoppingCartV3 } from "../../shopping/hooks/handleShoppingCartV3";
// ROLLBACK V2: para volver a flujo V2, cambiar import a: import { useHandleShoppingCart } from "../../shopping/hooks/handleShoppingCart";
import { useAuthStore } from "../../auth/states/authStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { trackAddToCart } from "../../analytics/MetaEvents";

type Props = {
    data: PV3CardData;
    viewMode?: "grid" | "list";
    className?: string;
    imageLoading?: "lazy" | "eager";
};

const MAX_VISIBLE_TAGS = 4;

const ProductVersionCardV3 = ({ data, viewMode = "grid", className, imageLoading }: Props) => {
    const { theme } = useThemeStore();
    const { isAuth, authCustomer } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    // Flujo V3 aislado (shopping-cart:load:v3) – V2 deprecado conservado para rollback
    const { updateQtyItem } = useHandleShoppingCartV3({
        isAuth,
        authCustomer: { uuid: authCustomer?.uuid || "" },
        showTriggerAlert(type, message, options) {
            showTriggerAlert(type, message, options)
        },
    });
    const [images, setImages] = useState<string[]>([]);
    const [unitPrice, setUnitPrice] = useState<string[]>([]);
    const [finalPriceFormatted, setFinalPriceFormatted] = useState<string[]>([]);
    const navigate = useNavigate();

    const isList = viewMode === "list";

    const product = data.product;
    const version = data.version;
    const category = makeSlug(product.category.name);
    const slug = makeSlug(product.product_name);
    const sku = version.sku.toLowerCase();

    // Tags ordenados por tier/index; solo lectura
    const sortedTags = useMemo(
        () =>
            [...(product.tags || [])].sort((a, b) =>
                a.tier === b.tier ? a.index - b.index : a.tier - b.tier
            ),
        [product.tags]
    );
    const visibleTags = sortedTags.slice(0, MAX_VISIBLE_TAGS);
    const extraTagsCount = sortedTags.length > MAX_VISIBLE_TAGS ? sortedTags.length - MAX_VISIBLE_TAGS : 0;

    /* Objetos tipados que consumen useFavorite y los eventos de Meta */
    const favoriteItem: ProductVersionCardType = {
        product_name: product.product_name,
        subcategories: [],
        product_version: {
            sku: version.sku,
            unit_price: version.unit_price,
            unit_price_with_discount: version.final_price,
            color_line: version.color_line,
            color_name: version.color_name,
            color_code: version.color_code,
            stock: version.stock,
        },
        product_images: [],
        category: category,
        isOffer: version.offer.isOffer,
        discount: version.offer.discount,
        isFavorite: version.is_favorite,
    };

    const analyticsItem: ProductVersionCardI = {
        name: product.product_name,
        productUUID: product.uuid,
        category: { uuid: product.category.uuid, name: product.category.name },
        subcategories: [],
        sku: version.sku,
        color: {
            line: version.color_line,
            name: version.color_name,
            code: version.color_code,
        },
        unitPrice: version.unit_price,
        finalPrice: version.final_price,
        isFavorite: version.is_favorite,
        stock: version.stock,
        images: version.images.map((img) => ({ url: img.url, mainImage: img.isMain })),
        rating: version.rating,
        offer: {
            isOffer: version.offer.isOffer,
            discount: version.offer.discount ?? 0,
        },
        parents: version.parents.map((p) => ({ sku: p.sku, colorCode: p.color_code })),
    };

    const { isFavorite, toggleFavorite } = useFavorite({
        sku: version.sku,
        initialFavoriteState: version.is_favorite,
        item: favoriteItem,
    });

    useEffect(() => {
        let sortedImages = [...version.images]
            .sort((a, b) => (a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1))
            .map((img) => img.url);
        if (sortedImages.length === 0) {
            sortedImages = [NotFoundSVG];
        }
        setImages(sortedImages);

        if (version.offer.isOffer && version.offer.discount) {
            setFinalPriceFormatted(formatPrice(version.final_price, "es-MX").split("."));
        }
        setUnitPrice(formatPrice(version.unit_price, "es-MX").split("."));
    }, [version]);

    if (!data) { return <div>Ocurrio un error inesperado</div>; };

    const isDark = theme !== "ligth";

    const detailUrl = `/tienda/${category}/${slug}/${sku}`;

    const handleColorClick = (e: React.MouseEvent, parentSku: string) => {
        e.stopPropagation();
        e.preventDefault();
        navigate(`/tienda/${category}/${slug}/${parentSku.toLowerCase()}`);
    };

    const isOutOfStock = version.stock <= 0;
    const outOfStockTooltip = "Sin stock por el momento, puedes ver más detalles y contactarte con nosotros para consultar disponibilidad";

    const handleAddItem = () => {
        if (isOutOfStock) return;
        trackAddToCart(analyticsItem, 1);
        updateQtyItem({
            isChecked: true,
            item: {
                productUUID: product.uuid,
                sku: version.sku
            },
            quantity: 1
        })
    };

    const handleSetBuyNow = () => {
        if (isOutOfStock) return;
        navigate(`/pagar-ahora/${product.uuid}/${sku}?quantity=1`);
    };

    const sortedParents = [...(version.parents || [])].sort((a, b) => {
        if (a.sku.toLowerCase() === sku) return -1;
        if (b.sku.toLowerCase() === sku) return 1;
        return 0;
    });
    const parentsToShow = sortedParents.slice(0, 5);
    const extraParentsCount = sortedParents.length > 5 ? sortedParents.length - 5 : 0;

    /* ── Imagen ── */
    const imageBlock = (
        <div
            role="button"
            onClick={() => navigate(detailUrl)}
            className={clsx(
                "relative overflow-hidden cursor-pointer group/images",
                isList ? "w-32 sm:w-44 shrink-0 aspect-square self-start" : "w-full aspect-square"
            )}
        >
            {/* Mobile version (single image) */}
            <img
                className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105 block sm:hidden"
                src={images[0]}
                alt={product.product_name}
                loading={imageLoading}
            />

            {/* Desktop Version */}
            <div className="w-full h-full hidden sm:block">
                {images.length > 1 ? (
                    <figure className="hover-gallery w-full h-full">
                        {images.slice(0, 4).map((imgUrl, i) => (
                            <img
                                key={i}
                                src={imgUrl}
                                alt={`${product.product_name} - Imagen ${i + 1}`}
                                loading={imageLoading}
                                className="object-contain"
                            />
                        ))}
                    </figure>
                ) : (
                    <img
                        className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                        src={images[0]}
                        alt={product.product_name}
                        loading={imageLoading}
                    />
                )}
            </div>

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover/images:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* SKU badge */}
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-mono font-semibold shadow-md pointer-events-none">
                {version.sku}
            </span>

            {/* Fire badge */}
            {version.offer.isOffer && (
                <span className={clsx(
                    "absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold shadow-md backdrop-blur-sm",
                    version.offer.discount && version.offer.discount < 50 && "bg-error/90",
                    version.offer.discount && version.offer.discount >= 50 && version.offer.discount < 65 && "bg-success/90",
                    version.offer.discount && version.offer.discount >= 65 && "bg-primary/90"
                )}>
                    <FaFire />
                    <span>{version.offer.discount}% OFF</span>
                </span>
            )}

            {/* Favorite button (solo autenticados) */}
            {isAuth && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(e); }}
                    aria-label={isFavorite ? "Desmarcar favorito" : "Marcar como favorito"}
                    className={clsx(
                        "absolute bottom-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 z-10",
                        "hover:scale-110 active:scale-95",
                        isDark ? "bg-black/40 hover:bg-black/60" : "bg-white/60 hover:bg-white/90"
                    )}
                >
                    {isFavorite
                        ? <IoMdHeart className="text-primary text-xl sm:text-2xl" />
                        : <IoIosHeartEmpty className="text-primary text-xl sm:text-2xl" />
                    }
                </button>
            )}
        </div>
    );

    /* ── Rating ── */
    const ratingBlock = version.rating > 0 && (
        <div className="flex items-center gap-1.5 mt-0.5">
            <div className="rating rating-xs rating-half pointer-events-none">
                <input type="radio" name={`rating-${sku}`} className="rating-hidden" />
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => (
                    <input key={i} type="radio" name={`rating-${sku}`}
                        className={clsx("mask mask-star-2 bg-primary", i % 2 === 0 ? "mask-half-1" : "mask-half-2")}
                        defaultChecked={version.rating > v * 10 - 10 && version.rating <= v * 10}
                    />
                ))}
            </div>
        </div>
    );

    /* ── Tags readonly ── */
    const tagsBlock = visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-1 min-h-5">
            {visibleTags.map((tag) => (
                <span
                    key={tag.id}
                    title={tag.name}
                    className={clsx(
                        "px-1.5 py-0.5 rounded-full line-clamp-1 text-[9px] sm:text-[10px] leading-none select-none cursor-default",
                        isDark
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600 border border-gray-200/60"
                    )}
                >
                    {tag.name}
                </span>
            ))}
            {extraTagsCount > 0 && (
                <span
                    className={clsx(
                        "px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] leading-none select-none cursor-default",
                        isDark ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-400"
                    )}
                >
                    +{extraTagsCount}
                </span>
            )}
        </div>
    );

    /* ── Colores ── */
    const colorsBlock = version.parents && version.parents.length > 0 && (
        <div className="flex items-center gap-1.5 mt-1">
            {parentsToShow.map((parent) => (
                <button
                    key={parent.sku}
                    type="button"
                    onClick={(e) => handleColorClick(e, parent.sku)}
                    className={clsx(
                        "w-4 h-4 rounded-full border border-base-300 shadow-sm transition-all hover:scale-110",
                        sku === parent.sku.toLowerCase() && "ring-1 ring-primary ring-offset-1 scale-110"
                    )}
                    style={{ backgroundColor: parent.color_code }}
                    title={parent.sku}
                />
            ))}
            {extraParentsCount > 0 && (
                <span
                    className="text-[10px] sm:text-xs text-primary underline underline-offset-2 cursor-pointer ml-1 hover:opacity-70"
                    onClick={(e) => { e.stopPropagation(); navigate(detailUrl); }}
                >
                    + {extraParentsCount} más...
                </span>
            )}
        </div>
    );

    /* ── Precio ── */
    const priceBlock = (
        <div className="flex items-center">
            {version.offer.isOffer ? (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={clsx(
                        "inline-flex items-baseline gap-0.5 font-extrabold text-white rounded-lg px-1.5 py-0.5 leading-none text-sm sm:text-base",
                        version.offer.discount && version.offer.discount < 50 && "bg-error",
                        version.offer.discount && version.offer.discount >= 50 && version.offer.discount < 65 && "bg-success",
                        version.offer.discount && version.offer.discount >= 65 && "bg-primary"
                    )}>
                        ${finalPriceFormatted[0]}
                        <span className="text-[10px] sm:text-xs">.{finalPriceFormatted[1] || '00'}</span>
                    </span>
                    <span className={clsx(
                        "line-through text-[10px] sm:text-xs leading-none",
                        isDark ? "text-gray-500" : "text-gray-400"
                    )}>
                        ${unitPrice[0]}.{unitPrice[1] || '00'}
                    </span>
                </div>
            ) : (
                <p className={clsx(
                    "font-extrabold leading-none text-base sm:text-lg",
                    isDark ? "text-white" : "text-gray-900"
                )}>
                    ${unitPrice[0]}<span className="text-xs sm:text-sm font-semibold">.{unitPrice[1] || '00'}</span>
                </p>
            )}
        </div>
    );

    /* ── Acciones ── */
    const actionsBlock = (
        <div className="flex gap-2 items-stretch pt-1 pb-1 w-full">
            {/* Buy now */}
            <div className={clsx(isOutOfStock && "tooltip tooltip-top flex-1", !isList && "flex-1")} data-tip={isOutOfStock ? outOfStockTooltip : undefined}>
                <button
                    type="button"
                    onClick={() => { handleSetBuyNow() }}
                    aria-label="Comprar ahora"
                    disabled={isOutOfStock}
                    aria-disabled={isOutOfStock}
                    title={isOutOfStock ? outOfStockTooltip : undefined}
                    className={clsx(
                        "group/btn h-9 sm:h-10 rounded-xl font-bold tracking-wide transition-all duration-300 active:scale-[0.97]",
                        "inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm w-full",
                        "shadow-sm hover:shadow-md",
                        isOutOfStock
                            ? "bg-base-300 text-base-content/50 cursor-not-allowed shadow-none hover:shadow-none"
                            : "text-white bg-blue-950 hover:bg-blue-900",
                        isList ? "px-5" : "px-3"
                    )}
                >
                    <TbShoppingCartDown className="text-base transition-transform duration-300 group-hover/btn:-translate-y-0.5 sm:hidden" />
                    <span className="hidden sm:inline">Comprar ahora</span>
                    <span className="sm:hidden">{isOutOfStock ? "Sin stock" : "Comprar"}</span>
                </button>
            </div>

            {/* Add to cart */}
            <div className={clsx(isOutOfStock && "tooltip tooltip-top")} data-tip={isOutOfStock ? outOfStockTooltip : undefined}>
                <button
                    type="button"
                    onClick={() => handleAddItem()}
                    aria-label="Agregar al carrito"
                    disabled={isOutOfStock}
                    aria-disabled={isOutOfStock}
                    title={isOutOfStock ? outOfStockTooltip : undefined}
                    className={clsx(
                        "group/cart h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-xl font-bold",
                        "inline-flex items-center justify-center gap-1 text-xs sm:text-sm",
                        "shadow-sm active:scale-[0.97] transition-all duration-300",
                        isOutOfStock
                            ? "bg-base-300 text-base-content/50 cursor-not-allowed shadow-none hover:shadow-none"
                            : "bg-yellow-600 text-white hover:shadow-md hover:bg-yellow-700"
                    )}
                >
                    <MdOutlineShoppingCart className="text-base transition-transform duration-300 group-hover/cart:-translate-x-0.5" />
                    <FaPlus className="text-[10px] transition-transform duration-300 group-hover/cart:rotate-90" />
                </button>
            </div>
        </div>
    );

    /* ── Contenido ── */
    const contentBlock = (
        <div className={clsx(
            "flex flex-col gap-1.5 px-3 py-2.5 min-w-0",
            isList && "flex-1"
        )}>
            {/* Product name */}
            <button
                type="button"
                onClick={() => navigate(detailUrl)}
                aria-label="Ver producto"
                className={clsx(
                    "font-bold line-clamp-2 text-left leading-tight transition-colors duration-200 text-xs sm:text-sm w-fit max-w-full",
                    "hover:text-primary hover:underline underline-offset-2",
                    isDark ? "text-white" : "text-gray-900"
                )}
            >
                {product.product_name.toUpperCase()}
            </button>

            {ratingBlock}
            {tagsBlock}
            {!isList && colorsBlock}

            <div className={clsx("mt-auto pt-1", !isList && "flex items-center")}>
                {priceBlock}
                {version.stock <= 0 && (
                    <span className={clsx("text-[10px] font-semibold text-error/80 shrink-0", isList ? "ml-auto" : "ml-2")}>
                        Sin stock
                    </span>
                )}
            </div>

            {isList && colorsBlock}

            {actionsBlock}
        </div>
    );

    return (
        <div className={clsx(
            "relative overflow-hidden border transition-all duration-300",
            isList ? "flex flex-row rounded-2xl" : "flex flex-col rounded-2xl w-full h-auto",
            "hover:shadow-xl",
            isList ? "hover:-translate-y-0.5" : "hover:-translate-y-1",
            !isDark
                ? "bg-white border-gray-200 shadow-md shadow-gray-200/60"
                : "bg-gray-900 border-gray-700 shadow-md shadow-black/30",
            className
        )}>
            {imageBlock}
            {contentBlock}
        </div>
    );
};

export default ProductVersionCardV3;
