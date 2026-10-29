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
import { phCartItemRemoved, phCartQuantityDecreased } from "../../analytics/PostHogEvents";

/* ── Coordinación de escrituras del carrito (multi-instancia) ──────────────
   Todas las instancias de este hook comparten la MISMA caché de react-query
   (Navbar, detalle, tarjetas y página del carrito). Sin estas guarda, cuando
   había varias mutaciones en vuelo cada respuesta escribía su snapshot en
   orden de llegada: una respuesta vieja que aterrizaba tarde rebobinaba la
   cantidad y el contador de cantidad saltaba/oscilaba (p.ej. 17 → 8 → 12).

   - WRITE_SEQ: seq más alta ya aplicada por cliente; una respuesta/refetch
     con seq menor se descarta (la escritura más nueva gana).
   - PENDING_WRITES: escrituras en vuelo por cliente; el refetch (invalidate)
     solo se dispara cuando se asienta LA ÚLTIMA, así el GET nunca snapshot
     un estado intermedio.
*/
const WRITE_SEQ = new Map<string, number>();
const PENDING_WRITES = new Map<string, number>();
let SEQ_COUNTER = 0;

const takeSeq = (clientKey: string): number => {
    const seq = ++SEQ_COUNTER;
    WRITE_SEQ.set(clientKey, seq);
    return seq;
};

const currentSeq = (clientKey: string): number => WRITE_SEQ.get(clientKey) ?? 0;

const passesGate = (clientKey: string, seq: number): boolean => {
    if (seq < currentSeq(clientKey)) return false;
    WRITE_SEQ.set(clientKey, seq);
    return true;
};

const beginWrite = (clientKey: string): void => {
    PENDING_WRITES.set(clientKey, (PENDING_WRITES.get(clientKey) ?? 0) + 1);
};

/** true → era la última escritura pendiente (hora de refrescar). */
const endWrite = (clientKey: string): boolean => {
    const next = (PENDING_WRITES.get(clientKey) ?? 0) - 1;
    if (next > 0) {
        PENDING_WRITES.set(clientKey, next);
        return false;
    }
    PENDING_WRITES.delete(clientKey);
    return true;
};

/**
 * Flujo V3 canónico (shopping-cart:load:v3) – Usar este para Navbar, ProductVersionCardV3, ProductVersionDetailV3 y ShoppingCartV3.
 * Flujo V2 (shopping-cart:load) deprecado pero conservado en useShoppingCart.tsx para rollback.
 */
export const shoppingCartV3QKs = {
    loadShoppingCart: (clientUUID: string) => buildKey("shopping-cart:load:v3", { clientUUID })
};

interface UseShoppingCartV3Props {
    isAuth: boolean;
    authCustomer?: { uuid: string } | null;
    showTriggerAlert: (type: "Successfull" | "Error", message: string, options?: { duration: number }) => void;
    destination?: string;
    destinationCity?: string;
    destinationState?: string;
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
    destinationCity,
    destinationState,
}: UseShoppingCartV3Props): UseShoppingCartV3Return => {

    const queryClient = useQueryClient();

    const clientUUID =
        (isAuth && authCustomer?.uuid && authCustomer.uuid.length > 0)
            ? authCustomer.uuid
            : "guest-client";

    const baseQueryKey = shoppingCartV3QKs.loadShoppingCart(clientUUID);

    const hasDestination = !!(destination || destinationCity || destinationState);
    const locationKey = {
        destination,
        city: destinationCity,
        state: destinationState,
    };
    const queryKey = hasDestination
        ? [...baseQueryKey, locationKey]
        : baseQueryKey;

    const {
        data,
        isLoading,
        isError,
    } = useQuery<LoadShoppingCartV3I>({
        queryKey,
        queryFn: async () => {
            const startSeq = currentSeq(clientUUID);
            const result = await loadShoppingCartV3(destination ?? undefined, destinationCity ?? undefined, destinationState ?? undefined);
            if (startSeq < currentSeq(clientUUID)) {
                // Durante este GET partió una escritura más nueva: este snapshot ya
                // es viejo, no debe pisar la caché (se conserva lo que hay).
                return queryClient.getQueryData<LoadShoppingCartV3I>(queryKey) ?? result;
            }
            return result;
        },
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

    /** Inicia una escritura de carrito (cualquier instancia del hook). */
    const beginCartWrite = () => beginWrite(clientUUID);

    /** Al asentarse una escritura: solo el último refresca (un solo GET). */
    const endCartWrite = () => {
        if (endWrite(clientUUID)) invalidate();
    };

    const updateQtyMutation = useMutation<
        ShoppingCartI[],
        unknown,
        { item: ShoppingCartI },
        { previous: LoadShoppingCartV3I | undefined; seq: number }
    >({
        mutationFn: async ({ item }) => setItem({ item: { type: "add", item } }),

        onMutate: async ({ item }) => {
            beginCartWrite();
            const seq = takeSeq(clientUUID);
            try {
                const res = await optimisticUpdate((old) => {
                    const exists = old.find(i => i.item.sku === item.item.sku);
                    if (exists) {
                        return old.map(i =>
                            i.item.sku === item.item.sku
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        );
                    }
                    return [...old, item];
                });
                return { ...res, seq };
            } catch {
                return { previous: undefined, seq };
            }
        },

        onError: (_err, _vars, context) => {
            // Solo la escritura más nueva puede restaurar su snapshot previo.
            if (context && passesGate(clientUUID, context.seq)) rollback(context);
            showTriggerAlert("Error", "No se pudo actualizar el carrito", { duration: 3500 });
        },

        onSuccess: (data, _vars, context) => {
            // Descarta respuestas de escrituras más viejas que las ya aplicadas
            // (fuera de orden): evita que un valor antiguo rebobine el carrito.
            if (!context || !passesGate(clientUUID, context.seq)) return;
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
        },

        onSettled: endCartWrite,
    });

    const setItemMutation = useMutation<
        ShoppingCartI[],
        unknown,
        { item: ShoppingCartI },
        { previous: LoadShoppingCartV3I | undefined; previousQty?: number; seq: number }
    >({
        mutationFn: async ({ item }) => setItem({ item: { type: "set", item } }),

        onMutate: async ({ item }) => {
            beginCartWrite();
            const seq = takeSeq(clientUUID);
            // Detectar disminución de cantidad (cantidad absoluta enviada por ButtonQtyCounter).
            const previousItems = queryClient.getQueryData<LoadShoppingCartV3I>(queryKey)?.shoppingCart;
            const previousQty = previousItems?.find(i => i.item.sku === item.item.sku)?.quantity;
            try {
                const result = await optimisticUpdate((old) => {
                    const exists = old.find(i => i.item.sku === item.item.sku);
                    if (exists) {
                        return old.map(i =>
                            i.item.sku === item.item.sku ? item : i
                        );
                    }
                    return [...old, item];
                });
                return { ...result, previousQty, seq };
            } catch {
                return { previous: undefined, previousQty, seq };
            }
        },

        onError: (_err, _vars, context) => {
            // Solo la escritura más nueva puede restaurar su snapshot previo.
            if (context && passesGate(clientUUID, context.seq)) rollback(context);
            showTriggerAlert("Error", "No se pudo agregar el item", { duration: 3500 });
        },

        onSuccess: (data, { item }, context) => {
            // Señal de abandono: el usuario bajó la cantidad de un producto.
            const previousQty = context?.previousQty;
            if (
                previousQty !== undefined &&
                item.quantity < previousQty
            ) {
                phCartQuantityDecreased(item.item.sku, item.quantity, previousQty);
            }
            // Descarta respuestas de escrituras más viejas (fuera de orden):
            // una respuesta vieja no debe rebobinar la cantidad mostrada.
            if (!context || !passesGate(clientUUID, context.seq)) return;
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
        },

        onSettled: endCartWrite,
    });

    const clearCartMutation = useMutation<
        ShoppingCartI[],
        unknown,
        void,
        { previous: LoadShoppingCartV3I | undefined; seq: number }
    >({
        mutationFn: clearCart,

        onMutate: async () => {
            beginCartWrite();
            const seq = takeSeq(clientUUID);
            try {
                await queryClient.cancelQueries({ queryKey });
                const previous = queryClient.getQueryData<LoadShoppingCartV3I>(queryKey);

                queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                    if (!old) return old;
                    return { ...old, shoppingCart: [] };
                });

                return { previous, seq };
            } catch {
                return { previous: undefined, seq };
            }
        },

        onError: (_err, _vars, context) => {
            if (context && passesGate(clientUUID, context.seq)) rollback(context);
            showTriggerAlert("Error", "No se pudo limpiar el carrito", { duration: 3500 });
        },

        onSuccess: (_data, _vars, context) => {
            if (!context || !passesGate(clientUUID, context.seq)) return;
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: [] };
            });
        },

        onSettled: endCartWrite,
    });

    const removeItemMutation = useMutation<
        ShoppingCartI[],
        unknown,
        { sku: string },
        { previous: LoadShoppingCartV3I | undefined; seq: number }
    >({
        mutationFn: removeItem,

        onMutate: async ({ sku }) => {
            beginCartWrite();
            const seq = takeSeq(clientUUID);
            try {
                const res = await optimisticUpdate((old) => old.filter(i => i.item.sku !== sku));
                return { ...res, seq };
            } catch {
                return { previous: undefined, seq };
            }
        },

        onError: (_err, _vars, context) => {
            if (context && passesGate(clientUUID, context.seq)) rollback(context);
            showTriggerAlert("Error", "No se pudo eliminar el item", { duration: 3500 });
        },

        onSuccess: (data, { sku }, context) => {
            // Señal de abandono: el usuario quitó un producto del carrito.
            phCartItemRemoved(sku);
            if (!context || !passesGate(clientUUID, context.seq)) return;
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
        },

        onSettled: endCartWrite,
    });

    const createCartMutation = useMutation<
        ShoppingCartI[],
        unknown,
        void,
        { previous: LoadShoppingCartV3I | undefined; seq: number }
    >({
        mutationFn: createShoppingCart,

        onMutate: async () => {
            beginCartWrite();
            const seq = takeSeq(clientUUID);
            try {
                const res = await optimisticUpdate(() => []);
                return { ...res, seq };
            } catch {
                return { previous: undefined, seq };
            }
        },

        onError: (_err, _vars, context) => {
            if (context && passesGate(clientUUID, context.seq)) rollback(context);
            showTriggerAlert("Error", "No se pudo crear el carrito", { duration: 3500 });
        },

        onSuccess: (data, _vars, context) => {
            if (!context || !passesGate(clientUUID, context.seq)) return;
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
        },

        onSettled: endCartWrite,
    });

    const mergeCartMutation = useMutation<
        ShoppingCartI[],
        unknown,
        void,
        { previous: LoadShoppingCartV3I | undefined; seq: number }
    >({
        mutationFn: mergeShoppingCart,

        onMutate: async () => {
            beginCartWrite();
            const seq = takeSeq(clientUUID);
            try {
                const res = await optimisticUpdate((old) => old);
                return { ...res, seq };
            } catch {
                return { previous: undefined, seq };
            }
        },

        onError: (_err, _vars, context) => {
            if (context && passesGate(clientUUID, context.seq)) rollback(context);
            showTriggerAlert("Error", "No se pudo fusionar el carrito", { duration: 3500 });
        },

        onSuccess: (data, _vars, context) => {
            if (!context || !passesGate(clientUUID, context.seq)) return;
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
        },

        onSettled: endCartWrite,
    });

    const saveCartMutation = useMutation<
        ShoppingCartI[],
        unknown,
        void,
        { previous: LoadShoppingCartV3I | undefined; seq: number }
    >({
        mutationFn: saveShoppingCart,

        onMutate: async () => {
            beginCartWrite();
            const seq = takeSeq(clientUUID);
            try {
                const res = await optimisticUpdate((old) => old);
                return { ...res, seq };
            } catch {
                return { previous: undefined, seq };
            }
        },

        onError: (_err, _vars, context) => {
            if (context && passesGate(clientUUID, context.seq)) rollback(context);
            showTriggerAlert("Error", "No se pudo guardar el carrito", { duration: 3500 });
        },

        onSuccess: (data, _vars, context) => {
            if (!context || !passesGate(clientUUID, context.seq)) return;
            queryClient.setQueryData<LoadShoppingCartV3I>(queryKey, (old) => {
                if (!old) return old;
                return { ...old, shoppingCart: data };
            });
        },

        onSettled: endCartWrite,
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
