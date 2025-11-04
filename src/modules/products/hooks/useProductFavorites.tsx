import { useState } from "react";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useAuthStore } from "../../auth/states/authStore";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";


type Props = {
    sku: string | undefined;
    initialFavoriteState: boolean | undefined;
};

export function useFavorite({ sku, initialFavoriteState = false }: Props) {
    const { isAuth } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    const [isFavorite, setIsFavorite] = useState<boolean | undefined>(initialFavoriteState);

    const executeFavoriteLogic = (newState: boolean) => {
        setIsFavorite(newState);
        if (newState === true) {
            showTriggerAlert("Favorite", "Producto agregado a favoritos", { duration: 3500, favoriteType: "add" })
        } else {
            showTriggerAlert("Favorite", "Producto removido de favoritos", { duration: 3500, favoriteType: "remove" })
        };
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