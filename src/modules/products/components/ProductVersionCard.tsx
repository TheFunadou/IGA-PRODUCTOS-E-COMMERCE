import { MdOutlineShoppingCart } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { FaFire } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { IoIosHeartEmpty } from "react-icons/io";

import type { ProductVersionCardType } from "../ProductTypes";
import { useEffect, useState } from "react";
import { formatPrice, makeSlug } from "../Helpers";
import ProductVersionCardSkeleton from "./ProductVersionCardSkeleton";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { Link } from "react-router-dom";
import { useShoppingCartActions } from "../../shopping/hooks/useShoppingCart";
import { useFavorite } from "../hooks/useProductFavorites";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";

type Props = {
    versionData: ProductVersionCardType;
    className: string;
}

const ProductVersionCard = ({ versionData, className }: Props) => {

    const [productName, setProductName] = useState<string>("");
    const [image, setImage] = useState<string | undefined>(NotFoundSVG);
    const { useAddToShoppingCart, useAddToBuyNow } = useShoppingCartActions();
    const category: string = versionData.category.toLowerCase();
    const slug: string = makeSlug(versionData.product_name);
    const sku: string = versionData.product_version.sku.toLowerCase();
    const unit_price: string[] = formatPrice(versionData.product_version.unit_price, "es-MX").split(".");
    const {isFavorite,toggleFavorite} = useFavorite({
        sku: versionData.product_version.sku,
        initialFavoriteState: versionData.isFavorite
    });

    useEffect(() => {
        if (versionData) {
            if (versionData.product_name.length > 70) {
                setProductName(versionData.product_name.substring(0, 70) + "...");
            } else {
                setProductName(versionData.product_name)
            };

            setImage(versionData.product_images.find(image => image.main_image === true)?.image_url);
        };
    }, [versionData]);

    if (!versionData) { <ProductVersionCardSkeleton /> }
    const handleAddToShoppingCart = useDebounceCallback(() => { useAddToShoppingCart(versionData) },500);
    return (
        <div className={`${className} bg-white p-5 hover:shadow-xl duration-350 ease-in`}>
            <div className="w-full h-full">
                <div className=" h-1/5 py-4 flex flex-col justify-start items-start">
                    <Link to={`/tienda/${category}/${slug}/${sku}`} className="text-xl font-bold hover:underline hover:text-primary">{productName}</Link>
                    <p className="text-gray-700">{versionData.product_attributes.map(subcategories => subcategories.category_attribute.description).join(", ")}</p>
                </div>
                <figure className="py-4 relative">
                    <img className="border border-gray-400 rounded-xl" src={image} alt={`${productName}`} />
                    {versionData.isOffer && <FaFire className="text-error text-5xl absolute top-5 left-0 m-2" />}
                    {isFavorite ? (
                        <button
                            type="button"
                            className=" absolute bottom-5 right-0 m-2"
                            onClick={(e) => toggleFavorite(e) }>
                            <IoMdHeart className="text-primary text-5xl" title="Marcar como favorito" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="absolute bottom-5 right-0 m-2">
                            <IoIosHeartEmpty className="duration-300 text-primary text-5xl" title="Desmarcar como favorito"
                                onClick={(e) => toggleFavorite(e)} />
                        </button>

                    )}
                </figure>
                <div className="flex flex-col justify-center">
                    {versionData.isOffer ? (
                        <div className="flex items-end">
                            <p className="text-2xl bg-error text-white px-3 rounded-lg font-bold mr-2">% 20</p>
                            <p className="font-bold text-3xl mr-1"><span className="text-xl">$</span>{`${unit_price[0]}`}<span className="text-xl mr-1">{`.${unit_price[1]}`}</span></p>
                            <p className=" line-through text-gray-500">{` ${formatPrice(versionData.product_version.unit_price, "es-MX")} MXN`}</p>

                        </div>
                    ) : (
                        <p className="font-bold text-3xl mr-1"><span className="text-xl">$</span>{`${unit_price[0]}`}<span className="text-xl mr-1">{`.${unit_price[1]}`}</span></p>
                    )}
                </div>
                <div className="mt-2 flex items-center gap-3 [&_button]:rounded-3xl">
                    <button type="button" className="btn bg-blue-950 text-white text-lg px-8" onClick={() => useAddToBuyNow(versionData)}>Comprar Ahora</button>
                    <button type="button" className="btn btn-primary px-8" onClick={handleAddToShoppingCart}><MdOutlineShoppingCart className="text-2xl" /><FaPlus /></button>
                </div>
            </div>
        </div>
    );
};

export default ProductVersionCard;