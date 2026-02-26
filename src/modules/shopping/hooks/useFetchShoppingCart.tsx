import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ShoppingCartType } from "../ShoppingTypes";
import { getShoppingCartService, shoppingCartAddItemService, shoppingCartCheckAllService, shoppingCartClearCartService, shoppingCartRemoveItemService, shoppingCartToggleCheckService, shoppingCartUpdateItemQty } from "../services/ShoppingServices";
import { useAuthStore } from "../../auth/states/authStore";
import { buildKey } from "../../../global/GlobalHelpers";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";


export const shoppingCartQueryKeys = {
    shoppingCart: (customer: string) => buildKey("shopping-cart", { customer })
};

export const useFetchShoppingCart = () => {
    const { isAuth, authCustomer } = useAuthStore();
    return useQuery<ShoppingCartType[] | null>({
        queryKey: shoppingCartQueryKeys.shoppingCart(authCustomer?.uuid!),
        enabled: !!isAuth || !!authCustomer,
        queryFn: async () => await getShoppingCartService(),
        staleTime: 4 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
};

export function useAddItem() {
    const queryClient = useQueryClient();
    const { authCustomer, isAuth, csrfToken } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    return useMutation({
        mutationFn: async (args: { sku: string, quantity: number }): Promise<ShoppingCartType[]> => {
            return await shoppingCartAddItemService({ sku: args.sku, quantity: args.quantity, csrfToken: csrfToken! });
        },
        onMutate: async (args: { sku: string, quantity: number }) => {
            if (!authCustomer || !authCustomer?.uuid || !isAuth || !csrfToken) return { previousShoppingCart: undefined };
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            await queryClient.cancelQueries({ queryKey });
            const previousShoppingCart = queryClient.getQueryData<ShoppingCartType[]>(queryKey);
            queryClient.setQueryData<ShoppingCartType[]>(
                queryKey, (old) => {
                    if (!old) return []; // El backend construirá el item completo
                    const exist = old.findIndex(cartItem => cartItem.product_version.sku === args.sku);
                    if (exist !== -1) {
                        return old.map((cartItem, index) =>
                            index === exist ? { ...cartItem, quantity: cartItem.quantity + args.quantity } : cartItem
                        );
                    };
                    // No podemos agregar el item optimistamente porque no tenemos todos los datos
                    // El backend lo construirá y lo devolverá
                    return old;
                }
            );
            return { previousShoppingCart };
        },
        onSuccess: (updatedCart, _args, _context) => {
            console.log("🔍 Frontend received:", updatedCart.length, "items");

            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);

            // Actualizar el cache directamente con la respuesta del backend
            queryClient.setQueryData<ShoppingCartType[]>(queryKey, updatedCart);

            // Invalidar para forzar re-render (sin refetch porque ya tenemos los datos)
            queryClient.invalidateQueries({ queryKey, refetchType: "none" });

            showTriggerAlert("Successfull", "Agregado al carrito", { duration: 3500 });
        },
        onError: (_error, _args, context) => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            if (context?.previousShoppingCart !== undefined) {
                queryClient.setQueryData(queryKey, context.previousShoppingCart);
            }
            showTriggerAlert("Error", "Ocurrio un error inesperado", { duration: 3500 });
        }
    })
};

export function useRemoveItem() {
    const queryClient = useQueryClient();
    const { authCustomer, isAuth, csrfToken } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    return useMutation({
        mutationFn: async (sku: string): Promise<boolean> => {
            return await shoppingCartRemoveItemService({ sku, csrfToken: csrfToken! });
        },
        onMutate: async (sku: string) => {
            if (!authCustomer || !authCustomer?.uuid || !isAuth || !csrfToken) return { previousShoppingCart: undefined };
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            await queryClient.cancelQueries({ queryKey });
            const previousShoppingCart = queryClient.getQueryData<ShoppingCartType[]>(queryKey);
            queryClient.setQueryData<ShoppingCartType[]>(
                queryKey, (old) => {
                    if (!old) return [];
                    const updated = old.filter(item => item.product_version.sku !== sku);
                    return updated;
                }
            );
            return { previousShoppingCart };
        },
        onSuccess: () => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            queryClient.invalidateQueries({ queryKey, refetchType: "none" });
            showTriggerAlert("Successfull", "Removido del carrito", { duration: 3500 });
        },
        onError: (_error, _item, context) => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            if (context?.previousShoppingCart !== undefined) {
                queryClient.setQueryData(queryKey, context.previousShoppingCart);
            }
            showTriggerAlert("Error", "Ocurrio un error inesperado", { duration: 3500 });
        }

    });
};

export function useUpdateItemQty() {
    const queryClient = useQueryClient();
    const { authCustomer, isAuth, csrfToken } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    return useMutation({
        mutationFn: async (values: { sku: string, newQuantity: number }): Promise<boolean> => {
            return await shoppingCartUpdateItemQty({ sku: values.sku, newQuantity: values.newQuantity, csrfToken: csrfToken! });
        },
        onMutate: async (values: { sku: string, newQuantity: number }) => {
            if (!authCustomer || !authCustomer?.uuid || !isAuth || !csrfToken) return { previousShoppingCart: undefined };
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            await queryClient.cancelQueries({ queryKey });
            const previousShoppingCart = queryClient.getQueryData<ShoppingCartType[]>(queryKey);
            queryClient.setQueryData<ShoppingCartType[]>(
                queryKey, (old) => {
                    if (!old) return [];
                    return old.map(item => item.product_version.sku === values.sku ? { ...item, quantity: values.newQuantity } : item);
                }
            );
            return { previousShoppingCart };
        },
        onSuccess: () => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            queryClient.invalidateQueries({ queryKey, refetchType: "none" });
        },
        onError: (_error, _item, context) => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            if (context?.previousShoppingCart !== undefined) {
                queryClient.setQueryData(queryKey, context.previousShoppingCart);
            }
            showTriggerAlert("Error", "Ocurrio un error inesperado", { duration: 3500 });
        }

    });
};

export function useToggleCheckItem() {
    const queryClient = useQueryClient();
    const { authCustomer, isAuth, csrfToken } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    return useMutation({
        mutationFn: async (sku: string): Promise<boolean> => {
            return await shoppingCartToggleCheckService({ sku, csrfToken: csrfToken! });
        },
        onMutate: async (sku: string) => {
            if (!authCustomer || !authCustomer?.uuid || !isAuth || !csrfToken) return { previousShoppingCart: undefined };
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            await queryClient.cancelQueries({ queryKey });
            const previousShoppingCart = queryClient.getQueryData<ShoppingCartType[]>(queryKey);
            queryClient.setQueryData<ShoppingCartType[]>(
                queryKey, (old) => {
                    if (!old) return [];
                    return old.map(item => item.product_version.sku === sku ? { ...item, isChecked: !item.isChecked } : item);
                }
            );
            return { previousShoppingCart };
        },
        onSuccess: () => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            queryClient.invalidateQueries({ queryKey, refetchType: "none" });
        },
        onError: (_error, _item, context) => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            if (context?.previousShoppingCart !== undefined) {
                queryClient.setQueryData(queryKey, context.previousShoppingCart);
            }
            showTriggerAlert("Error", "Ocurrio un error inesperado", { duration: 3500 });
        }

    });
};

export function useCheckAllItems() {
    const queryClient = useQueryClient();
    const { authCustomer, isAuth, csrfToken } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    return useMutation({
        mutationFn: async (): Promise<boolean> => {
            return await shoppingCartCheckAllService({ csrfToken: csrfToken! });
        },
        onMutate: async () => {
            if (!authCustomer || !authCustomer?.uuid || !isAuth) return { previousShoppingCart: undefined };
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            await queryClient.cancelQueries({ queryKey });
            const previousShoppingCart = queryClient.getQueryData<ShoppingCartType[]>(queryKey);
            queryClient.setQueryData<ShoppingCartType[]>(
                queryKey, (old) => {
                    if (!old) return [];
                    return old.map(item => ({ ...item, isChecked: true }));
                }
            );
            return { previousShoppingCart };
        },
        onSuccess: () => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            queryClient.invalidateQueries({ queryKey, refetchType: "none" });
        },
        onError: (_error, _item, context) => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            if (context?.previousShoppingCart !== undefined) {
                queryClient.setQueryData(queryKey, context.previousShoppingCart);
            }
            showTriggerAlert("Error", "Ocurrio un error inesperado", { duration: 3500 });
        }

    });
};

export function useUncheckAllItems() {
    const queryClient = useQueryClient();
    const { authCustomer, isAuth, csrfToken } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    return useMutation({
        mutationFn: async (): Promise<boolean> => {
            return await shoppingCartCheckAllService({ csrfToken: csrfToken! });
        },
        onMutate: async () => {
            if (!authCustomer || !authCustomer?.uuid || !isAuth) return { previousShoppingCart: undefined };
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            await queryClient.cancelQueries({ queryKey });
            const previousShoppingCart = queryClient.getQueryData<ShoppingCartType[]>(queryKey);
            queryClient.setQueryData<ShoppingCartType[]>(
                queryKey, (old) => {
                    if (!old) return [];
                    return old.map(item => ({ ...item, isChecked: false }));
                }
            );
            return { previousShoppingCart };
        },
        onSuccess: () => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            queryClient.invalidateQueries({ queryKey, refetchType: "none" });
        },
        onError: (_error, _item, context) => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            if (context?.previousShoppingCart !== undefined) {
                queryClient.setQueryData(queryKey, context.previousShoppingCart);
            }
            showTriggerAlert("Error", "Ocurrio un error inesperado", { duration: 3500 });
        }

    });
};

export function useClearShoppingCart() {
    const queryClient = useQueryClient();
    const { authCustomer, isAuth, csrfToken } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    return useMutation({
        mutationFn: async (): Promise<boolean> => {
            return await shoppingCartClearCartService({ csrfToken: csrfToken! });
        },
        onMutate: async () => {
            if (!authCustomer || !authCustomer?.uuid || !isAuth || !csrfToken) return { previousShoppingCart: undefined };
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            await queryClient.cancelQueries({ queryKey });
            const previousShoppingCart = queryClient.getQueryData<ShoppingCartType[]>(queryKey);
            queryClient.setQueryData<ShoppingCartType[]>(
                queryKey, (old) => {
                    if (!old) return [];
                    return [];
                }
            );
            return { previousShoppingCart };
        },
        onSuccess: () => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            queryClient.invalidateQueries({ queryKey, refetchType: "none" });
        },
        onError: (_error, _item, context) => {
            if (!authCustomer?.uuid) return;
            const queryKey = shoppingCartQueryKeys.shoppingCart(authCustomer.uuid!);
            if (context?.previousShoppingCart !== undefined) {
                queryClient.setQueryData(queryKey, context.previousShoppingCart);
            }
            showTriggerAlert("Error", "Ocurrio un error inesperado", { duration: 3500 });
        }

    });
};
