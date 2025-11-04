import { useQuery } from "@tanstack/react-query"
import { findProductVersionCards, getProductVersionDetailService, getSeachProductVersionByName } from "../services/ProductServices";
import type { ProductVersionCardFilters, ProductVersionCardType, ProductVersionDetailType, PVCardsResponseType, SearchedProductType } from "../ProductTypes";
/**
 * @description Get random product version cards
 * @param limit -- limit of records
 * @returns -An array of ProductVersionCardType
 */
// export const useFetchRandomProductVersionCards = (limit: number) => {
//     return useQuery<ProductVersionCardType[]>({
//         queryKey: ["product:product-version:random", limit],
//         queryFn: async () => await getProductVersionsCardsRandomService(limit),
//         staleTime: 5 * 60 * 1000,
//         gcTime: 10 * 60 * 1000,
//         refetchOnWindowFocus: false,
//     });
// };


export const useFetchProductVersionCards = (params: ProductVersionCardFilters) => {
    // const MAX_LIMIT: number = 25;
    // if(params.limit > MAX_LIMIT) throw new Error("El limite ingresado es demasiado grande, ingresar un valor entre 1 y 26");
    return useQuery<PVCardsResponseType | null>({
        queryKey: ["product:product_version", { params }],
        // enabled: params.limit > 25,
        queryFn: async () => await findProductVersionCards(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};


export const useFetchProductVersionDetail = (sku: string | undefined) => {
    return useQuery<ProductVersionDetailType>({
        queryKey: ["product:product-version", sku],
        queryFn: async () => await getProductVersionDetailService(sku!),
        enabled: !!sku,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useFetchSearchProductVersions = (input: string) => {
    return useQuery<SearchedProductType[]>({
        queryKey: ["product:product-version:search", input],
        queryFn: async () => await getSeachProductVersionByName(input!),
        enabled: !!input && input.length > 3,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}