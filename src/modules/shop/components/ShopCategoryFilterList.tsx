import { useMemo, useState } from "react";
import { FaStore } from "react-icons/fa6";
import { ChevronDown, Tag } from "lucide-react";
import clsx from "clsx";
import type { CategoryType } from "../../categories/CategoriesTypes";
import type { PublicCategoryTagItem } from "../../products/ProductTypes";

const CATEGORY_ORDER = ["Cascos", "Suspensiones", "Barboquejos", "Lentes", "Otros Articulos"];

interface ShopCategoryFilterListProps {
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
}

const ShopCategoryFilterList = ({
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
}: ShopCategoryFilterListProps) => {
    const orderedCategories = useMemo(() => {
        if (!categories) return [];
        const indexByUuid = new Map(categories.map((cat, index) => [cat.uuid, index]));
        return [...categories].sort((a, b) => {
            const rankA = CATEGORY_ORDER.indexOf(a.name);
            const rankB = CATEGORY_ORDER.indexOf(b.name);
            if (rankA === -1 && rankB === -1) {
                const indexA = indexByUuid.get(a.uuid) ?? 0;
                const indexB = indexByUuid.get(b.uuid) ?? 0;
                return indexA - indexB;
            }
            if (rankA === -1) return 1;
            if (rankB === -1) return -1;
            return rankA - rankB;
        });
    }, [categories]);

    const [isOpen, setIsOpen] = useState(true);

    const isAllStoreActive = !selectedCategory;

    return (
        <div>
            <button
                type="button"
                className="flex items-center justify-between w-full text-xs font-bold text-base-content/50 uppercase tracking-wider hover:text-primary transition-colors"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2">
                    <FaStore className="text-warning text-sm" />
                    Categorías
                </span>
                <ChevronDown
                    size={14}
                    className={clsx(
                        "transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && (
            <div className="w-full flex flex-col gap-1 mt-2">
                <button
                    type="button"
                    className={clsx(
                        "w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-semibold text-left transition-all duration-150 border-r-3",
                        isAllStoreActive
                            ? "bg-blue-950 text-white border-warning shadow-sm"
                            : "border-transparent text-base-content/60 hover:bg-base-200 hover:text-base-content"
                    )}
                    onClick={onClearSelection}
                >
                    Toda la tienda
                </button>

                {categoriesLoading && (
                    <div className="flex items-center gap-2 py-2 px-2 text-xs text-base-content/40">
                        <span className="loading loading-spinner loading-xs text-primary" />
                        Cargando...
                    </div>
                )}

                {categoriesError && !categoriesLoading && (
                    <div className="flex flex-col gap-1.5 py-1 px-1">
                        <p className="text-xs text-error font-medium">No se pudieron cargar las categorías</p>
                        <button
                            type="button"
                            onClick={refetchCategories}
                            className="text-xs text-primary underline underline-offset-2 hover:opacity-70 transition-opacity w-fit"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {!categoriesLoading && !categoriesError && orderedCategories.length === 0 && (
                    <p className="text-xs text-base-content/40 py-1 px-2">Sin categorías</p>
                )}

                {orderedCategories.map((category) => {
                    const isActive = selectedCategory?.uuid === category.uuid;
                    return (
                        <div key={category.uuid} className="w-full">
                            <button
                                type="button"
                                className={clsx(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm text-left transition-all duration-150 border-r-3",
                                    isActive
                                        ? "bg-blue-950 text-white font-bold border-warning shadow-sm"
                                        : "border-transparent font-semibold text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                )}
                                onClick={() => onSelectCategory(category)}
                            >
                                {category.name}
                            </button>

                            {isActive && (
                                <div className="w-full ml-3 pl-3 border-l-2 border-blue-950/20 mt-1 mb-2">
                                    {tagsLoading ? (
                                        <div className="flex items-center gap-2 py-2 text-xs text-base-content/40">
                                            <span className="loading loading-spinner loading-xs text-primary" />
                                            Cargando etiquetas...
                                        </div>
                                    ) : tagsByTier.length > 0 ? (
                                        <div className="flex flex-col">
                                            {tagsByTier.map(([tier, tags]) => (
                                                <div
                                                    key={tier}
                                                    className="flex flex-wrap gap-1.5 py-2 border-t border-base-200/60 first:border-t-0 first:pt-0"
                                                >
                                                    {tags.map((tag) => {
                                                        const isSelected = pendingTagIds.includes(tag.id);
                                                        return (
                                                            <button
                                                                key={tag.id}
                                                                type="button"
                                                                onClick={() => onToggleTag(tag.id)}
                                                                title={`Tier ${tier}`}
                                                                className={clsx(
                                                                    "badge badge-sm cursor-pointer transition-all duration-150 gap-1",
                                                                    isSelected
                                                                        ? "bg-blue-950 border-blue-950 text-white hover:bg-blue-800"
                                                                        : "bg-base-100 text-base-content/80 border-base-300 hover:border-blue-950/40 hover:bg-blue-950/5 hover:text-blue-950"
                                                                )}
                                                            >
                                                                <Tag size={9} />
                                                                {tag.name}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-base-content/40 py-1">
                                            No hay etiquetas para esta categoría
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            )}
        </div>
    );
};

export default ShopCategoryFilterList;