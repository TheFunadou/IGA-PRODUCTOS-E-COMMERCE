import { FaFire } from "react-icons/fa";
import { formatPrice, makeSlug } from "../../products/Helpers";
import { Link } from "react-router-dom";
import type { ShoppingCartType } from "../ShoppingTypes";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useThemeStore } from "../../../layouts/states/themeStore";

type Props = {
    data: ShoppingCartType;
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

const CheckoutOrderItem = ({ data }: Props) => {
    const { theme: _theme } = useThemeStore();
    const [subtotal, setSubtotal] = useState(0);
    const [subtotalWithDisc, setSubtotalWithDisc] = useState(0);

    useEffect(() => {
        if (data.isOffer && data.product_version.unit_price_with_discount) {
            setSubtotalWithDisc(parseFloat(data.product_version.unit_price_with_discount) * data.quantity);
        }
        setSubtotal(parseFloat(data.product_version.unit_price) * data.quantity);
    }, [data]);

    const mainImage = data.product_images.find(img => img.main_image)?.image_url;
    const productUrl = `/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name)}/${data.product_version.sku.toLowerCase()}`;

    return (
        <div className="w-full p-3 sm:p-4">
            <div className="flex gap-3 sm:gap-4">

                {/* ── Image ── */}
                <Link to={productUrl} className="flex-shrink-0 group">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-base-300 group-hover:border-primary/40 transition-colors duration-200">
                        <img
                            src={mainImage}
                            alt={data.product_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </Link>

                {/* ── Content ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">

                    {/* Name + badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            to={productUrl}
                            className="text-sm sm:text-base font-bold text-base-content hover:text-primary hover:underline underline-offset-2 transition-colors duration-150 leading-snug"
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

                    {/* Breadcrumb */}
                    <div className="breadcrumbs text-xs text-base-content/50 bg-base-200 w-fit rounded-lg px-2 py-0.5">
                        <ul>
                            <li><span className="text-base-content/60">{data.category}</span></li>
                            {data.subcategories.map((bc, i) => (
                                <li key={i}><span className="text-base-content/60">{bc}</span></li>
                            ))}
                        </ul>
                    </div>

                    {/* Color */}
                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-base-300 flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: data.product_version.color_code }}
                        />
                        <span className="text-xs text-base-content/60">
                            {data.product_version.color_line} —{" "}
                            <span className="text-base-content/80 font-medium">{data.product_version.color_name}</span>
                        </span>
                    </div>

                    {/* Qty + Prices */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mt-1">

                        {/* Quantity badge */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-base-content/40 uppercase">Cantidad</span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-base-200 border border-base-300 text-sm font-bold text-base-content">
                                {data.quantity}
                            </span>
                        </div>

                        {/* Prices */}
                        <div className="flex gap-4 sm:gap-5 items-end">

                            {/* Unit price */}
                            <div className="flex flex-col items-start sm:items-end">
                                <span className="text-[10px] sm:text-xs text-base-content/40 uppercase mb-0.5">Precio unitario</span>
                                {data.isOffer && data.product_version.unit_price_with_discount ? (
                                    <div className="flex flex-col items-start sm:items-end">
                                        <span className={clsx("text-sm sm:text-base font-bold", discountText(data.discount))}>
                                            ${formatPrice(data.product_version.unit_price_with_discount, "es-MX")}
                                        </span>
                                        <span className="text-xs line-through text-base-content/30">
                                            ${formatPrice(data.product_version.unit_price, "es-MX")}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-sm sm:text-base font-bold text-base-content">
                                        ${formatPrice(data.product_version.unit_price, "es-MX")}
                                    </span>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="w-px h-8 bg-base-300 hidden sm:block" />

                            {/* Subtotal */}
                            <div className="flex flex-col items-start sm:items-end">
                                <span className="text-[10px] sm:text-xs text-base-content/40 uppercase mb-0.5">Subtotal</span>
                                {data.isOffer && data.product_version.unit_price_with_discount ? (
                                    <div className="flex flex-col items-start sm:items-end">
                                        <span className={clsx("text-base sm:text-lg font-extrabold", discountText(data.discount))}>
                                            ${formatPrice(subtotalWithDisc.toString(), "es-MX")}
                                        </span>
                                        <span className="text-xs line-through text-base-content/30">
                                            ${formatPrice(subtotal.toString(), "es-MX")}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-base sm:text-lg font-extrabold text-base-content">
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

export default CheckoutOrderItem;