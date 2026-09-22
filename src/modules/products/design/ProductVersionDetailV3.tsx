import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    containsOffensiveLanguage, formatDate, formatPrice,
    makeSlug, toDriveDownloadUrl
} from "../Helpers";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import clsx from "clsx";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import PdfViewerModal from "../components/PdfViewerModal";
import { useFavorite } from "../hooks/useProductFavorites";
import type { AddPVReviewType } from "../ProductTypes";
import { useHandleShoppingCartV3 } from "../../shopping/hooks/handleShoppingCartV3";
// ROLLBACK V2: para volver a flujo V2, cambiar import a: import { useHandleShoppingCart } from "../../shopping/hooks/handleShoppingCart";
import {
    FaArrowDownLong, FaArrowLeft, FaArrowUpRightFromSquare, FaAward, FaBoxOpen,
    FaBoxesPacking, FaCircleCheck, FaCirclePause, FaCircleUser,
    FaFileInvoiceDollar, FaFileLines, FaHeadset,
    FaShieldHalved, FaStar, FaTag, FaTruck, FaTriangleExclamation,
    FaWarehouse
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
import ImageZoomViewer from "../components/ImageZoomViewer";
import ProductVersionImageGallery from "../components/ProductVersionImageGallery";
import { showModal, smoothScrollToSection } from "../../../global/GlobalHelpers";
import {
    useFetchProductVersionDetailV3
} from "../hooks/useFetchProductVersionCards";
import ProductVersionCardV3 from "../components/ProductVersionCardV3";
import { useShopProducts } from "../../shop/hooks/useShopProducts";
import { trackAddToCart, trackAddToWishlist, trackViewContent } from "../../analytics/MetaEvents";
import { useRecentlyViewedStore, getTabSessionId } from "../../../global/states/recentlyViewedStore";

const WHATSAPP_NUMBER = "529211963246";

// ── StockIndicator ────────────────────────────────────────────────────────────
const StockIndicator = ({ stock, isPaused = false }: { stock: number; isPaused?: boolean }) => {
    if (isPaused) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-warning/15 text-warning">
                <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                <FaCirclePause /> Pausado
            </span>
        );
    }
    if (stock <= 0) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-error/15 text-error">
                <span className="w-1.5 h-1.5 rounded-full bg-error" />
                Agotado
            </span>
        );
    }
    const level = stock > 100 ? "high" : stock > 20 ? "medium" : "low";
    return (
        <span className={clsx(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
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
            {level === "low" && `Stock bajo, ¡te quedan pocos! (${stock} uds.)`}
        </span>
    );
};

// ── TrustStrip ────────────────────────────────────────────────────────────────
const TrustStrip = () => (
    <div className="flex flex-wrap items-stretch gap-2 mt-6 pt-6 border-t border-base-200">
        {[
            { icon: FaShieldHalved, label: "Garantía de calidad", sub: "Productos certificados" },
            { icon: FaTruck, label: "Envío rastreado", sub: "Entregas lo antes posible" },
            { icon: FaFileInvoiceDollar, label: "Facturación", sub: "CFDI inmediato" },
            { icon: FaHeadset, label: "Soporte dedicado", sub: "Asesor disponible" },
        ].map(({ icon: Icon, label, sub }, i) => (
            <div key={i} className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-base-200/40 border border-base-200 flex-1 w-fit md:min-w-47.5">
                <Icon className="text-primary shrink-0" />
                <div className="leading-tight">
                    <p className="text-xs font-bold text-base-content">{label}</p>
                    <p className="text-[10px] text-base-content/55">{sub}</p>
                </div>
            </div>
        ))}
    </div>
);

// ── ContactBadges ─────────────────────────────────────────────────────────────
const SupportBadge = ({ productName, sku }: { productName: string; sku: string }) => (
    <a
        href={`https://wa.me/${WHATSAPP_NUMBER}/?text=${encodeURIComponent(`Hola, necesito ayuda o asistencia sobre el producto ${productName}, SKU ${sku}. ¿Me pueden apoyar?`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3.5 rounded-xl bg-success/10 border border-success/25 hover:bg-success/15 transition-colors"
    >
        <div className="w-9 h-9 rounded-lg bg-success/15 flex items-center justify-center shrink-0">
            <FaHeadset className="text-success" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-extrabold text-base-content leading-tight">¿Necesitas ayuda con este producto?</p>
            <p className="text-[10px] font-semibold text-success mt-0.5">Contáctanos ahora por WhatsApp</p>
        </div>
    </a>
);

const VolumeQuoteBadge = ({ productName, sku }: { productName: string; sku: string }) => (
    <a
        href={`mailto:atencionaclientes@igaproductos.com?subject=${encodeURIComponent(`Cotización en volumen: ${productName} (SKU ${sku})`)}&body=${encodeURIComponent(`Hola, requiero comprar el producto ${productName}, SKU ${sku}, en volúmenes grandes. ¿Podrían asesorarme con una cotización personalizada?`)}`}
        className="flex items-center gap-3 p-3.5 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
    >
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FaWarehouse className="text-primary" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-extrabold text-base-content leading-tight">¿Compras en volúmenes grandes?</p>
            <p className="text-[10px] font-semibold text-primary mt-0.5">Te asesoramos con una cotización</p>
            <p className="text-[10px] font-medium text-base-content/50 mt-0.5 break-all">atencionaclientes@igaproductos.com</p>
        </div>
    </a>
);

const AutomaticDiscountBadge = () => (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-primary/5 border border-primary/25">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <FaAward className="text-primary" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-extrabold text-base-content leading-tight">Recibe 10% descuento por mayoreo</p>
            <p className="text-[10px] font-semibold text-primary mt-0.5">en compras de 60 o más piezas de este producto</p>
        </div>
    </div>
);

const OutOfStockInquiryBadge = ({ productName, sku }: { productName: string; sku: string }) => (
    <a
        href={`https://wa.me/${WHATSAPP_NUMBER}/?text=${encodeURIComponent(`Hola, me interesa el producto ${productName} (SKU ${sku}) que actualmente figura sin stock. Quisiera consultar disponibilidad próxima o la posibilidad de hacer una solicitud bajo pedido. ¿Podrían brindarme más información?`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3.5 rounded-xl bg-error/10 border border-error/25 hover:bg-error/15 transition-colors"
    >
        <div className="w-9 h-9 rounded-lg bg-error/15 flex items-center justify-center shrink-0">
            <FaBoxesPacking className="text-error" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-extrabold text-base-content leading-tight">¿Te interesa este producto y no tiene stock?</p>
            <p className="text-[11px] font-medium text-base-content/70 leading-tight">Contáctanos para consultar disponibilidad próxima o hacer una solicitud bajo pedido</p>
            <p className="text-[10px] font-semibold text-error mt-0.5">Escríbenos por WhatsApp →</p>
        </div>
    </a>
);

const PausedInquiryBadge = ({ productName, sku }: { productName: string; sku: string }) => (
    <a
        href={`https://wa.me/${WHATSAPP_NUMBER}/?text=${encodeURIComponent(`Hola, me interesa el producto ${productName} (SKU ${sku}). Sé que actualmente está pausado, pero quisiera saber si todavía lo puedo adquirir. ¿Podrían brindarme más información sobre su disponibilidad?`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3.5 rounded-xl bg-warning/10 border border-warning/25 hover:bg-warning/15 transition-colors"
    >
        <div className="w-9 h-9 rounded-lg bg-warning/15 flex items-center justify-center shrink-0">
            <FaCirclePause className="text-warning" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-extrabold text-base-content leading-tight">¿Te interesa este producto?</p>
            <p className="text-[11px] font-medium text-base-content/70 leading-tight">Está pausado, pero si deseas adquirirlo contáctanos para consultar su disponibilidad</p>
            <p className="text-[10px] font-semibold text-warning mt-0.5">Escríbenos por WhatsApp →</p>
        </div>
    </a>
);

// ── QuickSpecsList ────────────────────────────────────────────────────────────
const QuickSpecsList = ({ specs }: { specs: { label: string; value: string }[] }) => (
    <dl className="rounded-xl border border-base-200 overflow-hidden">
        {specs.map(({ label, value }, i) => (
            <div key={i} className={clsx(
                "flex items-center px-4 py-2",
                i % 2 === 0 ? "bg-base-200/30" : "bg-base-100"
            )}>
                <dt className="w-2/5 text-[11px] font-bold text-base-content/50 uppercase tracking-wider">{label}</dt>
                <dd className="w-3/5 text-sm font-semibold text-base-content truncate">{value}</dd>
            </div>
        ))}
    </dl>
);

// ── PurchaseCard ──────────────────────────────────────────────────────────────
interface PurchaseCardProps {
    unitPrice: string;
    finalPrice: string;
    isOffer: boolean;
    discount?: number | null;
    stock: number;
    productQty: number;
    selectProductQty: string;
    stockError: string;
    isFavorite: boolean;
    isAuth: boolean;
    onQtySelect: (v: string) => void;
    onQtySet: (v: string) => void;
    onQtyLimit: (v: string) => void;
    onAddCart: () => void;
    onBuyNow: () => void;
    onToggleFavorite: (e: React.MouseEvent) => void;
    onShare: () => void;
    maxStock: number;
    status: string;
}

const PurchaseCard = ({
    unitPrice, finalPrice, isOffer, discount, stock,
    productQty, selectProductQty, stockError, isFavorite, isAuth,
    onQtySelect, onQtySet, onQtyLimit,
    onAddCart, onBuyNow, onToggleFavorite, onShare, maxStock, status
}: PurchaseCardProps) => {
    const isOutOfStock = stock <= 0;
    const isPaused = /PAUSED|PAUSADO/i.test(status);
    const isUnavailable = isPaused || isOutOfStock;
    const outOfStockTooltip = "Sin stock por el momento, puedes ver más detalles y contactarte con nosotros para consultar disponibilidad";
    const pausedTooltip = "Este producto está pausado, contáctanos para consultar su disponibilidad";
    const unavailableTooltip = isPaused ? pausedTooltip : outOfStockTooltip;
    const actionLabel = isPaused ? "Pausado" : "AGOTADO";
    return (
    <div className="w-full rounded-2xl border border-base-300 bg-base-100 shadow-xl overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-base-200 bg-base-200/30">
            {isOffer && (
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full text-white bg-error shadow-sm">
                        -{discount}%
                    </span>
                    <span className="text-xs text-base-content/45 line-through font-medium">${unitPrice}</span>
                </div>
            )}
            <div className="flex items-baseline gap-1">
                <span className="text-sm text-base-content/60 font-bold mb-0.5">$</span>
                <span className="text-4xl font-black text-base-content tracking-tight">
                    {(isOffer ? finalPrice : unitPrice).slice(0, -3)}
                </span>
                <span className="text-lg font-bold self-start mt-1.5 text-base-content">
                    {(isOffer ? finalPrice : unitPrice).slice(-3)}
                </span>
                <span className="text-[10px] text-base-content/50 ml-1 font-bold uppercase tracking-widest">MXN / pza.</span>
            </div>
            <div>
                <span className={clsx(
                    "badge badge-sm font-bold gap-1 border-0",
                    isPaused
                        ? "bg-warning/15 text-warning"
                        : status === 'DISPONIBLE'
                            ? "bg-success/15 text-success"
                            : "bg-error/15 text-error"
                )}>
                    {isPaused ? <FaCirclePause className="text-[10px]" /> : <FaCircleCheck className="text-[10px]" />}
                    {isPaused ? "Pausado" : status}
                </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
                <StockIndicator stock={stock} isPaused={isPaused} />
            </div>
        </div>

        <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label htmlFor="qty-v3" className="text-[11px] font-bold text-base-content/50 uppercase tracking-widest flex items-center gap-1.5">
                    <FaBoxOpen className="text-primary" /> Cantidad
                </label>
                <select
                    id="qty-v3"
                    className="select select-bordered select-sm w-full font-bold bg-base-100"
                    onChange={(e) => { onQtySelect(e.target.value); onQtySet(e.target.value); }}
                    value={selectProductQty}
                    disabled={isUnavailable}
                >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} pieza{n > 1 ? "s" : ""}</option>)}
                    <option value="more">Más de 5 piezas...</option>
                </select>
                {selectProductQty === "more" && !isUnavailable && (
                    <>
                        <input
                            type="number"
                            inputMode="numeric"
                            placeholder={`Máximo ${maxStock} piezas`}
                            className="input input-bordered input-sm w-full font-bold"
                            onChange={(e) => { onQtyLimit(e.target.value); onQtySet(e.target.value); }}
                        />
                        {stockError && (
                            <p className="text-error text-[11px] flex items-center gap-1 font-bold">
                                <FaTriangleExclamation />{stockError}
                            </p>
                        )}
                    </>
                )}
                {isUnavailable && (
                    <p className={clsx("text-[11px] flex items-center gap-1 font-bold", isPaused ? "text-warning" : "text-error")}>
                        <FaTriangleExclamation /> {isPaused ? "Producto pausado, no disponible para compra" : "Producto sin stock disponible"}
                    </p>
                )}
            </div>

            {productQty > 1 && !isUnavailable && (
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="text-[11px] font-bold text-primary/80 uppercase tracking-widest">Total ({productQty} pzas)</span>
                    <span className="text-base font-black text-primary">
                        ${formatPrice((parseFloat(unitPrice.replace(/,/g, "")) * productQty).toString(), "es-MX")} MXN
                    </span>
                </div>
            )}

            <div className="flex flex-col gap-2.5">
                <div className={clsx(isUnavailable && "tooltip tooltip-top")} data-tip={isUnavailable ? unavailableTooltip : undefined}>
                    <button
                        type="button"
                        className={clsx(
                            "btn w-full rounded-xl h-12 font-bold transition-all",
                            isUnavailable
                                ? "btn-disabled bg-base-300 text-base-content/50 border-base-300 cursor-not-allowed"
                                : "btn-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                        )}
                        onClick={onAddCart}
                        disabled={isUnavailable || productQty > maxStock}
                        aria-disabled={isUnavailable || productQty > maxStock}
                        title={isUnavailable ? unavailableTooltip : undefined}
                    >
                        <FaBoxesPacking className="text-lg" /> {isUnavailable ? actionLabel : "Agregar al carrito"}
                    </button>
                </div>
                <div className={clsx(isUnavailable && "tooltip tooltip-top")} data-tip={isUnavailable ? unavailableTooltip : undefined}>
                    <button
                        type="button"
                        className={clsx(
                            "btn w-full rounded-xl h-12 font-bold",
                            isUnavailable
                                ? "btn-disabled bg-base-200 text-base-content/50 border-base-300 cursor-not-allowed"
                                : "btn-outline btn-primary"
                        )}
                        onClick={onBuyNow}
                        disabled={isUnavailable}
                        aria-disabled={isUnavailable}
                        title={isUnavailable ? unavailableTooltip : undefined}
                    >
                        {isUnavailable ? actionLabel : "Comprar ahora"}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-around p-1.5 rounded-xl bg-base-200/40 border border-base-200">
                {isAuth && (
                    <>
                        <button
                            type="button"
                            className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg text-[11px] font-bold hover:bg-base-100 transition-colors active:scale-95"
                            onClick={onToggleFavorite}
                        >
                            {isFavorite
                                ? <IoMdHeart className="text-lg text-error" />
                                : <IoIosHeartEmpty className="text-lg text-base-content/60 hover:text-error" />}
                            <span className={isFavorite ? "text-error" : "text-base-content/60"}>
                                {isFavorite ? "Guardado" : "Favorito"}
                            </span>
                        </button>
                        <div className="w-px h-6 bg-base-300" />
                    </>
                )}
                <button
                    type="button"
                    className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg text-base-content/60 text-[11px] font-bold hover:text-base-content hover:bg-base-100 transition-colors active:scale-95"
                    onClick={onShare}
                >
                    <IoShareSocialOutline className="text-lg" />
                    <span>Compartir</span>
                </button>
            </div>
        </div>
    </div>
    );
};

// ── Componente principal ───────────────────────────────────────────────────────
const ProductVersionDetailV3 = () => {
    const params = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useFetchProductVersionDetailV3({ sku: params.sku! });

    const similarTagGroups = useMemo(() => {
        if (!data?.tags || data.tags.length === 0) return [];
        const byTier = new Map<number, string[]>();
        for (const tag of data.tags) {
            const ids = byTier.get(tag.tier);
            if (ids) ids.push(tag.id);
            else byTier.set(tag.tier, [tag.id]);
        }
        return Array.from(byTier.entries()).map(([tier, tagIds]) => ({ tier, tagIds }));
    }, [data]);

    const similarProducts = useShopProducts({
        tagGroups: similarTagGroups,
        itemsPerPage: 8,
        enabled: !!data && similarTagGroups.length > 0,
    });

    const { data: reviews, isLoading: reviewsLoading } = useFetchProductVersionReviews({ uuid: data?.sku });
    const { data: reviewsResume, isLoading: reviewsResumeLoading } = useFetchProductVersionReviewsResumeByUUID({ uuid: data?.sku });

    const { isAuth, authCustomer } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    const recentOwnerId = isAuth ? (authCustomer?.uuid ?? getTabSessionId()) : getTabSessionId();
    const addRecentSku = useRecentlyViewedStore((state) => state.addSku);
    // Flujo V3 aislado (shopping-cart:load:v3) – V2 deprecado conservado para rollback
    const { updateQtyItem } = useHandleShoppingCartV3({
        isAuth,
        authCustomer: { uuid: authCustomer?.uuid || "" },
        showTriggerAlert,
    });

    const [selectProductQty, setSelectProductQty] = useState("1");
    const [productQty, setProductQty] = useState(1);
    const [stockError, setStockError] = useState("");
    const [image, setImage] = useState<string | undefined>(NotFoundSVG);
    const [stock, setStock] = useState(1);
    const [selectedRating, setSelectedRating] = useState(1);
    const [reviewPage, setReviewPage] = useState(1);
    const [activeTab, setActiveTab] = useState(0);
    const [hasReviewed, setHasReviewed] = useState(false);

    const galleryModalRef = useRef<HTMLDialogElement>(null);
    const pdfModalRef = useRef<HTMLDialogElement>(null);

    const { register, handleSubmit, formState: { errors: formErrors, isSubmitting }, watch, setValue, setError, reset } = useForm<AddPVReviewType>({
        defaultValues: { rating: 1, title: "", comment: "" }
    });
    const reviewTitle = watch("title");
    const reviewComment = watch("comment");
    const addReview = useAddPVReview();

    const { isFavorite, toggleFavorite } = useFavorite({
        sku: data?.sku ?? "",
        initialFavoriteState: data?.isFavorite ?? false,
    });

    // Datos derivados (sin estado redundante)
    const sortedImageUrls = useMemo(() => {
        if (!data) return [];
        const urls = [...data.images]
            .sort((a, b) => (a.mainImage === b.mainImage ? 0 : a.mainImage ? -1 : 1))
            .map(img => img.url);
        return urls.length > 0 ? urls : [NotFoundSVG as string];
    }, [data]);

    const sortedTags = useMemo(() =>
        data ? [...data.tags].sort((a, b) => a.tier - b.tier || a.index - b.index) : [],
        [data]);

    const certificationResources = useMemo(() =>
        data ? data.resources.filter(r => r.type === "certification") : [],
        [data]);

    const otherResources = useMemo(() =>
        data ? data.resources.filter(r => r.type !== "certification") : [],
        [data]);

    const techSheetUrl = useMemo(() => {
        const url = data?.details.techSheetUrl;
        return url && url.trim() !== "" && url.toUpperCase() !== "N/A" ? url : undefined;
    }, [data]);

    const unitPriceFormatted = useMemo(() =>
        data ? formatPrice(data.unitPrice, "es-MX") : "",
        [data]);

    const categorySlug = makeSlug(data?.category.name ?? "");
    const productIsPaused = /PAUSED|PAUSADO/i.test(data?.details.status ?? "");

    useEffect(() => {
        if (!data) return;
        trackViewContent(data);
        document.title = `Iga Productos | ${data.name}`;
        setStock(data.stock);
        setValue("sku", data.sku);
    }, [data, setValue]);

    useEffect(() => {
        if (!data) return;
        addRecentSku(data.sku.toUpperCase(), recentOwnerId);
    }, [data, addRecentSku, recentOwnerId]);

    useEffect(() => {
        setImage(sortedImageUrls[0] ?? NotFoundSVG);
    }, [sortedImageUrls]);

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
        if (response) { showTriggerAlert("Successfull", "¡Gracias por tu opinión!"); reset(); setHasReviewed(true); }
    };

    const quickSpecs = data ? [
        { label: "SKU", value: data.sku },
        ...(data.codeBar ? [{ label: "Código de Barras", value: data.codeBar }] : []),
        { label: "Color", value: data.color.name },
        { label: "Línea", value: data.color.line },
        { label: "Estado", value: data.details.status },
        { label: "Stock", value: `${data.stock} unidades` },
    ] : [];

    const allTabs = [
        { label: "Descripción", content: data?.details.description ?? "" },
        { label: "Características", content: data?.details.specs ?? "" },
        { label: "Aplicaciones", content: data?.details.applications ?? "" },
        { label: "Recomendaciones", content: data?.details.recommendations ?? "" },
    ];
    const availableTabs = allTabs.filter(t => t.content.trim().length > 0);

    const sortedParents = useMemo(() =>
        data ? [...(data.parents || [])].sort((a, b) => {
            if (a.sku.toLowerCase() === data.sku.toLowerCase()) return -1;
            if (b.sku.toLowerCase() === data.sku.toLowerCase()) return 1;
            return 0;
        }) : [],
        [data]);

    const purchaseCardProps = {
        unitPrice: unitPriceFormatted,
        finalPrice: data ? formatPrice(data.finalPrice, "es-MX") : "",
        isOffer: data?.offer?.isOffer ?? false,
        discount: data?.offer?.discount,
        stock,
        productQty, selectProductQty, stockError,
        isFavorite: isFavorite!,
        isAuth,
        onQtySelect: handleSelectProductQty,
        onQtySet: handleSetProductQty,
        onQtyLimit: handleQtyLimit,
        onAddCart: () => {
            if (!data) return;
            if (data.stock <= 0 || productIsPaused) {
                showTriggerAlert("Message", productIsPaused
                    ? "Este producto está pausado, contáctanos para consultar su disponibilidad"
                    : "Sin stock por el momento, puedes ver más detalles y contactarte con nosotros para consultar disponibilidad");
                return;
            }
            trackAddToCart(data, productQty);
            updateQtyItem({
                isChecked: true,
                item: {
                    sku: data.sku,
                    productUUID: data.productUUID,
                },
                quantity: productQty
            });
        },
        onBuyNow: () => {
            if (!data) return;
            if (data.stock <= 0 || productIsPaused) {
                showTriggerAlert("Message", productIsPaused
                    ? "Este producto está pausado, contáctanos para consultar su disponibilidad"
                    : "Sin stock por el momento, puedes ver más detalles y contactarte con nosotros para consultar disponibilidad");
                return;
            }
            navigate(`/pagar-ahora/${data.productUUID}/${data.sku}?quantity=${productQty}`);
        },
        onToggleFavorite: (e: React.MouseEvent) => {
            toggleFavorite(e);
            if (!isFavorite && data) {
                trackAddToWishlist(data);
            }
        },
        onShare: handleShareProduct,
        maxStock: data?.stock ?? 1,
        status: data?.details.status ?? "",
    };

    if (isLoading) return <ProductDetailSkeleton />;
    if (error || !data) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-4">
            <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center shadow-inner">
                <FaTriangleExclamation className="text-5xl text-error drop-shadow-md" />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-black text-base-content mb-2">Página no encontrada</h2>
                <p className="text-base-content/60 font-medium max-w-md mx-auto">Lo sentimos, no pudimos cargar la información de este producto o no existe. Por favor, verifica el enlace.</p>
            </div>
            <button type="button" className="btn btn-primary font-bold px-8 mt-2 shadow-lg" onClick={() => navigate('/')}>Ir al inicio</button>
        </div>
    );

    return (
        <div className="w-full bg-base-100 min-h-screen pb-16">
            {/* ══ BARRA SUPERIOR ════════════════════════════════════════════ */}
            <div className="sticky top-0 z-30 bg-base-100/90 backdrop-blur border-b border-base-200">
                <div className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8 h-11 flex items-center justify-between gap-3">
                    <nav className="flex items-center gap-1.5 w-full text-xs font-bold" aria-label="Breadcrumb">
                        <Link
                            to="/"
                            className="btn btn-ghost btn-xs sm:btn-sm gap-1.5 -ml-2 px-2 text-base-content/70 hover:text-primary"
                        >
                            <FaArrowLeft className="text-[10px]" /> Inicio
                        </Link>
                        <span className="text-base-content/30 select-none">/</span>
                        {/* Tienda integrada en Home (/#tienda) - link comentado, se preserva categoría */}
                        {/* <Link to="/tienda" className="hidden sm:inline text-base-content/50 hover:text-primary transition-colors">Tienda</Link>
                        <span className="hidden sm:inline text-base-content/30 select-none">/</span> */}
                        <Link
                            to={`/tienda?category=${categorySlug}&page=1`}
                            className="hidden md:inline text-base-content/50 hover:text-primary transition-colors w-fit truncate sm:overflow-visible sm:whitespace-normal sm:text-clip"
                        >
                            {data.category.name}
                        </Link>
                        <span className="hidden md:inline text-base-content/30 select-none">/</span>
                        <span className="text-base-content/85 w-full truncate sm:overflow-visible sm:whitespace-normal sm:text-clip">{data.name}</span>
                    </nav>
                    <div className="flex items-center gap-2 shrink-0">
                    </div>
                </div>
            </div>

            <div className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8 pt-5">
                {/* Tags (readonly) */}
                {sortedTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-5">
                        {sortedTags.map(tag => (
                            <span
                                key={tag.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-base-200/60 text-base-content/70 border border-base-300 cursor-default"
                                title={`Tier ${tag.tier}`}
                            >
                                <FaTag className="text-[9px] text-primary/70" />
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* ══ SECCIÓN PRINCIPAL ═════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7">

                    {/* ── Galería ── */}
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-16 flex flex-col gap-3">
                            <div className="relative w-full rounded-2xl">
                                {data.offer?.isOffer && (
                                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full flex gap-1.5 items-center shadow-lg bg-error">
                                        <FaStar className="text-white text-xs" />
                                        <p className="text-xs font-extrabold text-white tracking-wide">-{data.offer.discount}%</p>
                                    </div>
                                )}
                                <ImageZoomViewer
                                    image_url={image!}
                                    alt={data.name}
                                    onClick={() => showModal(galleryModalRef.current)}
                                />
                            </div>

                            {sortedImageUrls.length > 1 && (
                                <div className="flex gap-2.5 overflow-x-auto p-2 scrollbar-hide">
                                    {sortedImageUrls.map((url, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setImage(url)}
                                            aria-label={`Ver imagen ${index + 1}`}
                                            className={clsx(
                                                "w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] shrink-0 rounded-2xl overflow-hidden border-2 bg-white transition-all duration-300",
                                                url === image
                                                    ? "border-primary shadow-md ring-2 ring-primary/20 ring-offset-2 scale-105"
                                                    : "border-base-200 opacity-70 hover:opacity-100 hover:border-primary/50 hover:scale-105"
                                            )}
                                        >
                                            <img
                                                className="w-full h-full object-contain p-1.5"
                                                src={url}
                                                alt={`${data.name} imagen ${index + 1}`}
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Info del producto ── */}
                    <div className="lg:col-span-4 flex flex-col gap-5">

                        <div className="flex flex-col gap-3">
                            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black leading-tight text-base-content tracking-tight">
                                {data.name}
                            </h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="badge badge-ghost badge-sm font-mono font-bold text-base-content/70">
                                    SKU: {data.sku}
                                </span>
                            </div>

                            {(reviewsResume && reviewsResume.totalReviews > 0) ? (
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-1.5 bg-base-300 px-2.5 py-1 rounded-lg border border-base-200">
                                        <FaStar className="text-yellow-400 text-sm" />
                                        <span className="text-sm font-extrabold text-base-content">
                                            {(reviewsResume.ratingAverage / 10).toFixed(1)}
                                        </span>
                                    </div>
                                    <a
                                        href="#reseñas"
                                        onClick={(e) => { e.preventDefault(); smoothScrollToSection("reseñas"); }}
                                        className="text-xs font-bold text-primary hover:underline underline-offset-4"
                                    >
                                        Leer {reviewsResume.totalReviews} {reviewsResume.totalReviews === 1 ? "opinión" : "opiniones"}
                                    </a>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="flex text-base-content/25">
                                        {[1, 2, 3, 4, 5].map(v => <FaStar key={v} className="text-sm" />)}
                                    </div>
                                    <a
                                        href="#reseñas"
                                        onClick={(e) => { e.preventDefault(); smoothScrollToSection("reseñas"); }}
                                        className="text-xs font-bold text-base-content/45 hover:text-primary transition-colors"
                                    >
                                        Sé el primero en opinar
                                    </a>
                                </div>
                            )}

                            {data.details.description.trim().length > 0 && (
                                <p className="text-sm text-base-content/70 leading-relaxed text-justify">
                                    {data.details.description.split('\n')[0]}
                                </p>
                            )}
                        </div>

                        {/* Purchase card móvil */}
                        <div className="lg:hidden">
                            <PurchaseCard {...purchaseCardProps} />
                            <div className="mt-2.5">
                                <AutomaticDiscountBadge />
                            </div>
                        </div>

                        {/* Color + ficha técnica */}
                        <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-base-200/30 border border-base-200">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                    className="w-7 h-7 rounded-full shadow-sm border border-base-300 shrink-0"
                                    style={{ backgroundColor: data.color.code }}
                                />
                                <div className="min-w-0 leading-tight">
                                    <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest">Color</p>
                                    <p className="text-sm font-extrabold text-base-content truncate">{data.color.name}</p>
                                    <p className="text-[10px] font-bold text-base-content/50 uppercase">{data.color.line}</p>
                                </div>
                            </div>
                            {techSheetUrl && (
                                <button
                                    type="button"
                                    onClick={() => showModal(pdfModalRef.current)}
                                    className="btn btn-outline btn-sm rounded-lg font-bold gap-2 border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary shrink-0"
                                >
                                    <FaFileLines /> Ficha técnica
                                </button>
                            )}
                        </div>

                        {/* Presentaciones disponibles */}
                        {sortedParents.length > 0 && (
                            <div className="flex flex-col gap-2.5">
                                <p className="text-[11px] font-bold text-base-content/55 uppercase tracking-widest text-center md:text-start">Presentaciones disponibles</p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {sortedParents.map((version) => {
                                        const isCurrent = version.sku.toLowerCase() === params.sku?.toLowerCase();
                                        return (
                                            <Link
                                                key={version.sku}
                                                to={`/tienda/${categorySlug}/${makeSlug(data.name)}/${version.sku.toLowerCase()}`}
                                                title={version.sku}
                                                className={clsx(
                                                    "relative flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 overflow-hidden",
                                                    isCurrent
                                                        ? "border-2 border-primary bg-primary/5 shadow-md ring-2 ring-primary/10 ring-offset-2 scale-105 z-10"
                                                        : "border border-base-200 bg-base-100 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 hover:scale-105"
                                                )}
                                                style={{ width: "88px" }}
                                            >
                                                {version.offer?.isOffer && (
                                                    <span className="absolute top-1 right-1 badge badge-xs badge-error font-bold text-[9px] text-white border-0">
                                                        -{version.offer.discount}%
                                                    </span>
                                                )}
                                                <div className="w-full aspect-square rounded-lg overflow-hidden bg-white flex items-center justify-center">
                                                    <img
                                                        className="w-full h-full object-contain p-1"
                                                        src={version.imageUrl || NotFoundSVG}
                                                        alt={version.sku}
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div
                                                    className="w-3 h-3 rounded-full border border-base-300 shadow-sm"
                                                    style={{ backgroundColor: version.colorCode }}
                                                />
                                                <p className={clsx(
                                                    "font-extrabold text-[11px]",
                                                    isCurrent ? "text-primary" : "text-base-content"
                                                )}>
                                                    ${formatPrice(version.finalPrice || version.unitPrice, "es-MX")}
                                                </p>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <QuickSpecsList specs={quickSpecs} />

                        {/* Badges de contacto (desktop) */}
                        <div className="hidden lg:flex flex-col gap-2.5">
                            <SupportBadge productName={data.name} sku={data.sku} />
                            <VolumeQuoteBadge productName={data.name} sku={data.sku} />
                            {productIsPaused && <PausedInquiryBadge productName={data.name} sku={data.sku} />}
                            {!productIsPaused && data.stock <= 0 && <OutOfStockInquiryBadge productName={data.name} sku={data.sku} />}
                        </div>
                    </div>

                    {/* ── Purchase Card Desktop ── */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-16 flex flex-col gap-4">
                            <PurchaseCard {...purchaseCardProps} />
                            <AutomaticDiscountBadge />
                        </div>
                    </div>
                </div>

                {/* Badges de contacto (móvil) */}
                <div className="lg:hidden flex flex-col sm:flex-row gap-2.5 mt-6">
                    <SupportBadge productName={data.name} sku={data.sku} />
                    <VolumeQuoteBadge productName={data.name} sku={data.sku} />
                </div>
                {productIsPaused && (
                    <div className="lg:hidden mt-2.5">
                        <PausedInquiryBadge productName={data.name} sku={data.sku} />
                    </div>
                )}
                {!productIsPaused && data.stock <= 0 && (
                    <div className="lg:hidden mt-2.5">
                        <OutOfStockInquiryBadge productName={data.name} sku={data.sku} />
                    </div>
                )}

                {/* ══ DETALLES + RECURSOS ═══════════════════════════════════ */}
                <TrustStrip />

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Tabs técnicos */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <h2 className="text-xl font-black text-base-content mb-4 flex items-center gap-2.5">
                            <FaFileLines className="text-primary" /> Detalles del producto
                        </h2>
                        {availableTabs.length > 0 ? (
                            <>
                                <div role="tablist" className="tabs tabs-box bg-base-200/50 border border-base-200 p-1 w-fit max-w-full">
                                    {availableTabs.map(({ label }, i) => (
                                        <button
                                            key={i}
                                            role="tab"
                                            type="button"
                                            onClick={() => setActiveTab(i)}
                                            className={clsx(
                                                "tab font-bold text-xs sm:text-sm h-8 min-h-0 rounded-lg",
                                                activeTab === i ? "tab-active bg-base-100 text-primary shadow-sm" : "text-base-content/50"
                                            )}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-5">
                                    <div className="prose prose-sm max-w-none text-base-content/80 text-justify">
                                        {availableTabs[Math.min(activeTab, availableTabs.length - 1)].content
                                            .split('\n')
                                            .filter(p => p.trim().length > 0)
                                            .map((paragraph, idx) => (
                                                <p key={idx}>{paragraph}</p>
                                            ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-36 bg-base-200/30 rounded-xl border border-dashed border-base-300 text-base-content/40 gap-3">
                                <FaFileLines className="text-4xl opacity-30" />
                                <p className="font-bold text-sm">No hay información adicional de este producto</p>
                            </div>
                        )}
                    </div>

                    {/* Ficha técnica, certificaciones y recursos */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3">
                        <h2 className="text-xl font-black text-base-content mb-1 flex items-center gap-2.5">
                            <FaShieldHalved className="text-primary" /> Recursos y cumplimiento
                        </h2>

                        {techSheetUrl && (
                            <button
                                type="button"
                                onClick={() => showModal(pdfModalRef.current)}
                                className="btn btn-outline btn-primary btn-sm w-full justify-between rounded-lg font-bold border-primary/30 hover:bg-primary hover:border-primary"
                            >
                                Ver ficha técnica (PDF) <FaFileLines />
                            </button>
                        )}

                        {otherResources.length > 0 && (
                            <div className="flex flex-col gap-1.5">
                                {otherResources.map(resource => (
                                    <a
                                        key={resource.id}
                                        href={toDriveDownloadUrl(resource.resourceUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline btn-primary btn-xs rounded-full font-bold gap-1.5 px-3 border-primary/30 hover:bg-primary hover:border-primary justify-between"
                                        title={resource.description}
                                        data-tip="Descargar recurso"
                                    >
                                        <span className="flex items-center gap-1.5 min-w-0">
                                            <FaFileLines className="text-[10px] shrink-0" />
                                            <span className="truncate">{resource.description}</span>
                                        </span>
                                        <FaArrowDownLong className="text-[10px] shrink-0" />
                                    </a>
                                ))}
                            </div>
                        )}

                        {certificationResources.length > 0 && (
                            <div className="flex flex-col gap-2">
                                {certificationResources.map(resource => (
                                    <a
                                        key={resource.id}
                                        href={resource.resourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-200 hover:border-primary/40 hover:bg-primary/[0.03] transition-all"
                                    >
                                        <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
                                            <FaAward className="text-base" />
                                        </div>
                                        <div className="min-w-0 flex-1 leading-tight">
                                            <p className="text-[13px] font-bold text-base-content/85 truncate">{resource.description}</p>
                                            <p className="text-[10px] font-semibold text-base-content/45 mt-0.5">
                                                Certificación · Act. {formatDate(resource.updatedAt as Date, "es-MX")}
                                            </p>
                                        </div>
                                        <FaArrowUpRightFromSquare className="text-base-content/30 group-hover:text-primary transition-colors shrink-0" size={13} />
                                    </a>
                                ))}
                            </div>
                        )}

                        {!techSheetUrl && certificationResources.length === 0 && otherResources.length === 0 && (
                            <div className="flex items-center justify-center h-24 border border-dashed border-base-300 rounded-xl bg-base-200/30 text-center px-4">
                                <p className="text-xs font-bold text-base-content/40">
                                    Este producto aún no tiene ficha técnica ni recursos publicados.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ══ RESEÑAS Y OPINIONES ═══════════════════════════════════ */}
                <div className="mt-10 mb-14 scroll-mt-24" id="reseñas">
                    <h2 className="text-2xl font-black text-base-content mb-6 flex items-center gap-2.5">
                        <FaStar className="text-yellow-400" /> Opiniones de nuestros clientes
                    </h2>
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                        {/* Resumen */}
                        <div className="w-full lg:w-[280px] shrink-0">
                            <div className="rounded-xl bg-base-100 border border-base-200 p-6 flex flex-col gap-4 lg:sticky lg:top-16">
                                {reviewsResumeLoading && (
                                    <div className="flex items-center justify-center h-40 gap-3 text-sm font-bold text-base-content/50 uppercase tracking-widest">
                                        <span className="loading loading-spinner loading-md text-primary" /> Analizando...
                                    </div>
                                )}
                                {reviewsResume && (
                                    <>
                                        <div className="text-center flex flex-col items-center">
                                            <h3 className="text-[11px] font-bold text-base-content/50 uppercase tracking-widest mb-1.5">Calificación Global</h3>
                                            <p className="text-5xl font-black text-base-content tracking-tighter">
                                                {(reviewsResume.ratingAverage / 10).toFixed(1)}
                                            </p>
                                            <div className="rating rating-md pointer-events-none justify-center mt-2">
                                                {[1, 2, 3, 4, 5].map(v => (
                                                    <div key={v} className={clsx(
                                                        "mask mask-star-2",
                                                        v <= Math.round(reviewsResume.ratingAverage / 2) ? "bg-yellow-400" : "bg-base-200"
                                                    )} />
                                                ))}
                                            </div>
                                            <p className="text-xs font-bold text-base-content/55 mt-2">
                                                Basado en {reviewsResume.totalReviews} {reviewsResume.totalReviews === 1 ? "opinión" : "opiniones"}
                                            </p>
                                        </div>
                                        <div className="divider my-0"></div>
                                        <div className="flex flex-col gap-2.5">
                                            {reviewsResume.ratingResume.map((star, i) => (
                                                <div key={i} className="flex items-center gap-2.5">
                                                    <span className="text-xs font-bold text-base-content/60 w-8 flex items-center justify-end gap-1">
                                                        {star.rating} <FaStar className="text-yellow-400 text-[10px]" />
                                                    </span>
                                                    <progress className="progress progress-warning bg-base-200 w-full h-2" value={star.percentage} max="100" />
                                                    <span className="text-xs font-bold text-base-content/60 w-9 text-right">{Math.round(star.percentage)}%</span>
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
                                        <div key={i} className="h-28 bg-base-200 animate-pulse rounded-xl"></div>
                                    ))}
                                </div>
                            )}

                            {reviews && reviews.reviews.length === 0 && (
                                <div className="rounded-xl border-2 border-dashed border-base-200 p-8 text-center bg-base-100/50 flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                                        <FaStar className="text-2xl text-primary opacity-50" />
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-base-content">Aún no hay opiniones de este producto</p>
                                        <p className="text-sm font-medium text-base-content/60 mt-1">Sé el primero en probar y contarnos qué te pareció</p>
                                    </div>
                                </div>
                            )}

                            {reviews && reviews.reviews.length > 0 && (
                                <div className="flex flex-col gap-4">
                                    {reviews.reviews.map((review, i) => (
                                        <div key={i} className="rounded-xl border border-base-200 bg-base-100 p-5 flex flex-col gap-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                                                        <FaCircleUser className="text-base" />
                                                    </div>
                                                    <div className="flex flex-col leading-tight">
                                                        <span className="text-sm font-extrabold text-base-content">{review.customer}</span>
                                                        <p className="text-[11px] font-bold text-base-content/40">{formatDate(review.created_at, "es-MX")}</p>
                                                    </div>
                                                </div>
                                                <div className="rating rating-sm pointer-events-none">
                                                    {[1, 2, 3, 4, 5].map(v => (
                                                        <div key={v} className={clsx("mask mask-star-2", v <= review.rating ? "bg-yellow-400" : "bg-base-200")} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-base-200/40 p-3.5 rounded-xl">
                                                <span className="text-sm font-black text-base-content block mb-1">{review.title}</span>
                                                <p className="text-[13px] text-base-content/70 leading-relaxed">{review.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {reviews.totalPages > 1 && (
                                        <div className="mt-6 flex justify-center">
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
                            <div className="mt-6">
                                {isAuth && !data.details.isReviewed && !hasReviewed && (
                                    <div className="rounded-xl bg-base-100 border border-base-200 p-6">
                                        <div className="mb-5">
                                            <h3 className="text-lg font-black text-base-content">Escribir una opinión</h3>
                                            <p className="text-xs text-base-content/60 font-medium mt-0.5">Comparte tu experiencia para ayudar a otros clientes</p>
                                        </div>
                                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                                            <div className="bg-base-200/40 p-4 rounded-xl border border-base-200 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                                                <div className="flex flex-col gap-0.5">
                                                    <label className="text-xs font-bold text-base-content uppercase tracking-wider">¿Cómo calificarías este producto?</label>
                                                    <p className="text-[11px] text-base-content/50">1 estrella = Malo, 5 estrellas = Excelente</p>
                                                </div>
                                                <div className="rating rating-lg">
                                                    {[1, 2, 3, 4, 5].map(v => (
                                                        <input key={v} type="radio" name="rating-form-v3"
                                                            className="mask mask-star-2 bg-yellow-400 hover:scale-110 transition-transform"
                                                            aria-label={`${v} estrellas`}
                                                            onChange={() => handleSelectRating(v)}
                                                            checked={selectedRating === v}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <div>
                                                    <label htmlFor="review-title-v3" className="text-[11px] font-bold text-base-content/55 uppercase tracking-widest block mb-1 ml-0.5">Título de tu reseña</label>
                                                    <input
                                                        id="review-title-v3"
                                                        {...register("title", { required: "Este campo es obligatorio", maxLength: { value: 50, message: "Máximo 50 caracteres" } })}
                                                        type="text"
                                                        className="input input-bordered input-sm w-full font-semibold focus:ring-2 focus:ring-primary/20"
                                                        placeholder="Ej: Excelente calidad, justo lo que buscaba"
                                                    />
                                                    <div className={clsx("flex mt-1 text-[11px] font-bold px-0.5", formErrors.title ? "justify-between" : "justify-end")}>
                                                        {formErrors.title && <p className="text-error">{formErrors.title.message}</p>}
                                                        <p className={clsx(reviewTitle?.length > 50 && "text-error", "text-base-content/40")}>{reviewTitle?.length ?? 0}/50</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="review-comment-v3" className="text-[11px] font-bold text-base-content/55 uppercase tracking-widest block mb-1 ml-0.5">Cuéntanos más detalles</label>
                                                    <textarea
                                                        id="review-comment-v3"
                                                        {...register("comment", { required: "Este campo es obligatorio", maxLength: { value: 300, message: "Máximo 300 caracteres" } })}
                                                        className="textarea textarea-bordered w-full text-sm py-2.5 resize-none focus:ring-2 focus:ring-primary/20"
                                                        placeholder="¿Qué te gustó más? ¿Cómo ha sido el rendimiento?" rows={4}
                                                    />
                                                    <div className={clsx("flex mt-1 text-[11px] font-bold px-0.5", formErrors.comment ? "justify-between" : "justify-end")}>
                                                        {formErrors.comment && <p className="text-error">{formErrors.comment.message}</p>}
                                                        <p className={clsx(reviewComment?.length > 300 && "text-error", "text-base-content/40")}>{reviewComment?.length ?? 0}/300</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button type="submit" disabled={addReview.isPending || isSubmitting} className="btn btn-primary btn-sm px-8 font-black uppercase tracking-wider rounded-lg shadow-md shadow-primary/20">
                                                    {addReview.isPending ? "Publicando..." : "Publicar opinión"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {!isAuth && (
                                    <div className="rounded-xl bg-base-200/40 border border-base-200 p-6 text-center flex flex-col items-center justify-center h-44">
                                        <div className="bg-base-100 p-3 rounded-full shadow-sm mb-2.5">
                                            <FaCircleUser className="text-2xl text-primary" />
                                        </div>
                                        <p className="text-base font-black text-base-content mb-0.5">Inicia sesión para opinar</p>
                                        <p className="text-xs font-medium text-base-content/60 mb-3">
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

            {/* ══ PRODUCTOS SIMILARES ════════════════════════════════════ */}
            <div className="w-full py-10 bg-base-200/30 border-t border-base-200">
                <div className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-black text-base-content">Productos similares</h2>
                        <p className="text-sm font-medium text-base-content/50 mt-0.5">Descubre más opciones con las mismas características</p>
                    </div>

                    {similarProducts.isLoading && !similarProducts.data && (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 mt-4">
                            {[...Array(4)].map((_, i) => <ProductVersionCardSkeleton key={i} />)}
                        </div>
                    )}

                    {!similarProducts.isLoading && similarProducts.data && (() => {
                        const filtered = similarProducts.data.data?.filter(
                            item => item.version.sku.toLowerCase() !== params.sku?.toLowerCase()
                        ) ?? [];
                        if (filtered.length === 0) return null;
                        return (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                                {filtered.map(item => (
                                    <ProductVersionCardV3
                                        key={`${item.version.sku}-${item.product.id}`}
                                        data={item}
                                        imageLoading="lazy"
                                    />
                                ))}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* ══ MODALES ═══════════════════════════════════════════════════ */}
            <ProductVersionImageGallery
                ref={galleryModalRef}
                currentImage={image!}
                images={data.images.map(img => img.url)}
                productData={{
                    productName: data.name,
                    subcategories: [],
                    colorLine: data.color.line,
                    colorName: data.color.name,
                    colorCode: data.color.code,
                }}
            />

            <PdfViewerModal
                ref={pdfModalRef}
                url={techSheetUrl}
                title={`Ficha técnica · ${data.name}`}
            />
        </div>
    );
};

export default ProductVersionDetailV3;
