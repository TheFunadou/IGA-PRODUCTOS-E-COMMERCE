import api from "../../../api/api.config";
import type { AddPVReviewType, GetProductVersionReviewsType, ProductVersionCardFilters, ProductVersionCardType, ProductVersionDetailType, ProductVersionRandomOptions, PVCardsResponseType, PVReviewResumeType, SearchedProductType } from "../ProductTypes"

export const searchProductVersionCards = async (params: ProductVersionCardFilters): Promise<PVCardsResponseType | null> => {
    const { data } = await api.post<PVCardsResponseType | null>("product-version/search", params);
    return data;
};

export const searchCardsRandom = async (options: ProductVersionRandomOptions): Promise<ProductVersionCardType[]> => {
    const { data } = await api.get<ProductVersionCardType[]>("product-version/random-cards", { params: options });
    return data;
};

export const getProductVersionDetailService = async (sku: string): Promise<ProductVersionDetailType> => {
    const { data } = await api.get<ProductVersionDetailType>("product-version/details/" + sku);
    return data;
};

export const listProductVersionsByName = async (input: string): Promise<SearchedProductType[]> => {
    const { data } = await api.get<SearchedProductType[]>("product-version/list/" + input);
    return data;
};

export const addProductVersionReview = async (args: { data: AddPVReviewType, csrfToken: string }): Promise<string> => {
    const { data } = await api.post<string>("product/review", args.data, { headers: { "X-CSRF-TOKEN": args.csrfToken } });
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