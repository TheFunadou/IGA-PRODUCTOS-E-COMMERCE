import api from "../../../api/api.config";
import type { CategoryType } from "../CategoriesTypes";

// export const getMainCategoriesService = async (): Promise<CategoryType[]> => {
//     const response = await axios.get<CategoryType[]>(`${BASE_URL}/categories`, { withCredentials: true });
//     return response.data;
// };

export const getMainCategoriesService = async (): Promise<CategoryType[]> => {
    const { data } = await api.get<CategoryType[]>("categories");
    return data;
};


