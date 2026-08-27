import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import type { ShoppingCartI } from "../ShoppingTypes";
import { useShoppingCartV3 } from "./useShoppingCartV3";

interface UseHandleShoppingCartV3Props {
    isAuth: boolean;
    authCustomer?: { uuid: string } | null;
    showTriggerAlert: (type: "Successfull" | "Error", message: string, options?: { duration: number }) => void;
    destination?: string;
}

export const useHandleShoppingCartV3 = ({
    isAuth,
    authCustomer,
    showTriggerAlert,
    destination,
}: UseHandleShoppingCartV3Props) => {
    const cart = useShoppingCartV3({
        isAuth,
        authCustomer,
        showTriggerAlert,
        destination,
    });

    const debouncedUpdateQtyItem = useDebounceCallback((item: ShoppingCartI) => {
        cart.updateQtyItem(item);
    }, 400);

    const debouncedSetItem = useDebounceCallback((item: ShoppingCartI) => {
        cart.setItem(item);
    }, 400);

    const debouncedRemoveItem = useDebounceCallback((sku: string) => {
        cart.removeItem(sku);
    }, 400);

    const debouncedClearCart = useDebounceCallback(() => {
        cart.clearCart();
    }, 400);

    const debouncedCreateCart = useDebounceCallback(() => {
        cart.createShoppingCart();
    }, 400);

    const debouncedMergeCart = useDebounceCallback(() => {
        cart.mergeShoppingCart();
    }, 400);

    const debouncedSaveCart = useDebounceCallback(() => {
        cart.saveShoppingCart();
    }, 240000);

    const triggerAutoSave = () => {
        debouncedSaveCart();
    };

    return {
        data: cart.data,
        isLoading: cart.isLoading,
        isError: cart.isError,

        isUpdatingQty: cart.isUpdatingQty,
        isSettingItem: cart.isSettingItem,
        isRemoving: cart.isRemoving,
        isClearing: cart.isClearing,

        updateQtyItem: (item: ShoppingCartI) => {
            debouncedUpdateQtyItem(item);
            if (isAuth) triggerAutoSave();
        },
        setItem: (item: ShoppingCartI) => {
            debouncedSetItem(item);
            if (isAuth) triggerAutoSave();
        },
        removeItem: (sku: string) => {
            debouncedRemoveItem(sku);
            if (isAuth) triggerAutoSave();
        },
        clearCart: () => {
            debouncedClearCart();
            if (isAuth) triggerAutoSave();
        },
        createCart: () => {
            debouncedCreateCart();
            if (isAuth) triggerAutoSave();
        },
        mergeCart: () => {
            debouncedMergeCart();
            if (isAuth) triggerAutoSave();
        },
        saveCart: () => {
            cart.saveShoppingCart();
        },
        saveNow: () => {
            cart.saveShoppingCart();
        },
    };
};
