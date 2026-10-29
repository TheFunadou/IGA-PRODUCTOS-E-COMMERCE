import AddressSection from "../AddressSection";
import PaymentMethod from "../PaymentMethod";
import CartItems from "../CartItems";
import RecentlyViewed from "../RecentlyViewed";
import FavoritesSectionV3 from "../FavoritesSectionV3";
import type { ShoppingCartV3Controller } from "../../hooks/useShoppingCartV3Controller";

/* Columna izquierda del carrito (orden DOM / desktop): Dirección → Pago →
   Productos → Vistos → Favoritos.

   Orden mobile-only: por debajo de lg esta columna es `contents`, así sus bloques
   se pliegan como items directos del section y cada uno lleva `order-N` para el
   orden mobile (Dirección 1 → Pago 2 → Productos 3 → Resumen/Badges 4 →
   Favoritos 6 → Vistos 7 → Publicidad 8, compartiendo espacio con CartRightColumn).
   En lg+ cada bloque lleva `lg:order-none` (order: 0) → manda el orden de DOM y
   el layout desktop queda idéntico al de antes (Dirección → Pago → Productos →
   Vistos → Favoritos).

   El ref del bloque de dirección (c.addressSectionRef) vive en el controller para
   el scroll de "Rellenar formulario de invitado". */
interface CartLeftColumnProps {
    c: ShoppingCartV3Controller;
}

const CartLeftColumn = ({ c }: CartLeftColumnProps) => (
    <div className="contents lg:flex lg:flex-1 lg:min-w-0 lg:flex-col lg:gap-5">
        <div ref={c.addressSectionRef} className="order-1 lg:order-none empty:contents">
            <AddressSection
                isAuth={c.isAuth}
                selectedAddress={c.selectedAddress}
                onSetSelectedAddress={c.handleSetSelectedAddress}
                showGuestForm={c.showGuestForm}
                setShowGuestForm={c.setShowGuestForm}
                showGuestFormEdit={c.showGuestFormEdit}
                setShowGuestFormEdit={(v) => { c.clearErrorBadge(); c.setShowGuestFormEdit(v); }}
                guestAddressForm={c.guestAddressForm}
                handleGuestFormSave={c.handleGuestFormSave}
            />
        </div>
        {!c.pendingOrder && (
            <div className="order-2 lg:order-none empty:contents">
                <PaymentMethod
                    paymentProvider={c.paymentProvider}
                    setPaymentProvider={c.setPaymentProvider}
                />
            </div>
        )}
        <div className="order-3 lg:order-none empty:contents">
            <CartItems
                allItems={c.allItems}
                cardsMap={c.cardsMap}
                handleCart={c.handleCart}
                isAuth={c.isAuth}
            />
        </div>
        {/* DOM en este orden para desktop; en mobile Favoritos(6) → Vistos(7) */}
        <div className="order-7 lg:order-none empty:contents">
            <RecentlyViewed excludeSkus={c.allItems.map((item) => item.item.sku)} mobileList />
        </div>
        <div className="order-6 lg:order-none empty:contents">
            <FavoritesSectionV3 />
        </div>
    </div>
);

export default CartLeftColumn;
