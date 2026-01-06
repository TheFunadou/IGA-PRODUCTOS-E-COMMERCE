import api from "../../../api/api.config";
import type { ProductVersionCardFilters, ProductVersionCardType, ProductVersionDetailType, ProductVersionRandomOptions, PVCardsResponseType, SearchedProductType } from "../ProductTypes"

export const searchProductVersionCards = async (params: ProductVersionCardFilters): Promise<PVCardsResponseType | null> => {
    const { data } = await api.post<PVCardsResponseType | null>("product-version/search", params);
    return data;
};


// export const findProductVersionCardsRandom = async (options: ProductVersionRandomOptions): Promise<ProductVersionCardType[]> => {
//     try {
//         const response = await axios.get<ProductVersionCardType[]>(`${BASE_URL}/product/product-version/random`, { withCredentials: true, params: options });
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching random product version cards:", error);
//         throw new Error("Failed to fetch random product version cards");
//     }
// };


export const searchCardsRandom = async (options: ProductVersionRandomOptions): Promise<ProductVersionCardType[]> => {
    const { data } = await api.get<ProductVersionCardType[]>("product-version/random", { params: options });
    return data;
};

// export const getProductVersionDetailService = async (sku: string): Promise<ProductVersionDetailType> => {
//     const response = await axios.get<ProductVersionDetailType>(`${BASE_URL}/product/product-version/detail/${sku}`, { withCredentials: true });
//     return response.data;
// };

export const getProductVersionDetailService = async (sku: string): Promise<ProductVersionDetailType> => {
    const { data } = await api.get<ProductVersionDetailType>("product-version/details/" + sku);
    return data;
};

export const listProductVersionsByName = async (input: string): Promise<SearchedProductType[]> => {
    const { data } = await api.get<SearchedProductType[]>("product-version/list/" + input);
    return data;
};
