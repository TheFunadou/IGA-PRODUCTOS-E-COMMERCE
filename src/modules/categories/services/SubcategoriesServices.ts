import axios from "axios";
import type { SubcategoriesType } from "../CategoriesTypes";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

export const getCategoryDescendantsService = async (category_id: number): Promise<SubcategoriesType[]> => {
    const response = await axios.get<SubcategoriesType[]>(`${BASEURL}/categories/subcategories/${category_id}`,{withCredentials:true});
    return response.data;
}

