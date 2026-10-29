import ShoppingCartItemV3 from "./ShoppingCartItemV3";
import ShoppingCartItemV3Mobile from "./ShoppingCartItemV3Mobile";
import type { PV3CardData } from "../../products/ProductTypes";
import type { ShoppingCartI } from "../ShoppingTypes";

/* Fila de producto compartida (carrito + comprar ahora): mismo wrapper y mismo
   dual-render mobile/desktop que usaba CartItems — variante lista
   (ShoppingCartItemV3Mobile) por debajo de sm y variante completa (V3) en sm+.
   El dual-render es el patrón de SimilarProducts: sin flash ni JS. */
interface CartItemRowProps {
    item: ShoppingCartI;
    cardData: PV3CardData;
    isAuth: boolean;
    /** true → la fila oculta el botón de quitar (comprar ahora: no hay carrito) */
    isBuyNow?: boolean;
    onUpdateQty: (item: ShoppingCartI) => void;
    onRemoveItem: (sku: string) => void;
}

const CartItemRow = ({ item, cardData, isAuth, isBuyNow = false, onUpdateQty, onRemoveItem }: CartItemRowProps) => (
    <div className="p-3 sm:p-4">
        <div className="sm:hidden">
            <ShoppingCartItemV3Mobile
                cartItem={item}
                cardData={cardData}
                stockLimit={cardData.version.stock ?? 0}
                onRemoveItem={onRemoveItem}
                onUpdateQty={onUpdateQty}
                isAuth={isAuth}
                isBuyNow={isBuyNow}
            />
        </div>
        <div className="hidden sm:block">
            <ShoppingCartItemV3
                cartItem={item}
                cardData={cardData}
                stockLimit={cardData.version.stock ?? 0}
                onRemoveItem={onRemoveItem}
                onUpdateQty={onUpdateQty}
                isAuth={isAuth}
                isBuyNow={isBuyNow}
            />
        </div>
    </div>
);

export default CartItemRow;
