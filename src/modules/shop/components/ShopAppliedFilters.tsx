import type { ReactNode } from "react";
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
    /** Versión mobile: chips redondos compactos, sin iconos ni tonos por tipo,
        con ✕ de área táctil ampliada. Web (sin compact) conserva el badge actual. */
    compact?: boolean;
}

const badgeBase = (isDark: boolean) =>
    `badge badge-sm gap-1 pr-1 h-auto py-1.5 border-blue-950/20 bg-blue-950/5 ${
        isDark ? "text-base-content" : "text-blue-950"
    } hover:text-primary cursor-default transition-colors`;

/* ── Chip de filtro aplicado ──
   Web: badge con icono + tono por tipo de filtro (idéntico al diseño anterior).
   Compact (mobile): chip redondo pequeño y uniforme; el ✕ conserva un icono de
   12px pero su área táctil se amplía ~36px con un pseudo-elemento after:-inset-2,
   sin inflar el chip. */
interface ChipProps {
    isDark: boolean;
    compact?: boolean;
    /** Classes extra del badge web (tonos por tipo de filtro) */
    tone?: string;
    icon?: ReactNode;
    label: string;
    /** Classes extra para el span del label (p. ej. truncate de SKUs en web) */
    labelClass?: string;
    ariaLabel: string;
    onRemove: () => void;
}

const Chip = ({ isDark, compact, tone, icon, label, labelClass, ariaLabel, onRemove }: ChipProps) => (
    <span
        className={
            compact
                ? clsx(
                    "inline-flex items-center gap-1 rounded-full border border-blue-950/15 bg-blue-950/5 px-2 py-1 text-[11px] font-semibold leading-none",
                    isDark ? "text-base-content" : "text-blue-950"
                )
                : clsx(badgeBase(isDark), tone)
        }
    >
        {!compact && icon}
        <span className={compact ? clsx("truncate", labelClass ?? "max-w-[150px]") : labelClass}>
            {label}
        </span>
        <button
            type="button"
            onClick={onRemove}
            aria-label={ariaLabel}
            className={
                compact
                    // after:-inset-2 extiende el target real a ~36px sin cambiar el layout
                    ? "relative -my-1 ml-0.5 flex items-center justify-center rounded-full p-1 transition-colors hover:bg-error/15 hover:text-error after:absolute after:-inset-2 after:content-['']"
                    : "ml-0.5 hover:text-error transition-colors"
            }
        >
            <X size={compact ? 12 : 11} />
        </button>
    </span>
);

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
    compact = false,
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
                <Chip
                    isDark={isDark}
                    compact={compact}
                    tone="!border-rose-400/30 !bg-rose-500/10 text-rose-500 hover:text-rose-600"
                    icon={<FaHeart size={9} />}
                    label="Solo favoritos"
                    ariaLabel="Quitar filtro de favoritos"
                    onRemove={() => onRemoveFilter("favorite")}
                />
            )}

            {offerCheck && (
                <Chip
                    isDark={isDark}
                    compact={compact}
                    tone="!border-warning/40 !bg-warning/15 text-warning-content font-semibold"
                    icon={<FaTag size={9} />}
                    label="Solo ofertas"
                    ariaLabel="Quitar filtro de ofertas"
                    onRemove={() => onRemoveFilter("offer")}
                />
            )}

            {stockCheck && (
                <Chip
                    isDark={isDark}
                    compact={compact}
                    icon={<FaBoxOpen size={10} />}
                    label="Con stock"
                    ariaLabel="Quitar filtro de stock"
                    onRemove={() => onRemoveFilter("stock")}
                />
            )}

            {ratingFilter !== undefined && (
                <Chip
                    isDark={isDark}
                    compact={compact}
                    icon={<FaStar size={9} className="text-warning" />}
                    label={`Calificación ≥ ${ratingFilter}`}
                    ariaLabel="Quitar filtro de calificación"
                    onRemove={() => onRemoveFilter("rating")}
                />
            )}

            {colorLineFilter && (
                <Chip
                    isDark={isDark}
                    compact={compact}
                    label={`Línea: ${colorLineFilter}`}
                    ariaLabel="Quitar filtro de línea de color"
                    onRemove={() => onRemoveFilter("colorLine")}
                />
            )}

            {priceRange && (
                <Chip
                    isDark={isDark}
                    compact={compact}
                    label={`Precio: $${priceRange.min}${priceRange.max ? ` - $${priceRange.max}` : "+"}`}
                    ariaLabel="Quitar rango de precio"
                    onRemove={() => onRemoveFilter("priceRange")}
                />
            )}

            {skuFilter !== undefined && skuFilter.length > 0 && (
                <Chip
                    isDark={isDark}
                    compact={compact}
                    icon={<FaBarcode size={10} />}
                    label={`SKUs: ${skuFilter.join(", ")}`}
                    labelClass="max-w-48 truncate"
                    ariaLabel="Quitar filtro de SKUs"
                    onRemove={() => onRemoveFilter("sku")}
                />
            )}

            {activeSorts?.map((s) => (
                <Chip
                    key={s.field}
                    isDark={isDark}
                    compact={compact}
                    icon={<ArrowUpDown size={9} />}
                    label={s.label}
                    ariaLabel={`Quitar orden por ${s.label}`}
                    onRemove={() => onRemoveSort?.(s.field)}
                />
            ))}

            {pendingTagNames.map((tag) => (
                <Chip
                    key={tag.id}
                    isDark={isDark}
                    compact={compact}
                    icon={<FaTag size={8} />}
                    label={`etiqueta: ${tag.name}`}
                    ariaLabel={`Quitar etiqueta ${tag.name}`}
                    onRemove={() => onRemoveTag(tag.id)}
                />
            ))}

            {(tagNameFilter ?? []).map((name) => (
                <Chip
                    key={`tag-name-${name}`}
                    isDark={isDark}
                    compact={compact}
                    icon={<FaTag size={8} />}
                    label={`nombre etiqueta: ${name}`}
                    ariaLabel={`Quitar etiqueta ${name}`}
                    onRemove={() => onRemoveTagName?.(name)}
                />
            ))}

            <button
                type="button"
                className={clsx(
                    "btn btn-ghost btn-xs gap-1 text-error hover:bg-error/10 normal-case",
                    compact && "h-7 px-2.5 rounded-full font-bold"
                )}
                onClick={onClearAll}
            >
                <X size={12} />
                Limpiar filtros
            </button>
        </div>
    );
};

export default ShopAppliedFilters;
