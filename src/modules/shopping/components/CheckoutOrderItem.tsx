import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaFire } from "react-icons/fa";
import { formatPrice, makeSlug } from "../../products/Helpers";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import type { OrderCheckoutItemI } from "../../orders/OrdersTypes";
import clsx from "clsx";

type Props = {
    data: OrderCheckoutItemI;
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

const CheckoutOrderItemV2 = ({ data }: Props) => {
    const images = useMemo(() => {
        if (!data.images || data.images.length === 0) return [NotFoundSVG];
        return [...data.images]
            .sort((a, b) => a.mainImage === b.mainImage ? 0 : a.mainImage ? -1 : 1)
            .map(img => img.url);
    }, [data.images]);

    const productUrl = `/tienda/${data.category.toLowerCase()}/${makeSlug(data.name)}/${data.sku.toLowerCase()}`;

    const buildSubcategoryUrl = (clickedIndex: number): string => {
        const category = data.category.toLowerCase();
        const slice = data.subcategories.slice(0, clickedIndex + 1);
        const params = slice.map(s => `&sub=${s.uuid}`).join("");
        return `/tienda?category=${category}${params}&page=1`;
    };

    return (
        <div className="w-full rounded-2xl bg-base-100 border border-base-300 hover:border-primary/30 transition-colors duration-200 p-3 sm:p-4 md:p-5">
            <div className="flex gap-4 sm:gap-5">

                {/* ── Image ── */}
                <Link to={productUrl} className="flex-shrink-0 group">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-xl overflow-hidden border border-base-300 group-hover:border-primary/50 transition-colors duration-200 aspect-square group/images relative">
                        {/* Mobile version (single image) */}
                        <img
                            src={images[0]}
                            alt={data.name}
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
                                            alt={`${data.name} - Imagen ${i + 1}`}
                                            className="object-cover"
                                            loading="lazy"
                                        />
                                    ))}
                                </figure>
                            ) : (
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={images[0]}
                                    alt={data.name}
                                    loading="lazy"
                                />
                            )}
                        </div>
                    </div>
                </Link>

                {/* ── Content ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                            <Link
                                to={productUrl}
                                className="text-sm sm:text-base md:text-lg font-bold text-base-content hover:text-primary hover:underline underline-offset-2 transition-colors duration-150 leading-snug"
                            >
                                {data.name}
                            </Link>
                            {data.offer.isOffer && (
                                <span className={clsx(
                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold flex-shrink-0",
                                    discountBg(data.offer.discount)
                                )}>
                                    <FaFire className="text-[10px]" />
                                    {data.offer.discount}% OFF
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Breadcrumbs */}
                    <div className="breadcrumbs text-xs sm:text-sm text-base-content/50 bg-base-200 w-fit rounded-lg px-2 sm:px-3 py-0.5">
                        <ul>
                            <li>
                                <Link
                                    to={`/tienda?category=${data.category.toLowerCase()}&page=1`}
                                    className="font-semibold text-base-content/70 hover:text-primary"
                                >
                                    {data.category}
                                </Link>
                            </li>
                            {data.subcategories.map((sc, i) => (
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

                    {/* Color & SKU */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span
                                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-base-300 flex-shrink-0 shadow-sm"
                                style={{ backgroundColor: data.color.code }}
                            />
                            <span className="text-xs sm:text-sm text-base-content/60 font-medium whitespace-nowrap">
                                {data.color.name}
                            </span>
                        </div>
                        <div className="w-px h-3 bg-base-300" />
                        <span className="text-xs sm:text-sm text-base-content/60">
                            SKU — <span className="text-base-content font-medium uppercase">{data.sku}</span>
                        </span>
                    </div>

                    {/* Qty + Prices */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-1">
                        
                        {/* Quantity (Read-only) */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-base-content/50 uppercase">Cantidad</span>
                            <div className="px-3 py-1.5 rounded-lg bg-base-200 border border-base-300 w-fit text-sm sm:text-base font-bold text-base-content">
                                {data.quantity} pza{data.quantity > 1 ? "s" : ""}
                            </div>
                        </div>

                        {/* Prices */}
                        <div className="flex gap-4 sm:gap-6 items-end">
                            
                            {/* Unit Price */}
                            <div className="flex flex-col items-start sm:items-end">
                                <span className="text-[10px] sm:text-xs text-base-content/40 uppercase mb-0.5">
                                    Precio unitario
                                </span>
                                {data.offer.isOffer ? (
                                    <div className="flex flex-col items-start sm:items-end">
                                        <span className={clsx("text-base sm:text-lg font-bold", discountText(data.offer.discount))}>
                                            ${formatPrice(data.finalPrice, "es-MX")}
                                        </span>
                                        <span className="text-xs line-through text-base-content/30">
                                            ${formatPrice(data.unitPrice, "es-MX")}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-base sm:text-lg font-bold text-base-content">
                                        ${formatPrice(data.unitPrice, "es-MX")}
                                    </span>
                                )}
                            </div>

                            <div className="w-px h-10 bg-base-300 hidden sm:block" />

                            {/* Subtotal */}
                            <div className="flex flex-col items-start sm:items-end">
                                <span className="text-[10px] sm:text-xs text-base-content/40 uppercase mb-0.5">
                                    Subtotal
                                </span>
                                <span className={clsx(
                                    "text-lg sm:text-xl font-extrabold text-base-content",
                                    data.offer.isOffer && discountText(data.offer.discount)
                                )}>
                                    ${formatPrice(data.subtotal, "es-MX")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutOrderItemV2;
