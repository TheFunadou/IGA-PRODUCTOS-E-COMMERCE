import { MdRemoveShoppingCart, MdShoppingBag } from "react-icons/md";
import ShoppingCartItemV3 from "./ShoppingCartItemV3";
import type { PV3CardData } from "../../products/ProductTypes";
import type { ShoppingCartI } from "../ShoppingTypes";

interface CartItemsProps {
    allItems: ShoppingCartI[];
    cardsMap: Map<string, PV3CardData>;
    handleCart: {
        data?: { shoppingCart: ShoppingCartI[]; resume?: { itemsSubtotal: string } };
        clearCart: () => void;
        removeItem: (sku: string) => void;
        setItem: (item: ShoppingCartI) => void;
    };
    isAuth: boolean;
}

const CartItems = ({ allItems, cardsMap, handleCart, isAuth }: CartItemsProps) => (
    <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
        <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center justify-between">
            <h2 className="text-sm font-bold text-base-content uppercase flex items-center gap-2">
                <MdShoppingBag className="text-primary" />
                Productos ({allItems.length})
            </h2>
            {allItems.length > 0 && (
                <button
                    type="button"
                    onClick={handleCart.clearCart}
                    className="text-xs text-base-content/40 hover:text-error transition-colors underline underline-offset-2 flex gap-2 items-center"
                >
                    <MdRemoveShoppingCart />
                    <p>Vaciar carrito</p>
                </button>
            )}
        </div>
        <div className="flex flex-col divide-y divide-base-200">
            {allItems.map((item, index) => {
                const cardData = cardsMap.get(item.item.sku.toLowerCase());
                if (!cardData) return null;
                return (
                    <div key={index} className="p-3 sm:p-4">
                        <ShoppingCartItemV3
                            cartItem={item}
                            cardData={cardData}
                            stockLimit={cardData.version.stock ?? 0}
                            onRemoveItem={handleCart.removeItem}
                            onUpdateQty={handleCart.setItem}
                            isAuth={isAuth}
                        />
                    </div>
                );
            })}
            <div className="px-4 py-3 bg-base-200 flex items-center justify-between">
                <span className="text-sm text-base-content/60">
                    Subtotal ({allItems.length} {allItems.length === 1 ? "producto" : "productos"})
                </span>
                <span className="text-base sm:text-lg font-extrabold text-base-content">
                    ${handleCart.data?.resume?.itemsSubtotal || "0.00"}
                </span>
            </div>
        </div>
    </div>
);

export default CartItems;
