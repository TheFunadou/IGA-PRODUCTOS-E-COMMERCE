import { useEffect, useState, useMemo } from "react";
import type { CategoryType, SubcategoriesType } from "../../categories/CategoriesTypes";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { IoIosArrowDown } from "react-icons/io";
import { buildHierarchyTree, findAncestors } from "../../categories/CategoriesUtils";
import clsx from "clsx";
import SubcategoryMenu from "../../categories/components/SubcategoryMenu";
import ProductVersionCardSkinny from "../../products/components/ProductVersionCardSkinny";
import { useFetchProductVersionCards } from "../../products/hooks/useFetchProductVersionCards";
import { useFetchMainCategories, useFetchSubcategories } from "../../categories/hooks/useFetchCategories";
import ProductVersionCardSkinnySkeleton from "../../products/components/ProductVersionCardSkinnySkeleton";
import { useAuthStore } from "../../auth/states/authStore";
import PaginationComponent from "../../../global/components/PaginationComponent";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";

const Shop = () => {
    const [subcategories, setSubcategories] = useState<SubcategoriesType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | undefined>(undefined);
    const [breadcrumb, setBreadcrumb] = useState<string[]>([]);
    const [subcategoriesPath, setSubcategoriesPath] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [expensive, setExpensive] = useState<boolean | undefined>(undefined);
    const [favoriteCheck, setFavoriteCheck] = useState<boolean>(false);
    const [showFavorites, setShowFavorites] = useState<boolean | undefined>(undefined);
    // const [showProductsCounter, setShowProductsCounter] = useState<number>(0);
    const [countedItems, setCountedItems] = useState<number>(0);

    const { isAuth } = useAuthStore();
    const MAX_PRODUCT_LIMIT_PER_PAGE: number = 8;

    const {
        data: categories,
        isLoading: categoriesLoading,
        error: categoriesError,
        refetch: refetchCategories
    } = useFetchMainCategories();

    const {
        data: flatSubcategories,
        isLoading: subcategoriesLoading,
        error: subcategoriesError,
        refetch: refetchSubcategories
    } = useFetchSubcategories(selectedCategory?.id)

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
        category: selectedCategory?.name,
        subcategoryPath: subcategoriesPath.length > 0 ? subcategoriesPath : undefined,
    })

    const totalPages = useMemo(() => {
        if (!pvCards?.total_records) return 1;
        return Math.ceil(pvCards.total_records / MAX_PRODUCT_LIMIT_PER_PAGE);
    }, [pvCards?.total_records, MAX_PRODUCT_LIMIT_PER_PAGE]);

    const handlePageChange = (page: number) => setCurrentPage(page);

    /**
     * -Rebuild herarchy tree when flatSubcategories have data
     */
    useEffect(() => {
        if (flatSubcategories && flatSubcategories.length > 0) {
            const buildTree: SubcategoriesType[] = buildHierarchyTree(flatSubcategories);
            setSubcategories(buildTree);
        } else {
            setSubcategories([]);
        }
    }, [flatSubcategories]);

    const handleSubcategoryNavigate = (subcategory_id: number) => {
        if (!flatSubcategories && !subcategories.length) return;

        const path: number[] = findAncestors(subcategories, subcategory_id);
        console.log(path);
        setSubcategoriesPath(path);

        if (flatSubcategories) {
            const breadcrumb: string[] = flatSubcategories
                .filter(item => path.includes(item.id))
                .sort((a, b) => path.indexOf(a.id) - path.indexOf(b.id))
                .map(item => item.description);
            setBreadcrumb(breadcrumb);
        }
    };

    const handleReturntoShop = () => {
        setSelectedCategory(undefined);
        setBreadcrumb([]);
        setSubcategoriesPath([]);
    };

    const handleChangeCategory = (category: CategoryType) => {
        if (selectedCategory === undefined || selectedCategory.id !== category.id) {
            setSelectedCategory({ id: category.id, name: category.name });
        }
    };

    const handlePrincingFilter = (value: string) => {
        setExpensive(value === "expensive" ? true : undefined);
    };

    const handleSetFavoriteFilter = useDebounceCallback(() => {
        setShowFavorites(favoriteCheck ? true : undefined);
    }, 250);

    useEffect(() => {
        handleSetFavoriteFilter();
    }, [favoriteCheck, handleSetFavoriteFilter]);

    useEffect(() => {
        if(pvCards && pvCards.product_version_cards.length> 0) {
            setCountedItems(prev => prev + pvCards.product_version_cards.length);
        }
    },[pvCards]);

    return (
        <div className="flex">
            <div className="w-1/4 pr-5 relative">
                <div className="w-full rounded-xl bg-white px-5 py-10 sticky top-5 border border-gray-300">
                    <p className="text-2xl font-bold text-blue-950 border-b pb-5">Categorias de productos</p>
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
                                        <button className="w-min" onClick={handleReturntoShop}>Tienda</button>
                                        {categories && categories.length > 0 && categories.map((category, index) => (
                                            <div key={index} className="w-full">
                                                <button
                                                    className="w-min text-left flex font-normal text-lg"
                                                    type="button"
                                                    onClick={() => handleChangeCategory(category)}
                                                >
                                                    {category.name}
                                                    <IoIosArrowDown className="ml-3 text-blue-950" />
                                                </button>
                                                <div className={clsx(
                                                    "w-full",
                                                    subcategories.length > 0 && selectedCategory && category.id === selectedCategory.id ? "block" : "hidden"
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
            <div className="w-3/4">
                <div className="w-full rounded-xl bg-white px-5 py-10 border border-gray-300">
                    <div className="px-5">
                        <p className="text-3xl text-blue-950 font-bold">{(selectedCategory && selectedCategory.name) ?? "Tienda de productos"}</p>
                        {breadcrumb.length > 0 &&
                            <div className="breadcrumbs">
                                <ul>
                                    {breadcrumb.map((crumb, index) => (
                                        <li className="text-lg" key={index}>{crumb}</li>
                                    ))}
                                </ul>
                            </div>
                        }
                        <div className="w-full flex justify-between items-end mt-5">
                            {/* <p className="text-lg text-gray-500">Mostrando {countedItems} de {pvCards?.total_records ?? 0}</p> */}
                            <select className="select" onChange={(e) => handlePrincingFilter(e.target.value)}>
                                <option value="cheap">Mas baratos</option>
                                <option value="expensive">Mas caros</option>
                            </select>
                        </div>
                    </div>
                    {productCardsIsLoading ? (
                        <div className="w-full">
                            <div className="w-full flex flex-wrap gap-5 mt-5">
                                <ProductVersionCardSkinnySkeleton />
                                <ProductVersionCardSkinnySkeleton />
                                <ProductVersionCardSkinnySkeleton />
                                <ProductVersionCardSkinnySkeleton />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full">
                            {productCardsError ? (
                                <div className="h-150">
                                    <p className="text-error py-5 text-lg">{getErrorMessage(productCardsError)}</p>
                                    <button className="btn btn-primary" onClick={() => productCardsRefetch()}>Reintentar</button>
                                </div>
                            ) : (
                                <div className="w-full animate-slide-up-fade">
                                    <div className="w-full flex flex-wrap gap-5">
                                        {pvCards && pvCards.product_version_cards && pvCards.product_version_cards.length > 0 ? (
                                            pvCards.product_version_cards.map((data, index) => (
                                                <ProductVersionCardSkinny key={`${index}-${data.product_version.sku}`} className="w-75 h-135" versionData={data} />
                                            ))
                                        ) : (
                                            <p className="text-gray-500 py-5 text-center w-full">No hay productos disponibles.</p>
                                        )}

                                    </div>
                                    <div>
                                        <PaginationComponent currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;