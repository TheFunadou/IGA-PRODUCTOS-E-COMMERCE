import { useQuery } from "@tanstack/react-query";
import type { ProductVersionCardType, ProductVersionRandomOptions } from "../../modules/products/ProductTypes";
import { useAuthStore } from "../../modules/auth/states/authStore";
import { searchCardsRandom } from "../../modules/products/services/ProductServices";


export const useFetchAds = (options: ProductVersionRandomOptions) => {
    const { authCustomer } = useAuthStore();
    return useQuery<ProductVersionCardType[]>({
        queryKey: ["product:product-version:ads", { limit: options.limit, customer: authCustomer?.uuid }],
        queryFn: async () => await searchCardsRandom(options),
        staleTime: 10 * 60000,
        gcTime: 11 * 60000,
        refetchOnWindowFocus: false
    })
};