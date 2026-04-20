import type { CategoryType, SubcategoriesType } from "../../categories/CategoriesTypes";
import { getErrorMessage } from "../../../global/GlobalUtils";
import clsx from "clsx";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import SubcategoryMenu from "../../categories/components/SubcategoryMenu";
import { FaFilter, FaHeart, FaTag, FaBoxOpen, FaStore } from "react-icons/fa6";
import ShopRatingFilter from "./ShopRatingFilter";
import type { colorLine } from "../../products/ProductTypes";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    // Categories
    categories?: CategoryType[];
    categoriesLoading: boolean;
    categoriesError: Error | null;
    refetchCategories: () => void;
    selectedCategory?: CategoryType | null;
    handleChangeCategory: (category: CategoryType) => void;
    handleSetClear: () => void;
    // Subcategories
    subcategories: SubcategoriesType[];
    subcategoriesLoading: boolean;
    subcategoriesError: Error | null;
    refetchSubcategories: () => void;
    handleSubcategoryNavigate: (subcategoryUUID: string) => void;
    // Filters
    isAuth: boolean;
    favoriteCheck: boolean;
    onSetFavoriteCheck: (checked: boolean) => void;
    offerCheck: boolean;
    onSetOfferCheck: (checked: boolean) => void;
    stockCheck: boolean;
    onSetStockCheck: (checked: boolean) => void;
    onSetRatingFilter: (rating?: number) => void;
    colorLineFilter?: colorLine;
    onSetColorLine: (value: string) => void;
    localPriceRange: { min: string, max: string };
    setLocalPriceRange: React.Dispatch<React.SetStateAction<{ min: string, max: string }>>;
    onApplyPriceRange: () => void;
    priceRange?: { min: number, max: number };
}

const FiltersMobileMenu = ({
    isOpen,
    onClose,
    categories,
    categoriesLoading,
    categoriesError,
    refetchCategories,
    selectedCategory,
    handleChangeCategory,
    handleSetClear,
    subcategories,
    subcategoriesLoading,
    subcategoriesError,
    refetchSubcategories,
    handleSubcategoryNavigate,
    isAuth,
    favoriteCheck,
    onSetFavoriteCheck,
    offerCheck,
    onSetOfferCheck,
    stockCheck,
    onSetStockCheck,
    onSetRatingFilter,
    colorLineFilter,
    onSetColorLine,
    localPriceRange,
    setLocalPriceRange,
    onApplyPriceRange,
    priceRange
}: Props) => {
    return (
        <div className="drawer drawer-end z-[9999]">
            <input
                id="filters-mobile-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={isOpen}
                onChange={onClose}
            />

            <div className="drawer-side z-[9999]">
                <label
                    htmlFor="filters-mobile-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                    onClick={onClose}
                ></label>

                <div className="menu p-0 w-80 min-h-full bg-base-100 text-base-content shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="sticky top-0 z-20 bg-base-100/80 backdrop-blur-md border-b border-base-300 px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-primary" />
                            <h2 className="text-lg font-black uppercase tracking-tight">Filtros</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="btn btn-circle btn-ghost btn-sm"
                        >
                            <IoIosClose className="text-2xl" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-8">
                        {/* Categorías Section */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                                <FaStore className="text-primary text-xs" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50">Categorías</h3>
                            </div>

                            {categoriesLoading && !categoriesError && (
                                <div className="flex flex-col gap-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-10 w-full skeleton rounded-xl opacity-20" />
                                    ))}
                                </div>
                            )}

                            {!categoriesLoading && categoriesError && (
                                <div className="p-4 bg-error/10 rounded-2xl border border-error/20">
                                    <p className="text-error text-xs font-medium">{getErrorMessage(categoriesError)}</p>
                                    <button className="btn btn-error btn-xs mt-2" onClick={refetchCategories}>Reintentar</button>
                                </div>
                            )}

                            {!categoriesLoading && !categoriesError && categories && (
                                <div className="flex flex-col gap-1">
                                    <button
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all",
                                            !selectedCategory
                                                ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                                                : "hover:bg-base-200 text-base-content/70"
                                        )}
                                        onClick={handleSetClear}
                                    >
                                        <FaStore className="text-xs" />
                                        Toda la tienda
                                    </button>

                                    {categories.map((category) => (
                                        <div key={category.uuid} className="flex flex-col">
                                            <button
                                                className={clsx(
                                                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all",
                                                    selectedCategory?.uuid === category.uuid
                                                        ? "bg-primary/10 text-primary font-extrabold"
                                                        : "hover:bg-base-200 text-base-content/70 font-semibold"
                                                )}
                                                onClick={() => handleChangeCategory(category)}
                                            >
                                                {category.name}
                                                <IoIosArrowDown className={clsx(
                                                    "text-xs transition-transform duration-300",
                                                    selectedCategory?.uuid === category.uuid ? "rotate-180" : "opacity-40"
                                                )} />
                                            </button>

                                            {/* Subcategories */}
                                            {selectedCategory?.uuid === category.uuid && (
                                                <div className="ml-4 pl-3 border-l-2 border-primary/20 mt-1 mb-2">
                                                    {subcategoriesLoading ? (
                                                        <span className="loading loading-dots loading-xs text-primary/40 p-2" />
                                                    ) : subcategoriesError ? (
                                                        <button className="text-[10px] text-error font-bold" onClick={refetchSubcategories}>Error: Reintentar</button>
                                                    ) : (
                                                        <SubcategoryMenu
                                                            data={subcategories}
                                                            onFindAncestors={handleSubcategoryNavigate}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Filtros de Estado */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                                <FaFilter className="text-primary text-xs" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50">Estado</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {isAuth && (
                                    <label className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-pointer transition-all",
                                        favoriteCheck
                                            ? "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400 font-bold"
                                            : "border-base-300 bg-base-100 hover:border-base-content/20"
                                    )}>
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-error checkbox-sm"
                                            checked={favoriteCheck}
                                            onChange={(e) => onSetFavoriteCheck(e.target.checked)}
                                        />
                                        <span className="flex items-center gap-2 text-sm">
                                            <FaHeart className="text-xs" /> Solo favoritos
                                        </span>
                                    </label>
                                )}

                                <label className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-pointer transition-all",
                                    offerCheck
                                        ? "border-warning/30 bg-warning/5 text-warning-content font-bold"
                                        : "border-base-300 bg-base-100 hover:border-base-content/20"
                                )}>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-warning checkbox-sm"
                                        checked={offerCheck}
                                        onChange={(e) => onSetOfferCheck(e.target.checked)}
                                    />
                                    <span className="flex items-center gap-2 text-sm">
                                        <FaTag className="text-xs" /> Solo ofertas
                                    </span>
                                </label>

                                <label className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-pointer transition-all",
                                    stockCheck
                                        ? "border-success/30 bg-success/5 text-success-content font-bold"
                                        : "border-base-300 bg-base-100 hover:border-base-content/20"
                                )}>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-success checkbox-sm"
                                        checked={stockCheck}
                                        onChange={(e) => onSetStockCheck(e.target.checked)}
                                    />
                                    <span className="flex items-center gap-2 text-sm">
                                        <FaBoxOpen className="text-xs" /> Con stock
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Rango de Precio */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50 px-1">Rango de Precio</h3>
                            <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300 flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <label className="label py-1">
                                            <span className="label-text-alt font-bold opacity-50">MIN</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="input input-bordered input-sm w-full bg-base-100 font-bold"
                                            value={localPriceRange.min}
                                            onChange={(e) => setLocalPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                        />
                                    </div>
                                    <div className="mt-6 font-bold opacity-20">-</div>
                                    <div className="flex-1">
                                        <label className="label py-1">
                                            <span className="label-text-alt font-bold opacity-50">MAX</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="∞"
                                            className="input input-bordered input-sm w-full bg-base-100 font-bold"
                                            value={localPriceRange.max}
                                            onChange={(e) => setLocalPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="btn btn-primary btn-sm w-full font-black shadow-lg shadow-primary/20"
                                    onClick={onApplyPriceRange}
                                >
                                    APLICAR
                                </button>
                                {priceRange && (
                                    <button
                                        className="btn btn-ghost btn-xs text-primary font-bold"
                                        onClick={() => {
                                            setLocalPriceRange({ min: "", max: "" });
                                            onApplyPriceRange();
                                        }}
                                    >
                                        Limpiar precio
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Línea de Color */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50 px-1">Línea de Color</h3>
                            <select
                                className="select select-bordered w-full bg-base-100 font-bold text-sm"
                                value={colorLineFilter || ""}
                                onChange={(e) => onSetColorLine(e.target.value)}
                            >
                                <option value="">Todas las líneas</option>
                                <option value="Linea Basica">Línea Básica</option>
                                <option value="Linea Especial">Línea Especial</option>
                                <option value="Linea Flourescente">Línea Fluorescente</option>
                            </select>
                        </div>

                        {/* Rating */}
                        <div className="flex flex-col gap-4 mb-20">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50 px-1">Calificación</h3>
                            <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300">
                                <ShopRatingFilter onRatingChange={onSetRatingFilter} />
                            </div>
                        </div>
                    </div>

                    {/* Footer / Apply Button */}
                    <div className="sticky bottom-0 bg-base-100 p-4 border-t border-base-300">
                        <button
                            className="btn btn-primary w-full text-lg font-black tracking-normal rounded-2xl h-14"
                            onClick={onClose}
                        >
                            VER RESULTADOS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiltersMobileMenu;
