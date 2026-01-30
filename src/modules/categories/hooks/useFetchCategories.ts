

import { useQuery } from "@tanstack/react-query"
import type { CategorySummaryType, CategoryType, SubcategoriesType } from "../CategoriesTypes";
import { getCategoriesSummary, getMainCategoriesService } from "../services/CategoriesServices";
import { getCategoryDescendantsService } from "../services/SubcategoriesServices";

/**
 * @description -Get the main categories
 * @returns An array of CategoryType
 */
export const useFetchMainCategories = () => {
    return useQuery<CategoryType[]>({
        queryKey: ["main-categories"],
        queryFn: async () => await getMainCategoriesService(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

/**
 * @description -Search the descedants(subcategories) of a father category
 * @param categoryID --ID of father category to search desecendants
 * @returns --An array of
 */

export const useFetchSubcategories = (categoryUUID: string | undefined) => {
    return useQuery<SubcategoriesType[]>({
        queryKey: ["subcategories", categoryUUID],
        // Enable when categoryID isnt provided
        queryFn: async () => getCategoryDescendantsService(categoryUUID!),
        enabled: !!categoryUUID,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};


export const useFetchCategoriesSummary = () => {
    return useQuery<CategorySummaryType[]>({
        queryKey: ["categories:summary"],
        queryFn: async () => await getCategoriesSummary(),
        staleTime: 60 * 60 * 1000,
        gcTime: 65 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};