import { useNavigate } from "react-router-dom";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import type { ProductVersionCardType } from "../../products/ProductTypes";
import { useShoppingCartStore } from "../states/shoppingCartStore";
import { useAddItem, useCheckAllItems, useClearShoppingCart, useFetchShoppingCart, useRemoveItem, useToggleCheckItem, useUncheckAllItems, useUpdateItemQty } from "./useFetchShoppingCart";
import { useAuthStore } from "../../auth/states/authStore";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import { useEffect, useState } from "react";
import type { ShoppingCartType } from "../ShoppingTypes";
import { getErrorMessage } from "../../../global/GlobalUtils";

export const useShoppingCart = () => {
    const [shoppingCart, setShoppingCart] = useState<ShoppingCartType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { items, addItem, addToBuyNow, removeItem, updateItemQty, checkAllItems, uncheckAllItems, clearShoppingCart, toogleCheckItem, error: cartError, itemBuyNow } = useShoppingCartStore();
    const { showTriggerAlert } = useTriggerAlert();
    const navigate = useNavigate();
    const { isAuth, authCustomer } = useAuthStore();
    const addAuth = useAddItem();
    const removeAuth = useRemoveItem();
    const updateQtyAuth = useUpdateItemQty();
    const toogleCheckAuth = useToggleCheckItem();
    const checkAllAuth = useCheckAllItems();
    const uncheckAllAuth = useUncheckAllItems();
    const clearAuth = useClearShoppingCart();

    const {
        data: authCart,
        isLoading: authCartLoading,
        error: authCartError,
        refetch: authRefetchCart
    } = useFetchShoppingCart();

    useEffect(() => {
        if (isAuth && authCustomer) {
            setShoppingCart(authCart ?? []);
        } else {
            setShoppingCart(items ?? []);
        }
    }, [isAuth, authCustomer, authCart, items]);

    useEffect(() => {
        if (isAuth && authCustomer) {
            if (authCartError) setError(getErrorMessage(authCartError));
            return;
        };
        if (cartError) setError(cartError);
        return;
    }, [authCartError, cartError]);

    const add = useDebounceCallback(async (data: ProductVersionCardType, quantity = 1) => {
        if (isAuth) {
            setIsLoading(true);
            await addAuth.mutateAsync({ sku: data.product_version.sku, quantity });
            setIsLoading(false);
            return;
        };
        addItem({ ...data, isChecked: true, quantity });
        return;
    }, 250);

    const remove = useDebounceCallback(async (sku: string) => {
        if (isAuth) {
            setIsLoading(true);
            await removeAuth.mutateAsync(sku);
            setIsLoading(false);
            return;
        }
        removeItem(sku);
        return;
    }, 250);

    const updateQty = useDebounceCallback(async (values: { sku: string, newQuantity: number }) => {
        if (isAuth) {
            setIsLoading(true);
            await updateQtyAuth.mutateAsync(values);
            setIsLoading(false);
            return;
        }
        updateItemQty(values.sku, values.newQuantity);
        return;
    }, 500);

    const toogleCheck = useDebounceCallback(async (sku: string) => {
        if (isAuth) {
            setIsLoading(true);
            await toogleCheckAuth.mutateAsync(sku);
            setIsLoading(false);
            return;
        }
        toogleCheckItem(sku);
        return;
    }, 50);

    const checkAll = useDebounceCallback(async () => {
        if (isAuth) {
            setIsLoading(true);
            await checkAllAuth.mutateAsync();
            setIsLoading(false);
            return;
        }
        checkAllItems();
        return;
    }, 100);

    const uncheckAll = useDebounceCallback(async () => {
        if (isAuth) {
            setIsLoading(true);
            await uncheckAllAuth.mutateAsync();
            setIsLoading(false);
            return;
        }
        uncheckAllItems();
        return;
    }, 100);

    const clear = useDebounceCallback(async () => {
        if (isAuth) {
            setIsLoading(true);
            await clearAuth.mutateAsync();
            setIsLoading(false);
            return;
        }
        clearShoppingCart();
        return;
    }, 100);

    const addBuyNow = useDebounceCallback(async (data: ProductVersionCardType, quantity = 1) => {
        const setBuyNow: boolean = await addToBuyNow({ ...data, isChecked: true, quantity });
        if (!setBuyNow) { showTriggerAlert("Message", "Ocurrio un error inesperado", { duration: 3500 }) };
        navigate("/pagar-ahora");
        return;
    }, 250);

    return { shoppingCart, itemBuyNow, authCartLoading, error, authRefetchCart, add, remove, updateQty, addBuyNow, toogleCheck, checkAll, uncheckAll, clear, isLoading };
}