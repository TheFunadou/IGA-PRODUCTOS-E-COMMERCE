import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { containsOffensiveLanguage, formatDate, formatPrice, makeSlug, ProductDetailToProductCardFormat } from "../Helpers";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import clsx from "clsx";
import ImageMagnifier from "../components/ImageMagnifier";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import { useFavorite } from "../hooks/useProductFavorites";
import { useFetchAds } from "../../../layouts/hooks/useAds";
import ProductVersionCardShop from "../components/ProductVersionCardShop";
import type { AddPVReviewType, ProductVersionCardType } from "../ProductTypes";
import { useShoppingCart } from "../../shopping/hooks/useShoppingCart";
import { FaFire } from "react-icons/fa6";
import { useThemeStore } from "../../../layouts/states/themeStore";
import { CircleUser } from "lucide-react";
import { useAuthStore } from "../../auth/states/authStore";
import { IoShareSocialOutline } from "react-icons/io5";
import ProductVersionCardSkeleton from "../components/ProductVersionCardSkeleton";
import { useAddPVReview, useFetchProductVersionDetail, useFetchProductVersionReviews, useFetchProductVersionReviewsResumeBySKU } from "../hooks/useProductDetail";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useForm } from "react-hook-form";
import PaginationComponent from "../../../global/components/PaginationComponent";
import { OverflowXComponent } from "../../home/components/OverflowXComponent";

const ProductDetail = () => {
    const SHIPPING_COST = 264.00;
    const params = useParams();
    const {
        data,
        isLoading,
        error,
        refetch
    } = useFetchProductVersionDetail(params?.sku);


    const {
        data: reviews,
        isLoading: reviewsLoading,
        error: reviewsError,
    } = useFetchProductVersionReviews({ sku: params?.sku! });

    const {
        data: reviewsResume,
        isLoading: reviewsResumeLoading,
        error: reviewsResumeError,
    } = useFetchProductVersionReviewsResumeBySKU({ sku: params?.sku! });

    const {
        data: ads,
        isLoading: adsLoading,
        error: adsError,
    } = useFetchAds({ limit: 10, entity: "ads" });

    const { theme } = useThemeStore();
    const { isAuth } = useAuthStore();
    const [selectProductQty, setSelectProductQty] = useState<string>("1");
    const [productQty, setProductQty] = useState<number>(1);
    const [stockError, setStockError] = useState<string>("");
    const [unitPrice, setUnitPrice] = useState<string>("");
    const [unitPriceWithDiscount, setUnitPriceWithDiscount] = useState<string[]>([]);
    const [image, setImage] = useState<string | undefined>(NotFoundSVG);
    const [color, setColor] = useState<string>("");
    const [stock, setStock] = useState<number>(1);
    const [certifications, setCertifications] = useState<string[]>([]);
    const [card, setCard] = useState<ProductVersionCardType | undefined>(undefined);
    const { add, addBuyNow } = useShoppingCart();
    const [shippingCost, setShippingCost] = useState<number>(SHIPPING_COST);
    const [boxesQty, setBoxesQty] = useState<number>(1);
    const [selectedRating, setSelectedRating] = useState<number>(1);
    const [reviewPage, setReviewPage] = useState<number>(1);
    const { showTriggerAlert } = useTriggerAlert();
    const { register, handleSubmit, formState: { errors }, watch, setValue, setError, reset } = useForm<AddPVReviewType>({ defaultValues: { rating: 1, title: "", comment: "" } });

    const reviewTitle = watch("title");
    const reviewComment = watch("comment");


    const addReview = useAddPVReview();

    const {
        isFavorite,
        toggleFavorite
    } = useFavorite({ sku: data?.product_version.sku!, initialFavoriteState: data?.isFavorite, item: card! });


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
        if (input !== "more") setStockError("");
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
        if (input.length === 0) setStockError("");
        if (input !== "more") {
            if (input.match(/^[0-9]+$/) && parseInt(input) > 0) {
                setProductQty(parseInt(input));
            } else {
                setStockError("El valor ingresado debe ser un numero entero positivo");
            };
        };
    };

    const handleShareProduct = () => {
        if (data) {
            navigator.clipboard.writeText(window.location.href);
            showTriggerAlert("Successfull", "Copiado al portapapeles");
        };
    };

    const handleSelectRating = (input: number) => {
        if (input > 5) return;
        setSelectedRating(input);
        setValue("rating", input);
    };

    const onSubmit = async (data: AddPVReviewType) => {
        if (containsOffensiveLanguage(data.title)) {
            setError("title", { type: "manual", message: "No se permite lenguaje ofensivo" });
            return;
        };

        if (containsOffensiveLanguage(data.comment)) {
            setError("comment", { type: "manual", message: "No se permite lenguaje ofensivo" });
            return;
        };
        const response = await addReview.mutateAsync({ data });
        if (response) { showTriggerAlert("Successfull", response); reset(); };

    };

    const handleReviewPageChange = (page: number) => setReviewPage(page);

    useEffect(() => {
        if (data) {
            if (data.product_images) {
                const mainImage = data.product_images.find(img => img.main_image === true)?.image_url;
                setImage(mainImage);
            };
            if (data.isOffer && data.discount) {
                const price = parseFloat(data.product_version.unit_price);
                const discount = (data.discount * parseFloat(data.product_version.unit_price)) / 100;
                const priceWithDiscount = price - discount;
                const priceWithDiscountFormat = formatPrice(priceWithDiscount.toString(), "es-MX");
                setUnitPriceWithDiscount(priceWithDiscountFormat.split("."));
            }
            const formated: string = formatPrice(data.product_version.unit_price, "es-MX");
            setUnitPrice(formated);
            setColor(data && data.product_version.color_code);
            setStock(data && data.product_version.stock);
            setCertifications(data && data.product.certifications_desc.split(","))
            setCard(ProductDetailToProductCardFormat(data));
            setValue("sku", data.product_version.sku);
        };
    }, [data]);

    useEffect(() => {
        const MAX_ITEMS_PER_BOX = 10;
        const boxes = Math.ceil(productQty / MAX_ITEMS_PER_BOX);
        setBoxesQty(boxes);
        const shippingCost = boxes * SHIPPING_COST;
        setShippingCost(shippingCost);
    }, [productQty]);

    return (
        <div className="w-full">
            {isLoading ? (
                <ProductDetailSkeleton />
            ) : (
                <div className="w-full px-5 py-10 rounded-xl bg-base-300">
                    <div className="w-full flex border-b border-gray-400 pb-5">
                        <div className="w-35/100 relative">
                            <div className="sticky top-5">
                                <figure className="w-full h-150 relative">
                                    {/* <img className="w-full h-full rounded-xl border-2 border-gray-300" src={image} alt={data && data.product.product_name} /> */}
                                    <ImageMagnifier src={image} alt={data && data.product.product_name} />
                                    {data && data.isOffer && (
                                        <div className={clsx(
                                            "absolute top-5 left-5 px-3 py-2 rounded-xl flex gap-3 items-center border border-white",
                                            data.discount && data.discount < 50 && "bg-error",
                                            data.discount && data.discount >= 50 && data.discount < 65 && "bg-success",
                                            data.discount && data.discount >= 65 && "bg-primary"
                                        )}>
                                            <FaFire className="text-3xl text-white" />
                                            <p className="text-xl font-bold text-white">
                                                {data.discount && data.discount < 50 && "Oferta"}
                                                {data.discount && data.discount >= 50 && data.discount < 65 && "Oferta Especial"}
                                                {data.discount && data.discount >= 65 && "Oferta Irresistible"}
                                            </p>
                                        </div>
                                    )}
                                </figure>
                                <div className="flex gap-2 items-center justify-start flex-wrap mt-5">
                                    {data && data.product_images && data.product_images.map((img, index) => (
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
                        <div className="w-45/100 px-10">
                            <h1 className="text-4xl font-bold">{data && data.product.product_name}</h1>
                            <div className="breadcrumbs text-xl">
                                <ul>
                                    {data && data.subcategories.map((sub, index) => (
                                        <li key={`${index}-${sub}`}>{sub}</li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-2xl font-bold text-primary">{data && data.product_version.status}</p>
                            <div className="py-5 border-y border-y-gray-400 mt-5">
                                {data && data.isOffer ? (
                                    <div className="flex gap-5">
                                        <div className="flex gap-2 items-center">
                                            <p className={clsx(
                                                "p-3 rounded-xl text-white font-bold text-3xl",
                                                data.discount && data.discount < 50 && "bg-error",
                                                data.discount && data.discount >= 50 && data.discount < 65 && "bg-success",
                                                data.discount && data.discount >= 65 && "bg-primary"
                                            )}>{data && data.discount}%</p>
                                            <div className={clsx(
                                                "text-lg",
                                                data.discount && data.discount < 50 && "text-error",
                                                data.discount && data.discount >= 50 && data.discount < 65 && "text-black",
                                                data.discount && data.discount >= 65 && "text-primary"
                                            )}>
                                                <h3 className={clsx(
                                                    "text-lg",
                                                    theme === "dark" && "text-white",
                                                    theme === "ligth" && "text-black"
                                                )}>Precio unitario en oferta:</h3>
                                                <p className={clsx(
                                                    "text-3xl font-bold",
                                                    data.discount && data.discount < 50 && "text-error",
                                                    data.discount && data.discount >= 50 && data.discount < 65 && "text-green-800",
                                                    data.discount && data.discount >= 65 && "text-primary"
                                                )}>${unitPriceWithDiscount[0]}.{unitPriceWithDiscount[1]}</p>
                                            </div>
                                        </div>
                                        <div className="text-gray-500 flex flex-col justify-end">
                                            <h3>Precio anterior:</h3>
                                            <p className="line-through">{unitPrice}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-lg">Precio unitario:</h3>
                                        <p className="text-3xl font-bold">${unitPrice}</p>
                                    </div>
                                )}
                            </div>
                            <div className="w-full py-5 border-b border-b-gray-400 flex items-center justify-between">
                                <p className="text-2xl font-bold">{data && data.product_version.color_line}: <span className="ml-2 px-6 py-2  rounded-full" style={{ backgroundColor: color }}></span><span className="ml-2">{data && data.product_version.color_name}</span></p>
                                <div className="flex gap-2">
                                    {/* <button className="btn btn-ghost underline">Copiar en formato CSV</button> */}
                                    <a href={(data && data.product_version.technical_sheet_url) ?? "#"} className="btn btn-primary" target="_blank">Ver ficha tecnica</a>
                                </div>
                            </div>
                            <div className="py-5 border-b border-b-gray-400">
                                <h2 className="text-2xl">Versiones del producto:</h2>

                                <div className="w-full flex flex-wrap gap-5 py-2">
                                    {data && data.parent_versions && data.parent_versions.map((version, index) => (
                                        <div key={index} className={clsx(
                                            "w-1/7 bg-white border-2 hover:border-primary duration-350 ease-in rounded-xl",
                                            version.sku.toLocaleLowerCase() === params.sku ? "border-primary" : "border-gray-400"
                                        )}>
                                            <Link to={`/tienda/${data.category.toLocaleLowerCase()}/${makeSlug(data.product.product_name)}/${version.sku.toLowerCase()}`}>
                                                <figure>
                                                    <img className="rounded-t-xl border border-gray-300" src={version.product_images && version.product_images[0].image_url} alt="" />
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
                            <div className="pt-5 text-2xl/10 text-justify">
                                {(data && data.product.description) ?? "No hay una descripción por mostrar"}
                            </div>
                        </div>
                        <div className="w-20/100">
                            <div className={clsx(
                                "w-full shadow-2xl rounded-xl p-5",
                                theme === "ligth" ? "bg-base-200" : "bg-gray-800"
                            )}>
                                <div className="border-b border-gray-400 pb-2">
                                    <p>Precio unitario:</p>
                                    <h1 className="text-3xl font-bold">${unitPrice}</h1>
                                </div>
                                <div className="border-b border-gray-400 py-3 tooltip" data-tip="Cada caja tiene una capacidad para 10 unidades de articulos">
                                    <p>Envio por:</p>
                                    <h1 className="text-lg">{`${formatPrice(shippingCost.toString(), "es-MX")} MXN (${boxesQty} caja/s)`}</h1>
                                </div>
                                <div className="py-5 flex flex-col gap-10">
                                    <Link to="/politica-de-devolucion" className="underline text-primary">Politica de devolución PNC</Link>
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
                                        {/* <button type="button" className="w-full btn btn-primary" onClick={() => card && useAddToShoppingCart(card, productQty)} disabled={productQty > data?.product_version.stock!}>{`Agregar al carrito (${stock} disponibles)`}</button>
                                        <button type="button" className="w-full btn bg-blue-950 text-white" onClick={() => card && useAddToBuyNow(card)}>Comprar ahora</button> */}
                                        <button type="button" className="w-full btn btn-primary" onClick={() => card && add(card, productQty)} disabled={productQty > data?.product_version.stock!}>{`Agregar al carrito (${stock} disponibles)`}</button>
                                        <button type="button" className="w-full btn bg-blue-950 text-white" onClick={() => card && addBuyNow(card)}>Comprar ahora</button>
                                    </div>
                                    <div className="flex items-center justify-center gap-5">
                                        <button type="button" className="w-fit text-primary font-semibold cursor-pointer" onClick={(e) => toggleFavorite(e)} >
                                            {isFavorite ? (
                                                <p className="flex items-center justify-center text-center cursor-pointer active:scale-125  duration-150 gap-1">
                                                    Favorito
                                                    <IoMdHeart className="text-2xl" />
                                                </p>
                                            ) : (
                                                <p className="flex items-center justify-center text-center cursor-pointer active:scale-125  duration-150 gap-1">
                                                    Agregar a favoritos
                                                    <IoIosHeartEmpty className="text-2xl" />
                                                </p>
                                            )}
                                        </button>
                                        <button className="w-fit flex items-center justify-center text-center cursor-pointer active:scale-125  duration-150" onClick={handleShareProduct}>
                                            <p>Compartir</p>
                                            <IoShareSocialOutline className="text-2xl" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full py-5">
                        <div className="w-full flex">
                            <div className="w-1/2">
                                <h2 className="text-2xl font-bold">Información adicional del producto</h2>
                                {/* name of each tab group should be unique */}
                                <div className="w-full tabs tabs-border [&_div]:rounded-xl [&_div]:text-justify text-lg">
                                    <input type="radio" name="my_tabs_2" className="tab text-lg" aria-label="Caracteristicas" defaultChecked />
                                    <div className={clsx(
                                        "tab-content border-base-300 p-10 text-2xl/10",
                                        theme === "ligth" ? "bg-base-200" : "bg-gray-800"
                                    )}>{(data && data.product.specs) ?? "No hay especificaciones por mostrar"}</div>

                                    <input type="radio" name="my_tabs_2" className="tab text-lg" aria-label="Aplicaciones" />
                                    <div className={clsx(
                                        "tab-content border-base-300 p-10 text-2xl/10",
                                        theme === "ligth" ? "bg-base-200" : "bg-gray-800"
                                    )}>{(data && data.product.applications) ?? "No hay aplicaciones por mostrar"}</div>

                                    <input type="radio" name="my_tabs_2" className="tab text-lg" aria-label="Recomendaciones" />
                                    <div className={clsx(
                                        "tab-content border-base-300 p-10 text-2xl/10",
                                        theme === "ligth" ? "bg-base-200" : "bg-gray-800"
                                    )}>{(data && data.product.recommendations) ?? "No hay recomendaciones por mostrar"}</div>
                                </div>
                            </div>
                            <div className="w-1/2 pl-15">
                                <h2 className="text-2xl font-bold">Cumplimientos normativos</h2>
                                <ol className="list-disc list-inside mt-2 text-2xl/10 flex flex-col gap-2">
                                    {certifications.map((cer, index) => (
                                        <li key={index}>{cer}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                        <div className="mt-5 flex gap-5">
                            <div className="w-25/100">
                                <h2>Reseñas</h2>
                                <div className={clsx(
                                    "rounded-xl mt-5 p-5",
                                    theme === "ligth" ? "bg-white" : "bg-gray-800"
                                )}>
                                    {reviewsResumeLoading && !reviewsResumeError && !reviewsResume && (
                                        <div className="flex items-center gap-2">Cargando reseñas <span className="loading loading-dots loading-xs text-primary"></span></div>
                                    )}

                                    {!reviewsResumeLoading && !reviewsResumeError && reviewsResume && (
                                        <div>
                                            <div className="rating rating-lg rating-half pointer-events-none">
                                                <input type="radio" name="rating-11" className="rating-hidden" defaultChecked={false} />
                                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-primary" aria-label="0.5 star" defaultChecked={reviewsResume.ratingAverage > 1 && reviewsResume.ratingAverage < 11} />
                                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-primary" aria-label="1 star" defaultChecked={reviewsResume.ratingAverage > 10 && reviewsResume.ratingAverage < 21} />
                                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-primary" aria-label="1.5 star" defaultChecked={reviewsResume.ratingAverage > 20 && reviewsResume.ratingAverage < 31} />
                                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-primary" aria-label="2 star" defaultChecked={reviewsResume.ratingAverage > 30 && reviewsResume.ratingAverage < 41} />
                                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-primary" aria-label="2.5 star" defaultChecked={reviewsResume.ratingAverage > 40 && reviewsResume.ratingAverage < 51} />
                                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-primary" aria-label="3 star" defaultChecked={reviewsResume.ratingAverage > 50 && reviewsResume.ratingAverage < 61} />
                                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-primary" aria-label="3.5 star" defaultChecked={reviewsResume.ratingAverage > 60 && reviewsResume.ratingAverage < 71} />
                                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-primary" aria-label="4 star" defaultChecked={reviewsResume.ratingAverage > 70 && reviewsResume.ratingAverage < 81} />
                                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-primary" aria-label="4.5 star" defaultChecked={reviewsResume.ratingAverage > 80 && reviewsResume.ratingAverage < 91} />
                                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-primary" aria-label="5 star" defaultChecked={reviewsResume.ratingAverage > 90 && reviewsResume.ratingAverage < 101} />
                                            </div>
                                            <p className={clsx(
                                                "text-gray-500 text-sm mt-2",
                                                theme === "ligth" ? "text-gray-500" : "text-white"
                                            )}>Basado en {reviewsResume.totalReviews} {reviewsResume.totalReviews === 1 ? "opinión de un cliente" : "opiniones de clientes"}</p>
                                            <div className="flex flex-col gap-5 mt-5">
                                                {reviewsResume.ratingResume.map((star, index) => (
                                                    <div key={index} className="flex gap-5 items-center">
                                                        {star.rating > 1 && (<h4 className="text-base">{star.rating} Estrellas</h4>)}
                                                        {star.rating === 1 && (<h4 className="text-base"><span className="text-transparent">0</span>{star.rating} Estrella</h4>)}
                                                        <progress className="progress progress-primary w-60 h-5" value={star.percentage} max="100"></progress>
                                                        <p>{star.percentage}%</p>
                                                    </div>

                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                            <div className="w-50/100">
                                <h2>Opiniones de los clientes</h2>
                                <div className={clsx(
                                    "rounded-xl p-5 mt-5",
                                    theme === "ligth" ? "bg-white" : "bg-gray-800"
                                )}>
                                    <div className="flex flex-col gap-5">
                                        {reviewsLoading && !reviewsError && !reviews && (
                                            <div>
                                                <h2>Cargando opiniones...</h2>
                                            </div>
                                        )}
                                        <div>
                                            {!reviewsLoading && !reviewsError && reviews && reviews.reviews.length > 0 && reviews.reviews.map((review, index) => (
                                                <div key={index} className="flex flex-col gap-2 border rounded-xl px-4 py-3 border-gray-200">
                                                    <div className="flex gap-3">
                                                        <CircleUser size={30} />
                                                        <h2>{review.customer}</h2>
                                                    </div>
                                                    <div className="flex gap-5">
                                                        <div className="rating">
                                                            <div className="mask mask-star-2 bg-primary" aria-label="1 star" aria-current={review.rating === 1} />
                                                            <div className="mask mask-star-2 bg-primary" aria-label="2 star" aria-current={review.rating === 2} />
                                                            <div className="mask mask-star-2 bg-primary" aria-label="3 star" aria-current={review.rating === 3} />
                                                            <div className="mask mask-star-2 bg-primary" aria-label="4 star" aria-current={review.rating === 4} />
                                                            <div className="mask mask-star-2 bg-primary" aria-label="5 star" aria-current={review.rating === 5} />
                                                        </div>
                                                        <h3>{review.title}</h3>
                                                    </div>
                                                    <p className="text-justify text-lg">{review.comment}</p>
                                                    <p className="text-gray-500">Publicado el {formatDate(review.created_at, "es-MX")}</p>
                                                </div>
                                            ))}
                                            {reviews && reviews.totalPages > 1 && (
                                                <div className="mt-5">
                                                    <PaginationComponent currentPage={reviewPage} onPageChange={handleReviewPageChange} totalPages={reviews && reviews.totalPages} />
                                                </div>
                                            )}
                                        </div>

                                        {!reviewsLoading && !reviewsError && reviews && reviews.reviews.length === 0 && (
                                            <div className="border rounded-xl px-4 py-3 border-gray-200">
                                                <h2>No hay reseñas para este producto</h2>
                                                <h4 className="font-normal underline">Se el primero en dejar tu opinión 😊</h4>
                                            </div>
                                        )}



                                    </div>
                                    {isAuth && !data?.isReviewed && (
                                        <div className={clsx(
                                            "mt-5 rounded-xl p-5",
                                            theme === "ligth" ? "bg-gray-100" : "bg-gray-700"
                                        )}><h2>Agrega tu reseña</h2>
                                            <h4>Nos gustaria saber tu opinión sobre este producto⭐</h4>
                                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-5">
                                                <div className="flex flex-col">
                                                    <label htmlFor="review-rating">Calificación</label>
                                                    <div className="rating" >
                                                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-primary" aria-label="1 star" onChange={() => handleSelectRating(1)} checked={selectedRating === 1} />
                                                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-primary" aria-label="2 star" onChange={() => handleSelectRating(2)} checked={selectedRating === 2} />
                                                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-primary" aria-label="3 star" onChange={() => handleSelectRating(3)} checked={selectedRating === 3} />
                                                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-primary" aria-label="4 star" onChange={() => handleSelectRating(4)} checked={selectedRating === 4} />
                                                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-primary" aria-label="5 star" onChange={() => handleSelectRating(5)} checked={selectedRating === 5} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex flex-col">
                                                        <label htmlFor="review-title">Titulo</label>
                                                        <input
                                                            {...register("title", {
                                                                required: "El titulo es requerido",
                                                                maxLength: {
                                                                    value: 50,
                                                                    message: "El titulo debe tener menos de 100 caracteres"
                                                                }
                                                            })}
                                                            name="title"
                                                            id="title"
                                                            type="text"
                                                            className="input input-bordered w-full"
                                                            placeholder="Agrega un titulo a la reseña"
                                                        />
                                                        <div className={clsx(
                                                            "w-full flex items-center gap-2",
                                                            errors.title ? "justify-between" : "justify-end",
                                                        )}>
                                                            {errors.title && <p className="text-error">{errors.title.message}</p>}
                                                            <p className={clsx(
                                                                "w-fit text-right mt-1",
                                                                reviewTitle && reviewTitle.length > 50 && "text-error"
                                                            )}>{reviewTitle.length}/50</p>
                                                        </div>

                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label htmlFor="review-comment">Comentario</label>
                                                        <textarea
                                                            {...register("comment", {
                                                                required: "El comentario es requerido",
                                                                maxLength: {
                                                                    value: 200,
                                                                    message: "El comentario debe tener menos de 200 caracteres"
                                                                }
                                                            })}
                                                            name="comment"
                                                            id="comment"
                                                            className="textarea textarea-bordered w-full"
                                                            placeholder="Agrega un comentario"
                                                        />
                                                        <div className={clsx(
                                                            "w-full flex items-center gap-2",
                                                            errors.comment ? "justify-between" : "justify-end",
                                                        )}>
                                                            {errors.comment && <p className="text-error">{errors.comment.message}</p>}
                                                            <p className={clsx(
                                                                "w-fit text-right mt-1",
                                                                reviewComment && reviewComment.length > 200 && "text-error"
                                                            )}>{reviewComment.length}/200</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button type="submit" className="w-fit btn btn-primary">Agregar reseña</button>
                                            </form>
                                        </div>
                                    )}
                                    {!isAuth && (
                                        <div className={clsx(
                                            "mt-5 rounded-xl p-5", theme === "ligth" ? "bg-gray-100" : "bg-gray-500")}>
                                            <h2>Inicia sesión para agregar tu reseña ⭐</h2>
                                            <p>No tienes cuenta? <Link to="/nueva-cuenta" className="underline text-primary">Registrate para agregar tu reseña</Link></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full">
                <p className="text-3xl font-bold">Productos que quiza te puedan interesar</p>
                {adsLoading && !adsError && !ads && (
                    <div className="flex gap-5">
                        <ProductVersionCardSkeleton />
                        <ProductVersionCardSkeleton />
                        <ProductVersionCardSkeleton />
                        <ProductVersionCardSkeleton />
                        <ProductVersionCardSkeleton />
                    </div>
                )}

                {!adsLoading && !adsError && ads && (
                    <OverflowXComponent className="mt-5 gap-20" >
                        {ads && ads.map((data, index) => (
                            <ProductVersionCardShop key={`${index}-${data.product_version.sku}`} versionData={data} className="flex-shrink-0" />
                        ))}
                    </OverflowXComponent>
                )}

            </div>
        </div>
    );
};

export default ProductDetail;