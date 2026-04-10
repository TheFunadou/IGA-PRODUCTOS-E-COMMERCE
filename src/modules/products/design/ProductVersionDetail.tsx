import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
    containsOffensiveLanguage, formatDate, formatPrice,
    makeSlug, ProductDetailToProductCardFormat
} from "../Helpers";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import clsx from "clsx";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import { useFavorite } from "../hooks/useProductFavorites";
import ProductVersionCard from "../components/ProductVersionCard";
import type { AddPVReviewType, ProductVersionCardType } from "../ProductTypes";
import { useShoppingCart } from "../../shopping/hooks/useShoppingCart";
import {
    FaCircleUser, FaFire, FaBoxOpen, FaTruck,
    FaShieldHalved, FaClipboardCheck,
    FaBoxesPacking, FaTag, FaHeadset,
    FaCircleCheck, FaTriangleExclamation, FaArrowTrendUp,
    FaFileInvoiceDollar, FaWarehouse, FaEnvelope, FaPhone,
    FaStar
} from "react-icons/fa6";
import { useAuthStore } from "../../auth/states/authStore";
import { IoShareSocialOutline } from "react-icons/io5";
import ProductVersionCardSkeleton from "../components/ProductVersionCardSkeleton";
import {
    useAddPVReview, useFetchProductVersionDetail,
    useFetchProductVersionReviews, useFetchProductVersionReviewsResumeByUUID
} from "../hooks/useProductDetail";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useForm } from "react-hook-form";
import PaginationComponent from "../../../global/components/PaginationComponent";
import { OverflowXComponent } from "../../home/components/OverflowXComponent";
import ImageZoomViewer from "../components/ImageZoomViewer";
import ProductVersionImageGallery from "../components/ProductVersionImageGallery";
import { showModal } from "../../../global/GlobalHelpers";
import { useFetchProductVersionCards } from "../hooks/useFetchProductVersionCards";

// ── Helpers de descuento ──────────────────────────────────────────────────────
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

// ── StockIndicator ────────────────────────────────────────────────────────────
const StockIndicator = ({ stock }: { stock: number }) => {
    const level = stock > 100 ? "high" : stock > 20 ? "medium" : "low";
    return (
        <div className="flex items-center gap-2 mt-1.5">
            <span className={clsx(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold",
                level === "high" && "bg-success/15 text-success",
                level === "medium" && "bg-warning/15 text-warning",
                level === "low" && "bg-error/15 text-error",
            )}>
                <span className={clsx(
                    "w-1.5 h-1.5 rounded-full",
                    level === "high" && "bg-success",
                    level === "medium" && "bg-warning",
                    level === "low" && "bg-error animate-pulse",
                )} />
                {level === "high" && `En stock (${stock} uds.)`}
                {level === "medium" && `Stock limitado (${stock} uds.)`}
                {level === "low" && `¡Pocas unidades! (${stock} uds.)`}
            </span>
        </div>
    );
};

// ── WholesaleBadge ────────────────────────────────────────────────────────────
const WholesaleBadge = ({ qty, unitPrice }: { qty: number; unitPrice: string }) => {
    if (qty < 10) return null;
    const price = parseFloat(unitPrice.replace(/,/g, ""));
    const discount = qty >= 100 ? 0.08 : qty >= 50 ? 0.05 : qty >= 10 ? 0.03 : 0;
    if (discount === 0) return null;
    const saving = (price * qty * discount).toFixed(2);
    return (
        <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
            <FaArrowTrendUp className="text-primary flex-shrink-0" />
            <p className="text-xs text-primary font-semibold">
                Comprando {qty} uds. ahorras ~${saving} MXN ({(discount * 100).toFixed(0)}% vol.)
            </p>
        </div>
    );
};

// ── TrustBadges ───────────────────────────────────────────────────────────────
const TrustBadges = () => (
    <div className="grid grid-cols-2 gap-2">
        {[
            { icon: FaShieldHalved, label: "Garantía de calidad", sub: "Productos certificados" },
            { icon: FaTruck, label: "Envío rastreado", sub: "Entregas lo mas pronto posible" },
            { icon: FaFileInvoiceDollar, label: "Facturación", sub: "CFDI inmediato" },
            { icon: FaHeadset, label: "Soporte dedicado", sub: "Asesor disponible" },
        ].map(({ icon: Icon, label, sub }, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-base-200/60 border border-base-300/50">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="text-primary text-sm" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-base-content leading-tight">{label}</p>
                    <p className="text-xs text-base-content/50 leading-tight mt-0.5">{sub}</p>
                </div>
            </div>
        ))}
    </div>
);

// ── QuickSpecsTable ───────────────────────────────────────────────────────────
const QuickSpecsTable = ({ specs }: { specs: { label: string; value: string }[] }) => (
    <div className="rounded-xl border border-base-300 overflow-hidden">
        <div className="px-4 py-3 bg-base-200/60 border-b border-base-300">
            <p className="text-sm font-bold text-base-content flex items-center gap-2">
                <FaClipboardCheck className="text-primary" /> Especificaciones rápidas
            </p>
        </div>
        <div className="divide-y divide-base-300">
            {specs.map(({ label, value }, i) => (
                <div key={i} className="flex items-center px-4 py-2.5 hover:bg-base-200/40 transition-colors">
                    <span className="w-2/5 text-xs font-semibold text-base-content/50 uppercase tracking-wide">{label}</span>
                    <span className="w-3/5 text-sm text-base-content font-medium">{value}</span>
                </div>
            ))}
        </div>
    </div>
);

// ── PurchaseCard ──────────────────────────────────────────────────────────────
interface PurchaseCardProps {
    unitPrice: string;
    unitPriceWithDiscount: string[];
    isOffer: boolean;
    discount?: number | null;
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
    unitPrice, unitPriceWithDiscount, isOffer, discount,
    shippingCost, boxesQty, stock,
    productQty, selectProductQty, stockError, isFavorite,
    onQtySelect, onQtySet, onQtyLimit,
    onAddCart, onBuyNow, onToggleFavorite, onShare, maxStock
}: PurchaseCardProps) => (
    <div className="w-full rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-hidden">

        {/* Header precio */}
        <div className={clsx(
            "px-5 pt-5 pb-4 border-b border-base-300",
            isOffer && "bg-gradient-to-br from-primary/5 to-transparent"
        )}>
            {isOffer ? (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className={clsx(
                            "text-xs font-bold px-2 py-0.5 rounded-full text-white",
                            discountColorBg(discount)
                        )}>-{discount}%</span>
                        <span className="text-xs text-base-content/40 line-through">${unitPrice}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xs text-base-content/50 mb-0.5">$</span>
                        <span className={clsx("text-3xl font-black", discountColorText(discount))}>
                            {unitPriceWithDiscount[0]}
                        </span>
                        <span className={clsx("text-base font-bold self-start mt-1", discountColorText(discount))}>
                            .{unitPriceWithDiscount[1]}
                        </span>
                        <span className="text-xs text-base-content/50 ml-1">MXN / pza.</span>
                    </div>
                </div>
            ) : (
                <div className="flex items-baseline gap-1">
                    <span className="text-xs text-base-content/50">$</span>
                    <span className="text-3xl font-black text-base-content">{unitPrice}</span>
                    <span className="text-xs text-base-content/50 ml-1">MXN / pza.</span>
                </div>
            )}
            <StockIndicator stock={stock} />
        </div>

        <div className="p-4 flex flex-col gap-3">

            {/* Envío */}
            <div className="flex items-center justify-between py-2.5 px-3 bg-base-200/60 rounded-xl border border-base-300/50">
                <div className="flex items-center gap-2">
                    <FaTruck className="text-primary text-sm flex-shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-base-content">Envío estimado</p>
                        <p className="text-xs text-base-content/50">{boxesQty} caja{boxesQty > 1 ? "s" : ""} · 10 uds/caja</p>
                    </div>
                </div>
                <p className="text-sm font-bold text-base-content">
                    ${formatPrice(shippingCost.toString(), "es-MX")}
                </p>
            </div>

            {/* Cantidad */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wide flex items-center gap-1.5">
                    <FaBoxOpen className="text-primary" /> Cantidad
                </label>
                <select
                    className="select select-bordered select-sm w-full"
                    onChange={(e) => { onQtySelect(e.target.value); onQtySet(e.target.value); }}
                >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} pieza{n > 1 ? "s" : ""}</option>)}
                    <option value="more">Más de 5 piezas...</option>
                </select>
                {selectProductQty === "more" && (
                    <div className="flex flex-col gap-1">
                        <input
                            type="number"
                            placeholder={`Máx. ${maxStock} piezas`}
                            className="input input-bordered input-sm w-full"
                            onChange={(e) => { onQtyLimit(e.target.value); onQtySet(e.target.value); }}
                        />
                        {stockError && (
                            <p className="text-error text-xs flex items-center gap-1">
                                <FaTriangleExclamation />{stockError}
                            </p>
                        )}
                    </div>
                )}
                <WholesaleBadge qty={productQty} unitPrice={unitPrice} />
            </div>

            {/* Total estimado */}
            {productQty > 1 && (
                <div className="flex items-center justify-between px-3 py-2 bg-primary/5 rounded-lg">
                    <span className="text-xs text-primary/70">Total estimado ({productQty} pzas.)</span>
                    <span className="text-sm font-bold text-primary">
                        ${formatPrice((parseFloat(unitPrice.replace(/,/g, "")) * productQty).toString(), "es-MX")} MXN
                    </span>
                </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-2 mt-1">
                <button
                    type="button"
                    className="w-full btn btn-primary btn-sm font-bold tracking-wide"
                    onClick={onAddCart}
                    disabled={productQty > maxStock}
                >
                    <FaBoxesPacking /> Agregar al carrito
                </button>
                <button
                    type="button"
                    className="w-full btn btn-sm bg-blue-950 hover:bg-blue-900 text-white font-bold border-0 tracking-wide"
                    onClick={onBuyNow}
                >
                    Comprar ahora
                </button>

            </div>

            <div className="divider my-0 text-xs text-base-content/30">o</div>

            {/* Acciones secundarias */}
            <div className="flex items-center justify-around">
                <button
                    type="button"
                    className="flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity active:scale-95"
                    onClick={onToggleFavorite}
                >
                    {isFavorite
                        ? <IoMdHeart className="text-xl text-error" />
                        : <IoIosHeartEmpty className="text-xl text-base-content/60" />}
                    <span className={isFavorite ? "text-error" : "text-base-content/60"}>
                        {isFavorite ? "Guardado" : "Favorito"}
                    </span>
                </button>
                <div className="w-px h-8 bg-base-300" />
                <button
                    type="button"
                    className="flex flex-col items-center gap-1 text-base-content/60 text-xs font-medium hover:text-base-content transition-colors active:scale-95"
                    onClick={onShare}
                >
                    <IoShareSocialOutline className="text-xl" />
                    <span>Compartir</span>
                </button>
                <div className="w-px h-8 bg-base-300" />
                <Link
                    to="/politica-de-devolucion"
                    className="flex flex-col items-center gap-1 text-base-content/60 text-xs font-medium hover:text-primary transition-colors"
                >
                    <FaShieldHalved className="text-xl" />
                    <span>Garantía</span>
                </Link>
            </div>
        </div>
    </div>
);

// ── Componente principal ───────────────────────────────────────────────────────
const ProductVersionDetail = () => {
    const SHIPPING_COST = 264.00;
    const params = useParams();

    const { data, isLoading, error, refetch } = useFetchProductVersionDetail(params?.sku);
    const { data: ads, isLoading: adsLoading, error: adsError } = useFetchProductVersionCards({ limit: 10, random: true });
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
    const [activeTab, setActiveTab] = useState(0);

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

    const quickSpecs = data ? [
        { label: "SKU", value: data.product_version.sku },
        { label: "Color", value: data.product_version.color_name },
        { label: "Línea", value: data.product_version.color_line },
        { label: "Estado", value: data.product_version.status },
        { label: "Stock", value: `${data.product_version.stock} unidades` },
    ] : [];

    const purchaseCardProps: PurchaseCardProps = {
        unitPrice,
        unitPriceWithDiscount,
        isOffer: data?.isOffer ?? false,
        discount: data?.discount,
        shippingCost, boxesQty, stock,
        productQty, selectProductQty, stockError,
        isFavorite: isFavorite!,
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

    const tabs = [
        { label: "Características", content: data.product.specs },
        { label: "Aplicaciones", content: data.product.applications },
        { label: "Recomendaciones", content: data.product.recommendations },
    ];

    return (
        <div className="w-full">

            <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 rounded-2xl bg-base-200">
                <div className="breadcrumbs text-sm text-base-content/50">
                    <ul>
                        <li><Link to={"/tienda"}>Tienda</Link></li>
                        <li><Link to={`/tienda?category=${data.category}&page=1`}>{data.category}</Link></li>
                        {data.subcategories.map((subcategory, index) => (
                            <li key={index}><Link to={`/tienda?category=${data.category}&subcategory=${subcategory}&page=1`}>{subcategory}</Link></li>
                        ))}
                        <li>{data.product.product_name}</li>
                    </ul>
                </div>
                {/* ══ SECCIÓN PRINCIPAL ═══════════════════════════════════════ */}
                <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 pb-8 border-b border-base-300">

                    {/* ── Galería ── */}
                    <div className="w-full lg:w-[35%] xl:w-[32%]">
                        <div className="lg:sticky lg:top-30 flex flex-col gap-3">
                            <div className="relative w-full">
                                {data.isOffer && (
                                    <div className={clsx(
                                        "absolute top-3 left-3 z-10 px-3 py-1.5 rounded-xl flex gap-1.5 items-center",
                                        discountColorBg(data.discount)
                                    )}>
                                        <FaFire className="text-white text-sm" />
                                        <p className="text-xs font-bold text-white">{discountLabel(data.discount)} -{data.discount}%</p>
                                    </div>
                                )}
                                <ImageZoomViewer
                                    image_url={image!}
                                    alt={data.product.product_name}
                                    onClick={() => showModal(imageGalleryModal.current)}
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {data.product_images.map((img, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setImage(img.image_url)}
                                        className={clsx(
                                            "w-14 h-14 sm:w-16 sm:h-16 xl:w-20 xl:h-20",
                                            "flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105",
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

                    {/* ── Info del producto ── */}
                    <div className="w-full lg:w-[42%] xl:w-[45%] flex flex-col gap-4">

                        {/* Nombre, estado y rating */}
                        <div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="text-xs text-base-content/40 font-mono bg-base-300/60 px-2 py-0.5 rounded">
                                    SKU: {data.product_version.sku}
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                    <FaCircleCheck className="text-xs" /> {data.product_version.status}
                                </span>
                                {data.isOffer && (
                                    <span className={clsx(
                                        "inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full text-white",
                                        discountColorBg(data.discount)
                                    )}>
                                        <FaTag /> {discountLabel(data.discount)}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight text-base-content">
                                {data.product.product_name}
                            </h1>

                            {reviewsResume && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="rating rating-sm rating-half pointer-events-none">
                                        <input type="radio" name="rating-header" className="rating-hidden" />
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => (
                                            <input key={i} type="radio" name="rating-header"
                                                className={clsx("mask mask-star-2 bg-primary", i % 2 === 0 ? "mask-half-1" : "mask-half-2")}
                                                defaultChecked={reviewsResume.ratingAverage > v * 10 - 10 && reviewsResume.ratingAverage <= v * 10}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-primary underline underline-offset-2 cursor-pointer hover:opacity-70">
                                        {reviewsResume.totalReviews} {reviewsResume.totalReviews === 1 ? "opinión" : "opiniones"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Precio */}
                        <div className={clsx(
                            "rounded-2xl p-4 border",
                            data.isOffer ? "bg-gradient-to-br from-primary/5 to-base-100 border-primary/20" : "bg-base-100 border-base-300"
                        )}>
                            {data.isOffer ? (
                                <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "text-white font-extrabold text-xl px-3 py-2 rounded-xl flex items-center gap-1.5",
                                            discountColorBg(data.discount)
                                        )}>
                                            <FaFire />
                                            -{data.discount}%
                                        </div>
                                        <div>
                                            <p className="text-xs text-base-content/50 mb-0.5">Precio en oferta / pieza</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className={clsx("text-3xl font-black", discountColorText(data.discount))}>
                                                    ${unitPriceWithDiscount[0]}.{unitPriceWithDiscount[1]}
                                                </span>
                                                <span className="text-sm text-base-content/50">MXN</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-base-content/40">
                                        <p className="text-xs">Antes</p>
                                        <p className="line-through text-base">${unitPrice} MXN</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-xs text-base-content/50 mb-0.5">Precio unitario</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-base-content">${unitPrice}</span>
                                        <span className="text-sm text-base-content/50">MXN / pieza</span>
                                    </div>
                                </div>
                            )}
                            <StockIndicator stock={stock} />
                        </div>

                        {/* Purchase card móvil */}
                        <div className="lg:hidden">
                            <PurchaseCard {...purchaseCardProps} />
                        </div>

                        {/* Color y presentaciones */}
                        <div className="rounded-2xl bg-base-100 border border-base-300 p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <span className="text-sm font-semibold text-base-content/50">{data.product_version.color_line}:</span>
                                    <span
                                        className="w-6 h-6 rounded-full border-2 border-base-100 shadow ring-2 ring-base-300"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-sm font-bold text-base-content">{data.product_version.color_name}</span>
                                </div>
                                <a
                                    href={data.product_version.technical_sheet_url ?? "#"}
                                    className="btn btn-outline btn-primary btn-xs font-semibold"
                                    target="_blank" rel="noopener noreferrer"
                                >
                                    <FaClipboardCheck /> Ficha técnica
                                </a>
                            </div>

                            {data.parent_versions && data.parent_versions.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-2">Otras presentaciones</p>
                                    <div className="flex flex-wrap gap-2">
                                        {data.parent_versions.map((version, index) => (
                                            <Link
                                                key={index}
                                                to={`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product.product_name)}/${version.sku.toLowerCase()}`}
                                                className={clsx(
                                                    "w-16 sm:w-20 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:border-primary hover:scale-105 bg-base-100",
                                                    version.sku.toLowerCase() === params.sku ? "border-primary shadow-md" : "border-base-300"
                                                )}
                                            >
                                                <img className="w-full aspect-square object-cover" src={version.product_images?.[0]?.image_url} alt={version.sku} />
                                                <div className="py-1 text-center">
                                                    <p className="font-bold text-xs text-base-content">${formatPrice(version.unit_price, "es-MX")}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Specs rápidas */}
                        <QuickSpecsTable specs={quickSpecs} />

                        {/* Trust badges */}
                        <TrustBadges />

                        {/* Descripción */}
                        <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                            <h2 className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-2">Descripción del producto</h2>
                            <p className="text-sm sm:text-base leading-relaxed text-base-content/80 text-justify">
                                {data.product.description ?? "No hay una descripción por mostrar"}
                            </p>
                        </div>
                    </div>

                    {/* ── Purchase Card desktop ── */}
                    <div className="hidden lg:block w-full lg:w-[23%] xl:w-[23%]">
                        <div className="sticky top-30 flex flex-col gap-4">
                            <PurchaseCard {...purchaseCardProps} />

                            {/* Pedido especial — color primary, texto actualizado */}
                            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <FaWarehouse className="text-primary text-lg" />
                                    <p className="text-sm font-bold text-base-content">¿Necesitas hacer un pedido especial?</p>
                                </div>
                                <p className="text-xs text-base-content/60">
                                    Volúmenes mayores a {stock} piezas, entregas programadas o pedidos recurrentes.
                                </p>
                                <a
                                    href={`https://wa.me/529211963246/?text=Hola, me gustaría solicitar una cotización para el producto ${data.product.product_name} con SKU ${data.product_version.sku}`}
                                    target="_blank"
                                    rel="noopener noreferrer"

                                >
                                    <button type="button" className="btn btn-primary btn-sm btn-outline font-semibold w-full">
                                        Solicitar cotización
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══ INFORMACIÓN TÉCNICA + NORMATIVOS ════════════════════════ */}
                <div className="w-full py-8">
                    <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10">

                        {/* Tabs técnicos */}
                        <div className="w-full lg:w-3/5">
                            <h2 className="text-xl md:text-2xl font-bold text-base-content mb-4">Información técnica</h2>
                            <div className="flex gap-1 bg-base-300/40 p-1 rounded-xl mb-4 overflow-x-auto">
                                {tabs.map(({ label }, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setActiveTab(i)}
                                        className={clsx(
                                            "flex-1 min-w-max px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                                            activeTab === i
                                                ? "bg-base-100 text-primary shadow-sm border border-base-300"
                                                : "text-base-content/50 hover:text-base-content"
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <div className="rounded-2xl bg-base-100 border border-base-300 p-5 text-sm leading-relaxed text-base-content/80 text-justify min-h-32">
                                {tabs[activeTab].content ?? `No hay ${tabs[activeTab].label.toLowerCase()} por mostrar`}
                            </div>
                        </div>

                        {/* Cumplimientos normativos */}
                        <div className="w-full lg:w-2/5">
                            <h2 className="text-xl md:text-2xl font-bold text-base-content mb-4">Cumplimientos normativos</h2>
                            <div className="rounded-2xl bg-base-100 border border-base-300 p-4 flex flex-col gap-2.5">
                                {certifications.map((cer, i) => (
                                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-base-200/50 transition-colors">
                                        <FaCircleCheck className="text-success flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-base-content/80">{cer}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ══ FAQ + CONTACTO — sección propia, debajo de técnica ══ */}
                    <div className="mt-8 rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                        <div className="px-5 py-4 bg-base-200/60 border-b border-base-300 flex items-center gap-2">
                            <FaHeadset className="text-primary" />
                            <p className="text-base font-bold text-base-content">Preguntas frecuentes y contacto</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-base-300">

                            {/* FAQ */}
                            <div className="flex flex-col divide-y divide-base-300">
                                {[
                                    {
                                        q: "¿Se puede facturar a empresa?",
                                        a: "Sí, emitimos CFDI de forma inmediata con cualquier RFC válido."
                                    },
                                    {
                                        q: "¿Hay precio por volumen?",
                                        a: "Sí. Desde 10 piezas aplican descuentos progresivos dependiendo del cliente y del producto."
                                    },
                                    {
                                        q: "¿Cuál es el tiempo de entrega?",
                                        a: "Lo más pronto posible según la logística del proveedor de envío. Generalmente 3-5 días hábiles."
                                    },
                                    {
                                        q: "¿Puedo hacer pedidos recurrentes?",
                                        a: "Sí, contáctanos para configurar un esquema de pedido periódico con condiciones especiales."
                                    },
                                ].map(({ q, a }, i) => (
                                    <div key={i} className="px-5 py-3.5">
                                        <p className="text-sm font-semibold text-base-content">{q}</p>
                                        <p className="text-xs text-base-content/60 mt-0.5 leading-relaxed">{a}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Contacto */}
                            <div className="flex flex-col gap-4 px-5 py-5 justify-center">
                                <p className="text-sm font-bold text-base-content">¿Tienes más dudas?</p>
                                <p className="text-xs text-base-content/60 leading-relaxed">
                                    Nuestro equipo está disponible para ayudarte, ya sea que estés comprando una pieza o cientos de ellas.
                                </p>
                                <div className="flex flex-col gap-2">
                                    <a
                                        href="mailto:atencionaclientes@igaproductos.com"
                                        className="flex items-center gap-2.5 text-sm font-semibold text-primary hover:opacity-70 transition-opacity"
                                    >
                                        <FaEnvelope className="flex-shrink-0" />
                                        atencionaclientes@igaproductos.com
                                    </a>
                                    <a
                                        href="https://wa.me/529211963246"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2.5 text-sm font-semibold text-success hover:opacity-70 transition-opacity"
                                    >
                                        <FaPhone className="flex-shrink-0" />
                                        WhatsApp / Teléfono
                                    </a>
                                </div>
                                <a
                                    href={`https://wa.me/529211963246/?text=Buen dia, quisiera información sobre el producto ${data.product.product_name} con SKU ${data.product_version.sku}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <button type="button" className="btn btn-primary btn-sm font-semibold w-fit">
                                        <FaHeadset /> Hablar con un asesor
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ══ RESEÑAS ══════════════════════════════════════════════ */}
                    <div className="mt-10">
                        <h2 className="text-xl md:text-2xl font-bold text-base-content mb-6">Opiniones de clientes</h2>
                        <div className="flex flex-col lg:flex-row gap-6">

                            {/* Resumen */}
                            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                                <div className="rounded-2xl bg-base-100 border border-base-300 p-5 flex flex-col gap-4">
                                    {reviewsResumeLoading && (
                                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                                            Cargando <span className="loading loading-dots loading-xs text-primary" />
                                        </div>
                                    )}
                                    {reviewsResume && (
                                        <>
                                            <div className="text-center">
                                                <p className="text-5xl font-black text-base-content">
                                                    {(reviewsResume.ratingAverage / 10).toFixed(1)}
                                                </p>
                                                <div className="rating rating-sm rating-half pointer-events-none justify-center mt-1">
                                                    <input type="radio" name="rating-summary" className="rating-hidden" />
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => (
                                                        <input key={i} type="radio" name="rating-summary"
                                                            className={clsx("mask mask-star-2 bg-primary", i % 2 === 0 ? "mask-half-1" : "mask-half-2")}
                                                            defaultChecked={reviewsResume.ratingAverage > v * 10 - 10 && reviewsResume.ratingAverage <= v * 10}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-base-content/50 mt-1">
                                                    {reviewsResume.totalReviews} {reviewsResume.totalReviews === 1 ? "opinión" : "opiniones"}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {reviewsResume.ratingResume.map((star, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <span className="text-xs text-base-content/50 w-16 whitespace-nowrap text-right flex items-center gap-1">
                                                            {star.rating} <FaStar className="text-primary" />
                                                        </span>
                                                        <progress className="progress progress-primary flex-1 h-2" value={star.percentage} max="100" />
                                                        <span className="text-xs text-base-content/50 w-8 text-right">{star.percentage}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Lista + formulario */}
                            <div className="flex-1 min-w-0">
                                {reviewsLoading && <p className="text-sm text-base-content/60">Cargando opiniones...</p>}

                                {reviews && reviews.reviews.length === 0 && (
                                    <div className="rounded-2xl border border-base-300 p-8 text-center bg-base-100">
                                        <p className="text-base font-semibold text-base-content">Sin reseñas aún</p>
                                        <p className="text-sm text-base-content/50 mt-1">Sé el primero en dejar tu opinión 😊</p>
                                    </div>
                                )}

                                {reviews && reviews.reviews.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        {reviews.reviews.map((review, i) => (
                                            <div key={i} className="rounded-2xl border border-base-300 bg-base-100 p-4 flex flex-col gap-2 hover:border-primary/30 transition-colors">
                                                <div className="flex items-center gap-2 justify-between flex-wrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                                                            <FaCircleUser className="text-primary text-sm" />
                                                        </div>
                                                        <span className="text-sm font-bold text-base-content">{review.customer}</span>
                                                    </div>
                                                    <p className="text-xs text-base-content/40">{formatDate(review.created_at, "es-MX")}</p>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <div className="rating rating-xs">
                                                        {[1, 2, 3, 4, 5].map(v => (
                                                            <div key={v} className={clsx("mask mask-star-2", v <= review.rating ? "bg-primary" : "bg-base-300")} />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-semibold text-base-content">{review.title}</span>
                                                </div>
                                                <p className="text-sm text-base-content/70 leading-relaxed">{review.comment}</p>
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

                                {isAuth && !data.isReviewed && (
                                    <div className="mt-6 rounded-2xl bg-base-100 border border-base-300 p-5">
                                        <h3 className="text-base font-bold text-base-content">Agrega tu reseña</h3>
                                        <p className="text-sm text-base-content/50 mb-4">¿Qué te pareció este producto? ⭐</p>
                                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-base-content/50 uppercase tracking-wide block mb-1">Calificación</label>
                                                <div className="rating rating-md">
                                                    {[1, 2, 3, 4, 5].map(v => (
                                                        <input key={v} type="radio" name="rating-form"
                                                            className="mask mask-star-2 bg-primary"
                                                            aria-label={`${v} star`}
                                                            onChange={() => handleSelectRating(v)}
                                                            checked={selectedRating === v}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-base-content/50 uppercase tracking-wide block mb-1">Título</label>
                                                <input
                                                    {...register("title", { required: "El título es requerido", maxLength: { value: 50, message: "Máximo 50 caracteres" } })}
                                                    type="text" className="input input-bordered w-full input-sm sm:input-md"
                                                    placeholder="Resume tu experiencia"
                                                />
                                                <div className={clsx("flex mt-1 text-xs", errors.title ? "justify-between" : "justify-end")}>
                                                    {errors.title && <p className="text-error">{errors.title.message}</p>}
                                                    <p className={clsx(reviewTitle?.length > 50 && "text-error", "text-base-content/40")}>{reviewTitle?.length ?? 0}/50</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-base-content/50 uppercase tracking-wide block mb-1">Comentario</label>
                                                <textarea
                                                    {...register("comment", { required: "El comentario es requerido", maxLength: { value: 200, message: "Máximo 200 caracteres" } })}
                                                    className="textarea textarea-bordered w-full textarea-sm sm:textarea-md"
                                                    placeholder="Cuéntanos más sobre el producto..." rows={3}
                                                />
                                                <div className={clsx("flex mt-1 text-xs", errors.comment ? "justify-between" : "justify-end")}>
                                                    {errors.comment && <p className="text-error">{errors.comment.message}</p>}
                                                    <p className={clsx(reviewComment?.length > 200 && "text-error", "text-base-content/40")}>{reviewComment?.length ?? 0}/200</p>
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-primary btn-sm sm:btn-md w-fit font-semibold">
                                                Publicar reseña
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {!isAuth && (
                                    <div className="mt-6 rounded-2xl bg-base-100 border border-base-300 p-5 text-center">
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

            {/* ══ PRODUCTOS RELACIONADOS ══════════════════════════════════════ */}
            <div className="w-full mt-8 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
                        Productos que quizá te interesen
                    </h2>
                </div>
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

export default ProductVersionDetail;