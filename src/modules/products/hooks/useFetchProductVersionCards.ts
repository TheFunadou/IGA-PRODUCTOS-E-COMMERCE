import { useQuery } from "@tanstack/react-query"
import { getProductVersionDetail, getProductVersionDetailV3, getPublicCategoryTags, getStockBySKUList, searchProductVersionCards, searchProductVersionCardsV2, searchProductVersionCardsV3 } from "../services/ProductServices";
import type { ProductVersionCardFilters, ProductVersionDetailI, ProductVersionDetailV3I, ProductVersionStockI, PVCardsResponseType, PVCardsResponseTypeV2, PV3Params, PV3Response, PublicTagsResponseType, SearchCardsDTO } from "../ProductTypes";
import { buildKey } from "../../../global/GlobalHelpers";


export const productQueryKeys = {
    versionCardsV2: (searchParams: SearchCardsDTO) => buildKey("product:version-cards:v2", { searchParams }),
    versionCardsV3: (params: PV3Params) => buildKey("product:version-cards:v3", { params }),
    publicTags: (categoryUuid?: string) => buildKey("tags:public", { categoryUuid }),
    stock: (skuList: string[]) => buildKey("product:version:stock", { skuList }),
    versionDetailsV3: (sku: string) => ["product:product_version:details:v3", { sku }],
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

export const useFetchProductVersionCardsV3 = (params: PV3Params, options?: { enabled?: boolean }) => {
    return useQuery<PV3Response>({
        queryKey: productQueryKeys.versionCardsV3(params),
        queryFn: async () => await searchProductVersionCardsV3(params),
        enabled: options?.enabled ?? true,
        staleTime: 4 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useFetchPublicCategoryTags = (categoryUuid?: string) => {
    return useQuery<PublicTagsResponseType>({
        queryKey: productQueryKeys.publicTags(categoryUuid),
        queryFn: async () => await getPublicCategoryTags(categoryUuid!),
        enabled: !!categoryUuid,
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
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

export const useFetchProductVersionDetailV3 = ({ sku }: { sku: string }) => {
    return useQuery<ProductVersionDetailV3I | null>({
        queryKey: productQueryKeys.versionDetailsV3(sku),
        queryFn: async () => await getProductVersionDetailV3(sku),
        staleTime: 4 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
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

/* ── Tarjetas seleccionadas (home "Modelos más buscados") ─────────────────── */

export const SELECTED_HELMET_SKUS = [
    "CAS4-AM1-001",
    "CAS2-AM1-001",
    "CAS3-AM2-004",
    "CAS1-AI-006",
];

const selectedHelmetsParams: PV3Params = {
    pagination: { page: 1, limit: 8 },
    filters: { sku: SELECTED_HELMET_SKUS },
};

// Contenido curado y estable: TTL largo (staleTime 30 min / gcTime 60 min)
export const useFetchSelectedHelmets = () => {
    return useQuery<PV3Response>({
        queryKey: ["product:version-cards:v3:selected-helmets"],
        queryFn: async () => await searchProductVersionCardsV3(selectedHelmetsParams),
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};