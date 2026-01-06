import { useQuery } from "@tanstack/react-query"
import { getProductVersionDetailService, listProductVersionsByName, searchProductVersionCards } from "../services/ProductServices";
import type { ProductVersionCardFilters, ProductVersionDetailType, PVCardsResponseType, SearchedProductType } from "../ProductTypes";

export const useFetchProductVersionCards = (params: ProductVersionCardFilters) => {
    return useQuery<PVCardsResponseType | null>({
        queryKey: ["product:product_version", { params }],
        queryFn: async () => await searchProductVersionCards(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useFetchProductVersionDetail = (sku: string | undefined) => {
    return useQuery<ProductVersionDetailType>({
        queryKey: ["product:product_version:detail", sku],
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
        queryFn: async () => await listProductVersionsByName(input!),
        enabled: !!input && input.length > 3,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}