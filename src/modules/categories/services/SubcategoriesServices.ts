import api from "../../../api/api.config";
import type { SubcategoriesType } from "../CategoriesTypes";

// export const getCategoryDescendantsService = async (categoryUUID: string): Promise<SubcategoriesType[]> => {
//     const response = await axios.get<SubcategoriesType[]>(`${BASEURL}/categories/subcategories/${categoryUUID}`, { withCredentials: true });
//     return response.data;
// }

export const getCategoryDescendantsService = async (categoryUUID: string): Promise<SubcategoriesType[]> => {
    const { data } = await api.get<SubcategoriesType[]>("subcategories/" + categoryUUID);
    return data;
}

