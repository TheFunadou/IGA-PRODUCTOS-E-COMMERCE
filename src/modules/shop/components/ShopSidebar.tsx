import { SlidersHorizontal } from "lucide-react";
import ShopFiltersContent from "./ShopFiltersContent";
import type { CategoryType } from "../../categories/CategoriesTypes";
import type { colorLine, PublicCategoryTagItem } from "../../products/ProductTypes";

interface ShopSidebarProps {
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

const ShopSidebar = ({
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
}: ShopSidebarProps) => {
    return (
        <aside className="hidden lg:block w-full lg:w-64 xl:w-72 shrink-0">
            <div className="w-full bg-base-100 rounded-2xl border border-base-300 overflow-hidden sticky top-35">
                <div className="px-4 py-3.5 border-b border-base-200 bg-base-200/60 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                        <SlidersHorizontal size={14} className="text-warning" />
                        Filtros
                    </h3>
                    {activeFilterCount > 0 && (
                        <span className="badge badge-primary badge-sm font-bold">
                            {activeFilterCount}
                        </span>
                    )}
                </div>

                <ShopFiltersContent
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
        </aside>
    );
};

export default ShopSidebar;
