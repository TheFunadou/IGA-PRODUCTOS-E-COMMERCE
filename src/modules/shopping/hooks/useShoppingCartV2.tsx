import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoadShoppingCartI, ShoppingCartI } from "../ShoppingTypes";
import {
    setItem,
    removeItem,
    toggleCheck,
    checkAll,
    uncheckAll,
    clearCart,
    createShoppingCart,
    mergeShoppingCart,
    saveShoppingCart,
    loadShoppingCart
} from "../services/ShoppingCartService";
import { buildKey } from "../../../global/GlobalHelpers";


export const shoppingCartQKs = {
    shoppingCart: (clientUUID: string) => buildKey("shopping-cart", { clientUUID }),
    loadShoppingCart: (clientUUID: string) => buildKey("shopping-cart:load", { clientUUID })
};


// Interface del hook
interface UseShoppingCartProps {
    isAuth: boolean;
    authCustomer?: { uuid: string } | null;
    showTriggerAlert: (type: "Successfull" | "Error", message: string, options?: { duration: number }) => void;
}

interface UseShoppingCartReturn {
    // Data
    data: LoadShoppingCartI | undefined;
    isLoading: boolean;
    isError: boolean;

    // Mutations
    updateQtyItem: (item: ShoppingCartI) => void;
    setItem: (item: ShoppingCartI) => void;
    clearCart: () => void;
    removeItem: (sku: string) => void;
    toggleCheck: (sku: string) => void;
    checkAll: () => void;
    uncheckAll: () => void;
    createShoppingCart: () => void;
    mergeShoppingCart: () => void;
    saveShoppingCart: () => void;

    // States
    isUpdatingQty: boolean;
    isSettingItem: boolean;
    isClearing: boolean;
    isRemoving: boolean;
    isToggling: boolean;
    isCheckingAll: boolean;
    isUncheckingAll: boolean;
    isCreating: boolean;
    isMerging: boolean;
    isSaving: boolean;
}

export const useShoppingCart = ({
    isAuth,
    authCustomer,
    showTriggerAlert,
}: UseShoppingCartProps): UseShoppingCartReturn => {

    const queryClient = useQueryClient();

    const clientUUID =
        (isAuth && authCustomer?.uuid && authCustomer.uuid.length > 0)
            ? authCustomer.uuid
            : "guest-client";

    const queryKey = shoppingCartQKs.loadShoppingCart(clientUUID);

    const {
        data,
        isLoading,
        isError,
    } = useQuery<LoadShoppingCartI>({
        queryKey,
        queryFn: loadShoppingCart,
        staleTime: 1000 * 60 * 3,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled: !!clientUUID,
        refetchInterval: 3 * 60 * 1000,
    });


    const optimisticUpdate = async (
        updater: (old: ShoppingCartI[]) => ShoppingCartI[]
    ) => {
        await queryClient.cancelQueries({ queryKey });

        const previous = queryClient.getQueryData<LoadShoppingCartI>(queryKey);

        queryClient.setQueryData<LoadShoppingCartI>(queryKey, (old) => {
            if (!old) return old;

            return {
                ...old,
                shoppingCart: updater(old.shoppingCart || []),
            };
        });

        return { previous };
    };


    const rollback = (
        context: { previous: LoadShoppingCartI | undefined } | undefined
    ) => {
        if (context?.previous) {
            queryClient.setQueryData(queryKey, context.previous);
        }
    };

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey });
    };

    const updateQtyMutation = useMutation<
        ShoppingCartI[],
        unknown,
        { item: ShoppingCartI },
        { previous: LoadShoppingCartI | undefined }
    >({
        mutationFn: async ({ item }) => {
            return setItem({ item: { type: "add", item } });
        },

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
            queryClient.setQueryData<LoadShoppingCartI>(queryKey, (old) => {
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
        { previous: LoadShoppingCartI | undefined }
    >({
        mutationFn: async ({ item }) => {
            return setItem({ item: { type: "set", item } });
        },

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
            queryClient.setQueryData<LoadShoppingCartI>(queryKey, (old) => {
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
        { previous: LoadShoppingCartI | undefined }
    >({
        mutationFn: clearCart,

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey });

            const previous = queryClient.getQueryData<LoadShoppingCartI>(queryKey);

            queryClient.setQueryData<LoadShoppingCartI>(queryKey, (old) => {
                if (!old) return old;

                return { ...old, shoppingCart: [] };
            });

            return { previous };
        },

        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey, context.previous);
            }

            showTriggerAlert("Error", "No se pudo limpiar el carrito", {
                duration: 3500,
            });
        },

        onSuccess: () => {
            // Asegura consistencia total con backend
            queryClient.setQueryData<LoadShoppingCartI>(queryKey, (old) => {
                if (!old) return old;

                return {
                    ...old,
                    shoppingCart: [],
                };
            });
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey,
                refetchType: "active",
            });
        },
    });

    const removeItemMutation = useMutation<
        ShoppingCartI[],
        unknown,
        { sku: string },
        { previous: LoadShoppingCartI | undefined }
    >({
        mutationFn: removeItem,

        onMutate: async ({ sku }) =>
            optimisticUpdate((old) =>
                old.filter(i => i.item.sku !== sku)
            ),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo eliminar el item", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartI>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
            invalidate();
        },

        onSettled: invalidate,
    });

    const toggleCheckMutation = useMutation<
        ShoppingCartI[],
        unknown,
        { sku: string },
        { previous: LoadShoppingCartI | undefined }
    >({
        mutationFn: toggleCheck,

        onMutate: async ({ sku }) =>
            optimisticUpdate((old) =>
                old.map(i =>
                    i.item.sku === sku ? { ...i, isChecked: !i.isChecked } : i
                )
            ),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo actualizar el check", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartI>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
            invalidate();
        },

        onSettled: invalidate,
    });

    const checkAllMutation = useMutation<
        ShoppingCartI[],
        unknown,
        void,
        { previous: LoadShoppingCartI | undefined }
    >({
        mutationFn: checkAll,

        onMutate: async () =>
            optimisticUpdate((old) =>
                old.map(i => ({ ...i, isChecked: true }))
            ),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo seleccionar todo", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartI>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
            invalidate();
        },

        onSettled: invalidate,
    });

    const uncheckAllMutation = useMutation<
        ShoppingCartI[],
        unknown,
        void,
        { previous: LoadShoppingCartI | undefined }
    >({
        mutationFn: uncheckAll,

        onMutate: async () =>
            optimisticUpdate((old) =>
                old.map(i => ({ ...i, isChecked: false }))
            ),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo deseleccionar todo", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartI>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
        },

        onSettled: invalidate,
    });

    const createCartMutation = useMutation<
        ShoppingCartI[],
        unknown,
        void,
        { previous: LoadShoppingCartI | undefined }
    >({
        mutationFn: createShoppingCart,

        onMutate: async () => optimisticUpdate(() => []),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo crear el carrito", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartI>(queryKey, (old) => {
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
        { previous: LoadShoppingCartI | undefined }
    >({
        mutationFn: mergeShoppingCart,

        onMutate: async () => optimisticUpdate((old) => old),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo fusionar el carrito", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartI>(queryKey, (old) => {
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
        { previous: LoadShoppingCartI | undefined }
    >({
        mutationFn: saveShoppingCart,

        onMutate: async () => optimisticUpdate((old) => old),

        onError: (_err, _vars, context) => {
            rollback(context);
            showTriggerAlert("Error", "No se pudo guardar el carrito", { duration: 3500 });
        },

        onSuccess: (data) => {
            queryClient.setQueryData<LoadShoppingCartI>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
        },

        onSettled: invalidate,
    });

    // ================================
    // 🚀 RETURN
    // ================================

    return {
        data,
        isLoading,
        isError,

        updateQtyItem: (item) => updateQtyMutation.mutate({ item }),
        setItem: (item) => setItemMutation.mutate({ item }),
        clearCart: () => clearCartMutation.mutate(),
        removeItem: (sku) => removeItemMutation.mutate({ sku }),
        toggleCheck: (sku) => toggleCheckMutation.mutate({ sku }),
        checkAll: () => checkAllMutation.mutate(),
        uncheckAll: () => uncheckAllMutation.mutate(),
        createShoppingCart: () => createCartMutation.mutate(),
        mergeShoppingCart: () => mergeCartMutation.mutate(),
        saveShoppingCart: () => saveCartMutation.mutate(),

        isUpdatingQty: updateQtyMutation.isPending,
        isSettingItem: setItemMutation.isPending,
        isClearing: clearCartMutation.isPending,
        isRemoving: removeItemMutation.isPending,
        isToggling: toggleCheckMutation.isPending,
        isCheckingAll: checkAllMutation.isPending,
        isUncheckingAll: uncheckAllMutation.isPending,
        isCreating: createCartMutation.isPending,
        isMerging: mergeCartMutation.isPending,
        isSaving: saveCartMutation.isPending,
    };
};
