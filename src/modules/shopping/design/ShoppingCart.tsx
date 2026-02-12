import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdOutlineCheckBox } from "react-icons/md";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import ShoppingCartProductResume from "../components/ShoppingCartProductResume";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice, makeSlug } from "../../products/Helpers";
import { useAuthStore } from "../../auth/states/authStore";
import { usePaymentStore } from "../states/paymentStore";
import ProductVersionCardSkinnySkeleton from "../../products/components/ProductVersionCardSkinnySkeleton";
import { useFetchAds } from "../../../layouts/hooks/useAds";
import { useThemeStore } from "../../../layouts/states/themeStore";
import clsx from "clsx";
import ProductVersionCardShop from "../../products/components/ProductVersionCardShop";
import { useEffect, useState } from "react";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { useFetchCustomerFavorites } from "../../customers/hooks/useCustomer";
import PaginationComponent from "../../../global/components/PaginationComponent";
import { calcShippingCost } from "../../../global/GlobalHelpers";
import { FaShippingFast } from "react-icons/fa";



const ShoppingCart = () => {
    const { theme } = useThemeStore();
    const { order } = usePaymentStore();
    const { isAuth } = useAuthStore();
    const navigate = useNavigate();
    const [subtotal, setSubtotal] = useState<number>(0);
    const [favoritesPage, setFavoritesPage] = useState<number>(1);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [boxesQty, setBoxesQty] = useState<number>(0);
    const [pendingOrder, setPendingOrder] = useState<boolean>(false);
    const {
        shoppingCart,
        checkAll,
        uncheckAll,
        clear,
        toogleCheck,
        remove,
        updateQty,
    } = useShoppingCart();

    const { data: favorites, isLoading: isLoadingFavorites, error: favoritesError } = useFetchCustomerFavorites({
        pagination: { page: favoritesPage, limit: 10 }
    });


    const {
        data: ads,
        isLoading: adsLoading,
    } = useFetchAds({ limit: 10, entity: "ads" })

    useEffect(() => {
        if (shoppingCart) {
            const onlyChecked = shoppingCart.filter(items => items.isChecked);
            const subtotal = onlyChecked.reduce((acc, item) => {
                if (item.isOffer && item.product_version.unit_price_with_discount) {
                    return acc + (parseFloat(item.product_version.unit_price_with_discount) * item.quantity);
                } else {
                    return acc + (parseFloat(item.product_version.unit_price) * item.quantity);
                }
            }, 0);
            setSubtotal(subtotal);

            const totalItems = onlyChecked.reduce((acc, item) => {
                return acc + item.quantity;
            }, 0);
            const { boxesQty, shippingCost } = calcShippingCost({ itemQty: totalItems });
            setBoxesQty(boxesQty);
            setShippingCost(shippingCost);
        };
    }, [shoppingCart]);

    useEffect(() => { if (order) setPendingOrder(true) }, [order]);



    const handleRedirectToCheckout = () => {
        if (shoppingCart && shoppingCart.filter(item => item.isChecked).length > 0) {
            navigate("/resumen-de-carrito");
        };
    };

    const handleFavoritesPageChange = (page: number) => setFavoritesPage(page);
    return (
        <div className="w-full px-3 md:px-5 py-6 md:py-10 rounded-xl bg-base-300">
            <p className="text-2xl md:text-3xl font-bold">Carrito de Compras</p>
            <div className="flex gap-2 sm:gap-5 mb-2 [&_button]:cursor-pointer mt-2">
                <button
                    type="button"
                    className={clsx(
                        "underline text-xs sm:text-lg md:text-xl flex gap-1 md:gap-2 items-center text-left",
                        theme === "ligth" ? "text-primary" : "text-white"
                    )}
                    onClick={checkAll}>
                    <MdOutlineCheckBox className="text-primary" />Seleccionar todo
                </button>
                <button
                    type="button"
                    className={clsx(
                        "underline text-xs sm:text-lg md:text-xl flex gap-1 md:gap-2 items-center text-left",
                        theme === "ligth" ? "text-primary" : "text-white"
                    )} onClick={uncheckAll}>
                    <MdCheckBoxOutlineBlank className="text-primary" />Desmarcar todo
                </button>
                <button
                    type="button"
                    className={clsx(
                        "underline text-xs sm:text-lg md:text-xl flex gap-1 md:gap-2 items-center text-left",
                        theme === "ligth" ? "text-primary" : "text-white"
                    )} onClick={clear} >
                    <MdOutlineRemoveShoppingCart className="text-primary" />Vaciar carrito
                </button>
            </div>
            <section className="w-full flex flex-col lg:flex-row mt-5 gap-5">
                <div className="w-full lg:w-3/4">
                    {/* Shopping Cart container */}
                    {/* Shopping Cart */}
                    <div className="w-full rounded-xl p-3 md:p-5 flex flex-col gap-2 bg-base-100">
                        {/* Product */}
                        {shoppingCart.length < 1 &&
                            <p
                                className="text-base md:text-xl text-gray-500 py-5">
                                No hay productos en el carrito, <span className="text-primary underline"><Link to={"/tienda"}>explora nuestra tienda y conoce los diversos productos que ofrecemos para ti</Link></span>
                            </p>
                        }
                        {shoppingCart && shoppingCart.length > 0 && shoppingCart.map((item, index) => (
                            <ShoppingCartProductResume
                                key={index}
                                data={item}
                                onRemoveItem={remove}
                                onToggleCheck={toogleCheck}
                                onUpdateQty={updateQty}
                                isAuth={isAuth ?? false}
                            />
                        ))}
                        <div className="w-full border-t border-t-gray-300 pt-5">
                            <p className="text-base md:text-xl text-right">{`Subtotal (${shoppingCart && shoppingCart.filter(item => item.isChecked === true).length}) productos: `}<span className="font-bold">${formatPrice((subtotal.toString()), "es-MX")}</span> </p>
                        </div>
                    </div>
                    <div className="lg:hidden py-5">
                        {shoppingCart && shoppingCart.length > 0 &&
                            <div className="w-full p-3 md:p-5 rounded-xl flex flex-col gap-2 bg-base-100">
                                <p className="text-base md:text-xl border-b border-b-gray-400 pb-5">{`Subtotal (${shoppingCart && shoppingCart.filter(item => item.isChecked === true).length}) productos: `}<span className="font-bold">${formatPrice((subtotal.toString()), "es-MX")}</span> </p>

                                <div className="bg-base-200 px-2 py-3 rounded-xl flex gap-2">
                                    <p className="text-base md:text-xl flex flex-col sm:flex-row items-start sm:items-center gap-2 font-medium"><FaShippingFast className="text-2xl md:text-3xl text-primary" />Envio por: ${formatPrice((shippingCost.toString()), "es-MX")} ({boxesQty > 1 ? `${boxesQty} Cajas` : `${boxesQty} Caja`})</p>
                                </div>
                                <div>
                                    {pendingOrder && (
                                        <button
                                            type="button"
                                            className="w-full btn bg-warning text-white"
                                            onClick={() => navigate("/pagar-productos")}
                                            disabled={!order}>
                                            Finalizar pago pendiente
                                        </button>
                                    )}
                                    {!pendingOrder && (
                                        <button
                                            type="button"
                                            className="w-full btn btn-primary mt-5"
                                            onClick={handleRedirectToCheckout}
                                            disabled={shoppingCart.filter(item => item.isChecked).length === 0}>
                                            Proceder al pago
                                        </button>
                                    )}
                                </div>
                            </div>
                        }
                    </div>
                    {favorites && isAuth && (
                        <div className="w-full lg:mt-5">
                            {/* Customer Favorites */}
                            <p className="text-2xl md:text-3xl font-bold">Mis favoritos</p>
                            <Link to={"/mis-favoritos"} className="underline text-primary text-lg md:text-xl">Ir a mis favoritos</Link>
                            <div className="w-full rounded-xl mt-4 p-3 md:p-5 bg-base-100">

                                {isLoadingFavorites && !favoritesError && !favorites && (
                                    <div>
                                        <ProductVersionCardSkinnySkeleton />
                                        <ProductVersionCardSkinnySkeleton />
                                        <ProductVersionCardSkinnySkeleton />
                                    </div>
                                )}

                                {!isLoadingFavorites && !favoritesError && favorites && favorites.data.length === 0 && (
                                    <p className="text-gray-500">No tienes productos agregados en favoritos</p>
                                )}

                                {!isLoadingFavorites && !favoritesError && favorites && favorites.data.length > 0 && (
                                    <div className="flex flex-wrap gap-3 md:gap-5">
                                        {favorites.data.map((data, index) => (
                                            <ProductVersionCardShop key={index} versionData={data} />
                                        ))}
                                    </div>
                                )}
                                {favorites.totalPages > 1 && (
                                    <div className="mt-5"><PaginationComponent currentPage={favoritesPage} onPageChange={handleFavoritesPageChange} totalPages={favorites.totalPages} /></div>
                                )}
                            </div>
                        </div>
                    )}

                    {!isAuth && (
                        <div className="w-full rounded-xl mt-4 p-3 md:p-5 bg-base-100">
                            <p className="text-2xl md:text-3xl font-bold">Inicia sesión para ver tus favoritos</p>
                            <Link to={"/iniciar-sesion"} className="underline text-primary text-lg md:text-xl">Iniciar sesión</Link>
                        </div>
                    )}


                </div>
                <div className="w-full lg:w-1/4 lg:pl-5 flex flex-col gap-5">
                    <div className="hidden lg:block">
                        {shoppingCart && shoppingCart.length > 0 &&
                            <div className="w-full p-3 md:p-5 rounded-xl bg-base-100 flex flex-col gap-2">
                                <p className="text-base md:text-xl border-b border-b-gray-400 pb-5">{`Subtotal (${shoppingCart && shoppingCart.filter(item => item.isChecked === true).length}) productos: `}<span className="font-bold">${formatPrice((subtotal.toString()), "es-MX")}</span> </p>

                                <div className="bg-base-200 px-2 py-3 rounded-xl flex gap-2">
                                    <p className="text-base md:text-xl flex flex-col sm:flex-row items-start sm:items-center gap-2 font-medium"><FaShippingFast className="text-2xl md:text-3xl text-primary" />Envio por: ${formatPrice((shippingCost.toString()), "es-MX")} ({boxesQty > 1 ? `${boxesQty} Cajas` : `${boxesQty} Caja`})</p>
                                </div>
                                <div>
                                    {pendingOrder && (
                                        <button
                                            type="button"
                                            className="w-full btn bg-warning text-white"
                                            onClick={() => navigate("/pagar-productos")}
                                            disabled={!order}>
                                            Finalizar pago pendiente
                                        </button>
                                    )}
                                    {!pendingOrder && (
                                        <button
                                            type="button"
                                            className="w-full btn btn-primary mt-5"
                                            onClick={handleRedirectToCheckout}
                                            disabled={shoppingCart.filter(item => item.isChecked).length === 0}>
                                            Proceder al pago
                                        </button>
                                    )}
                                </div>
                            </div>
                        }
                    </div>
                    <div className="w-full">
                        <p className="text-xl md:text-2xl font-bold">Productos que te pueden interesar</p>
                        {adsLoading ? (
                            <div>
                                Cargando ....
                            </div>
                        ) : (
                            <div className="w-full flex flex-col gap-4 mt-5">
                                {ads && ads.slice(0, shoppingCart && shoppingCart.length === 0 ? 5 : 5).map((data, index) => (
                                    <div
                                        key={index}
                                        className="w-full flex rounded-xl p-3 md:p-5 bg-base-100 cursor-pointer"
                                        onClick={() => navigate(`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name.toLowerCase())}/${data.product_version.sku.toLowerCase()}`)}>
                                        <figure className="w-24 sm:w-28 md:w-30/100 h-full flex-shrink-0">
                                            <img className="w-full h-full object-cover rounded-xl border border-gray-300" src={data.product_images[0].image_url} alt={data.product_name} />
                                        </figure>
                                        <div className="flex-1 pl-2 md:pl-3">
                                            <p className="text-sm sm:text-base md:text-lg/6 line-clamp-3">{data.product_name}</p>
                                            <p className="text-lg sm:text-xl md:text-2xl font-bold">{formatPrice(data.product_version.unit_price, "es-MX")}</p>
                                        </div>
                                    </div>
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