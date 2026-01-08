import api from "../../../api/api.config";
import type { ProductVersionCardFilters, ProductVersionCardType, ProductVersionDetailType, ProductVersionRandomOptions, PVCardsResponseType, SearchedProductType } from "../ProductTypes"

export const searchProductVersionCards = async (params: ProductVersionCardFilters): Promise<PVCardsResponseType | null> => {
    const { data } = await api.post<PVCardsResponseType | null>("product-version/search", params);
    return data;
};


export const searchCardsRandom = async (options: ProductVersionRandomOptions): Promise<ProductVersionCardType[]> => {
    const { data } = await api.get<ProductVersionCardType[]>("product-version/random", { params: options });
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
