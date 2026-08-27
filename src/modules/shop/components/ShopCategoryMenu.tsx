import { IoIosArrowDown } from "react-icons/io";
import { FaStore } from "react-icons/fa6";
import clsx from "clsx";
import SubcategoryMenu from "../../categories/components/SubcategoryMenu";
import type { CategoryType, SubcategoriesType } from "../../categories/CategoriesTypes";

interface ShopCategoryMenuProps {
    categories?: CategoryType[];
    categoriesLoading: boolean;
    categoriesError: Error | null;
    refetchCategories: () => void;
    selectedCategory?: CategoryType;
    subcategories: SubcategoriesType[];
    subcategoriesLoading: boolean;
    subcategoriesError: Error | null;
    refetchSubcategories: () => void;
    onSelectCategory: (category: CategoryType) => void;
    onClearSelection: () => void;
    onSelectSubcategory: (uuid: string) => void;
}

const ShopCategoryMenu = ({
    categories,
    categoriesLoading,
    categoriesError,
    refetchCategories,
    selectedCategory,
    subcategories,
    subcategoriesLoading,
    subcategoriesError,
    refetchSubcategories,
    onSelectCategory,
    onClearSelection,
    onSelectSubcategory,
}: ShopCategoryMenuProps) => {
    return (
        <div className="flex flex-col gap-1">
            <button
                className={clsx(
                    "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150",
                    !selectedCategory
                        ? "bg-blue-950 text-white shadow-sm"
                        : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                )}
                onClick={onClearSelection}
            >
                <FaStore className="text-xs shrink-0" />
                Ver todos los productos
            </button>

            {categoriesLoading && !categoriesError && (!categories || categories.length === 0) && (
                <div className="w-full flex flex-col gap-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-full h-9 skeleton rounded-lg opacity-25" />
                    ))}
                </div>
            )}

            {!categoriesLoading && categoriesError && (
                <div className="flex flex-col gap-2">
                    <p className="text-error text-sm font-medium">Error al cargar categorías</p>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => refetchCategories()}>
                        Reintentar
                    </button>
                </div>
            )}

            {!categoriesLoading && !categoriesError && categories && categories.length > 0 && (
                <div className="w-full flex flex-col gap-1">
                    {categories.map((category, index) => (
                        <div key={index} className="w-full">
                            <button
                                className={clsx(
                                    "w-full px-3 py-2 text-left flex items-center justify-between text-sm rounded-xl transition-all duration-150",
                                    selectedCategory && category.uuid === selectedCategory.uuid
                                        ? "bg-blue-950 text-white font-bold"
                                        : "font-semibold text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                )}
                                type="button"
                                onClick={() => onSelectCategory(category)}
                            >
                                {category.name}
                                <IoIosArrowDown
                                    className={clsx(
                                        "text-xs shrink-0 transition-transform duration-200",
                                        selectedCategory && category.uuid === selectedCategory.uuid
                                            ? "rotate-180 text-warning"
                                            : "text-base-content/40"
                                    )}
                                />
                            </button>

                            <div
                                className={clsx(
                                    "w-full pl-2 ml-2 border-l-2 border-warning/30",
                                    subcategories.length > 0 &&
                                        selectedCategory &&
                                        category.uuid === selectedCategory.uuid
                                        ? "block mt-1 mb-2"
                                        : "hidden"
                                )}
                            >
                                {subcategoriesLoading ? (
                                    <div className="flex items-center gap-2 py-2 px-2">
                                        <span className="loading loading-spinner loading-xs text-warning" />
                                        <span className="text-xs text-base-content/40 font-medium">Cargando...</span>
                                    </div>
                                ) : subcategoriesError ? (
                                    <div className="flex flex-col gap-1 py-1">
                                        <p className="text-error text-xs">Error al cargar subcategorías</p>
                                        <button
                                            className="mt-2 btn btn-primary btn-xs w-fit"
                                            onClick={() => refetchSubcategories()}
                                        >
                                            Reintentar
                                        </button>
                                    </div>
                                ) : (
                                    <SubcategoryMenu
                                        data={subcategories}
                                        onFindAncestors={onSelectSubcategory}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShopCategoryMenu;
