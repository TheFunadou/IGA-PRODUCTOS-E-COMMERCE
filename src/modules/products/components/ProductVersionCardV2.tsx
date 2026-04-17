import { FaFire, FaPlus } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import type { ProductVersionCardI } from "../ProductTypes";
import { useFavorite } from "../hooks/useProductFavorites";
import { useEffect, useState } from "react";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { formatPrice, makeSlug } from "../Helpers";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../../layouts/states/themeStore";
import clsx from "clsx";
import { TbShoppingCartDown } from "react-icons/tb";
import { useHandleShoppingCart } from "../../shopping/hooks/handleShoppingCart";
import { useAuthStore } from "../../auth/states/authStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";

type Props = {
    versionData: ProductVersionCardI;
    className?: string;
    imageLoading?: "lazy" | "eager";
    transparent?: boolean;
};

const ProductVersionCardV2 = ({ versionData, className, imageLoading, transparent = true }: Props) => {
    const { theme } = useThemeStore();
    const { isAuth, authCustomer } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    const { updateQtyItem, setBuyNow } = useHandleShoppingCart({
        isAuth,
        authCustomer: { uuid: authCustomer?.uuid || "" },
        showTriggerAlert(type, message, options) {
            showTriggerAlert(type, message, options)
        },
    });
    const [images, setImages] = useState<string[]>([]);
    const [unitPrice, setUnitPrice] = useState<string[]>([]);
    const [unitPriceWithDiscount, setUnitPriceWithDiscount] = useState<string[]>([]);
    const category = versionData.category.name.toLowerCase();
    const slug = makeSlug(versionData.name);
    const sku = versionData.sku.toLowerCase();
    const navigate = useNavigate();

    // Convert to the shape expected by useFavorite which accepts ProductVersionCardType
    // but extracts sku and isFavorite inside. We pass 'any' since it uses standard shapes.
    const { isFavorite, toggleFavorite } = useFavorite({
        sku: versionData.sku,
        initialFavoriteState: versionData.isFavorite,
        item: versionData as any
    });

    useEffect(() => {
        if (versionData) {
            let sortedImages = [...versionData.images].sort((a, b) => a.mainImage === b.mainImage ? 0 : a.mainImage ? -1 : 1).map(img => img.url);
            if (sortedImages.length === 0) {
                sortedImages = [NotFoundSVG];
            }
            setImages(sortedImages);
        }
        if (versionData.offer.isOffer && versionData.offer.discount) {
            const priceWithDiscountFormat = formatPrice(versionData.finalPrice, "es-MX");
            setUnitPriceWithDiscount(priceWithDiscountFormat.split("."));
        };
        setUnitPrice(formatPrice(versionData.unitPrice, "es-MX").split("."));
    }, [versionData]);

    if (!versionData) { return <div>Ocurrio un error inesperado</div>; };

    const isDark = theme !== "ligth";

    const buildSubcategoryUrl = (clickedIndex: number): string => {
        const slice = versionData.subcategories.slice(0, clickedIndex + 1);
        const params = slice.map(s => `&sub=${s.uuid}`).join("");
        return `/tienda?category=${category}${params}&page=1`;
    };

    const handleSubcategoryClick = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        e.preventDefault();
        navigate(buildSubcategoryUrl(index));
    };

    const handleColorClick = (e: React.MouseEvent, parentSku: string) => {
        e.stopPropagation();
        e.preventDefault();
        navigate(`/tienda/${category}/${slug}/${parentSku.toLowerCase()}`);
    };

    const handleAddItem = () => {
        updateQtyItem({
            isChecked: true,
            item: {
                productUUID: versionData.productUUID,
                sku: versionData.sku
            },
            quantity: 1
        })
    };

    const handleSetBuyNow = () => {
        setBuyNow({
            quantity: 1,
            sku: versionData.sku
        });
    };

    const sortedParents = [...(versionData.parents || [])].sort((a, b) => {
        if (a.sku.toLowerCase() === sku) return -1;
        if (b.sku.toLowerCase() === sku) return 1;
        return 0;
    });
    const parentsToShow = sortedParents.slice(0, 8);
    const extraParentsCount = sortedParents.length > 8 ? sortedParents.length - 8 : 0;

    return (
        <div className={clsx(
            "relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300",
            "w-full h-auto",
            "hover:shadow-xl hover:-translate-y-1",
            !transparent && (isDark
                ? "bg-gray-900 border-gray-700 shadow-md shadow-black/30"
                : "bg-white border-gray-200 shadow-md shadow-gray-200/60"
            ),
            transparent && "bg-transparent border-transparent",
            className
        )}>
            {/* ── IMAGE ── */}
            <div
                role="button"
                onClick={() => navigate(`/tienda/${category}/${slug}/${sku}`)}
                className="relative w-full overflow-hidden cursor-pointer group aspect-square group/images"
            >
                {/* Mobile version (single image) */}
                <img
                    className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105 block sm:hidden"
                    src={images[0]}
                    alt={versionData.name}
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
                                    alt={`${versionData.name} - Imagen ${i + 1}`}
                                    loading={imageLoading}
                                    className="object-contain"
                                />
                            ))}
                        </figure>
                    ) : (
                        <img
                            className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                            src={images[0]}
                            alt={versionData.name}
                            loading={imageLoading}
                        />
                    )}
                </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover/images:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Fire badge */}
                {versionData.offer.isOffer && (
                    <span className={clsx(
                        "absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold shadow-md backdrop-blur-sm",
                        versionData.offer.discount && versionData.offer.discount < 50 && "bg-error/90",
                        versionData.offer.discount && versionData.offer.discount >= 50 && versionData.offer.discount < 65 && "bg-success/90",
                        versionData.offer.discount && versionData.offer.discount >= 65 && "bg-primary/90"
                    )}>
                        <FaFire />
                        <span>{versionData.offer.discount}% OFF</span>
                    </span>
                )}

                {/* Favorite button */}
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
            </div>

            {/* ── CONTENT ── */}
            <div className="flex flex-col flex-1 gap-1.5 px-3 py-2.5">
                {/* Product name */}
                <button
                    type="button"
                    onClick={() => navigate(`/tienda/${category}/${slug}/${sku}`)}
                    aria-label="Ver producto"
                    className={clsx(
                        "font-bold line-clamp-2 text-left leading-tight transition-colors duration-200 text-xs sm:text-sm",
                        "hover:text-primary hover:underline underline-offset-2",
                        isDark ? "text-white" : "text-gray-900"
                    )}
                >
                    {versionData.name.toUpperCase()}
                </button>

                {/* Rating element */}
                {versionData.rating > 0 && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="rating rating-xs rating-half pointer-events-none">
                            <input type="radio" name={`rating-${sku}`} className="rating-hidden" />
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => (
                                <input key={i} type="radio" name={`rating-${sku}`}
                                    className={clsx("mask mask-star-2 bg-primary", i % 2 === 0 ? "mask-half-1" : "mask-half-2")}
                                    defaultChecked={versionData.rating > v * 10 - 10 && versionData.rating <= v * 10}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Subcategories */}
                {versionData.subcategories && versionData.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 min-h-[1.25rem]">
                        {versionData.subcategories.map((sub, i) => (
                            <span
                                key={sub.uuid}
                                onClick={(e) => handleSubcategoryClick(e, i)}
                                className={clsx(
                                    "px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] leading-none cursor-pointer transition-colors duration-200",
                                    isDark
                                        ? "bg-gray-700 text-gray-300 hover:bg-primary/20 hover:text-primary"
                                        : "bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary"
                                )}
                            >
                                {sub.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Colors section */}
                {versionData.parents && versionData.parents.length > 0 && (
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
                                style={{ backgroundColor: parent.colorCode }}
                                title={parent.sku}
                            />
                        ))}
                        {extraParentsCount > 0 && (
                            <span
                                className="text-[10px] sm:text-xs text-primary underline underline-offset-2 cursor-pointer ml-1 hover:opacity-70"
                                onClick={(e) => { e.stopPropagation(); navigate(`/tienda/${category}/${slug}/${sku}`); }}
                            >
                                + {extraParentsCount} más...
                            </span>
                        )}
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center mt-auto pt-1">
                    {versionData.offer.isOffer ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={clsx(
                                "inline-flex items-baseline gap-0.5 font-extrabold text-white rounded-lg px-1.5 py-0.5 leading-none text-sm sm:text-base",
                                versionData.offer.discount && versionData.offer.discount < 50 && "bg-error",
                                versionData.offer.discount && versionData.offer.discount >= 50 && versionData.offer.discount < 65 && "bg-success",
                                versionData.offer.discount && versionData.offer.discount >= 65 && "bg-primary"
                            )}>
                                ${unitPriceWithDiscount[0]}
                                <span className="text-[10px] sm:text-xs">.{unitPriceWithDiscount[1] || '00'}</span>
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

                {/* Actions */}
                <div className="flex gap-2 items-center pt-1 pb-1">
                    {/* Buy now */}
                    <button
                        type="button"
                        onClick={() => { handleSetBuyNow() }}
                        aria-label="Comprar ahora"
                        className={clsx(
                            "btn flex-1 rounded-xl text-white font-semibold transition-all duration-200 active:scale-95 text-xs sm:text-sm",
                            isDark
                                ? "bg-transparent border border-white hover:bg-white/10"
                                : "bg-blue-950 hover:bg-blue-800"
                        )}
                    >
                        <TbShoppingCartDown className="text-base sm:hidden" />
                        <span className="hidden sm:inline">Comprar ahora</span>
                    </button>

                    {/* Add to cart */}
                    <button
                        type="button"
                        onClick={() => handleAddItem()}
                        aria-label="Agregar al carrito"
                        className="btn btn-primary rounded-xl flex items-center gap-1 transition-all duration-200 active:scale-95 hover:brightness-110 text-xs sm:text-sm px-2.5 sm:px-3"
                    >
                        <MdOutlineShoppingCart className="text-base" />
                        <FaPlus className="text-xs" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductVersionCardV2;
