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
            <div className="hidden md:block md:w-20/100 md:flex-shrink-0 relative ">
                <div className="w-full border-r border-gray-300 sticky top-5 pr-5">
                    <h2>Categorias de productos</h2>
                    <div className="hidden md:block w-full font-bold text-xl mt-5">
                        {categoriesLoading && !categoriesError && (!categories || categories.length === 0) && (
                            <div className="w-full flex flex-col gap-5">
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                            </div>
                        )}
                        {!categoriesLoading && (!categories || categories.length === 0) && categoriesError && (
                            <div>
                                <p className="text-error mt-2 text-lg font-normal">{getErrorMessage(categoriesError)}</p>
                                <button type="button" className="btn btn-primary mt-2" onClick={() => refetchCategories()}>Reintentar</button>
                            </div>
                        )}
                        {!categoriesLoading && !categoriesError && categories && categories.length > 0 && (
                            <div className="w-full flex flex-col gap-5">
                                <button className={clsx(
                                    "w-fit rounded-xl px-2 py-1",
                                    !selectedCategory && theme === "ligth" ? "bg-gray-200" : "",
                                    !selectedCategory && theme === "dark" ? "border" : "",

                                )} onClick={handleSetClear}>Tienda</button>
                                {categories && categories.length > 0 && categories.map((category, index) => (
                                    <div key={index} className="w-full">
                                        <button
                                            className={clsx(
                                                "w-60/100 px-2 py-1 text-left flex items-center justify-between font-normal text-lg",
                                                selectedCategory && category.uuid === selectedCategory.uuid && theme === "ligth" ? "bg-gray-200 rounded-xl" : "",
                                                selectedCategory && category.uuid === selectedCategory.uuid && theme === "dark" ? "border  rounded-xl" : ""

                                            )}
                                            type="button"
                                            onClick={() => handleChangeCategory(category)}
                                        >
                                            {category.name}
                                            <IoIosArrowDown className={clsx(theme === "ligth" ? "text-blue-950" : "text-white")} />
                                        </button>
                                        <div className={clsx(
                                            "w-full",
                                            subcategories.length > 0 && selectedCategory && category.uuid === selectedCategory.uuid ? "block" : "hidden"
                                        )}>
                                            {subcategoriesLoading ? (
                                                "Cargando subcategorias..."
                                            ) : (
                                                <div className="w-full">
                                                    {subcategoriesError ? (
                                                        <div>
                                                            <p className="text-error mt-2 text-lg font-normal">{getErrorMessage(subcategoriesError)}</p>
                                                            <button className="mt-2 btn btn-primary" onClick={() => refetchSubcategories()}>Reintentar</button>
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
                        <div className="w-full border-t mt-5 py-5 flex flex-col gap-4 text-lg [&_button]:text-start font-normal">
                            {isAuth &&
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={favoriteCheck}
                                        onChange={(e) => handleSetFavoriteCheck(e.target.checked)}
                                    />
                                    <span>Mostrar solo favoritos</span>
                                </div>
                            }
                            <div className="flex items-center gap-3">
                                <input type="checkbox" className="checkbox" />
                                <span>Mostrar solo ofertas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-80/100 md:flex-none flex-1 md:px-5">
                <div className="w-full">
                    <div>
                        <h1 className={clsx(
                            "text-2xl md:text-3xl font-bold",
                            theme === "ligth" ? "text-blue-950" : "text-white"
                        )}>{(selectedCategory && selectedCategory.name) ?? "Tienda de productos"}</h1>
                        {subcategoriesBreadcrumb.length > 0 &&
                            <div className="breadcrumbs">
                                <ul>
                                    {subcategoriesBreadcrumb.map((crumb, index) => (
                                        <li className="text-xs md:text-lg" key={index}>{crumb}</li>
                                    ))}
                                </ul>
                            </div>
                        }
                        <div className="w-full flex items-center gap-3 md:gap-0 md:justify-between md:items-end mt-2 md:mt-5">
                            <button type="button" className="md:hidden text-primary flex items-center gap-2" onClick={() => setShowMobileFilters(true)}><FaFilter />Filtros</button>
                            <select className="select w-fit md:w-auto" onChange={(e) => handlePrincingFilter(e.target.value)}>
                                <option value="cheap">Mas baratos</option>
                                <option value="expensive">Mas caros</option>
                            </select>
                        </div>
                    </div>
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
                    {productCardsError && !pvCards && !productCardsIsLoading && (
                        <div className="h-150">
                            <p className="text-error py-5 text-lg">{getErrorMessage(productCardsError)}</p>
                            <button className="btn btn-primary" onClick={() => productCardsRefetch()}>Reintentar</button>
                        </div>
                    )}
                    {!productCardsIsLoading && !productCardsError && pvCards && pvCards.data && pvCards.data.length > 0 && (
                        <div className="w-full">
                            <div className="w-full grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-1 md:gap-5 mt-5">
                                {pvCards && pvCards.data && pvCards.data.length > 0 ? (
                                    pvCards.data.map((data, index) => (
                                        <ProductVersionCard key={`${index}-${data.product_version.sku}`} className="w-75 md:h-135" versionData={data} />
                                    ))
                                ) : (
                                    <p className="text-gray-500 py-5 text-center w-full">No hay productos disponibles.</p>
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