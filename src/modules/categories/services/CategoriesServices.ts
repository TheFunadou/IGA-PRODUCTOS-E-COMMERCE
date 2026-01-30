import api from "../../../api/api.config";
import type { CategorySummaryType, CategoryType } from "../CategoriesTypes";

export const getMainCategoriesService = async (): Promise<CategoryType[]> => {
    const { data } = await api.get<CategoryType[]>("categories");
    return data;
};

export const getCategoriesSummary = async (): Promise<CategorySummaryType[]> => {
    const { data } = await api.get<CategorySummaryType[]>("categories/summary");
    return data;
};


