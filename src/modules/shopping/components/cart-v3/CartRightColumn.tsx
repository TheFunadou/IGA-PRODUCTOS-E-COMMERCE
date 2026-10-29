import OrderSummary from "../OrderSummary";
import TrustBadgesV3 from "../TrustBadgesV3";
import SideAdBanner from "../SideAdBanner";
import type { ShoppingCartV3Controller } from "../../hooks/useShoppingCartV3Controller";

/* Columna derecha del carrito: Resumen del pedido + sellos de confianza + banner.
   Ancho fijo en lg+ (w-80/xl:w-96) con shrink-0; por debajo de lg es `contents`
   (sus bloques se pliegan al section con los order mobile: Resumen/Badges 4,
   Publicidad 8) y en lg+ `lg:order-none` restaura el orden de DOM idéntico al
   anterior (Resumen → Sellos → Banner). */
interface CartRightColumnProps {
    c: ShoppingCartV3Controller;
}

const CartRightColumn = ({ c }: CartRightColumnProps) => (
    <div className="contents lg:flex lg:w-80 xl:w-96 shrink-0 lg:flex-col lg:gap-4">
        <div className="order-4 lg:order-none empty:contents">
            <OrderSummary
                allItems={c.allItems}
                handleCart={c.handleCart}
                destination={c.destination}
                couponCode={c.couponCode}
                setCouponCode={c.setCouponCode}
                orderLoading={c.orderLoading}
                handleCreateOrder={c.handleCreateOrder}
                error={c.error}
                isAuth={c.isAuth}
                isSubmitDisabled={c.pendingOrder ? false : c.isSubmitDisabled}
                pendingOrder={c.pendingOrder}
                onPendingPayment={c.handlePendingPayment}
                onOpenAddress={c.handleOpenAddress}
            />
        </div>
        <div className="order-4 lg:order-none empty:contents">
            <TrustBadgesV3 />
        </div>
        <div className="order-8 lg:order-none empty:contents">
            <SideAdBanner />
        </div>
    </div>
);

export default CartRightColumn;
