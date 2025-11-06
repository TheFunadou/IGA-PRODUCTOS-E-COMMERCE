import axios from "axios";
import { BASE_URL } from "../../../global/GlobalTypes"
import type { ProductVersionCardFilters, ProductVersionCardType, ProductVersionDetailType, ProductVersionRandomOptions, PVCardsResponseType, SearchedProductType } from "../ProductTypes"


export const findProductVersionCards = async (params: ProductVersionCardFilters): Promise<PVCardsResponseType | null> => {
    try {
        const { subcategoryPath: path, ...uniqueParams } = params;
        console.log("Path enviado: ", path);

        const response = await axios.get<PVCardsResponseType | null>(`${BASE_URL}/product/product-version`, {
            withCredentials: true,
            params: { 
                ...uniqueParams,
                subcategoryPath: path // Enviar el array directamente
            },
            paramsSerializer: {
                indexes: null // Esto genera: subcategoryPath=1&subcategoryPath=2&subcategoryPath=3
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching product version cards:", error);
        throw new Error("Failed to fetch product version cards");
    }
};
export const findProductVersionCardsRandom = async (options: ProductVersionRandomOptions): Promise<ProductVersionCardType[]> => {
    try {
        const response = await axios.get<ProductVersionCardType[]>(`${BASE_URL}/product/product-version/random`, { withCredentials: true, params: options });
        return response.data;
    } catch (error) {
        console.error("Error fetching random product version cards:", error);
        throw new Error("Failed to fetch random product version cards");
    }
};


export const getProductVersionDetailService = async (sku: string): Promise<ProductVersionDetailType> => {
    const response = await axios.get<ProductVersionDetailType>(`${BASE_URL}/product/product-version/detail/${sku}`,{withCredentials:true});
    return response.data;
};

export const getSeachProductVersionByName = async (input: string): Promise<SearchedProductType[]> => {
    const response = await axios.get<SearchedProductType[]>(`${BASE_URL}/product/product-version/search`, { params: { input }, withCredentials:true });
    return response.data;
};