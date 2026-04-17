// useHandleShoppingCart.ts
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import type { ShoppingCartI } from "../ShoppingTypes";
import { usePaymentStore } from "../states/paymentStore";
import { useShoppingCart } from "./useShoppingCartV2";

// Props necesarias para el hook base
interface UseHandleShoppingCartProps {
    isAuth: boolean;
    authCustomer?: { uuid: string } | null;
    showTriggerAlert: (type: "Successfull" | "Error", message: string, options?: { duration: number }) => void;
}

/**
 * Hook de alto nivel para manejar las acciones del carrito de compras.
 * Implementa debouncing en todas las funciones para evitar saturación de peticiones
 * y maneja la persistencia automática (saveCart) tras inactividad.
 */
export const useHandleShoppingCart = ({
    isAuth,
    authCustomer,
    showTriggerAlert,
}: UseHandleShoppingCartProps) => {
    const cart = useShoppingCart({
        isAuth,
        authCustomer,
        showTriggerAlert,
    });

    const { setBuyNow } = usePaymentStore();

    // Debounce estándar para acciones de UI (evitar spam de clics)
    const debouncedUpdateQtyItem = useDebounceCallback((item: ShoppingCartI) => {
        cart.updateQtyItem(item);
    }, 400);

    const debouncedSetItem = useDebounceCallback((item: ShoppingCartI) => {
        cart.setItem(item);
    }, 400);

    const debouncedRemoveItem = useDebounceCallback((sku: string) => {
        cart.removeItem(sku);
    }, 400);

    const debouncedToggleCheck = useDebounceCallback((sku: string) => {
        cart.toggleCheck(sku);
    }, 200);

    const debouncedCheckAll = useDebounceCallback(() => {
        cart.checkAll();
    }, 300);

    const debouncedUncheckAll = useDebounceCallback(() => {
        cart.uncheckAll();
    }, 300);

    const debouncedClearCart = useDebounceCallback(() => {
        cart.clearCart();
    }, 400);

    const debouncedCreateCart = useDebounceCallback(() => {
        cart.createShoppingCart();
    }, 400);

    const debouncedMergeCart = useDebounceCallback(() => {
        cart.mergeShoppingCart();
    }, 400);

    const debouncedSetBuyNow = useDebounceCallback((item: { quantity: number, sku: string }) => {
        setBuyNow({ quantity: item.quantity, sku: item.sku });
    }, 400);

    /**
     * Guardado automático del carrito tras 4 minutos de inactividad.
     * Esto asegura que los cambios se persistan en el servidor para sesiones largas.
     */
    const debouncedSaveCart = useDebounceCallback(() => {
        cart.saveShoppingCart();
    }, 240000); // 4 minutos (4 * 60 * 1000)

    // Función para reiniciar el temporizador de guardado automático
    const triggerAutoSave = () => {
        debouncedSaveCart();
    };

    return {
        // Estado y carga
        data: cart.data,
        isLoading: cart.isLoading,
        isError: cart.isError,

        // Estados de carga específicos
        isUpdatingQty: cart.isUpdatingQty,
        isSettingItem: cart.isSettingItem,
        isRemoving: cart.isRemoving,
        isToggling: cart.isToggling,
        isClearing: cart.isClearing,

        // Versiones debounced de las acciones
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
        toggleCheck: (sku: string) => {
            debouncedToggleCheck(sku);
            if (isAuth) triggerAutoSave();
        },
        checkAll: () => {
            debouncedCheckAll();
            if (isAuth) triggerAutoSave();
        },
        uncheckAll: () => {
            debouncedUncheckAll();
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
        setBuyNow: (item: { quantity: number, sku: string }) => {
            debouncedSetBuyNow(item);
        },
        saveCart: () => {
            cart.saveShoppingCart(); // Guardado manual sin debounce
        },


        // Acción manual para guardar inmediatamente
        saveNow: () => {
            cart.saveShoppingCart();
        },
    };
};