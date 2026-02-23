import clsx from "clsx";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useCategories } from "../../modules/categories/hooks/useCategories";
import { findAncestors } from "../../modules/categories/CategoriesUtils";
import type { SubcategoriesType } from "../../modules/categories/CategoriesTypes";
// Using local icon or just text if icon not available, MdKeyboardArrowRight is standard.

type Props = {
    onScheduleHide: () => void;
};

// Recursive component to render subcategories
const SubcategoryList = ({ items, level = 0, onItemClick }: { items: SubcategoriesType[], level?: number, onItemClick: (uuid: string) => void }) => {
    if (!items || items.length === 0) return null;

    return (
        <ul className={clsx("flex flex-col gap-1", level === 0 ? "pt-2" : "pl-4 border-l border-base-content/10 ml-2 mt-1")}>
            {items.map((sub) => (
                <li key={sub.uuid} className="flex flex-col">
                    <div
                        className="group flex items-center justify-between py-1 px-2 rounded-lg hover:bg-base-200 cursor-pointer transition-all duration-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            onItemClick(sub.uuid);
                        }}
                    >
                        <span
                            className={clsx(
                                "text-sm group-hover:text-primary transition-colors",
                                level === 0 ? "font-semibold text-base-content" : "text-base-content/80"
                            )}
                        >
                            {sub.description}
                        </span>
                        {sub.children && sub.children.length > 0 && level === 0 && (
                            <MdKeyboardArrowRight className="text-base-content/30 group-hover:text-primary transition-colors" />
                        )}
                    </div>

                    {/* Always render children if they exist, creating a vertical list structure */}
                    {sub.children && sub.children.length > 0 && (
                        <SubcategoryList items={sub.children} level={level + 1} onItemClick={onItemClick} />
                    )}
                </li>
            ))}
        </ul>
    );
};

const ShopMenuPreview = ({ onScheduleHide }: Props) => {
    const navigate = useNavigate();

    const {
        categories,
        categoriesLoading,
        selectedCategory,
        handleChangeCategory,
        subcategories,
        subcategoriesLoading,
        subcategoriesError,
    } = useCategories();


    // Select the first category by default if none selected and categories exist
    useEffect(() => {
        if (!selectedCategory && categories && categories.length > 0) {
            handleChangeCategory(categories[0]);
        }
    }, [categories, selectedCategory]);

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/tienda?category=${categoryName.toLowerCase()}`);
        // Close menu logic could be added here if passed from parent, 
        // but navigating usually re-renders or changes page. 
        // If on same page, we might want to close.
        // For now, rely on mouse leave or navigation unmount.
    };

    const handleSubcategoryClick = (subUuid: string) => {
        if (!selectedCategory) return;

        // Use the tree from hook if available, otherwise we might need to rely on the passed items
        // But findAncestors needs the tree. 'subcategories' from useCategories is the tree of the CURRENT selected category.
        // So we can use 'subcategories' here.
        const path = findAncestors(subcategories, subUuid);

        // If path is found, navigate
        if (path.length > 0) {
            const subParams = path.map(id => `sub=${id}`).join("&");
            const url = `/tienda?category=${selectedCategory.name.toLowerCase()}&${subParams}&page=1`;
            navigate(url);
        } else {
            // If for some reason path is not found (should not happen if UUID is valid in the tree), 
            // try navigating just to the category or search? 
            // Fallback: Just navigate to category
            navigate(`/tienda?category=${selectedCategory.name.toLowerCase()}`);
        }
    };

    return (
        <div
            onMouseLeave={onScheduleHide}
            className="absolute top-full left-0 mt-0 pt-2 z-50"
        >
            {/* Main Container with Glassmorphism / Shadow */}
            <div className="flex w-[800px] h-[500px] bg-base-100 rounded-xl shadow-2xl overflow-hidden border border-base-200 ring-1 ring-black/5">

                {/* Left Panel: Main Categories */}
                <div className="w-1/3 bg-base-200/50 overflow-y-auto custom-scrollbar border-r border-base-200 flex flex-col">
                    <div className="p-4 pb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 px-2">Categorías</h3>
                    </div>

                    <div className="flex flex-col p-2 pt-0 gap-1">
                        {categoriesLoading && (
                            <div className="p-4 flex items-center justify-center text-base-content/50 text-sm">Cargando...</div>
                        )}

                        {categories?.map((cat) => (
                            <div
                                key={cat.uuid}
                                onMouseEnter={() => handleChangeCategory(cat)}
                                onClick={() => handleCategoryClick(cat.name)}
                                className={clsx(
                                    "px-4 py-3 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 group relative",
                                    selectedCategory?.uuid === cat.uuid
                                        ? "bg-base-100 shadow-sm text-primary font-medium"
                                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                )}
                            >
                                {selectedCategory?.uuid === cat.uuid && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-md" />
                                )}
                                <span className={clsx("truncate", selectedCategory?.uuid === cat.uuid && "pl-1")}>{cat.name}</span>
                                <MdKeyboardArrowRight
                                    className={clsx(
                                        "text-xl transition-transform duration-200",
                                        selectedCategory?.uuid === cat.uuid ? "text-primary translate-x-1" : "text-base-content/30 group-hover:text-base-content/50"
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Subcategories */}
                <div className="w-2/3 bg-base-100 flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-base-200 flex items-center justify-between bg-base-100 sticky top-0 z-10 w-full">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-base-content/50">Explorando</span>
                            <h2
                                className="text-2xl font-bold text-primary cursor-pointer hover:underline decoration-2 underline-offset-4 decoration-primary/30 hover:decoration-primary"
                                onClick={() => selectedCategory && handleCategoryClick(selectedCategory.name)}
                            >
                                {selectedCategory?.name || "Selecciona una categoría"}
                            </h2>
                        </div>
                        <Link
                            to={selectedCategory ? `/tienda?category=${selectedCategory.name.toLowerCase()}` : "/tienda"}
                            className="btn btn-sm btn-ghost gap-2 normal-case font-normal text-base-content/70 hover:text-primary hover:bg-primary/10"
                        >
                            Ver todo <MdKeyboardArrowRight className="text-lg" />
                        </Link>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {subcategoriesLoading && (
                            <div className="flex h-full items-center justify-center gap-2 text-base-content/50">
                                <span className="loading loading-spinner loading-md"></span>
                                <span className="text-sm">Cargando subcategorías...</span>
                            </div>
                        )}

                        {!subcategoriesLoading && subcategoriesError && (
                            <div className="flex h-full flex-col items-center justify-center gap-4 text-center p-8">
                                <p className="text-base-content/60">No pudimos cargar las opciones disponible.</p>
                                <button className="btn btn-sm btn-outline" onClick={() => window.location.reload()}>Reintentar</button>
                            </div>
                        )}

                        {!subcategoriesLoading && !subcategoriesError && (!subcategories || subcategories.length === 0) && (
                            <div className="flex h-full items-center justify-center text-base-content/50 italic">
                                No hay subcategorías disponibles.
                            </div>
                        )}

                        {!subcategoriesLoading && subcategories && subcategories.length > 0 && (
                            <div className="grid grid-cols-2 gap-x-8 gap-y-8 pb-10">
                                {/* If we have many top-level subcategories, grid them. */}
                                {/* The recursive list will handle the children. */}
                                {/* To make better use of space, we can split the main list into columns if needed, 
                                    but CSS grid-cols-2 is a good start for the top level items. */}
                                {subcategories.map(rootSub => (
                                    <div key={rootSub.uuid} className="break-inside-avoid">
                                        {/* Render the root item as a header-like link */}
                                        <div
                                            className="font-bold text-lg text-base-content mb-2 cursor-pointer hover:text-primary transition-colors flex items-center gap-1 group"
                                            onClick={() => handleSubcategoryClick(rootSub.uuid)}
                                        >
                                            {rootSub.description}
                                            <MdKeyboardArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary text-xl" />
                                        </div>
                                        {/* Render children */}
                                        {rootSub.children && (
                                            <SubcategoryList items={rootSub.children} onItemClick={handleSubcategoryClick} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopMenuPreview;
