import api from "../../../api/api.config";
import type { AddPVReviewType, GetProductVersionReviewsType, ProductVersionCardFilters, ProductVersionDetailI, ProductVersionDetailType, ProductVersionDetailV3I, ProductVersionStockI, PVCardsResponseType, PVCardsResponseTypeV2, PVReviewResumeType, PV3Params, PV3Response, PublicTagsResponseType, SearchCardsDTO } from "../ProductTypes"

export const searchProductVersionCards = async (params: ProductVersionCardFilters): Promise<PVCardsResponseType | null> => {
    const { data } = await api.post<PVCardsResponseType | null>("product-version/search", params);
    return data;
};

export const searchProductVersionCardsV2 = async (params: SearchCardsDTO): Promise<PVCardsResponseTypeV2 | null> => {
    const { data } = await api.post<PVCardsResponseTypeV2 | null>("product-version/search/v2", params);
    return data;
};

export const searchProductVersionCardsV3 = async (params: PV3Params): Promise<PV3Response> => {
    const { data } = await api.post<PV3Response>("product-version/search/v3", params);
    return data;
};

export const getPublicCategoryTags = async (categoryUuid: string): Promise<PublicTagsResponseType> => {
    const { data } = await api.get<PublicTagsResponseType>("tags/public", { params: { categoryUuid } });
    return data;
};

export const getProductVersionDetailService = async (sku: string): Promise<ProductVersionDetailType> => {
    const { data } = await api.get<ProductVersionDetailType>("product-version/details/" + sku);
    return data;
};

export const getProductVersionDetail = async (sku: string): Promise<ProductVersionDetailI> => {
    const { data } = await api.get<ProductVersionDetailI>("product-version/details/v2/" + sku);
    return data;
};

export const getProductVersionDetailV3 = async (sku: string): Promise<ProductVersionDetailV3I> => {
    const { data } = await api.get<ProductVersionDetailV3I>("product-version/details/v3/" + sku);
    return data;
};

export const getStockBySKUList = async (skuList: string[]): Promise<ProductVersionStockI[]> => {
    const { data } = await api.post<ProductVersionStockI[]>("product-version/stock", { skuList });
    return data;
};

export const addProductVersionReview = async (args: { data: AddPVReviewType }): Promise<string> => {
    const { data } = await api.post<string>("product/review", args.data);
    return data;
}

export const showProductVersionReviewsByUUID = async (args: { uuid: string, pagination: { page: number, limit: number } }): Promise<GetProductVersionReviewsType> => {
    const { data } = await api.get<GetProductVersionReviewsType>("product/review/" + args.uuid, { params: args.pagination });
    return data;
};

export const getProductVersionReviewsResumeByUUID = async (args: { uuid: string }): Promise<PVReviewResumeType> => {
    const { data } = await api.get<PVReviewResumeType>("product/review/resume/" + args.uuid);
    return data;
};