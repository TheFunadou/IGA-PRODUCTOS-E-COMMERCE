import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { IoIosArrowDown } from "react-icons/io";
import clsx from "clsx";
import SubcategoryMenu from "../../categories/components/SubcategoryMenu";
import { useFetchProductVersionCards } from "../../products/hooks/useFetchProductVersionCards";
import ProductVersionCardSkinnySkeleton from "../../products/components/ProductVersionCardSkinnySkeleton";
import { useAuthStore } from "../../auth/states/authStore";
import PaginationComponent from "../../../global/components/PaginationComponent";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import ProductVersionCard from "../../products/components/ProductVersionCard";
import { useCategories } from "../../categories/hooks/useCategories";
import { useSearchParams } from "react-router-dom";
import { useThemeStore } from "../../../layouts/states/themeStore";
import { FaFilter } from "react-icons/fa6";
import { FaStore } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import FiltersMobileMenu from "../components/FiltersMobileMenu";

const Shop = () => {
    const { theme } = useThemeStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");
    const subcategoryPathParam = searchParams.getAll("sub");
    const pageParam = searchParams.get("page");
    const currentPage = pageParam ? parseInt(pageParam) : 1;
    const [expensive, setExpensive] = useState<boolean | undefined>(undefined);
    const [favoriteCheck, setFavoriteCheck] = useState<boolean>(false);
    const [showMobileFilets, setShowMobileFilters] = useState<boolean>(false);
    const [showFavorites, setShowFavorites] = useState<boolean | undefined>(undefined);
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
        selectedCategory,
        handleSubcategoryNavigate,
        handleSetClear,
        handleChangeCategory,
    } = useCategories({
        enableQueryParamsNavigate: true,
        initCategory: categoryParam ? categoryParam : undefined,
        initSubcategoryPath: subcategoryPathParam.length > 0 ? subcategoryPathParam : undefined,
    });
    const MAX_PRODUCT_LIMIT_PER_PAGE: number = 8;
    const {
        data: pvCards,
        isLoading: productCardsIsLoading,
        error: productCardsError,
        refetch: productCardsRefetch
    } = useFetchProductVersionCards({
        limit: MAX_PRODUCT_LIMIT_PER_PAGE,
        moreExpensive: expensive,
        page: currentPage,
        onlyFavorites: isAuth ? showFavorites : undefined,
        category: categoryParam ? categoryParam : undefined,
        subcategoryPath: subcategoryPathParam.length > 0 ? subcategoryPathParam : undefined,
    });

    const handlePageChange = (page: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", page.toString());
        setSearchParams(newParams);
    };
    const handlePrincingFilter = (value: string) => {
        setExpensive(value === "expensive" ? true : undefined);
    };
    const handleSetFavoriteFilter = useDebounceCallback(() => {
        setShowFavorites(favoriteCheck ? true : undefined);
    }, 250);
    const handleSetFavoriteCheck = (checked: boolean) => {
        setFavoriteCheck(checked);
    };
    useEffect(() => {
        handleSetFavoriteFilter();
    }, [favoriteCheck, handleSetFavoriteFilter]);
    useEffect(() => {
        if (pageParam && pageParam !== "1") {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("page", "1");
            setSearchParams(newParams);
        }
    }, [categoryParam, JSON.stringify(subcategoryPathParam)]);

    return (
        <div className="flex flex-wrap md:flex-nowrap rounded-xl md:rounded-2xl p-3 md:p-10 bg-base-100">

            {/* ── SIDEBAR ── */}
            <div className="hidden md:block md:w-20/100 md:flex-shrink-0 relative">
                <div className="w-full border-r border-base-300 sticky top-5 pr-5">

                    {/* Sidebar header */}
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-base-300">
                        <FaStore className="text-primary text-sm" />
                        <h2 className="text-xs font-bold text-base-content/50 uppercase">
                            Categorías
                        </h2>
                    </div>

                    <div className="hidden md:block w-full">

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

                                {/* "All store" */}
                                <button
                                    className={clsx(
                                        "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-left transition-all duration-150",
                                        !selectedCategory
                                            ? "bg-primary text-primary-content shadow-sm"
                                            : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                                    )}
                                    onClick={handleSetClear}
                                >
                                    <FaStore className="text-xs flex-shrink-0" />
                                    Tienda
                                </button>

                                {/* Categories */}
                                {categories.map((category, index) => (
                                    <div key={index} className="w-full">
                                        <button
                                            className={clsx(
                                                "w-full px-3 py-2 text-left flex items-center justify-between text-sm rounded-xl transition-all duration-150",
                                                selectedCategory && category.uuid === selectedCategory.uuid
                                                    ? "bg-primary/10 text-primary font-semibold"
                                                    : "font-normal text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                            )}
                                            type="button"
                                            onClick={() => handleChangeCategory(category)}
                                        >
                                            {category.name}
                                            <IoIosArrowDown className={clsx(
                                                "text-xs flex-shrink-0 transition-transform duration-200",
                                                selectedCategory && category.uuid === selectedCategory.uuid
                                                    ? "rotate-180 text-primary"
                                                    : theme === "ligth" ? "text-blue-950/40" : "text-white/30"
                                            )} />
                                        </button>

                                        {/* Subcategories */}
                                        <div className={clsx(
                                            "w-full pl-2 ml-2 border-l-2 border-primary/20",
                                            subcategories.length > 0 && selectedCategory && category.uuid === selectedCategory.uuid ? "block mt-1" : "hidden"
                                        )}>
                                            {subcategoriesLoading ? (
                                                <div className="flex items-center gap-2 py-2 px-2">
                                                    <span className="loading loading-spinner loading-xs text-primary" />
                                                    <span className="text-xs text-base-content/40">Cargando...</span>
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

                        {/* Filters */}
                        {/* <div className="w-full border-t border-base-300 mt-5 pt-4 flex flex-col gap-2">
                            <p className="text-xs font-bold text-base-content/40 uppercase mb-1">Filtros</p>

                            {isAuth && (
                                <label className={clsx(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all",
                                    favoriteCheck
                                        ? "border-rose-400/40 bg-rose-500/10 text-rose-500"
                                        : "border-base-300 hover:bg-base-200 text-base-content/60"
                                )}>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-sm checkbox-error"
                                        checked={favoriteCheck}
                                        onChange={(e) => handleSetFavoriteCheck(e.target.checked)}
                                    />
                                    <span className="text-sm flex items-center gap-2 font-medium">
                                        <FaHeart className="text-xs" />
                                        Solo favoritos
                                    </span>
                                </label>
                            )}

                            <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-base-300 hover:bg-base-200 cursor-pointer transition-all text-base-content/60">
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-warning" />
                                <span className="text-sm flex items-center gap-2 font-medium">
                                    <FaTag className="text-xs" />
                                    Solo ofertas
                                </span>
                            </label>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="w-full md:w-80/100 md:flex-none flex-1 md:px-5">
                <div className="w-full">

                    {/* Page header */}
                    <div>
                        <h1 className={clsx(
                            "text-2xl md:text-3xl font-extrabold leading-tight",
                            theme === "ligth" ? "text-blue-950" : "text-white"
                        )}>
                            {(selectedCategory && selectedCategory.name) ?? "Tienda de productos"}
                        </h1>

                        {subcategoriesBreadcrumb.length > 0 && (
                            <div className="breadcrumbs py-0 mt-0.5">
                                <ul>
                                    {subcategoriesBreadcrumb.map((crumb, index) => (
                                        <li className="text-xs md:text-sm text-base-content/50" key={index}>{crumb}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Toolbar */}
                        <div className="w-full flex items-center gap-3 md:gap-0 md:justify-between md:items-center mt-2 md:mt-4 pb-4 border-b border-base-300">
                            <button
                                type="button"
                                className="md:hidden btn btn-sm btn-ghost border border-base-300 gap-2 text-sm"
                                onClick={() => setShowMobileFilters(true)}
                            >
                                <FaFilter className="text-primary text-xs" />
                                Filtros
                            </button>

                            <div className="relative flex items-center ml-auto">
                                <BiSortAlt2 className="absolute left-3 text-base-content/40 text-sm pointer-events-none z-10" />
                                <select
                                    className="select select-sm pl-8 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    onChange={(e) => handlePrincingFilter(e.target.value)}
                                >
                                    <option value="cheap">Más baratos</option>
                                    <option value="expensive">Más caros</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Loading */}
                    {productCardsIsLoading && !productCardsError && !pvCards && (
                        <div className="w-full">
                            <div className="w-full flex flex-wrap gap-5 mt-5">
                                <ProductVersionCardSkinnySkeleton />
                                <ProductVersionCardSkinnySkeleton />
                                <ProductVersionCardSkinnySkeleton />
                                <ProductVersionCardSkinnySkeleton />
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {productCardsError && !pvCards && !productCardsIsLoading && (
                        <div className="h-150 flex flex-col items-center justify-center gap-4 py-20">
                            <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center text-2xl">⚠️</div>
                            <div className="text-center">
                                <p className="font-bold text-base-content">Error al cargar productos</p>
                                <p className="text-error text-sm mt-1">{getErrorMessage(productCardsError)}</p>
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={() => productCardsRefetch()}>Reintentar</button>
                        </div>
                    )}

                    {/* Products grid */}
                    {!productCardsIsLoading && !productCardsError && pvCards && pvCards.data && pvCards.data.length > 0 && (
                        <div className="w-full">
                            <div className="w-full grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-1 md:gap-5 mt-5">
                                {pvCards && pvCards.data && pvCards.data.length > 0 ? (
                                    pvCards.data.map((data, index) => (
                                        <ProductVersionCard key={`${index}-${data.product_version.sku}`} versionData={data} />
                                    ))
                                ) : (
                                    <p className="text-base-content/40 py-5 text-center w-full col-span-full">No hay productos disponibles.</p>
                                )}
                            </div>
                            <div className="mt-5">
                                <PaginationComponent currentPage={currentPage} onPageChange={handlePageChange} totalPages={pvCards.totalPages} />
                            </div>
                        </div>
                    )}
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
                theme={theme!}
                onSetFavoriteCheck={handleSetFavoriteCheck}
                favoriteCheck={favoriteCheck}
                isAuth={isAuth}
            />
        </div>
    );
};

export default Shop;