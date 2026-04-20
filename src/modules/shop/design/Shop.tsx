import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { IoIosArrowDown } from "react-icons/io";
import clsx from "clsx";
import SubcategoryMenu from "../../categories/components/SubcategoryMenu";
import { useFetchProductVersionCardsV2 } from "../../products/hooks/useFetchProductVersionCards";
import ProductVersionCardSkinnySkeleton from "../../products/components/ProductVersionCardSkinnySkeleton";
import { useAuthStore } from "../../auth/states/authStore";
import PaginationComponent from "../../../global/components/PaginationComponent";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import ProductVersionCardV2 from "../../products/components/ProductVersionCard";
import { useCategories } from "../../categories/hooks/useCategories";
import { Link, useSearchParams } from "react-router-dom";
import { FaFilter, FaHeart, FaTag, FaBoxOpen, FaShop } from "react-icons/fa6";
import { FaStore } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import FiltersMobileMenu from "../components/FiltersMobileMenu";
import ShopRatingFilter from "../components/ShopRatingFilter";
import type { colorLine } from "../../products/ProductTypes";

const ShopV2 = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");
    const subcategoryPathParam = searchParams.getAll("sub");
    const pageParam = searchParams.get("page");
    const currentPage = pageParam ? parseInt(pageParam) : 1;

    // Filters State
    const [expensive, setExpensive] = useState<boolean | undefined>(undefined);
    const [favoriteCheck, setFavoriteCheck] = useState<boolean>(false);
    const [offerCheck, setOfferCheck] = useState<boolean>(false);
    const [stockCheck, setStockCheck] = useState<boolean>(false);
    const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
    const [colorLineFilter, setColorLineFilter] = useState<colorLine | undefined>(undefined);
    const [localPriceRange, setLocalPriceRange] = useState<{ min: string, max: string }>({ min: "", max: "" });
    const [priceRange, setPriceRange] = useState<{ min: number, max: number } | undefined>(undefined);

    const [showMobileFilets, setShowMobileFilters] = useState<boolean>(false);
    const { isAuth } = useAuthStore();

    const {
        categories,
        categoriesLoading,
        categoriesError,
        refetchCategories,
        subcategories,
        subcategoriesLoading,
        subcategoriesError,
        refetchSubcategories,
        subcategoriesBreadcrumb,
        debouncedSubcategoriesPath,
        selectedCategory,
        handleSubcategoryNavigate,
        handleSetClear,
        handleChangeCategory,
    } = useCategories({
        enableQueryParamsNavigate: true,
        initCategory: categoryParam ? categoryParam : undefined,
        initSubcategoryPath: subcategoryPathParam.length > 0 ? subcategoryPathParam : undefined,
    });

    const MAX_PRODUCT_LIMIT_PER_PAGE: number = 12; // Adjusted to be multiple of 4 for lg:grid-cols-4

    const {
        data: pvCards,
        isLoading: productCardsIsLoading,
        error: productCardsError,
        refetch: productCardsRefetch
    } = useFetchProductVersionCardsV2({
        filters: {
            limit: MAX_PRODUCT_LIMIT_PER_PAGE,
            moreExpensive: expensive,
            page: currentPage,
            onlyFavorites: isAuth ? favoriteCheck : undefined,
            onlyOffers: offerCheck ? true : undefined,
            onlyInStock: stockCheck ? true : undefined,
            ratingRange: ratingFilter,
            colorLine: colorLineFilter,
            priceRange: priceRange,
            category: categoryParam ? categoryParam : undefined,
            subcategoryPath: subcategoryPathParam.length > 0 ? subcategoryPathParam : undefined,
        }
    });

    const handlePageChange = (page: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", page.toString());
        setSearchParams(newParams);
    };

    const handlePrincingFilter = useDebounceCallback((value: string) => {
        setExpensive(value === "expensive" ? true : undefined);
    }, 250);

    const handleSetFavoriteCheck = useDebounceCallback((checked: boolean) => {
        setFavoriteCheck(checked);
        if (currentPage !== 1) handlePageChange(1);
    }, 250);

    const handleSetOfferCheck = useDebounceCallback((checked: boolean) => {
        setOfferCheck(checked);
        if (currentPage !== 1) handlePageChange(1);
    }, 250);

    const handleSetStockCheck = useDebounceCallback((checked: boolean) => {
        setStockCheck(checked);
        if (currentPage !== 1) handlePageChange(1);
    }, 250);

    const handleSetRatingFilter = useDebounceCallback((rating?: number) => {
        setRatingFilter(rating);
        if (currentPage !== 1) handlePageChange(1);
    }, 250);

    const handleSetColorLine = useDebounceCallback((value: string) => {
        const val = value === "" ? undefined : value as colorLine;
        if (colorLineFilter === val) return;
        setColorLineFilter(val);
        if (currentPage !== 1) handlePageChange(1);
    }, 250);

    const handleSetPriceRange = useDebounceCallback(() => {
        const min = localPriceRange.min ? parseFloat(localPriceRange.min) : 0;
        const max = localPriceRange.max ? parseFloat(localPriceRange.max) : 0;

        if (min === 0 && max === 0) {
            if (priceRange !== undefined) {
                setPriceRange(undefined);
                if (currentPage !== 1) handlePageChange(1);
            }
            return;
        }

        if (priceRange && priceRange.min === min && priceRange.max === max) {
            return; // Bloquea si es el mismo rango para evitar hacer la misma petición
        }

        setPriceRange({ min, max });
        if (currentPage !== 1) handlePageChange(1);
    }, 250);

    useEffect(() => {
        if (pageParam && pageParam !== "1") {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("page", "1");
            setSearchParams(newParams);
        }
    }, [categoryParam, JSON.stringify(subcategoryPathParam)]);

    const categorySlug = selectedCategory ? selectedCategory.name.toLowerCase() : "";

    return (
        <div className="w-full bg-base-200 min-h-screen pb-16 rounded-3xl">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ── SIDEBAR ── */}
                    <div className="hidden lg:block w-full lg:w-64 xl:w-72 flex-shrink-0 relative">
                        <div className="w-full bg-base-100 rounded-2xl border border-base-300 p-5 sticky top-30">

                            {/* Categorías */}
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-base-200">
                                <FaStore className="text-primary text-base" />
                                <h2 className="text-sm font-bold text-base-content uppercase">
                                    Categorías
                                </h2>
                            </div>

                            {/* Skeletons */}
                            {categoriesLoading && !categoriesError && (!categories || categories.length === 0) && (
                                <div className="w-full flex flex-col gap-3">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-full h-9 skeleton rounded-lg opacity-25" />
                                    ))}
                                </div>
                            )}

                            {/* Error */}
                            {!categoriesLoading && (!categories || categories.length === 0) && categoriesError && (
                                <div className="flex flex-col gap-2">
                                    <p className="text-error text-sm font-medium">{getErrorMessage(categoriesError)}</p>
                                    <button type="button" className="btn btn-primary btn-sm" onClick={() => refetchCategories()}>
                                        Reintentar
                                    </button>
                                </div>
                            )}

                            {/* Categories list */}
                            {!categoriesLoading && !categoriesError && categories && categories.length > 0 && (
                                <div className="w-full flex flex-col gap-1">
                                    <button
                                        className={clsx(
                                            "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150",
                                            !selectedCategory
                                                ? "bg-primary text-primary-content shadow-sm"
                                                : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                                        )}
                                        onClick={handleSetClear}
                                    >
                                        <FaStore className="text-xs flex-shrink-0" />
                                        Toda la tienda
                                    </button>

                                    {categories.map((category, index) => (
                                        <div key={index} className="w-full">
                                            <button
                                                className={clsx(
                                                    "w-full px-3 py-2 text-left flex items-center justify-between text-sm rounded-xl transition-all duration-150",
                                                    selectedCategory && category.uuid === selectedCategory.uuid
                                                        ? "bg-primary/10 text-primary font-bold"
                                                        : "font-semibold text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                                )}
                                                type="button"
                                                onClick={() => handleChangeCategory(category)}
                                            >
                                                {category.name}
                                                <IoIosArrowDown className={clsx(
                                                    "text-xs flex-shrink-0 transition-transform duration-200",
                                                    selectedCategory && category.uuid === selectedCategory.uuid
                                                        ? "rotate-180 text-primary"
                                                        : "text-base-content/40"
                                                )} />
                                            </button>

                                            <div className={clsx(
                                                "w-full pl-2 ml-2 border-l-2 border-primary/20",
                                                subcategories.length > 0 && selectedCategory && category.uuid === selectedCategory.uuid ? "block mt-1 mb-2" : "hidden"
                                            )}>
                                                {subcategoriesLoading ? (
                                                    <div className="flex items-center gap-2 py-2 px-2">
                                                        <span className="loading loading-spinner loading-xs text-primary" />
                                                        <span className="text-xs text-base-content/40 font-medium">Cargando...</span>
                                                    </div>
                                                ) : (
                                                    <div className="w-full">
                                                        {subcategoriesError ? (
                                                            <div className="flex flex-col gap-1 py-1">
                                                                <p className="text-error text-xs">{getErrorMessage(subcategoriesError)}</p>
                                                                <button className="mt-2 btn btn-primary btn-xs w-fit" onClick={() => refetchSubcategories()}>Reintentar</button>
                                                            </div>
                                                        ) : (
                                                            <SubcategoryMenu data={subcategories} onFindAncestors={handleSubcategoryNavigate} />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Filtros */}
                            <div className="w-full border-t border-base-200 mt-6 pt-5 flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <FaFilter className="text-primary text-sm" />
                                    <h2 className="text-sm font-bold text-base-content uppercase">Filtros</h2>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {isAuth && (
                                        <label className={clsx(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all",
                                            favoriteCheck
                                                ? "border-rose-400/40 bg-rose-500/10 text-rose-500"
                                                : "border-base-200 bg-base-100 hover:bg-base-200/50 text-base-content/60"
                                        )}>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm checkbox-error rounded-sm"
                                                checked={favoriteCheck}
                                                onChange={(e) => handleSetFavoriteCheck(e.target.checked)}
                                            />
                                            <span className="text-sm flex items-center gap-2 font-bold">
                                                <FaHeart className="text-xs" />
                                                Solo favoritos
                                            </span>
                                        </label>
                                    )}

                                    <label className={clsx(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all",
                                        offerCheck
                                            ? "border-warning/40 bg-warning/10 text-warning-content font-bold"
                                            : "border-base-200 bg-base-100 hover:bg-base-200/50 text-base-content/60"
                                    )}>
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm checkbox-warning rounded-sm"
                                            checked={offerCheck}
                                            onChange={(e) => handleSetOfferCheck(e.target.checked)}
                                        />
                                        <span className="text-sm flex items-center gap-2 font-bold">
                                            <FaTag className="text-xs" />
                                            Solo ofertas
                                        </span>
                                    </label>

                                    <label className={clsx(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all",
                                        stockCheck
                                            ? "border-success/40 bg-success/10 text-success-content font-bold"
                                            : "border-base-200 bg-base-100 hover:bg-base-200/50 text-base-content/60"
                                    )}>
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm checkbox-success rounded-sm"
                                            checked={stockCheck}
                                            onChange={(e) => handleSetStockCheck(e.target.checked)}
                                        />
                                        <span className="text-sm flex items-center gap-2 font-bold">
                                            <FaBoxOpen className="text-xs" />
                                            Con stock
                                        </span>
                                    </label>

                                </div>

                                {/* Color Line Select */}
                                <div className="mt-2 flex flex-col gap-2">
                                    <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-1">
                                        Línea de Color
                                    </p>
                                    <select
                                        className="select select-sm select-bordered w-full bg-base-100 font-medium text-base-content/80 text-sm"
                                        value={colorLineFilter || ""}
                                        onChange={(e) => handleSetColorLine(e.target.value)}
                                    >
                                        <option value="">Todas las líneas</option>
                                        <option value="Linea Basica">Línea Básica</option>
                                        <option value="Linea Especial">Línea Especial</option>
                                        <option value="Linea Flourescente">Línea Fluorescente</option>
                                    </select>
                                </div>

                                {/* Price Range Inputs */}
                                <div className="mt-2 flex flex-col gap-2">
                                    <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-1">
                                        Rango de Precio
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="input input-sm input-bordered w-full bg-base-100"
                                            value={localPriceRange.min}
                                            onChange={(e) => setLocalPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                            min={0}
                                        />
                                        <span className="text-base-content/50">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="input input-sm input-bordered w-full bg-base-100"
                                            value={localPriceRange.max}
                                            onChange={(e) => setLocalPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                            min={0}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary w-full mt-1 font-bold"
                                        onClick={handleSetPriceRange}
                                    >
                                        Aplicar límite
                                    </button>
                                    {priceRange && (
                                        <button
                                            type="button"
                                            className="text-xs text-primary underline underline-offset-2 text-left mt-1 hover:opacity-70 transition-opacity w-fit"
                                            onClick={() => {
                                                setLocalPriceRange({ min: "", max: "" });
                                                setPriceRange(undefined);
                                                if (currentPage !== 1) handlePageChange(1);
                                            }}
                                        >
                                            Limpiar precio
                                        </button>
                                    )}
                                </div>

                                {/* Rating Filter */}
                                <div className="mt-2 bg-base-200/30 p-3 rounded-xl border border-base-200">
                                    <ShopRatingFilter onRatingChange={handleSetRatingFilter} />
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ── MAIN CONTENT ── */}
                    <div className="flex-1 min-w-0 flex flex-col gap-6">

                        {/* Header y Toolbar */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    {!selectedCategory && (
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <FaShop className="text-primary text-lg sm:text-xl" />
                                        </div>
                                    )}
                                    <h1 className={clsx(
                                        "text-3xl md:text-4xl font-black leading-tight tracking-tight text-base-content"
                                    )}>

                                        {(selectedCategory && selectedCategory.name) ?? "Tienda de productos"}
                                    </h1>
                                </div>

                                <div className="breadcrumbs text-sm mt-2 font-semibold">
                                    <ul>
                                        <li><Link to={"/tienda"} className="text-primary hover:opacity-80 transition-opacity">Tienda</Link></li>
                                        {selectedCategory && (
                                            <li>
                                                <Link
                                                    to={`/tienda?category=${categorySlug}&page=1`}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {selectedCategory.name}
                                                </Link>
                                            </li>
                                        )}
                                        {subcategoriesBreadcrumb.map((name, index) => {
                                            const slice = debouncedSubcategoriesPath.slice(0, index + 1);
                                            const params = slice.map(s => `&sub=${s}`).join("");
                                            return (
                                                <li key={index}>
                                                    <Link
                                                        to={`/tienda?category=${categorySlug}${params}&page=1`}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <p className="text-sm text-base-content/50 mt-1 font-medium">
                                    {pvCards ? `${pvCards.totalRecords} resultados encontrados` : "Cargando catálogo..."}
                                </p>
                            </div>

                            <div className="w-full flex items-center justify-between gap-3 bg-base-100 px-4 py-3 rounded-2xl border border-base-300">
                                <button
                                    type="button"
                                    className="lg:hidden btn btn-sm bg-base-200 border-base-300 hover:bg-base-300 gap-2 text-sm font-bold"
                                    onClick={() => setShowMobileFilters(true)}
                                >
                                    <FaFilter className="text-primary text-xs" />
                                    Filtros
                                </button>

                                <div className="relative flex items-center ml-auto">
                                    <BiSortAlt2 className="absolute left-3 text-base-content/40 text-sm pointer-events-none z-10" />
                                    <select
                                        className="select select-sm pl-8 pr-8 bg-base-200 font-bold border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        onChange={(e) => handlePrincingFilter(e.target.value)}
                                    >
                                        <option value="cheap">Más baratos primero</option>
                                        <option value="expensive">Más caros primero</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Loading */}
                        {productCardsIsLoading && !productCardsError && !pvCards && (
                            <div className="w-full">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                                    <ProductVersionCardSkinnySkeleton />
                                    <ProductVersionCardSkinnySkeleton />
                                    <ProductVersionCardSkinnySkeleton />
                                    <ProductVersionCardSkinnySkeleton />
                                    <ProductVersionCardSkinnySkeleton />
                                    <ProductVersionCardSkinnySkeleton />
                                    <ProductVersionCardSkinnySkeleton />
                                    <ProductVersionCardSkinnySkeleton />
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {productCardsError && !pvCards && !productCardsIsLoading && (
                            <div className="flex flex-col items-center justify-center gap-4 py-20 bg-base-100 rounded-2xl border border-base-300">
                                <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-3xl shadow-inner">⚠️</div>
                                <div className="text-center px-4">
                                    <p className="font-extrabold text-lg text-base-content">Ocurrió un error</p>
                                    <p className="text-error/80 text-sm mt-1 mb-2 max-w-sm">{getErrorMessage(productCardsError)}</p>
                                    <button className="btn btn-primary font-bold shadow-md" onClick={() => productCardsRefetch()}>Intentar nuevamente</button>
                                </div>
                            </div>
                        )}

                        {/* Products grid */}
                        {!productCardsIsLoading && !productCardsError && pvCards && (
                            <div className="w-full flex flex-col items-center">
                                {pvCards.data && pvCards.data.length > 0 ? (
                                    <>
                                        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                                            {pvCards.data.map((data, index) => (
                                                <ProductVersionCardV2
                                                    key={`${data.sku}-${index}`}
                                                    versionData={data}
                                                    transparent={false}
                                                />
                                            ))}
                                        </div>
                                        <div className="mt-8 mb-4">
                                            <PaginationComponent
                                                currentPage={currentPage}
                                                onPageChange={handlePageChange}
                                                totalPages={pvCards.totalPages}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full flex flex-col items-center justify-center py-24 bg-base-100 rounded-3xl border border-base-300 border-dashed">
                                        <FaStore className="text-5xl text-base-content/10 mb-4" />
                                        <p className="text-lg font-bold text-base-content/60">No se encontraron productos</p>
                                        <p className="text-sm text-base-content/40 mt-1 max-w-sm text-center">
                                            Intenta ajustando los filtros o seleccionando otra categoría.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FiltersMobileMenu
                isOpen={showMobileFilets}
                onClose={() => setShowMobileFilters(false)}
                categories={categories}
                categoriesLoading={categoriesLoading}
                categoriesError={categoriesError}
                refetchCategories={refetchCategories}
                selectedCategory={selectedCategory}
                handleChangeCategory={handleChangeCategory}
                handleSetClear={handleSetClear}
                subcategories={subcategories}
                subcategoriesLoading={subcategoriesLoading}
                subcategoriesError={subcategoriesError}
                refetchSubcategories={refetchSubcategories}
                handleSubcategoryNavigate={handleSubcategoryNavigate}
                onSetFavoriteCheck={handleSetFavoriteCheck}
                favoriteCheck={favoriteCheck}
                isAuth={isAuth}
                offerCheck={offerCheck}
                onSetOfferCheck={handleSetOfferCheck}
                stockCheck={stockCheck}
                onSetStockCheck={handleSetStockCheck}
                onSetRatingFilter={handleSetRatingFilter}
                colorLineFilter={colorLineFilter}
                onSetColorLine={handleSetColorLine}
                localPriceRange={localPriceRange}
                setLocalPriceRange={setLocalPriceRange}
                onApplyPriceRange={handleSetPriceRange}
                priceRange={priceRange}
            />
        </div>
    );
};

export default ShopV2;
