

import { useQuery } from "@tanstack/react-query"
import type { CategoryType, SubcategoriesType } from "../CategoriesTypes";
import { getMainCategoriesService } from "../services/CategoriesServices";
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
// export const useFetchSubcategories = (categoryID: number | undefined) => {
//     return useQuery<SubcategoriesType[]>({
//         queryKey: ["subcategories", categoryID],
//         // Enable when categoryID isnt provided
//         queryFn: async () => getCategoryDescendantsService(categoryID!),
//         enabled: !!categoryID,
//         staleTime: 5 * 60 * 1000,
//         gcTime: 10 * 60 * 1000,
//         refetchOnWindowFocus: false,
//     });
// };

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