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
};

const ProductVersionCardShop = ({ versionData, className, imageLoading }: Props) => {
    const { theme } = useThemeStore();
    const { add, addBuyNow } = useShoppingCart();
    const [image, setImage] = useState<string | undefined>(NotFoundSVG);
    const [unitPrice, setUnitPrice] = useState<string[]>([]);
    const [unitPriceWithDiscount, setUnitPriceWithDiscount] = useState<string[]>([]);
    const category = versionData.category.toLowerCase();
    const slug = makeSlug(versionData.product_name);
    const sku = versionData.product_version.sku.toLowerCase();
    const navigate = useNavigate();
    const {
        isFavorite,
        toggleFavorite
    } = useFavorite({
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

    return (
        <div className={`w-full h-85 md:w-75 md:h-120 ${className}`}>
            <figure role="button" className="w-full h-40 md:h-60/100 relative cursor-pointer" onClick={() => navigate(`/tienda/${category}/${slug}/${sku}`)}>
                <img className="w-full h-full object-cover object-center rounded-t-xl" src={image} alt={versionData.product_name} loading={imageLoading} />
                {versionData.isOffer && <FaFire className={clsx(
                    "text-2xl md:text-4xl absolute top-1 left-1 m-1 md:m-2",
                    versionData.discount && versionData.discount < 50 && "text-error",
                    versionData.discount && versionData.discount >= 50 && versionData.discount < 65 && "text-success",
                    versionData.discount && versionData.discount >= 65 && "text-primary"
                )} />}
                {isFavorite ? (
                    <button
                        type="button"
                        className="absolute bottom-2 right-2 md:bottom-5 md:right-5"
                        onClick={(e) => toggleFavorite(e)}>
                        <IoMdHeart className="text-primary text-2xl md:text-4xl" title="Marcar como favorito" aria-label="Marcar como favorito" />
                    </button>
                ) : (
                    <button
                        type="button"
                        className="absolute bottom-2 right-2 md:bottom-5 md:right-5"
                        onClick={(e) => toggleFavorite(e)}>
                        <IoIosHeartEmpty className="text-primary text-2xl md:text-4xl" title="Desmarcar favorito" aria-label="Desmarcar favorito" />
                    </button>
                )}
            </figure>
            <div className="w-full flex items-center py-1 md:py-0 md:h-10/100">
                <button
                    type="button"
                    className="font-bold line-clamp-2 text-xs md:text-lg/6 hover:text-primary hover:underline text-left cursor-pointer"
                    onClick={() => navigate(`/tienda/${category}/${slug}/${sku}`)}
                    aria-label="Ver producto">
                    {versionData.product_name.toUpperCase()}
                </button>
            </div>
            <div className="w-full py-1 md:py-0 h-10/100">
                <p className={clsx("text-xs md:text-sm line-clamp-2", theme === "ligth" ? "text-gray-700" : "text-white")}>{versionData.subcategories && versionData.subcategories.join(", ")}</p>
            </div>
            <div className="w-full flex items-center py-1 md:py-0 md:h-10/100">
                {versionData.isOffer ? (
                    <div className="flex items-center gap-1 md:gap-2">
                        <p className={
                            clsx(
                                "h-full px-1 md:px-2 text-sm md:text-2xl text-white font-bold rounded-md",
                                versionData.discount && versionData.discount < 50 && "bg-error",
                                versionData.discount && versionData.discount >= 50 && versionData.discount < 65 && "bg-success",
                                versionData.discount && versionData.discount >= 65 && "bg-primary"
                            )
                        }>{versionData.discount}%</p>
                        <div>
                            <p className="font-bold text-sm md:text-2xl inline-block">${unitPriceWithDiscount[0]}.<span className="align-baseline text-xs md:text-lg">{unitPriceWithDiscount[1]}</span> <span className="line-through text-gray-400 text-xs md:text-lg align-baseline">${unitPrice[0]}.{unitPrice[1]}</span></p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm md:text-2xl font-bold inline">${unitPrice[0]}.<span className="align-baseline text-xs md:text-lg">{unitPrice[1]}</span></p>
                )}
            </div>
            <div className="w-full flex gap-1 md:gap-3 items-center py-2 md:py-0 md:h-10/100">
                <button
                    type="button"
                    className={clsx("btn rounded-xl block sm:hidden text-white w-fit cursor-pointer text-xs md:text-base", theme === "ligth" ? "bg-blue-950" : "bg-transparent border border-white")}
                    onClick={() => addBuyNow({ sku, quantity: 1 })}
                    aria-label="Comprar ahora">
                    <TbShoppingCartDown />
                </button>
                <button
                    type="button"
                    className={clsx("hidden sm:block btn rounded-xl text-white w-fit cursor-pointer text-xs md:text-base", theme === "ligth" ? "bg-blue-950" : "bg-transparent border border-white")}
                    onClick={() => addBuyNow({ sku, quantity: 1 })}
                    aria-label="Comprar ahora">
                    Comprar ahora
                </button>
                <button
                    type="button"
                    className="btn btn-primary rounded-xl w-fit cursor-pointer"
                    onClick={() => add(versionData)}
                    aria-label="Agregar al carrito">
                    <MdOutlineShoppingCart className="hidden md:block text-base md:text-xl" /><FaPlus className="text-sm md:text-base" />
                </button>
            </div>
        </div>
    );
};

export default ProductVersionCardShop;