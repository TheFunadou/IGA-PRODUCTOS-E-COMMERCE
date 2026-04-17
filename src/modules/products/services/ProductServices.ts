import api from "../../../api/api.config";
import type { AddPVReviewType, GetProductVersionReviewsType, ProductVersionCardFilters, ProductVersionDetailI, ProductVersionDetailType, ProductVersionStockI, PVCardsResponseType, PVCardsResponseTypeV2, PVReviewResumeType, SearchCardsDTO, SearchedProductType } from "../ProductTypes"

export const searchProductVersionCards = async (params: ProductVersionCardFilters): Promise<PVCardsResponseType | null> => {
    const { data } = await api.post<PVCardsResponseType | null>("product-version/search", params);
    return data;
};

export const searchProductVersionCardsV2 = async (params: SearchCardsDTO): Promise<PVCardsResponseTypeV2 | null> => {
    const { data } = await api.post<PVCardsResponseTypeV2 | null>("product-version/search/v2", params);
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

export const getStockBySKUList = async (skuList: string[]): Promise<ProductVersionStockI[]> => {
    const { data } = await api.post<ProductVersionStockI[]>("product-version/stock", { skuList });
    return data;
};


export const listProductVersionsByName = async (input: string): Promise<SearchedProductType[]> => {
    const { data } = await api.get<SearchedProductType[]>("product-version/list/" + input);
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