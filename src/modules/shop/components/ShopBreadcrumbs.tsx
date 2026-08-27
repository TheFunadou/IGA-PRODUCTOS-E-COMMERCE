import type { CategoryType } from "../../categories/CategoriesTypes";

interface ShopBreadcrumbsProps {
    selectedCategory?: CategoryType;
    subcategoriesBreadcrumb: string[];
    onSelectCategory: (category: CategoryType) => void;
    onSelectSubcategory: (index: number) => void;
    totalRecords: number;
}

const ShopBreadcrumbs = ({
    selectedCategory,
    subcategoriesBreadcrumb,
    onSelectCategory,
    onSelectSubcategory,
    totalRecords,
}: ShopBreadcrumbsProps) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="breadcrumbs text-sm font-semibold">
                <ul>
                    <li>
                        <button
                            type="button"
                            onClick={() => {}}
                            className="text-primary hover:opacity-80 transition-opacity"
                        >
                            Tienda
                        </button>
                    </li>
                    {selectedCategory && (
                        <li>
                            <button
                                type="button"
                                onClick={() => onSelectCategory(selectedCategory)}
                                className="hover:text-primary transition-colors"
                            >
                                {selectedCategory.name}
                            </button>
                        </li>
                    )}
                    {subcategoriesBreadcrumb.map((name, index) => (
                        <li key={index}>
                            <button
                                type="button"
                                onClick={() => onSelectSubcategory(index)}
                                className={`hover:text-primary transition-colors ${
                                    index === subcategoriesBreadcrumb.length - 1
                                        ? "text-warning font-bold"
                                        : ""
                                }`}
                            >
                                {name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <p className="text-sm text-base-content/50 font-medium">
                {totalRecords > 0
                    ? `${totalRecords} resultados encontrados`
                    : "Cargando catálogo..."}
            </p>
        </div>
    );
};

export default ShopBreadcrumbs;
