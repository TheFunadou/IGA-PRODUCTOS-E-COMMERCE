import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CustomerAddressType, NewAddressType, onToogleFavoriteType, UpdateAddressType } from "../CustomerTypes";
import { createAddressService, deleteAddressService, getCustomerAddressesService, getCustomerFavorites, toggleFavoriteService, updateAddressService } from "../services/CustomerService";
import { buildKey } from "../../../global/GlobalHelpers";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useAuthStore } from "../../auth/states/authStore";
import type { ProductVersionCardType, ProductVersionDetailType, PVCardsResponseType } from "../../products/ProductTypes";

export const customerQueryKeys = {
    addresses: (customer: string | undefined) => buildKey("customer:addresses", { customer }),
    favorites: (customer: string | undefined) => buildKey("customer:favorites", { customer })
};

export const useFetchCustomerAddresses = () => {
    const { isAuth, authCustomer } = useAuthStore();
    return useQuery<CustomerAddressType[]>({
        queryKey: customerQueryKeys.addresses(authCustomer?.uuid!),
        queryFn: async () => await getCustomerAddressesService(),
        enabled: !!isAuth,
        staleTime: 10 * 60000,
        gcTime: 15 * 60000,
        refetchOnWindowFocus: false
    });
};

// useAddAddress - CON LÓGICA DE SERVIDOR
export function useAddAddress(customer: string | undefined) {
    const queryClient = useQueryClient();
    const { showTriggerAlert } = useTriggerAlert();

    return useMutation({
        mutationFn: async (newAddress: NewAddressType): Promise<CustomerAddressType> => {
            return await createAddressService(newAddress);
        },

        onMutate: async (newAddress: NewAddressType) => {
            if (!customer) return { previousAddresses: undefined, tempUUID: "" };
            const queryKey = customerQueryKeys.addresses(customer);
            await queryClient.cancelQueries({ queryKey });
            const previousAddresses = queryClient.getQueryData<CustomerAddressType[]>(queryKey);
            const tempUUID = `temp-${Date.now()}`;
            queryClient.setQueryData<CustomerAddressType[]>(
                queryKey,
                (old) => {
                    if (!old) return [{ ...newAddress, uuid: tempUUID } as CustomerAddressType];
                    let updatedAddresses = old;
                    if (newAddress.default_address) {
                        updatedAddresses = old.map(addr => ({ ...addr, default_address: false }));
                    };
                    return [
                        { ...newAddress, uuid: tempUUID } as CustomerAddressType,
                        ...updatedAddresses
                    ];
                }
            );

            return { previousAddresses, tempUUID };
        },

        onSuccess: (savedAddress, newAddress, context) => {
            if (!customer) return;
            const queryKey = customerQueryKeys.addresses(customer);
            queryClient.invalidateQueries({ queryKey });
            showTriggerAlert("Successfull", "Dirección de envío creada exitosamente", {
                duration: 3500,
                delay: 1000
            });
        },

        onError: (error, newAddress, context) => {
            if (!customer || !context) return;
            const queryKey = customerQueryKeys.addresses(customer);
            queryClient.setQueryData(queryKey, context.previousAddresses);
            showTriggerAlert("Error", "No se pudo crear la dirección", {
                duration: 3500
            });
        },
    });
}

// useDeleteAddress - CON LÓGICA DE SERVIDOR
export function useDeleteAddress(customer: string | undefined) {
    const queryClient = useQueryClient();
    const { showTriggerAlert } = useTriggerAlert();

    return useMutation({
        mutationFn: async (addressUUID: string): Promise<string> => {
            return await deleteAddressService(addressUUID);
        },

        onMutate: async (addressUUID: string) => {
            if (!customer) return { previousAddresses: undefined };
            const queryKey = customerQueryKeys.addresses(customer);
            await queryClient.cancelQueries({ queryKey });
            const previousAddresses = queryClient.getQueryData<CustomerAddressType[]>(queryKey);
            queryClient.setQueryData<CustomerAddressType[]>(
                queryKey,
                (old) => {
                    if (!old) return [];
                    return old.filter(addr => addr.uuid !== addressUUID);
                }
            );

            return { previousAddresses };
        },

        onSuccess: (message) => {
            if (!customer) return;
            const queryKey = customerQueryKeys.addresses(customer);
            queryClient.invalidateQueries({ queryKey });
            showTriggerAlert("Successfull", message, { duration: 3500, delay: 1000 });
        },

        onError: (error, addressUUID, context) => {
            if (!customer || !context) return;
            const queryKey = customerQueryKeys.addresses(customer);
            queryClient.setQueryData(queryKey, context.previousAddresses);
            showTriggerAlert("Error", "No se pudo eliminar la dirección", {
                duration: 3500
            });
        },
    });
};


// useUpdateAddress - CON LÓGICA DE SERVIDOR
export function useUpdateAddress(customer: string | undefined) {
    const queryClient = useQueryClient();
    const { showTriggerAlert } = useTriggerAlert();

    return useMutation({
        mutationFn: async ({ addressUUID, data }: {
            addressUUID: string;
            data: UpdateAddressType
        }): Promise<string> => {
            return await updateAddressService(addressUUID, data);
        },
        onMutate: async ({ addressUUID, data }) => {
            if (!customer) return { previousAddresses: undefined };
            const queryKey = customerQueryKeys.addresses(customer);
            await queryClient.cancelQueries({ queryKey });
            const previousAddresses = queryClient.getQueryData<CustomerAddressType[]>(queryKey);
            queryClient.setQueryData<CustomerAddressType[]>(
                queryKey,
                (old) => {
                    if (!old) return [];

                    return old.map(addr => {
                        if (addr.uuid === addressUUID) {
                            return { ...addr, ...data };
                        };
                        if (data.default_address === true) {
                            return { ...addr, default_address: false };
                        };
                        return addr;
                    });
                }
            );

            return { previousAddresses };
        },

        onSuccess: (message) => {
            if (!customer) return;

            const queryKey = customerQueryKeys.addresses(customer);
            // ✅ Invalida y refetch automático para sincronizar con el estado real del servidor
            // Esto garantiza coherencia con la lógica del backend (ej: asignación automática de default_address)
            queryClient.invalidateQueries({ queryKey });

            showTriggerAlert("Successfull", message, {
                duration: 3500,
                delay: 1000
            });
        },

        onError: (error, data, context) => {
            if (!customer || !context) return;

            const queryKey = customerQueryKeys.addresses(customer);

            // ✅ Restaurar estado anterior si falla
            queryClient.setQueryData(queryKey, context.previousAddresses);

            console.error('❌ Error al actualizar la dirección:', error);
            showTriggerAlert("Error", "No se pudo actualizar la dirección", {
                duration: 3500
            });
        },
    });
};


export const useFetchCustomerFavorites = () => {
    const { isAuth, authCustomer } = useAuthStore();
    return useQuery<ProductVersionCardType[] | null>({
        queryKey: customerQueryKeys.favorites(authCustomer?.uuid!),
        queryFn: async () => await getCustomerFavorites(),
        enabled: !!isAuth,
        staleTime: 10 * 60000,
        gcTime: 15 * 60000,
        refetchOnWindowFocus: false
    });
};

export function useToggleFavorite() {
    const queryClient = useQueryClient();
    const { showTriggerAlert } = useTriggerAlert();
    const { isAuth, authCustomer } = useAuthStore();

    return useMutation({
        mutationFn: async ({ sku }: { sku: string, product: ProductVersionCardType }): Promise<onToogleFavoriteType> => {
            return await toggleFavoriteService(sku);
        },
        onMutate: async ({ sku, product }) => {
            if (!authCustomer && !isAuth) return { previousFavorites: undefined };

            const queryKey = customerQueryKeys.favorites(authCustomer?.uuid!);
            await queryClient.cancelQueries({ queryKey });
            const previousFavorites = queryClient.getQueryData<ProductVersionCardType[]>(queryKey);
            const exists = previousFavorites?.some(fav => fav.product_version.sku === sku);
            const isAdding = !exists;

            queryClient.setQueryData<ProductVersionCardType[]>(
                queryKey, (old) => {
                    if (!old) return [product];
                    return exists ? old.filter(fav => fav.product_version.sku !== sku) : [product, ...old];
                }
            );

            queryClient.setQueriesData<PVCardsResponseType>(
                { queryKey: ['product:product_version'] }, // Busca todas las queries que empiecen con 'products'
                (oldData) => {
                    if (!oldData?.product_version_cards) return oldData;

                    return {
                        ...oldData,
                        product_version_cards: oldData.product_version_cards.map(card =>
                            card.product_version.sku === sku
                                ? { ...card, isFavorite: isAdding }
                                : card
                        )
                    };
                }
            );

            queryClient.setQueriesData<ProductVersionDetailType>(
                {
                    queryKey: ['product:product_version:detail'],
                    predicate: (query) => query.state.data !== undefined
                },
                (oldData) => {
                    if (!oldData) return oldData;
                    if (oldData.product_version.sku === sku) {
                        return {
                            ...oldData,
                            isFavorite: isAdding
                        }
                    };
                    return oldData;
                }
            );

            if (isAdding) {
                showTriggerAlert("Successfull", "Agregado a favoritos", {
                    favoriteType: "add",
                    duration: 3500,
                });
            } else {
                showTriggerAlert("Successfull", "Removido de favoritos", {
                    favoriteType: "remove",
                    duration: 3500,
                });
            };

            return { previousFavorites };
        },
        onSuccess: () => {
            if (!authCustomer && !isAuth) return;

            queryClient.invalidateQueries({
                queryKey: customerQueryKeys.favorites(authCustomer?.uuid!),
                refetchType: "none"
            });
        },
        onError: (error, variables, context) => {
            if (!authCustomer || !context) return;
            queryClient.setQueryData(
                customerQueryKeys.favorites(authCustomer.uuid!),
                context.previousFavorites
            );
            showTriggerAlert("Error", "Ocurrio un error inesperado", {
                duration: 3500
            });
        }
    })

}