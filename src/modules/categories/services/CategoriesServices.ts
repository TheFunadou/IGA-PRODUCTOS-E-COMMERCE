import axios from "axios";
import type { CategoryType } from "../CategoriesTypes";
import { BASE_URL } from "../../../global/GlobalTypes";


export const getMainCategoriesService = async (): Promise<CategoryType[]> =>  {
    const response = await axios.get<CategoryType[]>(`${BASE_URL}/categories`,{withCredentials:true});
    return response.data;
}


