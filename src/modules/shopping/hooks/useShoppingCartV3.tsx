import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoadShoppingCartV3I, ShoppingCartI } from "../ShoppingTypes";
import {
    setItem,
    removeItem,
    clearCart,
    createShoppingCart,
    mergeShoppingCart,
    saveShoppingCart,
    loadShoppingCartV3
} from "../services/ShoppingCartService";
import { buildKey } from "../../../global/GlobalHelpers";

export const shoppingCartV3QKs = {
    loadShoppingCart: (clientUUID: string) => buildKey("shopping-cart:load:v3", { clientUUID })
};

interface UseShoppingCartV3Props {
    isAuth: boolean;
    authCustomer?: { uuid: string } | null;
    showTriggerAlert: (type: "Successfull" | "Error", message: string, options?: { duration: number }) => void;
    destination?: string;
}

interface UseShoppingCartV3Return {
    data: LoadShoppingCartV3I | undefined;
    isLoading: boolean;
    isError: boolean;

    updateQtyItem: (item: ShoppingCartI) => void;
    setItem: (item: ShoppingCartI) => void;
    clearCart: () => void;
    removeItem: (sku: string) => void;
    createShoppingCart: () => void;
    mergeShoppingCart: () => void;
    saveShoppingCart: () => void;

    isUpdatingQty: boolean;
    isSettingItem: boolean;
    isClearing: boolean;
    isRemoving: boolean;
    isCreating: boolean;
    isMerging: boolean;
    isSaving: boolean;
}

export const useShoppingCartV3 = ({
    isAuth,
    authCustomer,
    showTriggerAlert,
    destination,
}: UseShoppingCartV3Props): UseShoppingCartV3Return => {

    const queryClient = useQueryClient();

    const clientUUID =
        (isAuth && authCustomer?.uuid && authCustomer.uuid.length > 0)
            ? authCustomer.uuid
            : "guest-client";

    const baseQueryKey = shoppingCartV3QKs.loadShoppingCart(clientUUID);
    const queryKey = destination
        ? [...baseQueryKey, { destination }]
        : baseQueryKey;

    const {
        data,
        isLoading,
        isError,
    } = useQuery<LoadShoppingCartV3I>({
        queryKey,
        queryFn: () => loadShoppingCartV3(destination),
        staleTime: 1000 * 60 * 3,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled: !!clientUUID,
        refetchInterval: 3 * 60 * 1000,
        placeholderData: (previousData) => previousData,
    });

    const optimisticUpdate = async (
        updater: (old: ShoppingCartI[]) => ShoppingCartI[]
    ) => {
        await queryClient.cancelQueries({ queryKey });
        const previous = queryClient.getQueryData<LoadShoppingCartV3I>(queryKey);

        queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
            if (!old) return old;
            return {
                ...old,
                shoppingCart: updater(old.shoppingCart || []),
            };
        });

        return { previous };
    };

    const rollback = (
        context: { previous: LoadShoppingCartV3I | undefined } | undefined
    ) => {
        if (context?.previous) {
            queryClient.setQueryData(queryKey, context.previous);
        }
    };

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: baseQueryKey });
    };

    const updateQtyMutation = useMutation<
        ShoppingCartI[],
        unknown,
        { item: ShoppingCartI },
        { previous: LoadShoppingCartV3I | undefined }
    >({
        mutationFn: async ({ item }) => setItem({ item: { type: "add", item } }),

        onMutate: async ({ item }) =>
            optimisticUpdate((old) => {
                const exists = old.find(i => i.item.sku === item.item.sku);
                if (exists) {
                    return old.map(i =>
                        i.item.sku === item.item.sku
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    );
                }
                return [...old, item];
            }),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo actualizar el carrito", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
            invalidate();
        },

        onSettled: invalidate,
    });

    const setItemMutation = useMutation<
        ShoppingCartI[],
        unknown,
        { item: ShoppingCartI },
        { previous: LoadShoppingCartV3I | undefined }
    >({
        mutationFn: async ({ item }) => setItem({ item: { type: "set", item } }),

        onMutate: async ({ item }) =>
            optimisticUpdate((old) => {
                const exists = old.find(i => i.item.sku === item.item.sku);
                if (exists) {
                    return old.map(i =>
                        i.item.sku === item.item.sku ? item : i
                    );
                }
                return [...old, item];
            }),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo agregar el item", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
            invalidate();
        },

        onSettled: invalidate,
    });

    const clearCartMutation = useMutation<
        ShoppingCartI[],
        unknown,
        void,
        { previous: LoadShoppingCartV3I | undefined }
    >({
        mutationFn: clearCart,

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<LoadShoppingCartV3I>(queryKey);

            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: [] };
            });

            return { previous };
        },

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo limpiar el carrito", { duration: 3500 });
        },

        onSuccess: () => {
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: [] };
            });
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey, refetchType: "active" });
        },
    });

    const removeItemMutation = useMutation<
        ShoppingCartI[],
        unknown,
        { sku: string },
        { previous: LoadShoppingCartV3I | undefined }
    >({
        mutationFn: removeItem,

        onMutate: async ({ sku }) =>
            optimisticUpdate((old) => old.filter(i => i.item.sku !== sku)),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo eliminar el item", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
            invalidate();
        },

        onSettled: invalidate,
    });

    const createCartMutation = useMutation<
        ShoppingCartI[],
        unknown,
        void,
        { previous: LoadShoppingCartV3I | undefined }
    >({
        mutationFn: createShoppingCart,

        onMutate: async () => optimisticUpdate(() => []),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo crear el carrito", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
        },

        onSettled: invalidate,
    });

    const mergeCartMutation = useMutation<
        ShoppingCartI[],
        unknown,
        void,
        { previous: LoadShoppingCartV3I | undefined }
    >({
        mutationFn: mergeShoppingCart,

        onMutate: async () => optimisticUpdate((old) => old),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo fusionar el carrito", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
        },

        onSettled: invalidate,
    });

    const saveCartMutation = useMutation<
        ShoppingCartI[],
        unknown,
        void,
        { previous: LoadShoppingCartV3I | undefined }
    >({
        mutationFn: saveShoppingCart,

        onMutate: async () => optimisticUpdate((old) => old),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo guardar el carrito", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
        },

        onSettled: invalidate,
    });

    return {
        data,
        isLoading,
        isError,

        updateQtyItem: (item) => updateQtyMutation.mutate({ item }),
        setItem: (item) => setItemMutation.mutate({ item }),
        clearCart: () => clearCartMutation.mutate(),
        removeItem: (sku) => removeItemMutation.mutate({ sku }),
        createShoppingCart: () => createCartMutation.mutate(),
        mergeShoppingCart: () => mergeCartMutation.mutate(),
        saveShoppingCart: () => saveCartMutation.mutate(),

        isUpdatingQty: updateQtyMutation.isPending,
        isSettingItem: setItemMutation.isPending,
        isClearing: clearCartMutation.isPending,
        isRemoving: removeItemMutation.isPending,
        isCreating: createCartMutation.isPending,
        isMerging: mergeCartMutation.isPending,
        isSaving: saveCartMutation.isPending,
    };
};
