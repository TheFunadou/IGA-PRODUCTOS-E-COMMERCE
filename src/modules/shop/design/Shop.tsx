import { useEffect, useState } from "react";
// import type { CategoryType, SubcategoriesType } from "../../categories/CategoriesTypes";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { IoIosArrowDown } from "react-icons/io";
// import { buildHierarchyTree, findAncestors } from "../../categories/CategoriesUtils";
import clsx from "clsx";
import SubcategoryMenu from "../../categories/components/SubcategoryMenu";
import { useFetchProductVersionCards } from "../../products/hooks/useFetchProductVersionCards";
// import { useFetchMainCategories, useFetchSubcategories } from "../../categories/hooks/useFetchCategories";
import ProductVersionCardSkinnySkeleton from "../../products/components/ProductVersionCardSkinnySkeleton";
import { useAuthStore } from "../../auth/states/authStore";
import PaginationComponent from "../../../global/components/PaginationComponent";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import ProductVersionCardShop from "../../products/components/ProductVersionCardShop";
// import useDebounce from "../../../global/hooks/useDebounce";
import { useCategories } from "../../categories/hooks/useCategories";
import { useSearchParams } from "react-router-dom";
import { useThemeStore } from "../../../layouts/states/themeStore";

const Shop = () => {
    const { theme } = useThemeStore();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");
    // const subcategoryPathParam = searchParams.getAll("sub").map(Number);
    const subcategoryPathParam = searchParams.getAll("sub");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [expensive, setExpensive] = useState<boolean | undefined>(undefined);
    const [favoriteCheck, setFavoriteCheck] = useState<boolean>(false);
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
        initSubcategoryPath: subcategoryPathParam.length > 0 ? subcategoryPathParam : undefined
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

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handlePrincingFilter = (value: string) => {
        setExpensive(value === "expensive" ? true : undefined);
    };

    const handleSetFavoriteFilter = useDebounceCallback(() => {
        setShowFavorites(favoriteCheck ? true : undefined);
    }, 250);

    useEffect(() => {
        handleSetFavoriteFilter();
    }, [favoriteCheck, handleSetFavoriteFilter]);


    return (
        <div className={clsx("flex rounded-2xl p-10", theme === "ligth" ? "bg-white" : "bg-slate-950")}>
            <div className="w-20/100 relative">
                <div className="w-full border-r border-gray-300 sticky top-5 pr-5">
                    <p className={clsx("text-2xl font-bold border-b pb-5", theme === "ligth" ? "text-blue-950" : "text-white")}>Categorias de productos</p>
                    <div className="w-full font-bold text-xl mt-5">
                        {categoriesLoading ? (
                            <div className="w-full flex flex-col gap-5">
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                                <div className="w-full p-4 skeleton bg-gray-500 opacity-25" />
                            </div>
                        ) : (
                            <div className="w-full">
                                {categoriesError ? (
                                    <div>
                                        <p className="text-error mt-2 text-lg font-normal">{getErrorMessage(categoriesError)}</p>
                                        <button type="button" className="btn btn-primary mt-2" onClick={() => refetchCategories()}>Reintentar</button>
                                    </div>
                                ) : (
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
                                                onChange={(e) => setFavoriteCheck(e.target.checked)}
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
                        )}
                    </div>
                </div>
            </div>
            <div className="w-80/100 px-5">
                <div className="w-full">
                    <div>
                        <p className={clsx(
                            "text-3xl font-bold",
                            theme === "ligth" ? "text-blue-950" : "text-white"
                        )}>{(selectedCategory && selectedCategory.name) ?? "Tienda de productos"}</p>
                        {subcategoriesBreadcrumb.length > 0 &&
                            <div className="breadcrumbs">
                                <ul>
                                    {subcategoriesBreadcrumb.map((crumb, index) => (
                                        <li className="text-lg" key={index}>{crumb}</li>
                                    ))}
                                </ul>
                            </div>
                        }
                        <div className="w-full flex justify-between items-end mt-5">
                            <select className="select" onChange={(e) => handlePrincingFilter(e.target.value)}>
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
                            <div className="w-full flex flex-wrap gap-5 mt-5">
                                {pvCards && pvCards.data && pvCards.data.length > 0 ? (
                                    pvCards.data.map((data, index) => (
                                        <ProductVersionCardShop key={`${index}-${data.product_version.sku}`} className="w-75 h-135" versionData={data} />
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
        </div>
    );
};

export default Shop;