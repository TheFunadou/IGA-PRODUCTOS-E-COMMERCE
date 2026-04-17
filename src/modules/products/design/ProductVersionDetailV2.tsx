import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import {
    containsOffensiveLanguage, formatDate, formatPrice,
    makeSlug
} from "../Helpers";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import clsx from "clsx";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import { useFavorite } from "../hooks/useProductFavorites";
import type { AddPVReviewType, ProductVersionCardI } from "../ProductTypes";
import { useShoppingCart } from "../../shopping/hooks/useShoppingCart";
import {
    FaCircleUser, FaFire, FaBoxOpen, FaTruck,
    FaShieldHalved, FaClipboardCheck,
    FaBoxesPacking, FaHeadset,
    FaCircleCheck, FaTriangleExclamation, FaArrowTrendUp,
    FaFileInvoiceDollar, FaWarehouse, FaStar
} from "react-icons/fa6";
import { useAuthStore } from "../../auth/states/authStore";
import { IoShareSocialOutline } from "react-icons/io5";
import ProductVersionCardSkeleton from "../components/ProductVersionCardSkeleton";
import {
    useAddPVReview,
    useFetchProductVersionReviews, useFetchProductVersionReviewsResumeByUUID
} from "../hooks/useProductDetail";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useForm } from "react-hook-form";
import PaginationComponent from "../../../global/components/PaginationComponent";
import { OverflowXComponent } from "../../home/components/OverflowXComponent";
import ImageZoomViewer from "../components/ImageZoomViewer";
import ProductVersionImageGallery from "../components/ProductVersionImageGallery";
import { showModal } from "../../../global/GlobalHelpers";
import { useFetchProductVersionCardsV2, useFetchProductVersionDetailV2 } from "../hooks/useFetchProductVersionCards";
import ProductVersionCardV2 from "../components/ProductVersionCardV2";

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
                {level === "low" && `¡Apurate, te las ganan! (${stock} uds.)`}
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
    <div className="grid grid-cols-2 gap-3 mt-4">
        {[
            { icon: FaShieldHalved, label: "Garantía de calidad", sub: "Productos certificados" },
            { icon: FaTruck, label: "Envío rastreado", sub: "Entregas lo más pronto posible" },
            { icon: FaFileInvoiceDollar, label: "Facturación", sub: "CFDI inmediato" },
            { icon: FaHeadset, label: "Soporte dedicado", sub: "Asesor disponible" },
        ].map(({ icon: Icon, label, sub }, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-base-100 border border-base-200 hover:bg-base-200/50 hover:shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="text-primary text-lg" />
                </div>
                <div>
                    <p className="text-xs font-bold text-base-content leading-tight">{label}</p>
                    <p className="text-[10px] text-base-content/60 leading-tight mt-0.5">{sub}</p>
                </div>
            </div>
        ))}
    </div>
);

// ── QuickSpecsTable ───────────────────────────────────────────────────────────
const QuickSpecsTable = ({ specs }: { specs: { label: string; value: string }[] }) => (
    <div className="rounded-2xl border border-base-200 overflow-hidden bg-base-100 shadow-sm">
        <div className="px-5 py-3 bg-base-200/50 border-b border-base-200">
            <p className="text-sm font-bold text-base-content flex items-center gap-2">
                <FaClipboardCheck className="text-primary" /> Especificaciones rápidas
            </p>
        </div>
        <div className="divide-y divide-base-200">
            {specs.map(({ label, value }, i) => (
                <div key={i} className="flex items-center px-5 py-2.5 hover:bg-base-200/30 transition-colors">
                    <span className="w-2/5 text-[11px] font-bold text-base-content/50 uppercase tracking-widest">{label}</span>
                    <span className="w-3/5 text-sm text-base-content font-semibold">{value}</span>
                </div>
            ))}
        </div>
    </div>
);

// ── PurchaseCard ──────────────────────────────────────────────────────────────
interface PurchaseCardProps {
    unitPrice: string;
    unitPriceWithDiscount: string;
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
    <div className="w-full rounded-3xl border border-base-200 bg-base-100 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        {/* Header precio */}
        <div className={clsx(
            "px-6 pt-6 pb-5 border-b border-base-200 relative overflow-hidden",
            isOffer && "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
        )}>
            {isOffer && <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />}
            {isOffer ? (
                <div className="flex flex-col gap-1.5 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className={clsx(
                            "text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white shadow-sm tracking-wide",
                            discountColorBg(discount)
                        )}>-{discount}%</span>
                        <span className="text-xs text-base-content/40 line-through font-medium">${unitPrice}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm text-base-content/60 mb-0.5 font-bold">$</span>
                        <span className={clsx("text-4xl font-black tracking-tight", discountColorText(discount))}>
                            {unitPriceWithDiscount.substring(0, unitPriceWithDiscount.length - 3)}
                        </span>
                        <span className={clsx("text-lg font-bold self-start mt-1.5", discountColorText(discount))}>
                            {unitPriceWithDiscount.substring(unitPriceWithDiscount.length - 3)}
                        </span>
                        <span className="text-[10px] text-base-content/50 ml-1 font-bold uppercase tracking-widest">MXN / pza.</span>
                    </div>
                </div>
            ) : (
                <div className="flex items-baseline gap-1 relative z-10">
                    <span className="text-sm text-base-content/60 mb-0.5 font-bold">$</span>
                    <span className="text-4xl font-black text-base-content tracking-tight">
                        {unitPrice.substring(0, unitPrice.length - 3)}
                    </span>
                    <span className="text-lg font-bold self-start mt-1.5 text-base-content">
                        {unitPrice.substring(unitPrice.length - 3)}
                    </span>
                    <span className="text-[10px] text-base-content/50 ml-1 font-bold uppercase tracking-widest">MXN / pza.</span>
                </div>
            )}
            <StockIndicator stock={stock} />
        </div>

        <div className="p-6 flex flex-col gap-5">
            {/* Envío */}
            <div className="flex items-center justify-between py-3.5 px-4 bg-base-200/50 rounded-2xl border border-base-200">
                <div className="flex items-center gap-3">
                    <div className="p-2bg-primary/10 rounded-xl">
                        <FaTruck className="text-primary text-base flex-shrink-0" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-base-content">Envío estimado</p>
                        <p className="text-[10px] text-base-content/60 font-medium mt-0.5">{boxesQty} caja{boxesQty > 1 ? "s" : ""} · 10 uds/caja</p>
                    </div>
                </div>
                <p className="text-sm font-bold text-base-content bg-white py-1 px-2.5 rounded-lg shadow-sm border border-base-200">
                    ${formatPrice(shippingCost.toString(), "es-MX")}
                </p>
            </div>

            {/* Cantidad */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-base-content/50 uppercase tracking-widest flex items-center gap-1.5">
                    <FaBoxOpen className="text-primary" /> Cantidad
                </label>
                <select
                    className="select select-bordered w-full font-bold bg-base-200/20 focus:bg-base-100"
                    onChange={(e) => { onQtySelect(e.target.value); onQtySet(e.target.value); }}
                    value={selectProductQty}
                >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} pieza{n > 1 ? "s" : ""}</option>)}
                    <option value="more">Más de 5 piezas...</option>
                </select>
                {selectProductQty === "more" && (
                    <div className="flex flex-col gap-1.5 mt-1">
                        <input
                            type="number"
                            placeholder={`Máximo ${maxStock} piezas`}
                            className="input input-bordered w-full font-bold focus:ring-2 ring-primary/20"
                            onChange={(e) => { onQtyLimit(e.target.value); onQtySet(e.target.value); }}
                        />
                        {stockError && (
                            <p className="text-error text-[11px] flex items-center gap-1 font-bold mt-0.5">
                                <FaTriangleExclamation />{stockError}
                            </p>
                        )}
                    </div>
                )}
                <WholesaleBadge qty={productQty} unitPrice={unitPrice} />
            </div>

            {/* Total estimado */}
            {productQty > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="text-[11px] font-bold text-primary/80 uppercase tracking-widest">Total ({productQty} pzas)</span>
                    <span className="text-base font-black text-primary">
                        ${formatPrice((parseFloat(unitPrice.replace(/,/g, "")) * productQty).toString(), "es-MX")} MXN
                    </span>
                </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-3 mt-1">
                <button
                    type="button"
                    className="w-full btn btn-primary font-bold tracking-wide shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/40 transition-all rounded-xl h-12"
                    onClick={onAddCart}
                    disabled={productQty > maxStock}
                >
                    <FaBoxesPacking className="text-lg" /> Agregar al carrito
                </button>
                <button
                    type="button"
                    className="w-full btn bg-blue-950 hover:bg-blue-900 text-white font-bold tracking-wide shadow-md hover:shadow-lg transition-all rounded-xl h-12 border-0"
                    onClick={onBuyNow}
                >
                    Comprar ahora
                </button>
            </div>

            <div className="divider my-0 text-[10px] font-bold text-base-content/30 uppercase tracking-widest">o</div>

            {/* Acciones secundarias */}
            <div className="flex items-center justify-around bg-base-200/40 p-2 rounded-2xl border border-base-200">
                <button
                    type="button"
                    className="flex flex-col items-center gap-1.5 p-2 flex-1 rounded-xl text-xs font-bold hover:bg-base-100 transition-colors active:scale-95"
                    onClick={onToggleFavorite}
                >
                    {isFavorite
                        ? <IoMdHeart className="text-xl text-error drop-shadow-sm" />
                        : <IoIosHeartEmpty className="text-xl text-base-content/60 hover:text-error" />}
                    <span className={isFavorite ? "text-error" : "text-base-content/60"}>
                        {isFavorite ? "Guardado" : "Favorito"}
                    </span>
                </button>
                <div className="w-px h-6 bg-base-300" />
                <button
                    type="button"
                    className="flex flex-col items-center gap-1.5 p-2 flex-1 rounded-xl text-base-content/60 text-[11px] font-bold uppercase tracking-wider hover:text-base-content hover:bg-base-100 transition-colors active:scale-95"
                    onClick={onShare}
                >
                    <IoShareSocialOutline className="text-xl" />
                    <span>Compartir</span>
                </button>
            </div>
        </div>
    </div>
);

// ── Componente principal ───────────────────────────────────────────────────────
const ProductVersionDetailV2 = () => {
    const SHIPPING_COST = 264.00;
    const params = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useFetchProductVersionDetailV2({ sku: params.sku! });
    const { data: ads, isLoading: adsLoading, error: adsError } = useFetchProductVersionCardsV2({ filters: { limit: 10, random: true } });
    const { data: reviews, isLoading: reviewsLoading } = useFetchProductVersionReviews({ uuid: data?.sku });
    const { data: reviewsResume, isLoading: reviewsResumeLoading } = useFetchProductVersionReviewsResumeByUUID({ uuid: data?.sku });

    const { isAuth } = useAuthStore();
    const { add, addBuyNow } = useShoppingCart();
    const { showTriggerAlert } = useTriggerAlert();

    const [selectProductQty, setSelectProductQty] = useState("1");
    const [productQty, setProductQty] = useState(1);
    const [stockError, setStockError] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [unitPriceWithDiscount, setUnitPriceWithDiscount] = useState("");
    const [image, setImage] = useState<string | undefined>(NotFoundSVG);
    const [color, setColor] = useState("");
    const [stock, setStock] = useState(1);
    const [certifications, setCertifications] = useState<string[]>([]);
    const [card, _] = useState<ProductVersionCardI | undefined>(undefined);
    const [shippingCost, setShippingCost] = useState(SHIPPING_COST);
    const [boxesQty, setBoxesQty] = useState(1);
    const [selectedRating, setSelectedRating] = useState(1);
    const [reviewPage, setReviewPage] = useState(1);
    const [activeTab, setActiveTab] = useState(0);

    const imageGalleryModal = useRef<HTMLDialogElement>(null);

    const { register, handleSubmit, formState: { errors: formErrors }, watch, setValue, setError, reset } = useForm<AddPVReviewType>({
        defaultValues: { rating: 1, title: "", comment: "" }
    });
    const reviewTitle = watch("title");
    const reviewComment = watch("comment");
    const addReview = useAddPVReview();

    const { isFavorite, toggleFavorite } = useFavorite({
        sku: data?.sku ?? "",
        initialFavoriteState: data?.isFavorite ?? false,
        item: card as any,
    });

    useEffect(() => {
        if (!data) return;
        document.title = `Iga Productos | ${data.name}`;

        let sortedImages = [...data.images].sort((a, b) => a.mainImage === b.mainImage ? 0 : a.mainImage ? -1 : 1).map(img => img.url);
        if (sortedImages.length === 0) {
            sortedImages = [NotFoundSVG];
        }

        setImage(sortedImages[0]);

        if (data.offer?.isOffer && data.offer?.discount) {
            setUnitPriceWithDiscount(formatPrice(data.finalPrice, "es-MX"));
        }

        setUnitPrice(formatPrice(data.unitPrice, "es-MX"));
        setColor(data.color.code);
        setStock(data.stock);
        setCertifications(data.details.certsDesc ? data.details.certsDesc.split(",") : []);
        setValue("sku", data.sku);
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
        if (response) { showTriggerAlert("Successfull", "¡Gracias por tu opinión!"); reset(); }
    };

    const quickSpecs = data ? [
        { label: "SKU", value: data.sku },
        { label: "Color", value: data.color.name },
        { label: "Línea", value: data.color.line },
        { label: "Estado", value: data.details.status },
        { label: "Stock", value: `${data.stock} unidades` },
    ] : [];

    const purchaseCardProps: PurchaseCardProps = {
        unitPrice,
        unitPriceWithDiscount,
        isOffer: data?.offer?.isOffer ?? false,
        discount: data?.offer?.discount,
        shippingCost, boxesQty, stock,
        productQty, selectProductQty, stockError,
        isFavorite: isFavorite!,
        onQtySelect: handleSelectProductQty,
        onQtySet: handleSetProductQty,
        onQtyLimit: handleQtyLimit,
        onAddCart: () => card && add(card as any, productQty),
        onBuyNow: () => card && addBuyNow({ sku: data?.sku!, quantity: productQty }),
        onToggleFavorite: toggleFavorite,
        onShare: handleShareProduct,
        maxStock: data?.stock ?? 1,
    };

    if (isLoading) return <ProductDetailSkeleton />;
    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-4">
            <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center shadow-inner">
                <FaTriangleExclamation className="text-5xl text-error drop-shadow-md" />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-black text-base-content mb-2">Página no encontrada</h2>
                <p className="text-base-content/60 font-medium max-w-md mx-auto">Lo sentimos, no pudimos cargar la información de este producto o no existe. Por favor, verifica el enlace.</p>
            </div>
            <button type="button" className="btn btn-primary font-bold px-8 mt-2 shadow-lg" onClick={() => navigate('/tienda')}>Ir a la tienda</button>
        </div>
    );
    if (!data) return <Navigate to="/tienda" />;

    const tabs = [
        { label: "Características", content: data.details.specs },
        { label: "Aplicaciones", content: data.details.applications },
        { label: "Recomendaciones", content: data.details.recommendations },
    ];

    const sortedParents = [...(data.parents || [])].sort((a, b) => {
        if (a.sku.toLowerCase() === data.sku.toLowerCase()) return -1;
        if (b.sku.toLowerCase() === data.sku.toLowerCase()) return 1;
        return 0;
    });

    const categorySlug = data.category.name.toLowerCase();

    return (
        <div className="w-full bg-base-100 min-h-screen pb-16 rounded-3xl">
            {/* Breadcrumb Section */}
            <div className="bg-base-200/60 border-b border-base-200 backdrop-blur-sm sticky top-0 z-20 rounded-3xl">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
                    <div className="breadcrumbs text-xs font-bold text-base-content/50 uppercase tracking-wider">
                        <ul>
                            <li><Link to={"/tienda"} className="hover:text-primary transition-colors">Tienda</Link></li>
                            <li>
                                <Link
                                    to={`/tienda?category=${categorySlug}&page=1`}
                                    className="hover:text-primary transition-colors"
                                >
                                    {data.category.name}
                                </Link>
                            </li>
                            {data.subcategories.map((subcategory, index) => {
                                const slice = data.subcategories.slice(0, index + 1);
                                const params = slice.map(s => `&sub=${s.uuid}`).join("");
                                return (
                                    <li key={subcategory.uuid}>
                                        <Link
                                            to={`/tienda?category=${categorySlug}${params}&page=1`}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {subcategory.name}
                                        </Link>
                                    </li>
                                );
                            })}
                            <li className="text-base-content/80 truncate max-w-[200px] sm:max-w-xs">{data.name}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                {/* ══ SECCIÓN PRINCIPAL ═══════════════════════════════════════ */}
                <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-14">

                    {/* ── Galería ── */}
                    <div className="w-full lg:w-[38%] xl:w-[42%]">
                        <div className="lg:sticky lg:top-20 flex flex-col gap-4 z-40">
                            <div className="relative w-full rounded-3xl">
                                {data.offer?.isOffer && (
                                    <div className={clsx(
                                        "absolute top-5 left-5 z-10 px-4 py-2 rounded-full flex gap-2 items-center shadow-lg backdrop-blur-md",
                                        discountColorBg(data.offer.discount)
                                    )}>
                                        <FaFire className="text-white text-base animate-pulse" />
                                        <p className="text-sm font-extrabold text-white tracking-wide">{discountLabel(data.offer.discount)} -{data.offer.discount}%</p>
                                    </div>
                                )}
                                <ImageZoomViewer
                                    image_url={image!}
                                    alt={data.name}
                                    onClick={() => showModal(imageGalleryModal.current)}
                                />
                                {/* Hint overlay */}
                                <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg items-center gap-2 hidden sm:flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                    Click para zoom
                                </div>
                            </div>

                            {/* Thumbnail gallery */}
                            {data.images && data.images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-hide px-1">
                                    {data.images.map((img, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setImage(img.url)}
                                            className={clsx(
                                                "w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-white",
                                                img.url === image
                                                    ? "border-primary shadow-md ring-2 ring-primary/20 ring-offset-2 scale-105"
                                                    : "border-base-200 hover:border-primary/50 opacity-70 hover:opacity-100 hover:scale-105"
                                            )}
                                        >
                                            <img
                                                className="w-full h-full object-contain p-2"
                                                src={img.url}
                                                alt={`${data.name} imagen ${index + 1}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Info del producto ── */}
                    <div className="w-full lg:w-[38%] xl:w-[38%] flex flex-col gap-6">

                        {/* Nombre, estado y rating */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-bold text-base-content/60 uppercase tracking-widest bg-base-200/50 px-2.5 py-1.5 rounded-lg border border-base-200">
                                    SKU: <span className="text-base-content">{data.sku}</span>
                                </span>
                                <span className={clsx(
                                    "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-black px-3 py-1.5 rounded-lg border",
                                    data.details.status === 'DISPONIBLE'
                                        ? "bg-success/10 text-success border-success/20"
                                        : "bg-warning/10 text-warning border-warning/20"
                                )}>
                                    <FaCircleCheck className="text-[12px]" /> {data.details.status}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black leading-[1.1] text-base-content tracking-tight">
                                {data.name}
                            </h1>

                            {(reviewsResume && reviewsResume.totalReviews > 0) ? (
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center bg-base-200/50 px-3 py-1.5 rounded-xl border border-base-200">
                                        <div className="rating rating-sm rating-half pointer-events-none">
                                            <input type="radio" name="rating-header" className="rating-hidden" />
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => (
                                                <input key={i} type="radio" name="rating-header"
                                                    className={clsx("mask mask-star-2 bg-yellow-400 shadow-sm", i % 2 === 0 ? "mask-half-1" : "mask-half-2")}
                                                    defaultChecked={reviewsResume.ratingAverage > v * 10 - 10 && reviewsResume.ratingAverage <= v * 10}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-2 text-sm font-extrabold text-base-content">{reviewsResume.ratingAverage.toFixed(1)}</span>
                                    </div>
                                    <a href="#reseñas" className="text-[13px] font-bold text-primary hover:text-primary-focus transition-colors underline-offset-4 hover:underline">
                                        Leer {reviewsResume.totalReviews} {reviewsResume.totalReviews === 1 ? "opinión" : "opiniones"}
                                    </a>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center text-base-content/30">
                                        {[1, 2, 3, 4, 5].map((v) => <FaStar key={v} className="text-sm" />)}
                                    </div>
                                    <a href="#reseñas" className="text-xs font-bold text-base-content/40 hover:text-primary transition-colors">
                                        Sé el primero en opinar
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Purchase card móvil */}
                        <div className="lg:hidden mt-2">
                            <PurchaseCard {...purchaseCardProps} />
                        </div>

                        {/* Color y presentaciones */}
                        <div className="flex flex-col gap-5 mt-2 lg:mt-0">
                            <div className="flex items-center justify-between gap-3 bg-base-200/30 p-4 rounded-2xl border border-base-200">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest">Color Actual</span>
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-6 h-6 rounded-full shadow-sm ring-4 ring-base-100 border border-base-300"
                                            style={{ backgroundColor: color }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-extrabold text-base-content leading-none">{data.color.name}</span>
                                            <span className="text-[10px] font-bold text-base-content/50 mt-1 uppercase">{data.color.line}</span>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href={data.details.techSheetUrl ?? "#"}
                                    className="btn btn-outline btn-sm rounded-xl font-bold gap-2 hover:bg-primary hover:border-primary border-primary/30 text-primary"
                                    target="_blank" rel="noopener noreferrer"
                                >
                                    <FaClipboardCheck /> Ficha técnica
                                </a>
                            </div>

                            {sortedParents && sortedParents.length > 0 && (
                                <div className="flex flex-col gap-3">
                                    <p className="text-[11px] font-bold text-base-content/60 uppercase tracking-widest">Presentaciones disponibles</p>
                                    <div className="flex flex-wrap gap-3">
                                        {sortedParents.map((version) => (
                                            <Link
                                                key={version.sku}
                                                to={`/tienda/${categorySlug}/${makeSlug(data.name)}/${version.sku.toLowerCase()}`}
                                                className={clsx(
                                                    "group flex flex-col items-center gap-2 p-2 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden",
                                                    version.sku.toLowerCase() === params.sku?.toLowerCase()
                                                        ? "border-2 border-primary shadow-md bg-primary/5 ring-2 ring-primary/10 ring-offset-2 scale-105 z-10"
                                                        : "border border-base-200 bg-base-100 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 hover:bg-base-200/30"
                                                )}
                                                style={{ width: "88px" }}
                                                title={version.sku}
                                            >
                                                <div className="w-full aspect-square rounded-xl overflow-hidden bg-white flex items-center justify-center relative p-1">
                                                    <img
                                                        className="w-full h-full object-contain"
                                                        src={version.imageUrl || NotFoundSVG}
                                                        alt={version.sku}
                                                    />
                                                    {version.offer?.isOffer && (
                                                        <div className="absolute top-1 right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center shadow-md">
                                                            <FaFire className="text-[10px] text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-center w-full px-1">
                                                    <div className="flex items-center gap-1.5 mb-1.5 w-full justify-center">
                                                        <div
                                                            className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm border border-base-300"
                                                            style={{ backgroundColor: version.colorCode }}
                                                        />
                                                    </div>
                                                    <p className={clsx(
                                                        "font-extrabold text-[11px] text-center w-full",
                                                        version.sku.toLowerCase() === params.sku?.toLowerCase() ? "text-primary" : "text-base-content"
                                                    )}>
                                                        ${formatPrice(version.finalPrice || version.unitPrice, "es-MX")}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <QuickSpecsTable specs={quickSpecs} />
                        <TrustBadges />
                    </div>

                    {/* ── Purchase Card Desktop ── */}
                    <div className="hidden lg:block w-full lg:w-[24%] xl:w-[20%]">
                        <div className="sticky top-20 flex flex-col gap-5">
                            <PurchaseCard {...purchaseCardProps} />

                            {/* Pedido especial banner */}
                            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
                                <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
                                    <FaWarehouse className="text-[150px] text-primary" />
                                </div>
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <FaWarehouse className="text-primary text-xl" />
                                    </div>
                                    <p className="text-base font-extrabold text-base-content leading-tight">¿Compras de volúmen?</p>
                                </div>
                                <p className="text-xs text-base-content/70 leading-relaxed font-semibold relative z-10">
                                    Mejores precios en compras mayores a <span className="text-primary font-bold">{stock} piezas</span> o compras recurrentes.
                                </p>
                                <a
                                    href={`https://wa.me/529211963246/?text=Hola, me gustaría solicitar una cotización para el producto ${data.name} con SKU ${data.sku}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative z-10 mt-1"
                                >
                                    <button type="button" className="btn btn-primary btn-outline font-black text-xs uppercase tracking-wider w-full rounded-xl hover:shadow-lg transition-all h-11 border-2">
                                        Cotizar mayoreo
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══ MÁS INFORMACIÓN (Tabs) ════════════════════════════════════════════════ */}
                <div className="w-full py-12 border-t border-base-200 mt-6 border-b">
                    <div className="w-full flex flex-col lg:flex-row gap-12">
                        {/* Tabs técnicos */}
                        <div className="w-full lg:w-[60%]">
                            <h2 className="text-2xl font-black text-base-content mb-6 flex items-center gap-3">
                                <FaClipboardCheck className="text-primary" /> Detalles del producto
                            </h2>
                            <div className="flex gap-2 border-b-2 border-base-200 overflow-x-auto scrollbar-hide">
                                {tabs.map(({ label }, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setActiveTab(i)}
                                        className={clsx(
                                            "min-w-max px-6 py-3.5 text-sm font-extrabold transition-all relative uppercase tracking-wider",
                                            activeTab === i
                                                ? "text-primary"
                                                : "text-base-content/40 hover:text-base-content/80 hover:bg-base-200/50 rounded-t-xl"
                                        )}
                                    >
                                        {label}
                                        {activeTab === i && (
                                            <div className="absolute -bottom-0.5 left-0 w-full h-1 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--color-primary),0.5)]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="pt-8 pb-4 text-[15px] leading-relaxed text-base-content/80 min-h-[16rem]">
                                {tabs[activeTab].content ? (
                                    <div className="prose prose-sm max-w-none text-base-content/80 font-medium">
                                        {tabs[activeTab].content.split('\n').map((paragraph, idx) => (
                                            <p key={idx} className="mb-4">{paragraph}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-48 bg-base-200/30 rounded-2xl border border-dashed border-base-300 text-base-content/40 gap-4">
                                        <FaClipboardCheck className="text-5xl opacity-30" />
                                        <p className="font-bold text-sm tracking-wide">No hay información disponible de {tabs[activeTab].label.toLowerCase()}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cumplimientos normativos */}
                        <div className="w-full lg:w-[40%]">
                            <h2 className="text-2xl font-black text-base-content mb-6 flex items-center gap-3">
                                <FaShieldHalved className="text-primary" /> Normativas y Certificaciones
                            </h2>
                            {certifications.length > 0 && certifications[0] !== "" ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {certifications.map((cer, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 lg:p-5 rounded-2xl bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow group">
                                            <div className="bg-success/10 p-2.5 rounded-full text-success group-hover:bg-success group-hover:text-white transition-colors">
                                                <FaCircleCheck className="text-lg" />
                                            </div>
                                            <span className="text-[15px] font-bold text-base-content/80 leading-tight">{cer.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-48 flex items-center justify-center p-8 border border-dashed border-base-300 rounded-2xl bg-base-200/30 text-center">
                                    <p className="text-sm font-bold text-base-content/40">Este producto no cuenta con certificaciones adicionales especificadas en este momento.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ══ RESEÑAS Y OPINIONES ══════════════════════════════════════════════ */}
                <div className="mt-12 mb-16" id="reseñas">
                    <h2 className="text-3xl font-black text-base-content mb-8 flex items-center gap-3">
                        <FaStar className="text-yellow-400" /> Opiniones de nuestros clientes
                    </h2>
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Resumen */}
                        <div className="w-full lg:w-[320px] shrink-0">
                            <div className="rounded-3xl bg-base-100 border border-base-200 p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
                                {reviewsResumeLoading && (
                                    <div className="flex items-center justify-center h-48 gap-3 text-sm font-bold text-base-content/50 uppercase tracking-widest">
                                        <span className="loading loading-spinner loading-md text-primary" /> Analizando...
                                    </div>
                                )}
                                {reviewsResume && (
                                    <>
                                        <div className="text-center relative z-10 flex flex-col items-center">
                                            <h3 className="text-[11px] font-bold text-base-content/50 uppercase tracking-widest mb-2">Calificación Global</h3>
                                            <p className="text-6xl font-black text-base-content tracking-tighter">
                                                {(reviewsResume.ratingAverage / 10).toFixed(1)}
                                            </p>
                                            <div className="rating rating-md rating-half pointer-events-none justify-center mt-3 bg-base-200/50 px-4 py-2 rounded-2xl border border-base-200">
                                                <input type="radio" name="rating-summary" className="rating-hidden" />
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => (
                                                    <input key={i} type="radio" name="rating-summary"
                                                        className={clsx("mask mask-star-2 bg-yellow-400", i % 2 === 0 ? "mask-half-1" : "mask-half-2")}
                                                        defaultChecked={reviewsResume.ratingAverage > v * 10 - 10 && reviewsResume.ratingAverage <= v * 10}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm font-bold text-base-content/60 mt-3 bg-white px-3 py-1 rounded-full shadow-sm">
                                                Basado en {reviewsResume.totalReviews} {reviewsResume.totalReviews === 1 ? "opinión" : "opiniones"}
                                            </p>
                                        </div>
                                        <div className="divider my-0"></div>
                                        <div className="flex flex-col gap-3 relative z-10">
                                            {reviewsResume.ratingResume.map((star, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-base-content/60 w-8 flex items-center justify-end gap-1">
                                                        {star.rating} <FaStar className="text-yellow-400 text-[10px]" />
                                                    </span>
                                                    <progress className="progress progress-warning bg-base-200 w-full h-2.5" value={star.percentage} max="100" />
                                                    <span className="text-xs font-bold text-base-content/60 w-10 text-right">{Math.round(star.percentage)}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Lista + formulario */}
                        <div className="flex-1 min-w-0">
                            {reviewsLoading && (
                                <div className="flex flex-col gap-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="h-32 bg-base-200 animate-pulse rounded-2xl"></div>
                                    ))}
                                </div>
                            )}

                            {reviews && reviews.reviews.length === 0 && (
                                <div className="rounded-3xl border-2 border-dashed border-base-200 p-10 text-center bg-base-100/50 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                        <FaStar className="text-3xl text-primary opacity-50" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-base-content">Aún no hay opiniones de este producto</p>
                                        <p className="text-sm font-medium text-base-content/60 mt-1">Sé el primero en probar y contarnos qué te pareció</p>
                                    </div>
                                </div>
                            )}

                            {reviews && reviews.reviews.length > 0 && (
                                <div className="flex flex-col gap-5">
                                    {reviews.reviews.map((review, i) => (
                                        <div key={i} className="rounded-3xl border border-base-200 bg-base-100 p-6 flex flex-col gap-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary border-2 border-primary/20">
                                                        <FaCircleUser className="text-lg" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-extrabold text-base-content">{review.customer}</span>
                                                        <p className="text-[11px] font-bold text-base-content/40 uppercase tracking-widest">{formatDate(review.created_at, "es-MX")}</p>
                                                    </div>
                                                </div>
                                                <div className="rating rating-sm">
                                                    {[1, 2, 3, 4, 5].map(v => (
                                                        <div key={v} className={clsx("mask mask-star-2", v <= review.rating ? "bg-yellow-400" : "bg-base-200")} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-base-200/40 p-4 rounded-2xl">
                                                <span className="text-base font-black text-base-content block mb-2">{review.title}</span>
                                                <p className="text-[14px] text-base-content/70 leading-relaxed font-medium">{review.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {reviews.totalPages > 1 && (
                                        <div className="mt-8 flex justify-center">
                                            <PaginationComponent
                                                currentPage={reviewPage}
                                                onPageChange={setReviewPage}
                                                totalPages={reviews.totalPages}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Formulario */}
                            <div className="mt-8">
                                {isAuth && !data.details.isReviewed && (
                                    <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-8 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />
                                        <div className="mb-6">
                                            <h3 className="text-xl font-black text-base-content">Escribir una opinión</h3>
                                            <p className="text-sm text-base-content/60 font-medium mt-1">Comparte tu experiencia para ayudar a otros clientes</p>
                                        </div>
                                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                                            <div className="bg-base-200/50 p-6 rounded-2xl border border-base-200 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-xs font-bold text-base-content uppercase tracking-widest">¿Cómo calificarías este producto?</label>
                                                    <p className="text-[11px] text-base-content/50">1 estrella = Malo, 5 estrellas = Excelente</p>
                                                </div>
                                                <div className="rating rating-lg">
                                                    {[1, 2, 3, 4, 5].map(v => (
                                                        <input key={v} type="radio" name="rating-form"
                                                            className="mask mask-star-2 bg-yellow-400 hover:scale-110 transition-transform"
                                                            aria-label={`${v} star`}
                                                            onChange={() => handleSelectRating(v)}
                                                            checked={selectedRating === v}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6">
                                                <div>
                                                    <label className="text-[11px] font-bold text-base-content/60 uppercase tracking-widest block mb-1.5 ml-1">Título de tu reseña</label>
                                                    <input
                                                        {...register("title", { required: "Este campo es obligatorio", maxLength: { value: 50, message: "Máximo 50 caracteres" } })}
                                                        type="text" className="input input-bordered w-full font-bold focus:ring-2 focus:ring-primary/20 bg-base-200/20"
                                                        placeholder="Ej: Excelente calidad, justo lo que buscaba"
                                                    />
                                                    <div className={clsx("flex mt-1.5 text-[11px] font-bold px-1", formErrors.title ? "justify-between" : "justify-end")}>
                                                        {formErrors.title && <p className="text-error">{formErrors.title.message}</p>}
                                                        <p className={clsx(reviewTitle?.length > 50 && "text-error", "text-base-content/40")}>{reviewTitle?.length ?? 0}/50</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[11px] font-bold text-base-content/60 uppercase tracking-widest block mb-1.5 ml-1">Cuéntanos más detalles</label>
                                                    <textarea
                                                        {...register("comment", { required: "Este campo es obligatorio", maxLength: { value: 300, message: "Máximo 300 caracteres" } })}
                                                        className="textarea textarea-bordered w-full font-medium py-3 resize-none focus:ring-2 focus:ring-primary/20 bg-base-200/20"
                                                        placeholder="¿Qué te gustó más? ¿Cómo ha sido el rendimiento? Comparte consejos para futuros compradores..." rows={4}
                                                    />
                                                    <div className={clsx("flex mt-1.5 text-[11px] font-bold px-1", formErrors.comment ? "justify-between" : "justify-end")}>
                                                        {formErrors.comment && <p className="text-error">{formErrors.comment.message}</p>}
                                                        <p className={clsx(reviewComment?.length > 300 && "text-error", "text-base-content/40")}>{reviewComment?.length ?? 0}/300</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-2">
                                                <button type="submit" className="btn btn-primary px-8 font-black uppercase tracking-wider rounded-xl shadow-lg shadow-primary/30">
                                                    Publicar opinión
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {!isAuth && (
                                    <div className="rounded-3xl bg-base-200/50 border border-base-200 p-8 text-center flex flex-col items-center justify-center h-48">
                                        <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                            <FaCircleUser className="text-3xl text-primary" />
                                        </div>
                                        <p className="text-lg font-black text-base-content mb-1">Inicia sesión para opinar</p>
                                        <p className="text-sm font-medium text-base-content/60 mb-4">
                                            Solo los usuarios registrados pueden dejar reseñas de productos.
                                        </p>
                                        <Link to="/nueva-cuenta" className="btn btn-primary btn-sm px-6 rounded-full font-bold">
                                            Crear cuenta o entrar
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ PRODUCTOS RELACIONADOS ══════════════════════════════════════ */}
            <div className="w-full py-12 bg-base-200/30 border-t border-base-200">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-base-content">
                                Te podría interesar
                            </h2>
                            <p className="text-sm font-medium text-base-content/50 mt-1">Descubre más opciones similares o complementares</p>
                        </div>
                    </div>

                    {adsLoading && !adsError && !ads && (
                        <div className="flex gap-4 sm:gap-6 overflow-hidden mt-6">
                            {[...Array(5)].map((_, i) => <ProductVersionCardSkeleton key={i} />)}
                        </div>
                    )}

                    {!adsLoading && !adsError && ads && (
                        <OverflowXComponent className="gap-6 sm:gap-8 pb-4 py-2">
                            {ads.data.map((item, i) => (
                                <ProductVersionCardV2
                                    key={`${i}-${item.sku}`}
                                    versionData={item}
                                    transparent={false}
                                    className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px]"
                                />
                            ))}
                        </OverflowXComponent>
                    )}
                </div>
            </div>

            {/* ══ MODAL GALERÍA ════════════════════════════════════════════════ */}
            {data && (
                <ProductVersionImageGallery
                    ref={imageGalleryModal}
                    currentImage={image!}
                    images={data.images.map(img => img.url)}
                    productData={{
                        productName: data.name,
                        subcategories: data.subcategories.map(s => s.name),
                        colorLine: data.color.line,
                        colorName: data.color.name,
                        colorCode: data.color.code,
                    }}
                />
            )}
        </div>
    );
};

export default ProductVersionDetailV2;
