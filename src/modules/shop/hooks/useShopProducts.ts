import { useMemo } from "react";
import { useFetchProductVersionCardsV3 } from "../../products/hooks/useFetchProductVersionCards";
import type { PV3Sort } from "../../products/ProductTypes";
import { useAuthStore } from "../../auth/states/authStore";
import type { CategoryType } from "../../categories/CategoriesTypes";

const ITEMS_PER_PAGE = 12;
const MIN_SEARCH_LENGTH = 3;

interface UseShopProductsParams {
    currentPage?: number;
    itemsPerPage?: number;
    sort?: PV3Sort;
    favoriteCheck?: boolean;
    offerCheck?: boolean;
    stockCheck?: boolean;
    ratingFilter?: number;
    colorLineFilter?: string;
    skuFilter?: string[];
    priceRange?: { min: number; max: number };
    selectedCategory?: CategoryType;
    tagGroups?: { tier: number; tagIds: string[] }[];
    tagNameFilter?: string[];
    search?: string;
    enabled?: boolean;
}

export function useShopProducts(params: UseShopProductsParams) {
    const { isAuth } = useAuthStore();

    const searchTerm = params.search?.trim();
    const hasValidSearch = !!searchTerm && searchTerm.length >= MIN_SEARCH_LENGTH;

    const queryParams = useMemo(
        () => ({
            pagination: {
                page: params.currentPage ?? 1,
                limit: params.itemsPerPage ?? ITEMS_PER_PAGE,
            },
            filters: {
                search: hasValidSearch ? searchTerm : undefined,
                categoryUuid: params.selectedCategory?.uuid,
                onlyFavorites: isAuth && params.favoriteCheck ? true : undefined,
                onlyOffers: params.offerCheck || undefined,
                onlyInStock: params.stockCheck || undefined,
                ratingRange: params.ratingFilter,
                colorLine: params.colorLineFilter as never,
                sku: params.skuFilter,
                priceRange: params.priceRange,
                tagGroups:
                    params.tagGroups && params.tagGroups.length > 0
                        ? params.tagGroups
                        : undefined,
                tagName: params.tagNameFilter && params.tagNameFilter.length > 0 ? params.tagNameFilter : undefined,
            },
            sort:
                params.sort && Object.keys(params.sort).length > 0
                    ? params.sort
                    : undefined,
        }),
        [
            params.currentPage,
            params.itemsPerPage,
            hasValidSearch,
            searchTerm,
            params.selectedCategory?.uuid,
            params.favoriteCheck,
            params.offerCheck,
            params.stockCheck,
            params.ratingFilter,
            params.colorLineFilter,
            params.skuFilter,
            params.priceRange,
            params.tagGroups,
            params.tagNameFilter,
            params.sort,
            isAuth,
        ]
    );

    const {
        data: pvCards,
        isLoading: productCardsIsLoading,
        error: productCardsError,
        refetch: productCardsRefetch,
    } = useFetchProductVersionCardsV3(queryParams, { enabled: params.enabled ?? true });

    return {
        data: pvCards,
        isLoading: productCardsIsLoading,
        error: productCardsError,
        refetch: productCardsRefetch,
        totalRecords: pvCards?.totalRecords ?? 0,
        totalPages: pvCards?.totalPages ?? 0,
        itemsPerPage: params.itemsPerPage ?? ITEMS_PER_PAGE,
    };
}
