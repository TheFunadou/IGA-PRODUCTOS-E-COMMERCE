import { useEffect, useState } from "react";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useAuthStore } from "../../auth/states/authStore";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import { useToggleFavorite } from "../../customers/hooks/useCustomer";
import type { ProductVersionCardType } from "../ProductTypes";


type Props = {
    sku?: string;
    initialFavoriteState?: boolean;
    item?: ProductVersionCardType;
};

export function useFavorite({ sku, item, initialFavoriteState = false }: Props) {
    const { isAuth } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    const mutationToggleFavorite = useToggleFavorite();
    const [isFavorite, setIsFavorite] = useState<boolean | undefined>(initialFavoriteState);

    useEffect(() => {
        setIsFavorite(initialFavoriteState);
    }, [initialFavoriteState]);

    const executeFavoriteLogic = async (newState: boolean) => {
        setIsFavorite(newState);
        if (!sku || !item) return;
        await mutationToggleFavorite.mutateAsync({ sku: sku, product: item });
    };

    const debounceExecute = useDebounceCallback(executeFavoriteLogic, 400);
    const debounceAlert = useDebounceCallback(() => showTriggerAlert("Message", "Inicia sesión para utilizar esta función", { duration: 3500 }));

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (isAuth && isFavorite !== undefined) {
            const newState: boolean = !isFavorite;
            setIsFavorite(newState);
            debounceExecute(newState);
        } else {
            debounceAlert;
        };
    };

    return { isFavorite, toggleFavorite };
}; 