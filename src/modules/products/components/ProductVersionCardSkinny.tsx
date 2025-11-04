import { useEffect, useState } from "react";
import type { ProductVersionCardType } from "../ProductTypes";
import { formatPrice, makeSlug } from "../Helpers";
import { FaFire, FaPlus } from "react-icons/fa6";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { useShoppingCartActions } from "../../shopping/hooks/useShoppingCart";
import { useFavorite } from "../hooks/useProductFavorites";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";

type Props = {
    versionData: ProductVersionCardType;
    className?: string
};

const ProductVersionCardSkinny = ({ versionData, className }: Props) => {
    const [productName, setProductName] = useState<string>("");
    const [image, setImage] = useState<string | undefined>(NotFoundSVG);
    const { useAddToShoppingCart, useAddToBuyNow } = useShoppingCartActions();
    const category: string = versionData.category.toLowerCase();
    const slug: string = makeSlug(versionData.product_name);
    const sku: string = versionData.product_version.sku.toLowerCase();
    const unit_price: string[] = formatPrice(versionData.product_version.unit_price, "es-MX").split(".");
    const {
        isFavorite,
        toggleFavorite
    } = useFavorite({
        sku: versionData.product_version.sku, initialFavoriteState: versionData.isFavorite
    });
    useEffect(() => {
        if (versionData) {
            if (versionData.product_name.length > 65) {
                setProductName(versionData.product_name.substring(0, 65) + "...");
            } else {
                setProductName(versionData.product_name)
            };

            setImage(versionData.product_images.find(image => image.main_image === true)?.image_url);
            ;
        }
    }, [versionData]);

    if (!versionData) { "Cargando tarjeta ..." };

    const handleAddToShoppingCart = useDebounceCallback(() => { useAddToShoppingCart(versionData) }, 500);

    return (
        <div className={`px-5 pt-5 pb-15 ${className}`}>
            <Link to={`/tienda/${category}/${slug}/${sku}`}>
                <figure className="relative h-3/5 border rounded-xl border-gray-400 mb-2 ">
                    <img className="rounded-xl" src={image} alt={`${productName}`} />
                    {versionData.isOffer && <FaFire className="text-error text-5xl absolute top-5 left-0 m-2" />}
                    {isFavorite ? (
                        <button
                            type="button"
                            className=" absolute bottom-5 right-0 m-2"
                            onClick={(e) => toggleFavorite(e)}>
                            <IoMdHeart className="text-primary text-4xl" title="Marcar como favorito" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="absolute bottom-5 right-0 m-2">
                            <IoIosHeartEmpty className="duration-300 text-primary text-4xl" title="Desmarcar como favorito"
                                onClick={(e) => toggleFavorite(e)} />
                        </button>

                    )}
                </figure>
            </Link>
            <div className="h-1/2">
                <Link to={`/tienda/${category}/${slug}`}>
                    <div className=" h-1/3">
                        <p className="text-lg font-bold hover:underline hover:text-primary">{productName}</p>
                    </div>
                </Link>
                <div className=" h-1/5 py-1">
                    <p className="text-gray-700 text-sm">{versionData.product_attributes.map(subcategories => subcategories.category_attribute.description).join(", ")}</p>
                </div>
                <div >
                    {versionData.isOffer ? (
                        <div className="flex items-end justify-start">
                            <p className="text-xl bg-error text-white px-2 rounded-lg font-bold mr-2">%20</p>
                            <p className="font-bold text-2xl mr-1"><span className="text-sm">$</span>{`${unit_price[0]}`}<span className="text-sm mr-1">{`.${unit_price[1]}`}</span></p>
                            <p className=" line-through text-gray-500 text-xs mb-1">{` ${unit_price.join(".")}`}</p>
                        </div>
                    ) : (
                        <p className="font-bold text-2xl mr-1"><span className="text-xl">$</span>{`${unit_price[0]}`}<span className="text-xl mr-1">{`.${unit_price[1]}`}</span></p>
                    )}
                </div>
                <div className="mt-2 flex items-center gap-2 [&_button]:rounded-3xl ">
                    <button type="button" className="w-3/5 btn bg-blue-950 text-white" onClick={() => useAddToBuyNow(versionData)}>Comprar Ahora</button>
                    <button type="button" className="w-1/3 btn btn-primary" onClick={handleAddToShoppingCart}><MdOutlineShoppingCart className="text-xl" /><FaPlus /></button>
                </div>
            </div>
        </div>
    );
};

export default ProductVersionCardSkinny;