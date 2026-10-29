import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { containsOffensiveLanguage, formatPrice, makeSlug } from "../Helpers";
import NotFoundSVG from "../../../assets/products/NotFound.svg";
import { useFavorite } from "./useProductFavorites";
import type { AddPVReviewType } from "../ProductTypes";
import { useHandleShoppingCartV3 } from "../../shopping/hooks/handleShoppingCartV3";
// ROLLBACK V2: para volver a flujo V2, cambiar import a: import { useHandleShoppingCart } from "../../shopping/hooks/handleShoppingCart";
import { useAuthStore } from "../../auth/states/authStore";
import {
    useAddPVReview,
    useFetchProductVersionReviews, useFetchProductVersionReviewsResumeByUUID
} from "./useProductDetail";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useForm } from "react-hook-form";
import { useFetchProductVersionDetailV3 } from "./useFetchProductVersionCards";
import { useShopProducts } from "../../shop/hooks/useShopProducts";
import { trackAddToCart, trackAddToWishlist, trackViewContent } from "../../analytics/MetaEvents";
import { phAddToCartBlocked } from "../../analytics/PostHogEvents";
import { useRecentlyViewedStore, getTabSessionId } from "../../../global/states/recentlyViewedStore";

/* Controlador de la página de detalle V3: toda la lógica (estado, handlers,
   datos derivados) vive aquí, extraída verbatim del design original para que
   el orquestador sea solo composición de subcomponentes. */
export const useProductVersionDetailV3Controller = () => {
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

    const form = useForm<AddPVReviewType>({
        defaultValues: { rating: 1, title: "", comment: "" }
    });
    const { watch, setValue, setError, reset } = form;
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
                phAddToCartBlocked(data.sku, productIsPaused ? "paused" : "out_of_stock");
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
                phAddToCartBlocked(data.sku, productIsPaused ? "paused" : "out_of_stock");
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

    return {
        params,
        navigate,
        data,
        isLoading,
        error,
        image,
        setImage,
        sortedImageUrls,
        sortedTags,
        certificationResources,
        otherResources,
        techSheetUrl,
        unitPriceFormatted,
        categorySlug,
        productIsPaused,
        reviews,
        reviewsLoading,
        reviewsResume,
        reviewsResumeLoading,
        galleryModalRef,
        pdfModalRef,
        form,
        reviewTitle,
        reviewComment,
        addReview,
        selectedRating,
        handleSelectRating,
        onSubmit,
        hasReviewed,
        isAuth,
        quickSpecs,
        availableTabs,
        activeTab,
        setActiveTab,
        sortedParents,
        purchaseCardProps,
        similarProducts,
        reviewPage,
        setReviewPage,
    };
};
