import { useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";
import ShopFiltersContent from "./ShopFiltersContent";
import type { CategoryType } from "../../categories/CategoriesTypes";
import type { colorLine, PublicCategoryTagItem } from "../../products/ProductTypes";

interface ShopMobileFiltersProps {
    isOpen: boolean;
    onClose: () => void;

    categories?: CategoryType[];
    categoriesLoading: boolean;
    categoriesError: Error | null;
    refetchCategories: () => void;
    selectedCategory?: CategoryType;
    onSelectCategory: (category: CategoryType) => void;
    onClearSelection: () => void;

    tagsByTier: [number, PublicCategoryTagItem[]][];
    tagsLoading: boolean;
    pendingTagIds: string[];
    onToggleTag: (tagId: string) => void;

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

    activeFilterCount: number;
}

const ShopMobileFilters = ({
    isOpen,
    onClose,

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

    activeFilterCount,
}: ShopMobileFiltersProps) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    return (
        <div
            className={clsx(
                "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            aria-hidden={!isOpen}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={clsx(
                    "absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-base-200/60 border-l border-base-300 shadow-2xl flex flex-col transition-transform duration-300",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                role="dialog"
                aria-label="Filtros"
            >
                <div className="px-4 py-3.5 border-b border-base-300 bg-base-200/90 flex items-center justify-between sticky top-0">
                    <h3 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                        <SlidersHorizontal size={14} className="text-warning" />
                        Filtros
                        {activeFilterCount > 0 && (
                            <span className="badge badge-primary badge-sm font-bold">
                                {activeFilterCount}
                            </span>
                        )}
                    </h3>
                    <button
                        type="button"
                        className="btn btn-xs btn-ghost btn-circle"
                        onClick={onClose}
                        aria-label="Cerrar filtros"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-base-100">
                    <ShopFiltersContent
                        categories={categories}
                        categoriesLoading={categoriesLoading}
                        categoriesError={categoriesError}
                        refetchCategories={refetchCategories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={(cat) => {
                            onSelectCategory(cat);
                            onClose();
                        }}
                        onClearSelection={() => {
                            onClearSelection();
                            onClose();
                        }}

                        tagsByTier={tagsByTier}
                        tagsLoading={tagsLoading}
                        pendingTagIds={pendingTagIds}
                        onToggleTag={onToggleTag}

                        isAuth={isAuth}
                        favoriteCheck={favoriteCheck}
                        onSetFavoriteCheck={onSetFavoriteCheck}
                        offerCheck={offerCheck}
                        onSetOfferCheck={onSetOfferCheck}
                        stockCheck={stockCheck}
                        onSetStockCheck={onSetStockCheck}
                        ratingFilter={ratingFilter}
                        onSetRatingFilter={onSetRatingFilter}
                        colorLineFilter={colorLineFilter}
                        onSetColorLine={onSetColorLine}
                        skuFilter={skuFilter}
                        onSetSkuFilter={onSetSkuFilter}
                        localPriceRange={localPriceRange}
                        setLocalPriceRange={setLocalPriceRange}
                        onApplyPriceRange={onApplyPriceRange}
                        priceRange={priceRange}
                        onClearPriceRange={onClearPriceRange}
                    />
                </div>

                <div className="p-3 border-t border-base-300 bg-base-200/90">
                    <button
                        type="button"
                        className="btn btn-primary btn-sm w-full font-bold"
                        onClick={onClose}
                    >
                        Ver {activeFilterCount > 0 ? `${activeFilterCount} filtro${activeFilterCount !== 1 ? "s" : ""} aplicado${activeFilterCount !== 1 ? "s" : ""}` : "resultados"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopMobileFilters;
