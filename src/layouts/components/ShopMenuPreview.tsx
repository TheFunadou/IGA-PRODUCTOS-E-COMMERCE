import clsx from "clsx";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { useCategories } from "../../modules/categories/hooks/useCategories";
import { findAncestors } from "../../modules/categories/CategoriesUtils";
import type { SubcategoriesType } from "../../modules/categories/CategoriesTypes";

type Props = {
    onScheduleHide: () => void;
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

    const [hoveredSubcategory, setHoveredSubcategory] = useState<SubcategoriesType | null>(null);
    const hoverTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (!selectedCategory && categories && categories.length > 0) {
            handleChangeCategory(categories[0]);
        }
    }, [categories, selectedCategory]);

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current !== null) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const cancelHoverTimeout = useCallback(() => {
        if (hoverTimeoutRef.current !== null) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    }, []);

    const scheduleClearHover = useCallback(() => {
        cancelHoverTimeout();
        hoverTimeoutRef.current = window.setTimeout(() => {
            setHoveredSubcategory(null);
        }, 150);
    }, [cancelHoverTimeout]);

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/tienda?category=${categoryName.toLowerCase()}`);
    };

    const handleSubcategoryClick = (subUuid: string) => {
        if (!selectedCategory) return;
        const path = findAncestors(subcategories, subUuid);
        if (path.length > 0) {
            const subParams = path.map(id => `sub=${id}`).join("&");
            navigate(`/tienda?category=${selectedCategory.name.toLowerCase()}&${subParams}&page=1`);
        } else {
            navigate(`/tienda?category=${selectedCategory.name.toLowerCase()}`);
        }
    };

    const mainSubcategories = subcategories.filter(
        sub => sub.level === 0 || sub.father_uuid === null
    );

    const hoveredChildren = hoveredSubcategory?.children || [];

    return (
        <div
            onMouseLeave={onScheduleHide}
            className="absolute top-full left-0 mt-0 pt-2 z-50"
        >
            <div className="flex w-[56rem] h-[32rem] bg-base-100 rounded-xl shadow-2xl overflow-hidden border border-base-200 ring-1 ring-black/5">

                {/* ─── Left Panel: Main Categories ─── */}
                <div className="w-[28%] bg-base-200/50 overflow-y-auto custom-scrollbar border-r border-base-200 flex flex-col">
                    <div className="p-4 pb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 px-2">
                            Categorías
                        </h3>
                    </div>
                    <div className="flex flex-col p-2 pt-0 gap-1">
                        {categoriesLoading && (
                            <div className="p-4 flex items-center justify-center text-base-content/50 text-sm">
                                Cargando...
                            </div>
                        )}
                        {categories?.map((cat) => (
                            <div
                                key={cat.uuid}
                                onMouseEnter={() => {
                                    handleChangeCategory(cat);
                                    setHoveredSubcategory(null);
                                }}
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
                                <span className={clsx("truncate", selectedCategory?.uuid === cat.uuid && "pl-1")}>
                                    {cat.name}
                                </span>
                                <MdKeyboardArrowRight
                                    className={clsx(
                                        "text-xl transition-transform duration-200",
                                        selectedCategory?.uuid === cat.uuid
                                            ? "text-primary translate-x-1"
                                            : "text-base-content/30 group-hover:text-base-content/50"
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Middle Panel: Level-0 Subcategories ─── */}
                <div
                    className="w-[36%] bg-base-100 overflow-y-auto custom-scrollbar border-r border-base-200 flex flex-col"
                    onMouseLeave={() => scheduleClearHover()}
                >
                    <div className="p-4 pb-2 border-b border-base-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-base-content/50">
                                    Subcategorías
                                </span>
                                <h3 className="text-sm font-semibold text-base-content mt-0.5">
                                    {selectedCategory?.name || "Selecciona una categoría"}
                                </h3>
                            </div>
                            {selectedCategory && (
                                <Link
                                    to={`/tienda?category=${selectedCategory.name.toLowerCase()}`}
                                    onClick={() => onScheduleHide()}
                                    className="text-xs text-primary hover:underline whitespace-nowrap"
                                >
                                    Ver todo
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 p-2">
                        {subcategoriesLoading && (
                            <div className="flex h-full items-center justify-center gap-2 text-base-content/50">
                                <span className="loading loading-spinner loading-sm" />
                                <span className="text-xs">Cargando...</span>
                            </div>
                        )}
                        {!subcategoriesLoading && subcategoriesError && (
                            <div className="flex h-full flex-col items-center justify-center gap-4 text-center p-4">
                                <p className="text-base-content/60 text-xs">
                                    No pudimos cargar las opciones disponibles.
                                </p>
                                <button
                                    className="btn btn-xs btn-outline"
                                    onClick={() => window.location.reload()}
                                >
                                    Reintentar
                                </button>
                            </div>
                        )}
                        {!subcategoriesLoading && !subcategoriesError && mainSubcategories.length === 0 && (
                            <div className="flex h-full items-center justify-center text-base-content/50 italic text-xs">
                                No hay subcategorías disponibles.
                            </div>
                        )}
                        {mainSubcategories.map((sub) => (
                            <div
                                key={sub.uuid}
                                onMouseEnter={() => {
                                    cancelHoverTimeout();
                                    setHoveredSubcategory(sub);
                                }}
                                onClick={() => handleSubcategoryClick(sub.uuid)}
                                className={clsx(
                                    "px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 group relative",
                                    hoveredSubcategory?.uuid === sub.uuid
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                )}
                            >
                                {hoveredSubcategory?.uuid === sub.uuid && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-primary rounded-r-md" />
                                )}
                                <span
                                    className={clsx(
                                        "text-sm truncate",
                                        hoveredSubcategory?.uuid === sub.uuid && "pl-2"
                                    )}
                                >
                                    {sub.description}
                                </span>
                                {sub.children && sub.children.length > 0 && (
                                    <MdKeyboardArrowRight
                                        className={clsx(
                                            "text-lg transition-transform duration-200 shrink-0",
                                            hoveredSubcategory?.uuid === sub.uuid
                                                ? "text-primary translate-x-0.5"
                                                : "text-base-content/30"
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Right Panel: Children of hovered subcategory ─── */}
                <div
                    className="w-[36%] bg-base-200/30 overflow-y-auto custom-scrollbar flex flex-col"
                    onMouseEnter={() => cancelHoverTimeout()}
                    onMouseLeave={() => scheduleClearHover()}
                >
                    {hoveredSubcategory ? (
                        <>
                            <div className="p-4 pb-2 border-b border-base-200 bg-base-100/80 backdrop-blur-sm sticky top-0 z-10">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                                    {hoveredSubcategory.description}
                                </span>
                                <div className="flex items-center justify-between mt-0.5">
                                    <h4 className="text-sm font-semibold text-base-content">
                                        {hoveredChildren.length > 0 ? "Subcategorías" : "Acciones"}
                                    </h4>
                                    <button
                                        onClick={() => {
                                            handleSubcategoryClick(hoveredSubcategory.uuid);
                                            onScheduleHide();
                                        }}
                                        className="text-xs text-primary hover:underline whitespace-nowrap flex items-center gap-1"
                                    >
                                        Ver todo
                                        <MdKeyboardArrowRight className="text-sm" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 p-2">
                                {hoveredChildren.length > 0 ? (
                                    <div className="flex flex-col gap-0.5">
                                        {hoveredChildren.map((child) => (
                                            <div
                                                key={child.uuid}
                                                onClick={() => {
                                                    handleSubcategoryClick(child.uuid);
                                                    onScheduleHide();
                                                }}
                                                className="px-3 py-2 rounded-lg cursor-pointer text-sm text-base-content/70 hover:bg-base-200 hover:text-base-content transition-all duration-200 group flex items-center gap-2"
                                            >
                                                <span className="w-1 h-1 rounded-full bg-base-content/20 group-hover:bg-primary transition-colors shrink-0" />
                                                <span className="truncate">{child.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-6">
                                        <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
                                            <MdKeyboardArrowLeft className="text-xl text-base-content/30" />
                                        </div>
                                        <p className="text-xs text-base-content/50">
                                            Sin subcategorías adicionales
                                        </p>
                                        <button
                                            onClick={() => {
                                                handleSubcategoryClick(hoveredSubcategory.uuid);
                                                onScheduleHide();
                                            }}
                                            className="btn btn-xs btn-primary"
                                        >
                                            Ver productos
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-8">
                            <div className="w-14 h-14 rounded-full bg-base-200/50 flex items-center justify-center">
                                <MdKeyboardArrowLeft className="text-2xl text-base-content/20" />
                            </div>
                            <p className="text-sm text-base-content/40">
                                Selecciona una subcategoría
                            </p>
                            <p className="text-xs text-base-content/30 max-w-48">
                                Coloca el cursor sobre una subcategoría para ver sus opciones
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ShopMenuPreview;
