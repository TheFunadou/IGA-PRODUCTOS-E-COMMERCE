import { useState } from "react";
import { FaBoxOpen, FaFilter, FaHeart, FaTag } from "react-icons/fa6";
import { ChevronDown, Star, X } from "lucide-react";
import clsx from "clsx";
import ShopCategoryFilterList from "./ShopCategoryFilterList";
import ShopRatingFilter from "./ShopRatingFilter";
import { scrollToTienda } from "../utils/scrollToTienda";
import type { CategoryType } from "../../categories/CategoriesTypes";
import type { colorLine, PublicCategoryTagItem } from "../../products/ProductTypes";

type ShopAdvancedFilterType =
    | "favorites"
    | "offers"
    | "stock"
    | "rating"
    | "colorLine"
    | "priceRange"
    | "skus";

const COLOR_LINE_LABELS: Record<string, string> = {
    "Linea Basica": "Línea Básica",
    "Linea Especial": "Línea Especial",
    "Linea Flourescente": "Línea Fluorescente",
};

interface ShopFiltersContentProps {
    categories?: CategoryType[];
    categoriesLoading: boolean;
    categoriesError: Error | null;
    refetchCategories: () => void;
    selectedCategory?: CategoryType;
    onSelectCategory: (category: CategoryType) => void;
    onClearSelection: () => void;

    /* Etiquetas */
    tagsByTier: [number, PublicCategoryTagItem[]][];
    tagsLoading: boolean;
    pendingTagIds: string[];
    onToggleTag: (tagId: string) => void;

    /* Filtros avanzados */
    isAuth: boolean;
    favoriteCheck: boolean;
    onSetFavoriteCheck: (checked: boolean) => void;
    offerCheck: boolean;
    onSetOfferCheck: (checked: boolean) => void;
    stockCheck: boolean;
    onSetStockCheck: (checked: boolean) => void;
    ratingFilter?: number;
    onSetRatingFilter: (rating?: number) => void;
    colorLineFilter?: colorLine;
    onSetColorLine: (value: string) => void;
    skuFilter?: string[];
    onSetSkuFilter: (skus?: string[]) => void;
    localPriceRange: { min: string; max: string };
    setLocalPriceRange: React.Dispatch<React.SetStateAction<{ min: string; max: string }>>;
    onApplyPriceRange: () => void;
    priceRange?: { min: number; max: number };
    onClearPriceRange: () => void;
}

const ShopFiltersContent = ({
    categories,
    categoriesLoading,
    categoriesError,
    refetchCategories,
    selectedCategory,
    onSelectCategory,
    onClearSelection,

    tagsByTier,
    tagsLoading,
    pendingTagIds,
    onToggleTag,

    isAuth,
    favoriteCheck,
    onSetFavoriteCheck,
    offerCheck,
    onSetOfferCheck,
    stockCheck,
    onSetStockCheck,
    ratingFilter,
    onSetRatingFilter,
    colorLineFilter,
    onSetColorLine,
    skuFilter,
    onSetSkuFilter,
    localPriceRange,
    setLocalPriceRange,
    onApplyPriceRange,
    priceRange,
    onClearPriceRange,
}: ShopFiltersContentProps) => {
    const [advFiltersOpen, setAdvFiltersOpen] = useState(true);

    /* ── Filtros avanzados por etapas (patrón del panel de administración):
          primero se selecciona el tipo y el valor, y solo al presionar
          "+ Agregar filtro" se aplica a la consulta ── */
    const [advFilterType, setAdvFilterType] = useState<ShopAdvancedFilterType>("colorLine");
    const [advBoolValue, setAdvBoolValue] = useState(true);
    const [advRatingValue, setAdvRatingValue] = useState<number | undefined>(undefined);
    const [advColorValue, setAdvColorValue] = useState("");
    const [advSkuInput, setAdvSkuInput] = useState("");
    const [advSkuDraft, setAdvSkuDraft] = useState<string[]>([]);

    const advFilterOptions: { value: ShopAdvancedFilterType; label: string }[] = [
        ...(isAuth ? [{ value: "favorites" as const, label: "Solo favoritos" }] : []),
        { value: "offers", label: "Solo ofertas" },
        { value: "stock", label: "Con stock" },
        { value: "rating", label: "Rating mínimo" },
        { value: "colorLine", label: "Línea de color" },
        { value: "priceRange", label: "Rango de precio" },
        { value: "skus", label: "SKUs específicos" },
    ];

    const handleAdvTypeChange = (type: ShopAdvancedFilterType) => {
        setAdvFilterType(type);
        setAdvBoolValue(true);
        setAdvRatingValue(undefined);
        setAdvColorValue("");
        setAdvSkuInput("");
        setAdvSkuDraft([]);
        setLocalPriceRange({ min: "", max: "" });
    };

    const isAdvInputEmpty =
        (advFilterType === "rating" && !advRatingValue) ||
        (advFilterType === "colorLine" && !advColorValue) ||
        (advFilterType === "priceRange" && !localPriceRange.min && !localPriceRange.max) ||
        (advFilterType === "skus" && advSkuDraft.length === 0);

    const addSkuToDraft = () => {
        const value = advSkuInput.trim().toUpperCase();
        if (!value) return;
        setAdvSkuDraft((prev) => (prev.includes(value) ? prev : [...prev, value]));
        setAdvSkuInput("");
    };

    const removeSkuFromDraft = (sku: string) => {
        setAdvSkuDraft((prev) => prev.filter((s) => s !== sku));
    };

    const handleAddAdvFilterClick = () => {
        switch (advFilterType) {
            case "favorites":
                onSetFavoriteCheck(advBoolValue);
                break;
            case "offers":
                onSetOfferCheck(advBoolValue);
                break;
            case "stock":
                onSetStockCheck(advBoolValue);
                break;
            case "rating":
                onSetRatingFilter(advRatingValue);
                break;
            case "colorLine":
                onSetColorLine(advColorValue);
                break;
            case "priceRange":
                onApplyPriceRange();
                break;
            case "skus":
                onSetSkuFilter(advSkuDraft);
                setAdvSkuDraft([]);
                break;
        }
        scrollToTienda();
    };

    const renderAdvFilterInput = () => {
        switch (advFilterType) {
            case "favorites":
            case "offers":
            case "stock":
                return (
                    <label
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all",
                            advBoolValue
                                ? "border-primary/40 bg-primary/5 text-base-content"
                                : "border-base-200 bg-base-100 hover:bg-base-200/50 text-base-content/60"
                        )}
                    >
                        <input
                            type="checkbox"
                            className="checkbox checkbox-sm checkbox-primary rounded-sm"
                            checked={advBoolValue}
                            onChange={(e) => setAdvBoolValue(e.target.checked)}
                        />
                        <span className="text-sm font-bold">Habilitar filtro</span>
                    </label>
                );
            case "rating":
                return (
                    <div className="bg-base-200/30 p-3 rounded-xl border border-base-200">
                        <ShopRatingFilter
                            onRatingChange={setAdvRatingValue}
                            value={advRatingValue}
                        />
                    </div>
                );
            case "colorLine":
                return (
                    <select
                        className="select select-sm select-bordered w-full bg-base-100 font-medium text-base-content/80 text-sm"
                        value={advColorValue}
                        onChange={(e) => setAdvColorValue(e.target.value)}
                    >
                        <option value="">Selecciona una línea</option>
                        <option value="Linea Basica">Línea Básica</option>
                        <option value="Linea Especial">Línea Especial</option>
                        <option value="Linea Flourescente">Línea Fluorescente</option>
                    </select>
                );
            case "priceRange":
                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            className="input input-sm input-bordered w-full bg-base-100"
                            value={localPriceRange.min}
                            onChange={(e) =>
                                setLocalPriceRange((prev) => ({ ...prev, min: e.target.value }))
                            }
                            min={0}
                        />
                        <span className="text-base-content/50">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            className="input input-sm input-bordered w-full bg-base-100"
                            value={localPriceRange.max}
                            onChange={(e) =>
                                setLocalPriceRange((prev) => ({ ...prev, max: e.target.value }))
                            }
                            min={0}
                        />
                    </div>
                );
            case "skus":
                return (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Ingresa un SKU"
                                className="input input-sm input-bordered w-full bg-base-100 font-medium"
                                value={advSkuInput}
                                onChange={(e) => setAdvSkuInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addSkuToDraft();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={addSkuToDraft}
                                disabled={!advSkuInput.trim()}
                                aria-label="Agregar SKU a la lista"
                                className="btn btn-sm btn-outline border-base-300 hover:border-primary/50 hover:bg-primary/5 shrink-0 px-3"
                            >
                                +
                            </button>
                        </div>
                        {advSkuDraft.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {advSkuDraft.map((sku) => (
                                    <span key={sku} className="badge badge-sm gap-1 pr-1 bg-blue-950 text-white border-blue-950 cursor-default">
                                        {sku}
                                        <button
                                            type="button"
                                            aria-label={`Quitar ${sku}`}
                                            onClick={() => removeSkuFromDraft(sku)}
                                            className="hover:text-warning transition-colors ml-0.5"
                                        >
                                            <X size={10} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                );
        }
    };

    const appliedAdvCount =
        (favoriteCheck ? 1 : 0) +
        (offerCheck ? 1 : 0) +
        (stockCheck ? 1 : 0) +
        (ratingFilter ? 1 : 0) +
        (colorLineFilter ? 1 : 0) +
        (skuFilter !== undefined && skuFilter.length > 0 ? 1 : 0) +
        (priceRange ? 1 : 0);

    return (
        <div className="flex flex-col divide-y divide-base-200">
            {/* ── Categoría (listado con etiquetas anidadas) ── */}
            <div className="px-4 py-4">
                <ShopCategoryFilterList
                    categories={categories}
                    categoriesLoading={categoriesLoading}
                    categoriesError={categoriesError}
                    refetchCategories={refetchCategories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={onSelectCategory}
                    onClearSelection={onClearSelection}

                    tagsByTier={tagsByTier}
                    tagsLoading={tagsLoading}
                    pendingTagIds={pendingTagIds}
                    onToggleTag={onToggleTag}
                />
            </div>

            {/* ── Filtros avanzados (colapsable) ── */}
            <div className="px-4 py-4">
                <button
                    type="button"
                    className="flex items-center justify-between w-full text-xs font-bold text-base-content/50 uppercase tracking-wider hover:text-primary transition-colors"
                    onClick={() => setAdvFiltersOpen(!advFiltersOpen)}
                >
                    <span className="flex items-center gap-2">
                        <FaFilter className="text-warning text-xs" />
                        Filtros avanzados
                        {appliedAdvCount > 0 && (
                            <span className="badge badge-primary badge-xs font-bold">
                                {appliedAdvCount}
                            </span>
                        )}
                    </span>
                    <ChevronDown
                        size={14}
                        className={clsx(
                            "transition-transform duration-200",
                            advFiltersOpen && "rotate-180"
                        )}
                    />
                </button>

                {advFiltersOpen && (
                    <div className="flex flex-col gap-3 mt-4">
                        {/* Select de tipo de filtro */}
                        <select
                            className="select select-bordered select-sm w-full bg-base-100 font-medium text-base-content/80 text-sm"
                            value={advFilterType}
                            onChange={(e) => handleAdvTypeChange(e.target.value as ShopAdvancedFilterType)}
                        >
                            {advFilterOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        {/* Input dinámico según el tipo */}
                        {renderAdvFilterInput()}

                        {/* Aplicar el filtro seleccionado */}
                        <button
                            type="button"
                            className="btn btn-sm bg-blue-950 text-white hover:bg-blue-900 w-full font-bold border-none"
                            onClick={handleAddAdvFilterClick}
                            disabled={isAdvInputEmpty}
                        >
                            + Agregar filtro
                        </button>

                        {/* Filtros avanzados aplicados */}
                        {appliedAdvCount > 0 && (
                            <div className="border-t border-base-200 pt-2.5 flex flex-wrap gap-1.5">
                                {favoriteCheck && (
                                    <span className="badge badge-sm gap-1 pr-1 bg-blue-950 text-white border-blue-950 cursor-default">
                                        <FaHeart className="text-[9px]" />
                                        Solo favoritos
                                        <button
                                            type="button"
                                            aria-label="Quitar filtro de favoritos"
                                            onClick={() => onSetFavoriteCheck(false)}
                                            className="hover:text-warning transition-colors ml-0.5"
                                        >
                                            <X size={10} />
                                        </button>
                                    </span>
                                )}
                                {offerCheck && (
                                    <span className="badge badge-sm gap-1 pr-1 bg-blue-950 text-white border-blue-950 cursor-default">
                                        <FaTag className="text-[9px]" />
                                        Solo ofertas
                                        <button
                                            type="button"
                                            aria-label="Quitar filtro de ofertas"
                                            onClick={() => onSetOfferCheck(false)}
                                            className="hover:text-warning transition-colors ml-0.5"
                                        >
                                            <X size={10} />
                                        </button>
                                    </span>
                                )}
                                {stockCheck && (
                                    <span className="badge badge-sm gap-1 pr-1 bg-blue-950 text-white border-blue-950 cursor-default">
                                        <FaBoxOpen className="text-[9px]" />
                                        Con stock
                                        <button
                                            type="button"
                                            aria-label="Quitar filtro de stock"
                                            onClick={() => onSetStockCheck(false)}
                                            className="hover:text-warning transition-colors ml-0.5"
                                        >
                                            <X size={10} />
                                        </button>
                                    </span>
                                )}
                                {ratingFilter && (
                                    <span className="badge badge-sm gap-1 pr-1 bg-blue-950 text-white border-blue-950 cursor-default">
                                        <Star size={9} />
                                        Rating mínimo: {ratingFilter}
                                        <button
                                            type="button"
                                            aria-label="Quitar filtro de rating"
                                            onClick={() => onSetRatingFilter(undefined)}
                                            className="hover:text-warning transition-colors ml-0.5"
                                        >
                                            <X size={10} />
                                        </button>
                                    </span>
                                )}
                                {colorLineFilter && (
                                    <span className="badge badge-sm gap-1 pr-1 bg-blue-950 text-white border-blue-950 cursor-default">
                                        Línea: {COLOR_LINE_LABELS[colorLineFilter] ?? colorLineFilter}
                                        <button
                                            type="button"
                                            aria-label="Quitar filtro de línea de color"
                                            onClick={() => onSetColorLine("")}
                                            className="hover:text-warning transition-colors ml-0.5"
                                        >
                                            <X size={10} />
                                        </button>
                                    </span>
                                )}
                                {priceRange && (
                                    <span className="badge badge-sm gap-1 pr-1 bg-blue-950 text-white border-blue-950 cursor-default">
                                        ${priceRange.min} - ${priceRange.max}
                                        <button
                                            type="button"
                                            aria-label="Quitar rango de precio"
                                            onClick={onClearPriceRange}
                                            className="hover:text-warning transition-colors ml-0.5"
                                        >
                                            <X size={10} />
                                        </button>
                                    </span>
                                )}
                                {skuFilter !== undefined && skuFilter.length > 0 && (
                                    <span className="badge badge-sm gap-1 pr-1 bg-blue-950 text-white border-blue-950 cursor-default">
                                        SKU: {skuFilter.join(", ")}
                                        <button
                                            type="button"
                                            aria-label="Quitar filtro de SKUs"
                                            onClick={() => onSetSkuFilter(undefined)}
                                            className="hover:text-warning transition-colors ml-0.5"
                                        >
                                            <X size={10} />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopFiltersContent;
