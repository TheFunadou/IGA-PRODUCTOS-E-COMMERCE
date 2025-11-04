import { useNavigate } from "react-router-dom";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import type { ProductVersionCardType } from "../../products/ProductTypes";
import { useShoppingCartStore } from "../states/shoppingCartStore";


export const useShoppingCartActions = () => {
    const { addItem, addToBuyNow } = useShoppingCartStore();
    const { showTriggerAlert } = useTriggerAlert();
    const navigate = useNavigate();

    const useAddToShoppingCart = async (data: ProductVersionCardType, quantity = 1) => {
        const addToShoppingCart: boolean = await addItem({ ...data, isChecked: true, quantity });
        if (addToShoppingCart === false) { showTriggerAlert("Message", "Ocurrio un error inesperado", { duration: 3500 }); return; };
        showTriggerAlert("Successfull", "Producto agregado al carrito", { duration: 3500 });
    };

    const useAddToBuyNow = async (data: ProductVersionCardType, quantity = 1) => {
        const setBuyNow: boolean = await addToBuyNow({ ...data, isChecked: true, quantity });
        if (!setBuyNow) { showTriggerAlert("Message", "Ocurrio un error inesperado", { duration: 3500 }) };
        navigate("/pagar-ahora");
        return;
    };


    return { useAddToShoppingCart, useAddToBuyNow };
}