import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { containsOffensiveLanguage, formatDate, formatPrice, makeSlug, ProductDetailToProductCardFormat } from "../Helpers";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import clsx from "clsx";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import { useFavorite } from "../hooks/useProductFavorites";
import ProductVersionCard from "../components/ProductVersionCard";
import type { AddPVReviewType, ProductVersionCardType } from "../ProductTypes";
import { useShoppingCart } from "../../shopping/hooks/useShoppingCart";
import { FaCircleUser, FaFire, FaBoxOpen, FaTruck } from "react-icons/fa6";
import { useAuthStore } from "../../auth/states/authStore";
import { IoShareSocialOutline } from "react-icons/io5";
import ProductVersionCardSkeleton from "../components/ProductVersionCardSkeleton";
import { useAddPVReview, useFetchProductVersionDetail, useFetchProductVersionReviews, useFetchProductVersionReviewsResumeByUUID } from "../hooks/useProductDetail";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useForm } from "react-hook-form";
import PaginationComponent from "../../../global/components/PaginationComponent";
import { OverflowXComponent } from "../../home/components/OverflowXComponent";
import ImageZoomViewer from "../components/ImageZoomViewer";
import ProductVersionImageGallery from "../components/ProductVersionImageGallery";
import { showModal } from "../../../global/GlobalHelpers";
import { useFetchProductVersionCards } from "../hooks/useFetchProductVersionCards";

// ── Helpers de descuento reutilizables ──────────────────────────────────────
const discountColorBg = (discount?: number | null) => {
    if (!discount) return "";
    if (discount < 50) return "bg-error";
    if (discount < 65) return "bg-success";
    return "bg-primary";
};
const discountColorText = (discount?: number | null) => {
    if (!discount) return "text-base-content";
    if (discount < 50) return "text-error";
    if (discount < 65) return "text-success";
    return "text-primary";
};
const discountLabel = (discount?: number | null) => {
    if (!discount) return "";
    if (discount < 50) return "Oferta";
    if (discount < 65) return "Oferta Especial";
    return "Oferta Irresistible";
};

// ── Subcomponente: tarjeta de compra ────────────────────────────────────────
interface PurchaseCardProps {
    unitPrice: string;
    shippingCost: number;
    boxesQty: number;
    stock: number;
    productQty: number;
    selectProductQty: string;
    stockError: string;
    isFavorite: boolean;
    onQtySelect: (v: string) => void;
    onQtySet: (v: string) => void;
    onQtyLimit: (v: string) => void;
    onAddCart: () => void;
    onBuyNow: () => void;
    onToggleFavorite: (e: React.MouseEvent) => void;
    onShare: () => void;
    maxStock: number;
}

const PurchaseCard = ({
    unitPrice, shippingCost, boxesQty, stock, productQty,
    selectProductQty, stockError, isFavorite,
    onQtySelect, onQtySet, onQtyLimit,
    onAddCart, onBuyNow, onToggleFavorite, onShare, maxStock
}: PurchaseCardProps) => (
    <div className="w-full rounded-2xl border border-base-300 bg-base-100 shadow-xl p-4 xl:p-5 flex flex-col gap-4">

        {/* Precio */}
        <div className="pb-3 border-b border-base-300">
            <p className="text-xs text-base-content/50 uppercase mb-1">Precio unitario</p>
            <h1 className="text-2xl xl:text-3xl font-extrabold text-base-content">${unitPrice}</h1>
        </div>

        {/* Envío */}
        <div className="pb-3 border-b border-base-300 tooltip tooltip-bottom" data-tip="Cada caja tiene capacidad para 10 unidades">
            <p className="text-xs text-base-content/50 uppercase mb-1 flex items-center gap-1.5">
                <FaTruck className="text-primary" /> Costo de envío
            </p>
            <p className="text-sm xl:text-base font-semibold text-base-content">
                ${formatPrice(shippingCost.toString(), "es-MX")} MXN
                <span className="text-base-content/50 font-normal ml-1">({boxesQty} caja{boxesQty > 1 ? "s" : ""})</span>
            </p>
        </div>

        {/* Cantidad */}
        <div className="flex flex-col gap-2">
            <p className="text-xs text-base-content/50 uppercase flex items-center gap-1.5">
                <FaBoxOpen className="text-primary" /> Cantidad
            </p>
            <select
                className="select select-bordered select-sm xl:select-md w-full"
                onChange={(e) => { onQtySelect(e.target.value); onQtySet(e.target.value); }}
            >
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                <option value="more">Más de 5</option>
            </select>
            {selectProductQty === "more" && (
                <div className="flex flex-col gap-1">
                    <input
                        type="number"
                        placeholder={`Máx. ${maxStock} piezas`}
                        className="input input-bordered input-sm xl:input-md w-full"
                        onChange={(e) => { onQtyLimit(e.target.value); onQtySet(e.target.value); }}
                    />
                    {stockError && <p className="text-error text-xs">{stockError}</p>}
                </div>
            )}
            <p className="text-xs text-base-content/40">{stock} unidades disponibles</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2 pt-1">
            <button
                type="button"
                className="w-full btn btn-primary btn-sm xl:btn-md font-semibold"
                onClick={onAddCart}
                disabled={productQty > maxStock}
            >
                Agregar al carrito
            </button>
            <button
                type="button"
                className="w-full btn btn-sm xl:btn-md bg-blue-950 hover:bg-blue-800 text-white font-semibold border-0"
                onClick={onBuyNow}
            >
                Comprar ahora
            </button>
        </div>

        <div className="divider my-0" />

        {/* Acciones secundarias */}
        <div className="flex items-center justify-around">
            <button
                type="button"
                className="flex flex-col items-center gap-1 text-primary text-xs font-medium hover:opacity-70 transition-opacity active:scale-95"
                onClick={onToggleFavorite}
            >
                {isFavorite
                    ? <IoMdHeart className="text-2xl" />
                    : <IoIosHeartEmpty className="text-2xl" />}
                <span>{isFavorite ? "Guardado" : "Favorito"}</span>
            </button>
            <div className="w-px h-8 bg-base-300" />
            <button
                type="button"
                className="flex flex-col items-center gap-1 text-base-content/60 text-xs font-medium hover:text-base-content transition-colors active:scale-95"
                onClick={onShare}
            >
                <IoShareSocialOutline className="text-2xl" />
                <span>Compartir</span>
            </button>
        </div>

        <Link
            to="/politica-de-devolucion"
            className="text-center text-xs text-primary underline underline-offset-2 hover:opacity-70"
        >
            Política de devolución PNC
        </Link>
    </div>
);

// ── Componente principal ─────────────────────────────────────────────────────
const ProductDetail = () => {
    const SHIPPING_COST = 264.00;
    const params = useParams();

    const { data, isLoading, error, refetch } = useFetchProductVersionDetail(params?.sku);
    const { data: ads, isLoading: adsLoading, error: adsError } = useFetchProductVersionCards({ limit: 10, random: true, });
    const { data: reviews, isLoading: reviewsLoading } = useFetchProductVersionReviews({ uuid: data?.product.uuid! });
    const { data: reviewsResume, isLoading: reviewsResumeLoading } = useFetchProductVersionReviewsResumeByUUID({ uuid: data?.product.uuid! });

    const { isAuth } = useAuthStore();
    const { add, addBuyNow } = useShoppingCart();
    const { showTriggerAlert } = useTriggerAlert();

    const [selectProductQty, setSelectProductQty] = useState("1");
    const [productQty, setProductQty] = useState(1);
    const [stockError, setStockError] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [unitPriceWithDiscount, setUnitPriceWithDiscount] = useState<string[]>([]);
    const [image, setImage] = useState<string | undefined>(NotFoundSVG);
    const [color, setColor] = useState("");
    const [stock, setStock] = useState(1);
    const [certifications, setCertifications] = useState<string[]>([]);
    const [card, setCard] = useState<ProductVersionCardType | undefined>(undefined);
    const [shippingCost, setShippingCost] = useState(SHIPPING_COST);
    const [boxesQty, setBoxesQty] = useState(1);
    const [selectedRating, setSelectedRating] = useState(1);
    const [reviewPage, setReviewPage] = useState(1);

    const imageGalleryModal = useRef<HTMLDialogElement>(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue, setError, reset } = useForm<AddPVReviewType>({
        defaultValues: { rating: 1, title: "", comment: "" }
    });
    const reviewTitle = watch("title");
    const reviewComment = watch("comment");
    const addReview = useAddPVReview();

    const { isFavorite, toggleFavorite } = useFavorite({
        sku: data?.product_version.sku ?? "",
        initialFavoriteState: data?.isFavorite ?? false,
        item: card,
    });

    useEffect(() => {
        if (!data) return;
        document.title = `Iga Productos | ${data.product.product_name}`;
        const mainImage = data.product_images.find(img => img.main_image)?.image_url;
        setImage(mainImage);
        if (data.isOffer && data.discount) {
            const price = parseFloat(data.product_version.unit_price);
            const discountAmount = (data.discount * price) / 100;
            setUnitPriceWithDiscount(formatPrice((price - discountAmount).toString(), "es-MX").split("."));
        }
        setUnitPrice(formatPrice(data.product_version.unit_price, "es-MX"));
        setColor(data.product_version.color_code);
        setStock(data.product_version.stock);
        setCertifications(data.product.certifications_desc.split(","));
        setCard(ProductDetailToProductCardFormat(data));
        setValue("sku", data.product_version.sku);
    }, [data, setValue]);

    useEffect(() => {
        const boxes = Math.ceil(productQty / 10);
        setBoxesQty(boxes);
        setShippingCost(boxes * SHIPPING_COST);
    }, [productQty]);

    const handleSelectProductQty = (input: string) => {
        setSelectProductQty(input);
        if (input !== "more") setStockError("");
    };
    const handleQtyLimit = (input: string) => {
        if (parseInt(input) > stock) setStockError(`Máximo ${stock} piezas disponibles`);
        else setStockError("");
    };
    const handleSetProductQty = (input: string) => {
        if (input.length === 0) { setStockError(""); return; }
        if (input === "more") return;
        if (/^[0-9]+$/.test(input) && parseInt(input) > 0) setProductQty(parseInt(input));
        else setStockError("Ingresa un número entero positivo");
    };
    const handleShareProduct = () => {
        if (!data) return;
        navigator.clipboard.writeText(window.location.href);
        showTriggerAlert("Successfull", "Copiado al portapapeles");
    };
    const handleSelectRating = (input: number) => {
        if (input > 5) return;
        setSelectedRating(input);
        setValue("rating", input);
    };
    const onSubmit = async (formData: AddPVReviewType) => {
        if (containsOffensiveLanguage(formData.title)) {
            setError("title", { type: "manual", message: "No se permite lenguaje ofensivo" });
            return;
        }
        if (containsOffensiveLanguage(formData.comment)) {
            setError("comment", { type: "manual", message: "No se permite lenguaje ofensivo" });
            return;
        }
        const response = await addReview.mutateAsync({ data: formData });
        if (response) { showTriggerAlert("Successfull", response); reset(); }
    };

    const purchaseCardProps: PurchaseCardProps = {
        unitPrice, shippingCost, boxesQty, stock,
        productQty, selectProductQty, stockError, isFavorite: isFavorite!,
        onQtySelect: handleSelectProductQty,
        onQtySet: handleSetProductQty,
        onQtyLimit: handleQtyLimit,
        onAddCart: () => card && add(card, productQty),
        onBuyNow: () => card && addBuyNow({ sku: data?.product_version.sku!, quantity: productQty }),
        onToggleFavorite: toggleFavorite,
        onShare: handleShareProduct,
        maxStock: data?.product_version.stock ?? 1,
    };

    if (isLoading) return <ProductDetailSkeleton />;
    if (error) return (
        <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-2xl font-bold text-error text-center">Error al cargar el producto, inténtalo más tarde.</p>
            <button type="button" className="btn btn-primary" onClick={() => refetch()}>Reintentar</button>
        </div>
    );
    if (!data) return <Navigate to="/tienda" />;

    return (
        <div className="w-full">
            <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 md:py-8 lg:py-10 rounded-2xl bg-base-200">

                {/* ══ SECCIÓN PRINCIPAL ══════════════════════════════════════════ */}
                <div className="w-full flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 pb-8 border-b border-base-300">

                    {/* ── Galería de imágenes ── */}
                    <div className="w-full lg:w-[35%] xl:w-[33%] 2xl:w-[30%]">
                        <div className="lg:sticky lg:top-30 flex flex-col gap-3">
                            <div className="relative w-full">
                                {data.isOffer && (
                                    <div className={clsx(
                                        "absolute top-3 left-3 sm:top-4 sm:left-4 z-10",
                                        "px-2 sm:px-3 py-1 sm:py-2 rounded-xl flex gap-1.5 items-center border border-white/30",
                                        discountColorBg(data.discount)
                                    )}>
                                        <FaFire className="text-base sm:text-lg text-white" />
                                        <p className="text-xs sm:text-sm font-bold text-white">{discountLabel(data.discount)}</p>
                                    </div>
                                )}
                                <ImageZoomViewer
                                    image_url={image!}
                                    alt={data.product.product_name}
                                    onClick={() => showModal(imageGalleryModal.current)}
                                />
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-2 flex-wrap">
                                {data.product_images.map((img, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setImage(img.image_url)}
                                        className={clsx(
                                            "w-14 h-14 sm:w-16 sm:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24",
                                            "flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105",
                                            img.image_url === image
                                                ? "border-primary shadow-md shadow-primary/20"
                                                : "border-base-300 hover:border-primary/50"
                                        )}
                                    >
                                        <img
                                            className="w-full h-full object-cover"
                                            src={img.image_url}
                                            alt={`${data.product.product_name} imagen ${index + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Información del producto ── */}
                    <div className="w-full lg:w-[45%] xl:w-[47%] 2xl:w-[50%] flex flex-col gap-4 lg:px-4 xl:px-6">

                        {/* Nombre y categorías */}
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-extrabold leading-tight text-base-content">
                                {data.product.product_name}
                            </h1>
                            <div className="breadcrumbs text-sm sm:text-base text-base-content/50 mt-1">
                                <ul>
                                    {data.subcategories.map((sub, i) => <li key={`${i}-${sub}`}>{sub}</li>)}
                                </ul>
                            </div>
                            <span className={clsx(
                                "inline-block mt-1 text-sm sm:text-base font-semibold px-3 py-0.5 rounded-full",
                                "bg-primary/10 text-primary"
                            )}>
                                {data.product_version.status}
                            </span>
                        </div>

                        {/* Precio */}
                        <div className="rounded-xl bg-base-100 border border-base-300 p-4">
                            {data.isOffer ? (
                                <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                                    <div className="flex items-center gap-3">
                                        <span className={clsx(
                                            "text-white font-extrabold text-2xl sm:text-3xl px-3 py-2 rounded-xl",
                                            discountColorBg(data.discount)
                                        )}>
                                            -{data.discount}%
                                        </span>
                                        <div>
                                            <p className="text-xs text-base-content/50 mb-0.5">Precio en oferta</p>
                                            <p className={clsx(
                                                "text-2xl sm:text-3xl font-extrabold",
                                                discountColorText(data.discount)
                                            )}>
                                                ${unitPriceWithDiscount[0]}.{unitPriceWithDiscount[1]}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-base-content/40">
                                        <p className="text-xs">Precio anterior</p>
                                        <p className="line-through text-sm sm:text-base">${unitPrice}</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-xs text-base-content/50 mb-0.5">Precio unitario</p>
                                    <p className="text-2xl sm:text-3xl font-extrabold text-base-content">${unitPrice}</p>
                                </div>
                            )}
                        </div>

                        {/* Color y ficha técnica */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-y border-base-300">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-base-content/60">{data.product_version.color_line}:</span>
                                <span
                                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-base-100 shadow ring-2 ring-base-300 flex-shrink-0"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-sm sm:text-base font-semibold text-base-content">{data.product_version.color_name}</span>
                            </div>
                            <a
                                href={data.product_version.technical_sheet_url ?? "#"}
                                className="btn btn-outline btn-primary btn-xs sm:btn-sm shrink-0"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ver ficha técnica
                            </a>
                        </div>

                        {/* Otras presentaciones */}
                        {data.parent_versions && data.parent_versions.length > 0 && (
                            <div>
                                <h2 className="text-sm font-semibold text-base-content/50 uppercase mb-2">Otras presentaciones</h2>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    {data.parent_versions.map((version, index) => (
                                        <Link
                                            key={index}
                                            to={`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product.product_name)}/${version.sku.toLowerCase()}`}
                                            className={clsx(
                                                "w-16 sm:w-20 md:w-24 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:border-primary hover:scale-105 bg-base-100",
                                                version.sku.toLowerCase() === params.sku ? "border-primary shadow-md" : "border-base-300"
                                            )}
                                        >
                                            <img
                                                className="w-full aspect-square object-cover rounded-t-xl"
                                                src={version.product_images?.[0]?.image_url}
                                                alt={version.sku}
                                            />
                                            <div className="py-1 text-center">
                                                <p className="font-bold text-xs text-base-content">${formatPrice(version.unit_price, "es-MX")}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Purchase card móvil/tablet */}
                        <div className="lg:hidden">
                            <PurchaseCard {...purchaseCardProps} />
                        </div>

                        {/* Descripción */}
                        <div className="rounded-xl bg-base-100 border border-base-300 p-4">
                            <h2 className="text-xs font-semibold text-base-content/50 uppercase mb-2">Descripción</h2>
                            <p className="text-sm sm:text-base xl:text-xl leading-relaxed text-base-content/80 text-justify">
                                {data.product.description ?? "No hay una descripción por mostrar"}
                            </p>
                        </div>
                    </div>

                    {/* ── Purchase Card desktop ── */}
                    <div className="hidden lg:block w-full lg:w-[20%] xl:w-[20%] 2xl:w-[20%]">
                        <div className="sticky top-30">
                            <PurchaseCard {...purchaseCardProps} />
                        </div>
                    </div>
                </div>

                {/* ══ INFORMACIÓN ADICIONAL ═══════════════════════════════════════ */}
                <div className="w-full py-6 sm:py-8">
                    <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10">

                        {/* Tabs */}
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-base-content mb-3">Información adicional</h2>
                            <div className="tabs tabs-border [&_.tab-content]:rounded-xl [&_.tab-content]:text-justify">
                                {[
                                    { label: "Características", content: data.product.specs },
                                    { label: "Aplicaciones", content: data.product.applications },
                                    { label: "Recomendaciones", content: data.product.recommendations },
                                ].map(({ label, content }, i) => (
                                    <>
                                        <input
                                            key={`tab-${i}`}
                                            type="radio"
                                            name="product_tabs"
                                            className="tab text-xs sm:text-sm md:text-base text-base-content"
                                            aria-label={label}
                                            defaultChecked={i === 0}
                                        />
                                        <div className="tab-content border-base-300 bg-base-100 p-4 sm:p-6 text-sm sm:text-base leading-relaxed text-base-content/80">
                                            {content ?? `No hay ${label.toLowerCase()} por mostrar`}
                                        </div>
                                    </>
                                ))}
                            </div>
                        </div>

                        {/* Certificaciones */}
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-base-content mb-3">Cumplimientos normativos</h2>
                            <div className="rounded-xl bg-base-100 border border-base-300 p-4 sm:p-5 flex flex-col gap-2">
                                {certifications.map((cer, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm sm:text-base text-base-content/80">
                                        <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                                        <span>{cer}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ══ RESEÑAS ══════════════════════════════════════════════════ */}
                    <div className="mt-8 flex flex-col lg:flex-row gap-6">

                        {/* Resumen de calificaciones */}
                        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                            <h2 className="text-lg sm:text-xl font-bold text-base-content mb-3">Calificación general</h2>
                            <div className="rounded-xl bg-base-100 border border-base-300 p-4 sm:p-5">
                                {reviewsResumeLoading && (
                                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                                        Cargando <span className="loading loading-dots loading-xs text-primary" />
                                    </div>
                                )}
                                {reviewsResume && (
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <div className="rating rating-md rating-half pointer-events-none">
                                                <input type="radio" name="rating-display" className="rating-hidden" />
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => (
                                                    <input
                                                        key={i}
                                                        type="radio"
                                                        name="rating-display"
                                                        className={clsx(
                                                            "mask mask-star-2 bg-primary",
                                                            i % 2 === 0 ? "mask-half-1" : "mask-half-2"
                                                        )}
                                                        defaultChecked={
                                                            reviewsResume.ratingAverage > v * 10 - 10 &&
                                                            reviewsResume.ratingAverage <= v * 10
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-base-content/50 mt-1">
                                                Basado en {reviewsResume.totalReviews} {reviewsResume.totalReviews === 1 ? "opinión" : "opiniones"}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {reviewsResume.ratingResume.map((star, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <span className="text-xs text-base-content/50 w-14 whitespace-nowrap">
                                                        {star.rating} {star.rating === 1 ? "estrella" : "estrellas"}
                                                    </span>
                                                    <progress
                                                        className="progress progress-primary flex-1 h-2"
                                                        value={star.percentage}
                                                        max="100"
                                                    />
                                                    <span className="text-xs text-base-content/50 w-8 text-right">{star.percentage}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Opiniones y formulario */}
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-xl font-bold text-base-content mb-3">Opiniones de clientes</h2>
                            <div className="rounded-xl bg-base-100 border border-base-300 p-4 sm:p-5">

                                {reviewsLoading && (
                                    <p className="text-sm text-base-content/60">Cargando opiniones...</p>
                                )}

                                {reviews && reviews.reviews.length === 0 && (
                                    <div className="rounded-xl border border-base-300 p-4 text-center">
                                        <p className="text-base text-base-content">No hay reseñas para este producto</p>
                                        <p className="text-sm text-base-content/50 mt-1">Sé el primero en dejar tu opinión 😊</p>
                                    </div>
                                )}

                                {reviews && reviews.reviews.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        {reviews.reviews.map((review, i) => (
                                            <div key={i} className="rounded-xl border border-base-300 p-4 flex flex-col gap-2 hover:border-primary/30 transition-colors duration-200">
                                                <div className="flex items-center gap-2">
                                                    <FaCircleUser className="text-xl text-base-content/40 flex-shrink-0" />
                                                    <span className="text-sm font-semibold text-base-content">{review.customer}</span>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <div className="rating rating-xs">
                                                        {[1, 2, 3, 4, 5].map(v => (
                                                            <div
                                                                key={v}
                                                                className={clsx(
                                                                    "mask mask-star-2",
                                                                    v <= review.rating ? "bg-primary" : "bg-base-300"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-semibold text-base-content">{review.title}</span>
                                                </div>
                                                <p className="text-sm text-base-content/70 text-justify leading-relaxed">{review.comment}</p>
                                                <p className="text-xs text-base-content/40">Publicado el {formatDate(review.created_at, "es-MX")}</p>
                                            </div>
                                        ))}
                                        {reviews.totalPages > 1 && (
                                            <div className="mt-4">
                                                <PaginationComponent
                                                    currentPage={reviewPage}
                                                    onPageChange={setReviewPage}
                                                    totalPages={reviews.totalPages}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Formulario reseña */}
                                {isAuth && !data.isReviewed && (
                                    <div className="mt-6 rounded-xl bg-base-200 border border-base-300 p-4 sm:p-5">
                                        <h3 className="text-base font-bold text-base-content">Agrega tu reseña</h3>
                                        <p className="text-sm text-base-content/50 mb-4">¿Qué te pareció este producto? ⭐</p>
                                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-base-content/50 uppercase block mb-1">
                                                    Calificación
                                                </label>
                                                <div className="rating rating-md">
                                                    {[1, 2, 3, 4, 5].map(v => (
                                                        <input
                                                            key={v}
                                                            type="radio"
                                                            name="rating-2"
                                                            className="mask mask-star-2 bg-primary"
                                                            aria-label={`${v} star`}
                                                            onChange={() => handleSelectRating(v)}
                                                            checked={selectedRating === v}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-base-content/50 uppercase block mb-1">
                                                    Título
                                                </label>
                                                <input
                                                    {...register("title", {
                                                        required: "El título es requerido",
                                                        maxLength: { value: 50, message: "Máximo 50 caracteres" }
                                                    })}
                                                    type="text"
                                                    className="input input-bordered w-full input-sm sm:input-md"
                                                    placeholder="Resume tu experiencia"
                                                />
                                                <div className={clsx("flex mt-1 text-xs", errors.title ? "justify-between" : "justify-end")}>
                                                    {errors.title && <p className="text-error">{errors.title.message}</p>}
                                                    <p className={clsx(reviewTitle?.length > 50 && "text-error", "text-base-content/40")}>
                                                        {reviewTitle?.length ?? 0}/50
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-base-content/50 uppercase block mb-1">
                                                    Comentario
                                                </label>
                                                <textarea
                                                    {...register("comment", {
                                                        required: "El comentario es requerido",
                                                        maxLength: { value: 200, message: "Máximo 200 caracteres" }
                                                    })}
                                                    className="textarea textarea-bordered w-full textarea-sm sm:textarea-md"
                                                    placeholder="Cuéntanos más sobre el producto..."
                                                    rows={3}
                                                />
                                                <div className={clsx("flex mt-1 text-xs", errors.comment ? "justify-between" : "justify-end")}>
                                                    {errors.comment && <p className="text-error">{errors.comment.message}</p>}
                                                    <p className={clsx(reviewComment?.length > 200 && "text-error", "text-base-content/40")}>
                                                        {reviewComment?.length ?? 0}/200
                                                    </p>
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-primary btn-sm sm:btn-md w-fit">
                                                Publicar reseña
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {!isAuth && (
                                    <div className="mt-6 rounded-xl bg-base-200 border border-base-300 p-4 sm:p-5 text-center">
                                        <p className="text-base font-semibold text-base-content mb-1">Inicia sesión para dejar tu reseña ⭐</p>
                                        <p className="text-sm text-base-content/50">
                                            ¿No tienes cuenta?{" "}
                                            <Link to="/nueva-cuenta" className="text-primary underline underline-offset-2 hover:opacity-70">
                                                Regístrate aquí
                                            </Link>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ PRODUCTOS RELACIONADOS ════════════════════════════════════════ */}
            <div className="w-full mt-6 sm:mt-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content mb-4">
                    Productos que quizá te interesen
                </h2>
                {adsLoading && !adsError && !ads && (
                    <div className="flex gap-3 sm:gap-5 overflow-hidden">
                        {[...Array(5)].map((_, i) => <ProductVersionCardSkeleton key={i} />)}
                    </div>
                )}
                {!adsLoading && !adsError && ads && (
                    <OverflowXComponent className="mt-4 gap-10 sm:gap-14 md:gap-16 lg:gap-20">
                        {ads.data.map((item, i) => (
                            <ProductVersionCard
                                key={`${i}-${item.product_version.sku}`}
                                versionData={item}
                                className="flex-shrink-0 sm:w-56 sm:min-h-80 md:w-64 md:min-h-96 lg:w-72 lg:min-h-[26rem] xl:w-76 xl:min-h-[28rem] 2xl:w-80 2xl:min-h-[30rem]"
                            />
                        ))}
                    </OverflowXComponent>
                )}
            </div>

            {/* ══ MODAL GALERÍA ════════════════════════════════════════════════ */}
            {data && (
                <ProductVersionImageGallery
                    ref={imageGalleryModal}
                    currentImage={image!}
                    images={data.product_images.map(img => img.image_url)}
                    productData={{
                        productName: data.product.product_name,
                        subcategories: data.subcategories,
                        colorLine: data.product_version.color_line,
                        colorName: data.product_version.color_name,
                        colorCode: data.product_version.color_code,
                    }}
                />
            )}
        </div>
    );
};

export default ProductDetail;