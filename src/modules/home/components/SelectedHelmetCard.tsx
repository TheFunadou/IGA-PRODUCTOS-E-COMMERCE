import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { FaFire } from "react-icons/fa6";
import type { PV3CardData } from "../../products/ProductTypes";
import { formatPrice, makeSlug } from "../../products/Helpers";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { useThemeStore } from "../../../layouts/states/themeStore";

type Props = {
    data: PV3CardData;
    className?: string;
    imageLoading?: "lazy" | "eager";
};

const MAX_VISIBLE_TAGS = 4;

/**
 * Tarjeta de solo lectura basada en la forma grid de ProductVersionCardV3.
 * Sin carrito/comprar/favoritos: único CTA "Ver más detalles" hacia el detalle del producto.
 */
const SelectedHelmetCard = ({ data, className, imageLoading }: Props) => {
    const { theme } = useThemeStore();
    const [images, setImages] = useState<string[]>([]);
    const [unitPrice, setUnitPrice] = useState<string[]>([]);
    const [finalPriceFormatted, setFinalPriceFormatted] = useState<string[]>([]);
    const navigate = useNavigate();

    const product = data.product;
    const version = data.version;
    const category = product.category.name.toLowerCase();
    const slug = makeSlug(product.product_name);
    const sku = version.sku.toLowerCase();

    /* Tags ordenados por tier/index; solo lectura */
    const sortedTags = useMemo(
        () =>
            [...(product.tags || [])].sort((a, b) =>
                a.tier === b.tier ? a.index - b.index : a.tier - b.tier
            ),
        [product.tags]
    );
    const visibleTags = sortedTags.slice(0, MAX_VISIBLE_TAGS);
    const extraTagsCount = sortedTags.length > MAX_VISIBLE_TAGS ? sortedTags.length - MAX_VISIBLE_TAGS : 0;

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
            className="relative overflow-hidden cursor-pointer group/images w-full aspect-square"
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
                        "px-1.5 py-0.5 line-clamp-1  rounded-full text-[9px] sm:text-[10px] leading-none select-none cursor-default",
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

    return (
        <div className={clsx(
            "relative overflow-hidden border transition-all duration-300",
            "flex flex-col rounded-2xl w-full h-auto hover:shadow-xl hover:-translate-y-1",
            !isDark
                ? "bg-white border-gray-200 shadow-md shadow-gray-200/60"
                : "bg-gray-900 border-gray-700 shadow-md shadow-black/30",
            className
        )}>
            {imageBlock}

            {/* Contenido */}
            <div className="flex flex-col gap-1.5 px-3 py-2.5 min-w-0 flex-1">
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
                {colorsBlock}

                <div className="mt-auto pt-1 flex items-center">
                    {priceBlock}
                </div>

                {/* Único CTA: ver más detalles */}
                <button
                    type="button"
                    onClick={() => navigate(detailUrl)}
                    aria-label="Ver más detalles"
                    className="h-9 sm:h-10 w-full rounded-xl font-bold tracking-wide transition-all duration-300 active:scale-[0.97] inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-sm hover:shadow-md text-white bg-blue-950 hover:bg-blue-900 mt-1"
                >
                    Ver más detalles
                </button>
            </div>
        </div>
    );
};

export default SelectedHelmetCard;
