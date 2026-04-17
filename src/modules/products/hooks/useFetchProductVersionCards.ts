import { useQuery } from "@tanstack/react-query"
import { getProductVersionDetail, getStockBySKUList, listProductVersionsByName, searchProductVersionCards, searchProductVersionCardsV2 } from "../services/ProductServices";
import type { ProductVersionCardFilters, ProductVersionDetailI, ProductVersionStockI, PVCardsResponseType, PVCardsResponseTypeV2, SearchCardsDTO, SearchedProductType } from "../ProductTypes";
import { buildKey } from "../../../global/GlobalHelpers";


export const productQueryKeys = {
    versionCardsV2: (searchParams: SearchCardsDTO) => buildKey("product:version-cards:v2", { searchParams }),
    stock: (skuList: string[]) => buildKey("product:version:stock", { skuList }),
};

export const useFetchProductVersionCards = (params: ProductVersionCardFilters) => {
    return useQuery<PVCardsResponseType | null>({
        queryKey: ["product:product_version:cards", { params }],
        queryFn: async () => await searchProductVersionCards(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useFetchProductVersionCardsV2 = (params: SearchCardsDTO) => {
    return useQuery<PVCardsResponseTypeV2 | null>({
        queryKey: productQueryKeys.versionCardsV2(params),
        queryFn: async () => await searchProductVersionCardsV2(params),
        staleTime: 4 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useFetchProductVersionDetailV2 = ({ sku }: { sku: string }) => {
    return useQuery<ProductVersionDetailI | null>({
        queryKey: ["product:product_version:details:v2", { sku }],
        queryFn: async () => await getProductVersionDetail(sku),
        staleTime: 4 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
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
};


export const useFetchStock = (skuList: string[]) => {
    return useQuery<ProductVersionStockI[]>({
        queryKey: productQueryKeys.stock(skuList),
        queryFn: async () => await getStockBySKUList(skuList),
        enabled: !!skuList && skuList.length > 0,
        staleTime: 3 * 60 * 1000,
        gcTime: 4 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
};