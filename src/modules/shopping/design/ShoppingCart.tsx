import { MdCheckBoxOutlineBlank, MdOutlineCheckBox, MdOutlineRemoveShoppingCart } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice, makeSlug } from "../../products/Helpers";
import { useAuthStore } from "../../auth/states/authStore";
import { usePaymentStore } from "../states/paymentStore";
import ProductVersionCardSkinnySkeleton from "../../products/components/ProductVersionCardSkinnySkeleton";
import ProductVersionCard from "../../products/components/ProductVersionCard";
import { useEffect, useState } from "react";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { useFetchCustomerFavorites } from "../../customers/hooks/useCustomer";
import PaginationComponent from "../../../global/components/PaginationComponent";
import { calcShippingCost } from "../../../global/GlobalHelpers";
import { FaShippingFast, FaShoppingCart, FaHeart, FaLock } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import ShoppingCartItem from "../components/ShoppingCartItem";
import clsx from "clsx";
import { useFetchProductVersionCards } from "../../products/hooks/useFetchProductVersionCards";

// ── Subcomponente: resumen de pago ───────────────────────────────────────────
interface OrderSummaryProps {
    checkedCount: number;
    subtotal: number;
    shippingCost: number;
    boxesQty: number;
    pendingOrder: boolean;
    order: unknown;
    onCheckout: () => void;
    onPendingPayment: () => void;
}

const OrderSummary = ({
    checkedCount, subtotal, shippingCost, boxesQty,
    pendingOrder, order, onCheckout, onPendingPayment,
}: OrderSummaryProps) => {
    const total = subtotal + shippingCost;

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
                    <span className="text-base-content/60">
                        Subtotal ({checkedCount} {checkedCount === 1 ? "producto" : "productos"})
                    </span>
                    <span className="font-semibold text-base-content">
                        ${formatPrice(subtotal.toString(), "es-MX")}
                    </span>
                </div>

                {/* Envío */}
                <div className="flex items-center justify-between text-sm sm:text-base rounded-xl bg-base-200 px-3 py-2.5">
                    <span className="flex items-center gap-2 text-base-content/70">
                        <FaShippingFast className="text-primary text-base sm:text-lg flex-shrink-0" />
                        Envío ({boxesQty} {boxesQty === 1 ? "caja" : "cajas"})
                    </span>
                    <span className="font-semibold text-base-content">
                        ${formatPrice(shippingCost.toString(), "es-MX")}
                    </span>
                </div>

                <div className="border-t border-base-300 pt-3 flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-base-content">Total estimado</span>
                    <span className="text-lg sm:text-xl font-extrabold text-primary">
                        ${formatPrice(total.toString(), "es-MX")}
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
                    <FaLock className="text-[8px]" /> Pago seguro y encriptado
                </p>
            </div>
        </div>
    );
};

// ── Componente principal ─────────────────────────────────────────────────────
const ShoppingCart = () => {
    document.title = "Iga Productos | Carrito de compras";

    const { order } = usePaymentStore();
    const { isAuth } = useAuthStore();
    const navigate = useNavigate();

    const [subtotal, setSubtotal] = useState(0);
    const [favoritesPage, setFavoritesPage] = useState(1);
    const [shippingCost, setShippingCost] = useState(0);
    const [boxesQty, setBoxesQty] = useState(0);
    const [pendingOrder, setPendingOrder] = useState(false);

    const { shoppingCart, checkAll, uncheckAll, clear, toogleCheck, remove, updateQty } = useShoppingCart();

    const { data: favorites, isLoading: isLoadingFavorites, error: favoritesError } =
        useFetchCustomerFavorites({ pagination: { page: favoritesPage, limit: 10 } });

    const { data: ads, isLoading: adsLoading } = useFetchProductVersionCards({ limit: 5, random: true });

    useEffect(() => {
        if (!shoppingCart) return;
        const checked = shoppingCart.filter(i => i.isChecked);
        const sub = checked.reduce((acc, item) => {
            const price = item.isOffer && item.product_version.unit_price_with_discount
                ? parseFloat(item.product_version.unit_price_with_discount)
                : parseFloat(item.product_version.unit_price);
            return acc + price * item.quantity;
        }, 0);
        setSubtotal(sub);
        const totalItems = checked.reduce((acc, i) => acc + i.quantity, 0);
        const { boxesQty: bq, shippingCost: sc } = calcShippingCost({ itemQty: totalItems });
        setBoxesQty(bq);
        setShippingCost(sc);
    }, [shoppingCart]);

    useEffect(() => { if (order) setPendingOrder(true); }, [order]);

    const checkedCount = shoppingCart?.filter(i => i.isChecked).length ?? 0;

    const handleRedirectToCheckout = () => {
        if (checkedCount > 0) navigate("/resumen-de-carrito");
    };

    const summaryProps: OrderSummaryProps = {
        checkedCount, subtotal, shippingCost, boxesQty, pendingOrder, order,
        onCheckout: handleRedirectToCheckout,
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
                            {shoppingCart?.length ?? 0} {shoppingCart?.length === 1 ? "producto" : "productos"} en tu carrito
                        </p>
                    </div>
                </div>

                {/* Acciones rápidas */}
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={checkAll}
                        className="btn btn-ghost btn-xs sm:btn-sm gap-1.5 text-primary hover:bg-primary/10 rounded-lg"
                    >
                        <MdOutlineCheckBox className="text-base" />
                        <span className="text-xs sm:text-sm">Seleccionar todo</span>
                    </button>
                    <div className="w-px h-4 bg-base-300" />
                    <button
                        type="button"
                        onClick={uncheckAll}
                        className="btn btn-ghost btn-xs sm:btn-sm gap-1.5 text-base-content/60 hover:bg-base-300 rounded-lg"
                    >
                        <MdCheckBoxOutlineBlank className="text-base" />
                        <span className="text-xs sm:text-sm">Desmarcar todo</span>
                    </button>
                    <div className="w-px h-4 bg-base-300" />
                    <button
                        type="button"
                        onClick={clear}
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
                        {shoppingCart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center">
                                    <FaShoppingCart className="text-3xl text-base-content/20" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-base-content">Tu carrito está vacío</p>
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
                                {shoppingCart.map((item, index) => (
                                    <div key={index} className="p-3 sm:p-4">
                                        <ShoppingCartItem
                                            data={item}
                                            onToggleCheck={toogleCheck}
                                            onUpdateQty={updateQty}
                                            onRemoveItem={remove}
                                            isAuth={isAuth ?? false}
                                        />
                                    </div>
                                ))}

                                {/* Subtotal footer */}
                                <div className="px-4 py-3 bg-base-200 flex items-center justify-between">
                                    <span className="text-sm text-base-content/60">
                                        Subtotal ({checkedCount} seleccionados)
                                    </span>
                                    <span className="text-base sm:text-lg font-extrabold text-base-content">
                                        ${formatPrice(subtotal.toString(), "es-MX")}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resumen móvil */}
                    {shoppingCart.length > 0 && (
                        <div className="lg:hidden">
                            <OrderSummary {...summaryProps} />
                        </div>
                    )}

                    {/* Favoritos */}
                    {isAuth && favorites && (
                        <div className="w-full">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <FaHeart className="text-primary text-lg" />
                                    <h2 className="text-xl sm:text-2xl font-bold text-base-content">Mis favoritos</h2>
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
                                        <p className="text-sm text-base-content/50">No tienes productos en favoritos aún</p>
                                    </div>
                                )}
                                {!isLoadingFavorites && !favoritesError && favorites.data.length > 0 && (
                                    <div className="flex flex-wrap gap-3 md:gap-5">
                                        {favorites.data.map((item, i) => (
                                            <ProductVersionCard key={i} versionData={item} className="sm:w-56 sm:min-h-80 md:w-64 md:min-h-96 lg:w-72 lg:min-h-[26rem] xl:w-76 xl:min-h-[28rem] 2xl:w-80 2xl:min-h-[30rem]" />
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
                                <p className="font-bold text-base-content text-lg">Inicia sesión para ver tus favoritos</p>
                                <p className="text-sm text-base-content/50 mt-0.5">Guarda los productos que más te gusten</p>
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
                    {shoppingCart.length > 0 && (
                        <div className="hidden lg:block sticky top-5">
                            <OrderSummary {...summaryProps} />
                        </div>
                    )}

                    {/* Sugerencias */}
                    <div className="w-full">
                        <h2 className="text-lg sm:text-xl font-bold text-base-content mb-3">
                            También te puede interesar
                        </h2>
                        {adsLoading ? (
                            <div className="flex flex-col gap-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-full h-24 rounded-xl bg-base-100 border border-base-300 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {ads?.data.map((item, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => navigate(`/tienda/${item.category.toLowerCase()}/${makeSlug(item.product_name.toLowerCase())}/${item.product_version.sku.toLowerCase()}`)}
                                        className={clsx(
                                            "w-full flex gap-3 rounded-xl p-3 text-left",
                                            "bg-base-100 border border-base-300",
                                            "hover:border-primary/40 hover:shadow-sm transition-all duration-200",
                                            "active:scale-[0.99] cursor-pointer"
                                        )}
                                    >
                                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden border border-base-300 flex-shrink-0">
                                            <img
                                                className="w-full h-full object-cover"
                                                src={item.product_images[0].image_url}
                                                alt={item.product_name}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                            <p className="text-xs sm:text-sm text-base-content font-medium line-clamp-2 leading-snug">
                                                {item.product_name}
                                            </p>
                                            <p className="text-sm sm:text-base font-extrabold text-primary">
                                                ${formatPrice(item.product_version.unit_price, "es-MX")}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShoppingCart;