import { FaFire, FaPlus } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import type { ProductVersionCardType } from "../ProductTypes";
import { useFavorite } from "../hooks/useProductFavorites";
import { useEffect, useState } from "react";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { formatPrice, makeSlug } from "../Helpers";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../../layouts/states/themeStore";
import clsx from "clsx";
import { useShoppingCart } from "../../shopping/hooks/useShoppingCart";
import { TbShoppingCartDown } from "react-icons/tb";

type Props = {
    versionData: ProductVersionCardType;
    className?: string;
    imageLoading?: "lazy" | "eager";
    transparent?: boolean;
};

const ProductVersionCard = ({ versionData, className, imageLoading, transparent = true }: Props) => {
    const { theme } = useThemeStore();
    const { add, addBuyNow } = useShoppingCart();
    const [image, setImage] = useState<string | undefined>(NotFoundSVG);
    const [unitPrice, setUnitPrice] = useState<string[]>([]);
    const [unitPriceWithDiscount, setUnitPriceWithDiscount] = useState<string[]>([]);
    const category = versionData.category.toLowerCase();
    const slug = makeSlug(versionData.product_name);
    const sku = versionData.product_version.sku.toLowerCase();
    const navigate = useNavigate();
    const { isFavorite, toggleFavorite } = useFavorite({
        sku: versionData.product_version.sku,
        initialFavoriteState: versionData.isFavorite,
        item: versionData
    });

    useEffect(() => {
        if (versionData) setImage(versionData.product_images.find(img => img.main_image)?.image_url);
        if (versionData.isOffer && versionData.discount) {
            const price = parseFloat(versionData.product_version.unit_price);
            const discount = (versionData.discount * parseFloat(versionData.product_version.unit_price)) / 100;
            const priceWithDiscount = price - discount;
            const priceWithDiscountFormat = formatPrice(priceWithDiscount.toString(), "es-MX");
            setUnitPriceWithDiscount(priceWithDiscountFormat.split("."));
        };
        setUnitPrice(formatPrice(versionData.product_version.unit_price, "es-MX").split("."));
    }, [versionData]);

    if (!versionData) { "Ocurrio un error inesperado" };

    const isDark = theme !== "ligth";

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
            <figure
                role="button"
                onClick={() => navigate(`/tienda/${category}/${slug}/${sku}`)}
                // aspect-square → 1:1 en todos los breakpoints
                className="relative w-full overflow-hidden cursor-pointer group aspect-square"
            >
                <img
                    // object-contain → muestra la imagen completa sin recortes
                    className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                    src={image}
                    alt={versionData.product_name}
                    loading={imageLoading}
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

                {/* Fire badge */}
                {versionData.isOffer && (
                    <span className={clsx(
                        "absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold shadow-md backdrop-blur-sm",
                        versionData.discount && versionData.discount < 50 && "bg-error/90",
                        versionData.discount && versionData.discount >= 50 && versionData.discount < 65 && "bg-success/90",
                        versionData.discount && versionData.discount >= 65 && "bg-primary/90"
                    )}>
                        <FaFire />
                        <span>{versionData.discount}% OFF</span>
                    </span>
                )}

                {/* Favorite button */}
                <button
                    type="button"
                    onClick={(e) => toggleFavorite(e)}
                    aria-label={isFavorite ? "Desmarcar favorito" : "Marcar como favorito"}
                    className={clsx(
                        "absolute bottom-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200",
                        "hover:scale-110 active:scale-95",
                        isDark ? "bg-black/40 hover:bg-black/60" : "bg-white/60 hover:bg-white/90"
                    )}
                >
                    {isFavorite
                        ? <IoMdHeart className="text-primary text-xl sm:text-2xl" />
                        : <IoIosHeartEmpty className="text-primary text-xl sm:text-2xl" />
                    }
                </button>
            </figure>

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
                    {versionData.product_name.toUpperCase()}
                </button>

                {/* Subcategories */}
                {versionData.subcategories && versionData.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 min-h-[1.25rem]">
                        {versionData.subcategories.map((sub, i) => (
                            <span
                                key={i}
                                className={clsx(
                                    "px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] leading-none",
                                    isDark
                                        ? "bg-gray-700 text-gray-300"
                                        : "bg-gray-100 text-gray-600"
                                )}
                            >
                                {sub}
                            </span>
                        ))}
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center mt-auto pt-1">
                    {versionData.isOffer ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={clsx(
                                "inline-flex items-baseline gap-0.5 font-extrabold text-white rounded-lg px-1.5 py-0.5 leading-none text-sm sm:text-base",
                                versionData.discount && versionData.discount < 50 && "bg-error",
                                versionData.discount && versionData.discount >= 50 && versionData.discount < 65 && "bg-success",
                                versionData.discount && versionData.discount >= 65 && "bg-primary"
                            )}>
                                ${unitPriceWithDiscount[0]}
                                <span className="text-[10px] sm:text-xs">.{unitPriceWithDiscount[1]}</span>
                            </span>
                            <span className={clsx(
                                "line-through text-[10px] sm:text-xs leading-none",
                                isDark ? "text-gray-500" : "text-gray-400"
                            )}>
                                ${unitPrice[0]}.{unitPrice[1]}
                            </span>
                        </div>
                    ) : (
                        <p className={clsx(
                            "font-extrabold leading-none text-base sm:text-lg",
                            isDark ? "text-white" : "text-gray-900"
                        )}>
                            ${unitPrice[0]}<span className="text-xs sm:text-sm font-semibold">.{unitPrice[1]}</span>
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 items-center pt-1 pb-1">
                    {/* Buy now */}
                    <button
                        type="button"
                        onClick={() => addBuyNow({ sku, quantity: 1 })}
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
                        onClick={() => add(versionData)}
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

export default ProductVersionCard;