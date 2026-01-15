import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addProductVersionReview, getProductVersionDetailService, getProductVersionReviewsResumeBySKU, showProductVersionReviewsBySKU } from "../services/ProductServices"
import type { AddPVReviewType, GetProductVersionReviewsType, ProductVersionDetailType, PVCustomerReview, PVReviewResumeType } from "../ProductTypes";
import { useAuthStore } from "../../auth/states/authStore";
import { buildKey } from "../../../global/GlobalHelpers";
import { formatAxiosError } from "../../../api/helpers";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";

export const PVDetailQueryKeys = {
    detail: (sku: string | undefined) => buildKey("product:product-version:detail", { sku }),
    reviews: (sku: string | undefined) => buildKey("product:product-version:reviews", { sku }),
    reviewsResume: (sku: string | undefined) => buildKey("product:product-version:reviews:resume", { sku })
};


export const useFetchProductVersionDetail = (sku: string | undefined) => {
    return useQuery<ProductVersionDetailType>({
        queryKey: PVDetailQueryKeys.detail(sku),
        queryFn: async () => await getProductVersionDetailService(sku!),
        enabled: !!sku,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};


export const useFetchProductVersionReviews = (args: { sku: string }) => {
    return useQuery<GetProductVersionReviewsType>({
        queryKey: PVDetailQueryKeys.reviews(args.sku),
        queryFn: async () => await showProductVersionReviewsBySKU({ sku: args.sku, pagination: { page: 1, limit: 10 } }),
        enabled: !!args.sku,
        staleTime: 15 * 60 * 1000,
        gcTime: 25 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
};

export const useFetchProductVersionReviewsResumeBySKU = (args: { sku: string }) => {
    return useQuery<PVReviewResumeType>({
        queryKey: PVDetailQueryKeys.reviewsResume(args.sku),
        queryFn: async () => await getProductVersionReviewsResumeBySKU({ sku: args.sku }),
        enabled: !!args.sku,
        staleTime: 15 * 60 * 1000,
        gcTime: 20 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
};

export function useAddPVReview() {
    const queryClient = useQueryClient();
    const { authCustomer, csrfToken } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();

    return useMutation<
        string, // response (uuid real)
        Error,
        { data: AddPVReviewType },
        { previousReviews?: GetProductVersionReviewsType; tempUUID: string }
    >({
        mutationFn: async ({ data }) => {
            return await addProductVersionReview({
                data,
                csrfToken: csrfToken!
            });
        },

        onMutate: async ({ data }) => {
            const queryKey = PVDetailQueryKeys.reviews(data.sku);

            await queryClient.cancelQueries({ queryKey });

            const previousReviews =
                queryClient.getQueryData<GetProductVersionReviewsType>(queryKey);

            const tempUUID = `temp-${Date.now()}`;

            const optimisticReview: PVCustomerReview = {
                uuid: tempUUID,
                rating: data.rating,
                title: data.title,
                comment: data.comment,
                created_at: new Date(),
                customer: authCustomer?.name || "Cliente anónimo"
            };

            queryClient.setQueryData<GetProductVersionReviewsType>(
                queryKey,
                (old) => {
                    if (!old) {
                        return {
                            reviews: [optimisticReview],
                            totalRecords: 1,
                            totalPages: 1
                        };
                    }

                    return {
                        reviews: [...old.reviews, optimisticReview],
                        totalRecords: old.totalRecords + 1,
                        totalPages: old.totalPages
                    };
                }
            );

            return { previousReviews, tempUUID };
        },

        onError: (error, variables, context) => {
            if (!context?.previousReviews) return;

            const queryKey = PVDetailQueryKeys.reviews(variables.data.sku);

            queryClient.setQueryData(
                queryKey,
                context.previousReviews
            );

            showTriggerAlert("Error", formatAxiosError(error));
        },

        onSuccess: (realUUID, variables, context) => {
            if (!context) return;

            const queryKey = PVDetailQueryKeys.reviews(variables.data.sku);

            queryClient.setQueryData<GetProductVersionReviewsType>(
                queryKey,
                (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        reviews: old.reviews.map(review =>
                            review.uuid === context.tempUUID
                                ? { ...review, uuid: realUUID }
                                : review
                        )
                    };
                }
            );
        },
        onSettled: (_data, _error, variables) => {
            const sku = variables.data.sku;
            queryClient.invalidateQueries({
                queryKey: PVDetailQueryKeys.reviewsResume(sku),
                refetchType: "inactive"
            });
        }

    });
}

