import { FaFire, FaPlus } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import type { ProductVersionCardType } from "../ProductTypes";
import { useFavorite } from "../hooks/useProductFavorites";
import { useEffect, useState, version } from "react";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { formatPrice, makeSlug } from "../Helpers";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../../layouts/states/themeStore";
import clsx from "clsx";
import { useShoppingCart } from "../../shopping/hooks/useShoppingCart";

type Props = {
    versionData: ProductVersionCardType;
    className?: string;
};

const ProductVersionCardShop = ({ versionData, className }: Props) => {
    const { theme } = useThemeStore();
    // const { addItem,addToBuyNow} = useShoppingCartStore();
    const { add, addBuyNow } = useShoppingCart();
    const [image, setImage] = useState<string | undefined>(NotFoundSVG);
    const [unitPrice, setUnitPrice] = useState<string[]>([]);
    const [unitPriceWithDiscount, setUnitPriceWithDiscount] = useState<string[]>([]);
    const category = versionData.category.toLowerCase();
    const slug = makeSlug(versionData.product_name);
    const sku = versionData.product_version.sku.toLowerCase();
    // const unitPrice: string[] = formatPrice(versionData.product_version.unit_price, "es-MX").split(".");
    const navigate = useNavigate();
    const {
        isFavorite,
        toggleFavorite
    } = useFavorite({
        sku: versionData.product_version.sku, initialFavoriteState: versionData.isFavorite, item: versionData
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
        <div className={`w-75 h-120 ${className}`}>
            <figure role="button" className="w-full h-60/100 relative cursor-pointer" onClick={() => navigate(`/tienda/${category}/${slug}/${sku}`)}>
                <img className="w-full h-full object-cover object-center rounded-t-xl" src={image} alt={versionData.product_name} />
                {versionData.isOffer && <FaFire className="text-error text-4xl absolute top-1 left-1 m-2" />}
                {isFavorite ? (
                    <button
                        type="button"
                        className="absolute bottom-5 right-5"
                        onClick={(e) => toggleFavorite(e)}>
                        <IoMdHeart className="text-primary text-4xl" title="Marcar como favorito" />
                    </button>
                ) : (
                    <button
                        type="button"
                        className="absolute bottom-5 right-5"
                        onClick={(e) => toggleFavorite(e)}>
                        <IoIosHeartEmpty className="text-primary text-4xl" title="Desmarcar favorito" />
                    </button>
                )}
            </figure>
            <div className="w-full h-10/100 flex items-center">
                <button
                    type="button"
                    className="font-bold line-clamp-2 text-lg/6 hover:text-primary hover:underline text-left cursor-pointer"
                    onClick={() => navigate(`/tienda/${category}/${slug}/${sku}`)}>
                    {versionData.product_name.toUpperCase()}
                </button>
            </div>
            <div className="w-full h-10/100">
                <p className={clsx("text-sm line-clamp-2", theme === "ligth" ? "text-gray-700" : "text-white")}>{versionData.subcategories && versionData.subcategories.map(sub => sub.subcategories.description).join(", ")}</p>
            </div>
            <div className="w-full h-10/100 flex items-center">
                {versionData.isOffer ? (
                    <div className="flex items-center gap-2">
                        <p className="h-full px-2 bg-error text-2xl text-white font-bold rounded-md">{versionData.discount}%</p>
                        <div>
                            <p className="font-bold text-2xl  inline-block">${unitPriceWithDiscount[0]}.<span className="align-baseline text-lg">{unitPriceWithDiscount[1]}</span> <span className="line-through text-gray-400 text-lg align-baseline">${unitPrice[0]}.{unitPrice[1]}</span></p>
                        </div>
                    </div>
                ) : (
                    <p className="text-2xl font-bold inline">${unitPrice[0]}.<span className="align-baseline text-lg">{unitPrice[1]}</span></p>
                )}
            </div>
            <div className="w-full h-10/100 flex gap-3 items-center ">
                <button type="button" className={clsx("btn rounded-2xl text-white w-60/100 cursor-pointer", theme === "ligth" ? "bg-blue-950" : "bg-transparent border border-white")} onClick={() => addBuyNow(versionData)}>Comprar ahora</button>
                <button type="button" className="btn btn-primary rounded-2xl w-30/100 cursor-pointer" onClick={() => add(versionData)}><MdOutlineShoppingCart className="text-xl" /><FaPlus /></button>
            </div>
        </div>
    );
};

export default ProductVersionCardShop;