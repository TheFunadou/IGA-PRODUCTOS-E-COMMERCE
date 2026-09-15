import { FaBarcode, FaBoxOpen, FaHeart, FaStar, FaTag } from "react-icons/fa6";
import { ArrowUpDown, X } from "lucide-react";
import clsx from "clsx";
import type { colorLine, PV3SortField } from "../../products/ProductTypes";
import { useThemeStore } from "../../../layouts/states/themeStore";

export type AppliedFilterKey =
    | "favorite"
    | "offer"
    | "stock"
    | "rating"
    | "colorLine"
    | "priceRange"
    | "sku";

interface ShopAppliedFiltersProps {
    favoriteCheck: boolean;
    offerCheck: boolean;
    stockCheck: boolean;
    ratingFilter?: number;
    colorLineFilter?: colorLine;
    priceRange?: { min: number; max: number };
    skuFilter?: string[];
    activeSorts?: { field: PV3SortField; dir: "asc" | "desc"; label: string }[];
    pendingTagNames: { id: string; name: string }[];
    tagNameFilter?: string[];
    onRemoveFilter: (key: AppliedFilterKey) => void;
    onRemoveSort?: (field: PV3SortField) => void;
    onRemoveTag: (tagId: string) => void;
    onRemoveTagName?: (name: string) => void;
    onClearAll: () => void;
}

const badgeBase = (isDark: boolean) =>
    `badge badge-sm gap-1 pr-1 h-auto py-1.5 border-blue-950/20 bg-blue-950/5 ${
        isDark ? "text-base-content" : "text-blue-950"
    } hover:text-primary cursor-default transition-colors`;

const ShopAppliedFilters = ({
    favoriteCheck,
    offerCheck,
    stockCheck,
    ratingFilter,
    colorLineFilter,
    priceRange,
    skuFilter,
    activeSorts,
    pendingTagNames,
    tagNameFilter,
    onRemoveFilter,
    onRemoveSort,
    onRemoveTag,
    onRemoveTagName,
    onClearAll,
}: ShopAppliedFiltersProps) => {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";
    const hasAny =
        favoriteCheck ||
        offerCheck ||
        stockCheck ||
        ratingFilter !== undefined ||
        !!colorLineFilter ||
        !!priceRange ||
        (!!skuFilter && skuFilter.length > 0) ||
        (!!activeSorts && activeSorts.length > 0) ||
        pendingTagNames.length > 0 ||
        (tagNameFilter?.length ?? 0) > 0;

    if (!hasAny) return null;

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {favoriteCheck && (
                <span className={clsx(badgeBase(isDark), "!border-rose-400/30 !bg-rose-500/10 text-rose-500 hover:text-rose-600")}>
                    <FaHeart size={9} />
                    Solo favoritos
                    <button
                        type="button"
                        onClick={() => onRemoveFilter("favorite")}
                        aria-label="Quitar filtro de favoritos"
                        className="ml-0.5 hover:text-error transition-colors"
                    >
                        <X size={11} />
                    </button>
                </span>
            )}

            {offerCheck && (
                <span className={clsx(badgeBase(isDark), "!border-warning/40 !bg-warning/15 text-warning-content font-semibold")}>
                    <FaTag size={9} />
                    Solo ofertas
                    <button
                        type="button"
                        onClick={() => onRemoveFilter("offer")}
                        aria-label="Quitar filtro de ofertas"
                        className="ml-0.5 hover:text-error transition-colors"
                    >
                        <X size={11} />
                    </button>
                </span>
            )}

            {stockCheck && (
                <span className={clsx(badgeBase(isDark))}>
                    <FaBoxOpen size={10} />
                    Con stock
                    <button
                        type="button"
                        onClick={() => onRemoveFilter("stock")}
                        aria-label="Quitar filtro de stock"
                        className="ml-0.5 hover:text-error transition-colors"
                    >
                        <X size={11} />
                    </button>
                </span>
            )}

            {ratingFilter !== undefined && (
                <span className={clsx(badgeBase(isDark))}>
                    <FaStar size={9} className="text-warning" />
                    Calificación ≥ {ratingFilter}
                    <button
                        type="button"
                        onClick={() => onRemoveFilter("rating")}
                        aria-label="Quitar filtro de calificación"
                        className="ml-0.5 hover:text-error transition-colors"
                    >
                        <X size={11} />
                    </button>
                </span>
            )}

            {colorLineFilter && (
                <span className={clsx(badgeBase(isDark))}>
                    Línea: {colorLineFilter}
                    <button
                        type="button"
                        onClick={() => onRemoveFilter("colorLine")}
                        aria-label="Quitar filtro de línea de color"
                        className="ml-0.5 hover:text-error transition-colors"
                    >
                        <X size={11} />
                    </button>
                </span>
            )}

            {priceRange && (
                <span className={clsx(badgeBase(isDark))}>
                    Precio: ${priceRange.min}{priceRange.max ? ` - $${priceRange.max}` : "+"}
                    <button
                        type="button"
                        onClick={() => onRemoveFilter("priceRange")}
                        aria-label="Quitar rango de precio"
                        className="ml-0.5 hover:text-error transition-colors"
                    >
                        <X size={11} />
                    </button>
                </span>
            )}

            {skuFilter !== undefined && skuFilter.length > 0 && (
                <span className={clsx(badgeBase(isDark))}>
                    <FaBarcode size={10} />
                    <span className="max-w-48 truncate">SKUs: {skuFilter.join(", ")}</span>
                    <button
                        type="button"
                        onClick={() => onRemoveFilter("sku")}
                        aria-label="Quitar filtro de SKUs"
                        className="ml-0.5 hover:text-error transition-colors"
                    >
                        <X size={11} />
                    </button>
                </span>
            )}

            {activeSorts?.map((s) => (
                <span key={s.field} className={clsx(badgeBase(isDark))}>
                    <ArrowUpDown size={9} />
                    {s.label}
                    <button
                        type="button"
                        onClick={() => onRemoveSort?.(s.field)}
                        aria-label={`Quitar orden por ${s.label}`}
                        className="ml-0.5 hover:text-error transition-colors"
                    >
                        <X size={11} />
                    </button>
                </span>
            ))}

            {pendingTagNames.map((tag) => (
                <span key={tag.id} className={badgeBase(isDark)}>
                    <FaTag size={8} />
                    {`etiqueta: ${tag.name}`}
                    <button
                        type="button"
                        onClick={() => onRemoveTag(tag.id)}
                        aria-label={`Quitar etiqueta ${tag.name}`}
                        className="ml-0.5 hover:text-error transition-colors"
                    >
                        <X size={11} />
                    </button>
                </span>
            ))}

            {(tagNameFilter ?? []).map((name) => (
                <span key={`tag-name-${name}`} className={badgeBase(isDark)}>
                    <FaTag size={8} />
                    {`nombre etiqueta: ${name}`}
                    <button
                        type="button"
                        onClick={() => onRemoveTagName?.(name)}
                        aria-label={`Quitar etiqueta ${name}`}
                        className="ml-0.5 hover:text-error transition-colors"
                    >
                        <X size={11} />
                    </button>
                </span>
            ))}

            <button
                type="button"
                className="btn btn-ghost btn-xs gap-1 text-error hover:bg-error/10 normal-case"
                onClick={onClearAll}
            >
                <X size={12} />
                Limpiar filtros
            </button>
        </div>
    );
};

export default ShopAppliedFilters;
