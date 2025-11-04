import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPrice, makeSlug, ProductDetailToProductCardFormat } from "../Helpers";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { useFetchProductVersionDetail } from "../hooks/useFetchProductVersionCards";
import clsx from "clsx";
import ImageMagnifier from "../components/ImageMagnifier";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import { useShoppingCartActions } from "../../shopping/hooks/useShoppingCart";
import { useFavorite } from "../hooks/useProductFavorites";
import type { ProductVersionCardType } from "../ProductTypes";

const ProductDetail = () => {
    const params = useParams();
    const {
        data,
        isLoading,
        error,
        refetch
    } = useFetchProductVersionDetail(params.sku);

    const [selectProductQty, setSelectProductQty] = useState<string>("1");
    const [productQty, setProductQty] = useState<number>(1);
    const [stockError, setStockError] = useState<string>("");
    const [unitPrice, setUnitPrice] = useState<string>("");
    const [image, setImage] = useState<string | undefined>(NotFoundSVG);
    const [color, setColor] = useState<string>("");
    const [stock, setStock] = useState<number>(1);
    const { useAddToShoppingCart, useAddToBuyNow } = useShoppingCartActions();
    const {
        isFavorite,
        toggleFavorite }
        = useFavorite({ sku: data?.product_version.sku, initialFavoriteState: data?.isFavorite });

    if (error) {
        return (
            <div>
                <p className="mt-5 text-3xl font-bold text-error">Error al cargar el producto, intentelo mas tarde.</p>
                <button type="button" className="btn btn-primary" onClick={() => refetch}>Reintentar</button>
            </div>
        );
    };

    const handleSelectProductQty = (input: string) => {
        setSelectProductQty(input);
        if (input !== "more") {
            setStockError("");
        };
    };

    const handleQtyLimit = (input: string) => {
        const quantity: number = parseInt(input);
        if (quantity > stock) {
            setStockError(`La cantidad ingresada no puede ser mayor a ${stock} piezas`);
        } else {
            setStockError("");
        }
    };

    const handleSetProductQty = (input: string) => {
        if (input.length === 0) {
            setStockError("");
        };

        if (input !== "more") {
            if (input.match(/^[0-9]+$/) && parseInt(input) > 0) {
                setProductQty(parseInt(input));
            } else {
                setStockError("El valor ingresado debe ser un numero entero positivo");
            };
        }
    };

    useEffect(() => {
        if (data) {
            const mainImage = data.product_images.find(img => img.main_image === true)?.image_url;
            setImage(mainImage);
            const formated: string = formatPrice(data.product_version.unit_price, "es-MX");
            setUnitPrice(formated);
            setColor(data && data.product_version.color_code);
            setStock(data && data.product_version.stock);
        };
    }, [data]);

    const productCardData = data && ProductDetailToProductCardFormat(data);

    return (
        <div className="w-full">
            {isLoading ? (
                <ProductDetailSkeleton />
            ) : (
                <div className="w-full px-5 py-10 rounded-xl bg-base-300">
                    <div className="w-full flex border-b border-gray-400 pb-5">
                        <div className="w-30/100 relative">
                            <div className="sticky top-5">
                                <figure className="w-full h-130">
                                    {/* <img className="w-full h-full rounded-xl border-2 border-gray-300" src={image} alt={data && data.product.product_name} /> */}
                                    <ImageMagnifier src={image} alt={data && data.product.product_name} />

                                </figure>
                                <div className="flex gap-2 items-center justify-start flex-wrap mt-5">
                                    {data && data.product_images.map((img, index) => (
                                        <figure key={index}
                                            className="w-30 h-30"
                                            onClick={() => { setImage(img.image_url) }}
                                        >
                                            <img className={clsx(
                                                "w-full h-full border-2 rounded-lg hover:border-primary duration-200 ease-in cursor-pointer",
                                                img.image_url === image ? "border-primary" : "border-gray-300"
                                            )}
                                                src={img.image_url}
                                                alt={`${data && data.product.product_name} imagen ${index}`} />
                                        </figure>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="w-50/100 px-10">
                            <h1 className="text-4xl font-bold">{data && data.product.product_name}</h1>
                            <div className="breadcrumbs text-xl">
                                <ul>
                                    {data && data.product_attributes.map((subcategories, index) => (
                                        <li key={index}>{subcategories.category_attribute.description}</li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-2xl font-bold text-primary">{data && data.product_version.status}</p>
                            <div className="py-5 border-y border-y-gray-400 mt-5">
                                {data && data.isOffer ? (
                                    <div className="flex gap-5">
                                        <div className="flex gap-2 items-center">
                                            <p className="bg-error p-3 rounded-xl text-white font-bold text-3xl">% 20</p>
                                            <div>
                                                <p>Precio unitario en oferta:</p>
                                                <p className="text-3xl font-bold text-primary">$</p>

                                            </div>
                                        </div>
                                        <div className="text-gray-500 flex flex-col justify-end">
                                            <p>Precio anterior:</p>
                                            <p className="line-through">340.00</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p>Precio de unitario:</p>
                                        <p className="text-3xl font-bold">${unitPrice}</p>
                                    </div>
                                )}
                            </div>
                            <div className="w-full py-5 border-b border-b-gray-400 flex items-center justify-between">
                                <p className="text-2xl font-bold">{data && data.product_version.color_line}: <span className="ml-2">{data && data.product_version.color_name} <span className="ml-2 px-5 py-1 border border-gray-300 rounded-full" style={{ backgroundColor: color }}></span></span></p>
                                <a href={(data && data.product_version.technical_sheet_url) ?? "#"} target="_blank" className="underline text-primary font-bold">Ver ficha tecnica...</a>
                            </div>
                            <div className="py-5 border-b border-b-gray-400">
                                <p className="text-2xl">Versiones del producto:</p>

                                <div className="w-full flex flex-wrap gap-5 py-2">
                                    {data && data.parent_versions && data.parent_versions.map((version, index) => (
                                        <div key={index} className={clsx(
                                            "w-1/7 bg-white border-2 hover:border-primary duration-350 ease-in rounded-xl",
                                            version.sku.toLocaleLowerCase() === params.sku ? "border-primary" : "border-gray-400"
                                        )}>
                                            <Link to={`/tienda/${data.category.toLocaleLowerCase()}/${makeSlug(data.product.product_name)}/${version.sku.toLowerCase()}`}>
                                                <figure>
                                                    <img className="rounded-t-xl border border-gray-300" src={version.product_images[0].image_url} alt="" />
                                                </figure>
                                                <div className="py-2 text-center">
                                                    <p className="font-bold">$ {formatPrice(version.unit_price, "es-MX")}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Description */}
                            <div className="pt-5 text-lg/8 text-justify">
                                {(data && data.product.description) ?? "No hay una descripción por mostrar"}
                            </div>
                        </div>
                        <div className="w-20/100">
                            <div className="w-full bg-base-200 shadow-2xl rounded-xl p-5">
                                <div className="border-b border-gray-400 pb-2">
                                    <p>Precio unitario:</p>
                                    <h1 className="text-3xl font-bold">${unitPrice}</h1>
                                </div>
                                <div className="border-b border-gray-400 py-3">
                                    <p>Envio por:</p>
                                    <h1 className="text-lg">$200.00 MXN</h1>
                                </div>
                                <div className="py-5 flex flex-col gap-10">
                                    <Link to="#" className="underline text-primary">Politica de devolución PNC</Link>
                                    <div>
                                        <p>Selecciona una cantidad:</p>
                                        <select className="select w-full mt-2" onChange={(e) => { handleSelectProductQty(e.target.value); handleSetProductQty(e.target.value) }}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="more">Mas de 5</option>
                                        </select>
                                    </div>
                                    {selectProductQty === "more" &&
                                        <div>
                                            <p>Especifique una cantidad</p>
                                            <input
                                                type="number"
                                                pattern="0-9"
                                                placeholder={`Limite ${data && data.product_version.stock} piezas`}
                                                className="w-full input"
                                                onChange={(e) => { handleQtyLimit(e.target.value); handleSetProductQty(e.target.value) }}
                                            />
                                            {stockError.length > 0 && <p className="mt-2 text-error">{stockError}</p>}
                                        </div>
                                    }
                                    <div className="flex flex-col gap-5">
                                        <button type="button" className="w-full btn btn-primary" onClick={() => useAddToShoppingCart(productCardData!, productQty)} disabled={productQty > data?.product_version.stock!}>{`Agregar al carrito (${stock} disponibles)`}</button>
                                        <button type="button" className="w-full btn bg-blue-950 text-white" onClick={() => useAddToBuyNow(productCardData!)}>Comprar ahora</button>
                                    </div>
                                    <div className="">
                                        <button type="button" className="w-full text-primary font-semibold cursor-pointer" onClick={(e) => toggleFavorite(e)} >
                                            {isFavorite ? (
                                                <p className="flex items-center justify-center gap-1">
                                                    Favorito
                                                    <IoMdHeart className="text-2xl" />
                                                </p>
                                            ) : (
                                                <p className="flex items-center justify-center gap-1">
                                                    Agregar a favoritos
                                                    <IoIosHeartEmpty className="text-2xl" />
                                                </p>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full py-5">
                        <div className="w-full flex">
                            <div className="w-1/2">
                                <p className="text-2xl font-bold">Información adicional del producto</p>
                                {/* name of each tab group should be unique */}
                                <div className="w-full tabs tabs-border [&_div]:rounded-xl [&_div]:text-justify">
                                    <input type="radio" name="my_tabs_2" className="tab text-lg" aria-label="Caracteristicas" defaultChecked />
                                    <div className="tab-content border-base-300 bg-base-100 p-10">{(data && data.product.specs) ?? "No hay especificaciones por mostrar"}</div>

                                    <input type="radio" name="my_tabs_2" className="tab text-lg" aria-label="Aplicaciones" />
                                    <div className="tab-content border-base-300 bg-base-100 p-10">{(data && data.product.applications) ?? "No hay aplicaciones por mostrar"}</div>

                                    <input type="radio" name="my_tabs_2" className="tab text-lg" aria-label="Recomendaciones" />
                                    <div className="tab-content border-base-300 bg-base-100 p-10">{(data && data.product.recommendations) ?? "No hay recomendaciones por mostrar"}</div>
                                </div>
                            </div>
                            <div className="w-1/2 pl-15">
                                <p className="text-2xl font-bold">Certificaciones del producto</p>
                                <ol className="list-disc list-inside mt-2 text-lg flex flex-col gap-2">
                                    <li>NOM-2ASDAS</li>
                                    <li>NOM-2ASDAS</li>
                                    <li>NOM-2ASDAS</li>
                                    <li>NOM-2ASDAS</li>
                                </ol>
                            </div>
                        </div>
                        {/* <div className="w-full mt-5">
                    <p className="text-2xl font-bold">Reseñas del producto</p>
                    <div className="flex flex-col gap-3 py-5">
                        <RatingReadComponent rate={1} />
                        <RatingReadComponent rate={2} />D
                        <RatingReadComponent rate={3} />
                        <RatingReadComponent rate={4} />
                        <RatingReadComponent rate={5} />
                    </div>
                    <div className="w-1/2 py-5">
                        <div className="p-5 rounded-xl bg-white shadow-xl">
                            <p className="text-xl font-bold">Sebaspooh</p>
                        </div>
                    </div>
                </div> */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;