import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    MdCheckBoxOutlineBlank,
    MdOutlineCheckBox,
    MdOutlineRemoveShoppingCart,
    MdShoppingBag,
} from "react-icons/md";
import { FaShippingFast, FaShoppingCart, FaHeart, FaLock } from "react-icons/fa";
// Hooks y Store
import { useAuthStore } from "../../auth/states/authStore";
import { useTriggerAlert } from "../../alerts/states/TriggerAlert";
import { useHandleShoppingCart } from "../hooks/handleShoppingCart";
// Helpers y Tipos
import type { ProductVersionCardI } from "../../products/ProductTypes";
// Componentes
import ShoppingCartItemV2 from "../components/ShoppingCartItem";
import ProductVersionCardSkinnySkeleton from "../../products/components/ProductVersionCardSkinnySkeleton";
import PaginationComponent from "../../../global/components/PaginationComponent";
import type { OrderCreatedType } from "../../orders/OrdersTypes";
import { usePaymentStore } from "../states/paymentStore";
import ProductVersionCardV2 from "../../products/components/ProductVersionCard";
import { useFetchProductVersionCardsV2 } from "../../products/hooks/useFetchProductVersionCards";

// ── Subcomponente: Resumen de Pedido ─────────────────────────────────────────
interface OrderSummaryProps {
    checkedCount?: number;
    subtotalBeforeTaxes?: string;
    shippingCostBeforeTaxes?: string;
    iva?: string;
    discount?: string;
    total?: string;
    boxesQty?: number;
    pendingOrder: boolean;
    order?: OrderCreatedType | null;
    onCheckout: () => void;
    onPendingPayment: () => void;
}

const OrderSummary = ({
    checkedCount,
    subtotalBeforeTaxes,
    shippingCostBeforeTaxes,
    iva,
    discount,
    total,
    boxesQty,
    pendingOrder,
    order,
    onCheckout,
    onPendingPayment,
}: OrderSummaryProps) => {
    return (
        <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                <h2 className="text-sm font-bold text-base-content uppercase">
                    Resumen del pedido
                </h2>
            </div>
            <div className="p-4 flex flex-col gap-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm sm:text-base">
                    <div>
                        <span className="text-base-content/60">
                            Subtotal ({checkedCount} {checkedCount === 1 ? "producto" : "productos"})
                        </span>
                        <p className="text-xs text-base-content/60">Antes de impuestos</p>
                    </div>
                    <span className="font-semibold text-base-content">
                        ${subtotalBeforeTaxes}
                    </span>
                </div>
                {/* Envío */}
                <div className="flex items-center justify-between text-sm sm:text-base rounded-xl bg-base-200 px-3 py-2.5">
                    <div>
                        <span className="flex items-center gap-2 text-base-content/70">
                            <FaShippingFast className="text-primary text-base sm:text-lg flex-shrink-0" />
                            Envío ({boxesQty} {boxesQty === 1 ? "caja" : "cajas"})
                        </span>
                        <p className="text-xs text-base-content/60">Antes de impuestos</p>
                    </div>
                    <span className="font-semibold text-base-content">
                        ${shippingCostBeforeTaxes}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm sm:text-base rounded-xl bg-base-200 px-3 py-2.5">
                    <span className="flex items-center gap-2 text-base-content/70">
                        IVA
                    </span>
                    <span className="font-semibold text-base-content">
                        ${iva}
                    </span>
                </div>
                {discount && parseFloat(discount) > 0 && (
                    <div className="flex items-center justify-between text-sm sm:text-base rounded-xl bg-base-200 px-3 py-2.5">
                        <span className="flex items-center gap-2 text-base-content/70">
                            Descuento
                        </span>
                        <span className="font-semibold text-base-content">
                            ${discount}
                        </span>
                    </div>
                )}
                {/* Total */}
                <div className="border-t border-base-300 pt-3 flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-base-content">
                        Total estimado
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-primary">
                        ${total}
                    </span>
                </div>
                {/* CTA */}
                {pendingOrder ? (
                    <button
                        type="button"
                        className="w-full btn bg-warning hover:bg-warning/90 text-white font-bold border-0 mt-1"
                        onClick={onPendingPayment}
                        disabled={!order}
                    >
                        Finalizar pago pendiente
                    </button>
                ) : (
                    <button
                        type="button"
                        className="w-full btn btn-primary font-bold mt-1 gap-2"
                        onClick={onCheckout}
                        disabled={checkedCount === 0}
                    >
                        <FaLock className="text-sm" />
                        Proceder al pago
                    </button>
                )}
                <p className="text-center text-[10px] text-base-content/30 flex items-center justify-center gap-1">
                    <FaLock className="text-[8px]" /> Pago seguro
                </p>
            </div>
        </div>
    );
};

// ── Componente Principal ShoppingCartV2 ──────────────────────────────────────
const ShoppingCartV2 = () => {
    document.title = "Iga Productos | Carrito de Compras";

    const { isAuth, authCustomer } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    const { order } = usePaymentStore();
    const navigate = useNavigate();

    const [favoritesPage, setFavoritesPage] = useState(1);
    const [pendingOrder, setPendingOrder] = useState(false);

    const handleCart = useHandleShoppingCart({
        isAuth,
        authCustomer,
        showTriggerAlert: (type, message, options) =>
            showTriggerAlert(type, message, options),
    });

    const {
        data: favorites,
        isLoading: isLoadingFavorites,
        error: favoritesError,
    } = useFetchProductVersionCardsV2({
        filters: { onlyFavorites: true }
    });

    const cardsMap = useMemo(() => {
        if (!handleCart.data?.cards) return new Map<string, ProductVersionCardI>();

        return new Map(
            handleCart.data.cards.map(c => [c.sku.toLowerCase(), c])
        );
    }, [handleCart.data]);

    useEffect(() => {
        if (order) setPendingOrder(true);
    }, [order]);

    const summaryProps: OrderSummaryProps = {
        checkedCount: handleCart.data?.shoppingCart.length,
        subtotalBeforeTaxes: handleCart.data?.resume?.itemsSubtotalBeforeTaxes,
        shippingCostBeforeTaxes: handleCart.data?.resume?.shippingCostBeforeTaxes,
        iva: handleCart.data?.resume?.iva,
        discount: handleCart.data?.resume?.discount,
        total: handleCart.data?.resume?.total,
        boxesQty: handleCart.data?.resume?.boxesCount,
        pendingOrder,
        order,
        onCheckout: () => navigate("/resumen-de-carrito"),
        onPendingPayment: () => navigate("/pagar-productos"),
    };

    return (
        <div className="w-full px-3 sm:px-5 md:px-6 py-6 md:py-10 rounded-2xl bg-base-200">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FaShoppingCart className="text-primary text-lg sm:text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                            Carrito de compras
                        </h1>
                        <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                            {handleCart.data?.shoppingCart?.length ?? 0}{" "}
                            {handleCart.data?.shoppingCart?.length === 1 ? "producto" : "productos"} en tu carrito
                        </p>
                    </div>
                </div>

                {/* Acciones rápidas */}
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={handleCart.checkAll}
                        className="btn btn-ghost btn-xs sm:btn-sm gap-1.5 text-primary hover:bg-primary/10 rounded-lg"
                    >
                        <MdOutlineCheckBox className="text-base" />
                        <span className="text-xs sm:text-sm">Seleccionar todo</span>
                    </button>
                    <div className="w-px h-4 bg-base-300" />
                    <button
                        type="button"
                        onClick={handleCart.uncheckAll}
                        className="btn btn-ghost btn-xs sm:btn-sm gap-1.5 text-base-content/60 hover:bg-base-300 rounded-lg"
                    >
                        <MdCheckBoxOutlineBlank className="text-base" />
                        <span className="text-xs sm:text-sm">Desmarcar todo</span>
                    </button>
                    <div className="w-px h-4 bg-base-300" />
                    <button
                        type="button"
                        onClick={handleCart.clearCart}
                        className="btn btn-ghost btn-xs sm:btn-sm gap-1.5 text-error hover:bg-error/10 rounded-lg"
                    >
                        <MdOutlineRemoveShoppingCart className="text-base" />
                        <span className="text-xs sm:text-sm">Vaciar</span>
                    </button>
                </div>
            </div>

            {/* ── Layout principal ── */}
            <section className="w-full flex flex-col lg:flex-row gap-5 mt-2">
                {/* ── Columna izquierda ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-5">
                    {/* Lista de productos */}
                    <div className="w-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                        {handleCart.isLoading ? (
                            <div className="flex flex-col divide-y divide-base-200">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="p-3 sm:p-4 w-full h-36 animate-pulse bg-base-100"
                                    />
                                ))}
                            </div>
                        ) : !handleCart.data?.shoppingCart || handleCart.data.shoppingCart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center">
                                    <FaShoppingCart className="text-3xl text-base-content/20" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-base-content">
                                        Tu carrito está vacío
                                    </p>
                                    <p className="text-sm text-base-content/50 mt-1">
                                        Explora nuestra tienda y agrega productos que te interesen
                                    </p>
                                </div>
                                <Link
                                    to="/tienda"
                                    className="btn btn-primary btn-sm gap-2 mt-1"
                                >
                                    <MdShoppingBag className="text-base" />
                                    Ir a la tienda
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col divide-y divide-base-200">
                                {handleCart.data.shoppingCart.map((item) => {
                                    const cardData = cardsMap.get(item.item.sku.toLowerCase());
                                    if (!cardData) {
                                        return (
                                            <div className="p-4 text-sm text-error">
                                                Producto no disponible (SKU: {item.item.sku})
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={item.item.sku} className="p-3 sm:p-4">
                                            <ShoppingCartItemV2
                                                cartItem={item}
                                                cardData={cardData}
                                                stockLimit={cardData.stock ?? 0}
                                                onToggleCheck={handleCart.toggleCheck}
                                                onRemoveItem={handleCart.removeItem}
                                                onUpdateQty={handleCart.setItem}
                                                isAuth={isAuth}
                                            />
                                        </div>
                                    );
                                })}
                                {/* Subtotal footer */}
                                <div className="px-4 py-3 bg-base-200 flex items-center justify-between">
                                    <span className="text-sm text-base-content/60">
                                        Subtotal ({handleCart.data?.shoppingCart.length} seleccionados)
                                    </span>
                                    <span className="text-base sm:text-lg font-extrabold text-base-content">
                                        ${handleCart.data?.resume?.itemsSubtotal}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resumen móvil */}
                    {handleCart.data?.shoppingCart && handleCart.data.shoppingCart.length > 0 && (
                        <div className="lg:hidden">
                            <OrderSummary {...summaryProps} />
                        </div>
                    )}

                    {/* Favoritos (autenticado) */}
                    {isAuth && favorites && (
                        <div className="w-full">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <FaHeart className="text-primary text-lg" />
                                    <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                                        Mis favoritos
                                    </h2>
                                </div>
                                <Link
                                    to="/mis-favoritos"
                                    className="text-sm text-primary underline underline-offset-2 hover:opacity-70 transition-opacity"
                                >
                                    Ver todos
                                </Link>
                            </div>
                            <div className="w-full rounded-2xl bg-base-100 border border-base-300 p-4 sm:p-5">
                                {isLoadingFavorites && !favoritesError && (
                                    <div className="flex flex-col gap-3">
                                        <ProductVersionCardSkinnySkeleton />
                                        <ProductVersionCardSkinnySkeleton />
                                        <ProductVersionCardSkinnySkeleton />
                                    </div>
                                )}
                                {!isLoadingFavorites && !favoritesError && favorites.data.length === 0 && (
                                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                                        <FaHeart className="text-3xl text-base-content/10" />
                                        <p className="text-sm text-base-content/50">
                                            No tienes productos en favoritos aún
                                        </p>
                                    </div>
                                )}
                                {!isLoadingFavorites && !favoritesError && favorites.data.length > 0 && (
                                    <div className="flex flex-wrap gap-3 md:gap-5">
                                        {favorites.data.map((item, i) => (
                                            <ProductVersionCardV2
                                                key={i}
                                                versionData={item}
                                                className="sm:w-56 sm:min-h-80 md:w-64 md:min-h-96 lg:w-72 lg:min-h-[26rem] xl:w-76 xl:min-h-[28rem] 2xl:w-80 2xl:min-h-[30rem]"
                                            />
                                        ))}
                                    </div>
                                )}
                                {favorites.totalPages > 1 && (
                                    <div className="mt-5">
                                        <PaginationComponent
                                            currentPage={favoritesPage}
                                            onPageChange={setFavoritesPage}
                                            totalPages={favorites.totalPages}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* No autenticado */}
                    {!isAuth && (
                        <div className="w-full rounded-2xl bg-base-100 border border-base-300 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <FaHeart className="text-primary text-xl" />
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="font-bold text-base-content text-lg">
                                    Inicia sesión para ver tus favoritos
                                </p>
                                <p className="text-sm text-base-content/50 mt-0.5">
                                    Guarda los productos que más te gusten
                                </p>
                            </div>
                            <Link
                                to="/iniciar-sesion"
                                className="btn btn-primary btn-sm sm:ml-auto"
                            >
                                Iniciar sesión
                            </Link>
                        </div>
                    )}
                </div>

                {/* ── Columna derecha ── */}
                <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-5">
                    {/* Resumen desktop */}
                    {handleCart.data?.shoppingCart && handleCart.data.shoppingCart.length > 0 && (
                        <div className="hidden lg:block sticky top-5">
                            <OrderSummary {...summaryProps} />
                        </div>
                    )}


                </div>
            </section>
        </div>
    );
};

export default ShoppingCartV2;