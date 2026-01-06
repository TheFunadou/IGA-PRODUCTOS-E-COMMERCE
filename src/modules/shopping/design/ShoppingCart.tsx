import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdOutlineCheckBox } from "react-icons/md";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import ShoppingCartProductResume from "../components/ShoppingCartProductResume";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice, makeSlug } from "../../products/Helpers";
import type { ShoppingCartType } from "../ShoppingTypes";
import { useAuthStore } from "../../auth/states/authStore";
import { usePaymentStore } from "../states/paymentStore";
import ProductVersionCardSkinnySkeleton from "../../products/components/ProductVersionCardSkinnySkeleton";
import { useFetchAds } from "../../../layouts/hooks/useAds";
import { useThemeStore } from "../../../layouts/states/themeStore";
import clsx from "clsx";
import ProductVersionCardShop from "../../products/components/ProductVersionCardShop";
import { useEffect, useState } from "react";
import { useShoppingCart } from "../hooks/useShoppingCart";



const ShoppingCart = () => {
    const { theme } = useThemeStore();
    const { order } = usePaymentStore();
    const { isAuth, favorites, isLoading: favLoading } = useAuthStore();
    const navigate = useNavigate();
    const [subtotal, setSubtotal] = useState<number>(0);
    const {
        shoppingCart,
        checkAll,
        uncheckAll,
        clear,
        toogleCheck,
        remove,
        updateQty,
    } = useShoppingCart();

    const {
        data: ads,
        isLoading: adsLoading,
    } = useFetchAds({ limit: 10, entity: "ads" })
    const customerFavorites: boolean = true;

    useEffect(() => {
        if (shoppingCart) {
            const subtotal = shoppingCart.filter(items => items.isChecked === true).reduce((accumulator: number, product: ShoppingCartType) => {
                const itemTotal = parseFloat(product.product_version.unit_price) * product.quantity;
                return accumulator + itemTotal;
            }, 0);
            setSubtotal(subtotal);
        };
    }, [shoppingCart]);



    const handleRedirectToCheckout = () => {
        if (shoppingCart && shoppingCart.filter(item => item.isChecked).length > 0) {
            navigate("/resumen-de-carrito");
        };
    };
    return (
        <div className={clsx(
            "w-full px-5 py-10 rounded-xl",
            theme === "ligth" ? "bg-base-300" : "bg-slate-900"
        )}>
            <p className="text-3xl font-bold">Carrito de Compras</p>
            <div className="flex gap-5 mb-2 [&_button]:cursor-pointer mt-2">
                <button
                    type="button"
                    className={clsx(
                        "underline text-xl text-primary flex gap-2 items-center",
                        theme === "ligth" ? "text-primary" : "text-white"
                    )}
                    onClick={checkAll}>
                    <MdOutlineCheckBox className="text-primary" />Seleccionar todo
                </button>
                <button
                    type="button"
                    className={clsx(
                        "underline text-xl text-primary flex gap-2 items-center",
                        theme === "ligth" ? "text-primary" : "text-white"
                    )} onClick={uncheckAll}>
                    <MdCheckBoxOutlineBlank className="text-primary" />Desmarcar todo
                </button>
                <button
                    type="button"
                    className={clsx(
                        "underline text-xl text-primary flex gap-2 items-center",
                        theme === "ligth" ? "text-primary" : "text-white"
                    )} onClick={clear} >
                    <MdOutlineRemoveShoppingCart className="text-primary" />Vaciar carrito
                </button>
            </div>
            <section className="w-full flex mt-5">
                <div className="w-3/4">
                    {/* Shopping Cart container */}
                    {/* Shopping Cart */}
                    <div className={clsx(
                        "w-full rounded-xl p-5 flex flex-col gap-2",
                        theme === "ligth" ? "bg-white" : "bg-slate-950"
                    )}>
                        {/* Product */}
                        {shoppingCart.length < 1 &&
                            <p
                                className="text-xl text-gray-500 py-5">
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
                            <p className="text-xl text-right">{`Subtotal (${shoppingCart && shoppingCart.filter(item => item.isChecked === true).length}) productos: `}<span className="font-bold">${formatPrice((subtotal.toString()), "es-MX")}</span> </p>
                        </div>
                    </div>

                    {customerFavorites && isAuth &&
                        <div className="w-full mt-5">
                            {/* Customer Favorites */}
                            <p className="text-3xl font-bold">Mis favoritos</p>
                            <Link to={"/mis-favoritos"} className="underline text-primary text-xl">Ir a mis favoritos</Link>
                            <div className={clsx(
                                "w-full rounded-xl mt-4 p-5",
                                theme === "ligth" ? "bg-white" : "bg-slate-900"
                            )}>
                                {favLoading ? (
                                    <div>
                                        <ProductVersionCardSkinnySkeleton />
                                        <ProductVersionCardSkinnySkeleton />
                                        <ProductVersionCardSkinnySkeleton />
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-5 ">
                                        {favorites ? (
                                            favorites.map((data, index) => (
                                                <ProductVersionCardShop key={index} versionData={data} />
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No tienes productos agregados en favoritos</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    {!isAuth && (
                        <div className={clsx(
                            "w-full rounded-xl mt-4 p-5",
                            theme === "ligth" ? "bg-white" : "bg-slate-900"
                        )}>
                            <p className="text-3xl font-bold">Inicia sesión para ver tus favoritos</p>
                            <Link to={"/iniciar-sesion"} className="underline text-primary text-xl">Iniciar sesión</Link>
                        </div>
                    )}
                </div>
                <div className="w-1/4 pl-5 flex flex-col gap-5">
                    {shoppingCart && shoppingCart.length > 0 &&
                        <div className={clsx(
                            "w-full p-5 rounded-xl",
                            theme === "ligth" ? "bg-white" : "bg-slate-950"
                        )}>
                            <p className="text-xl border-b border-b-gray-400 pb-5">{`Subtotal (${shoppingCart && shoppingCart.filter(item => item.isChecked === true).length}) productos: `}<span className="font-bold">${formatPrice((subtotal.toString()), "es-MX")}</span> </p>
                            {order && (
                                <button
                                    type="button"
                                    className="w-full btn bg-blue-500 text-white mt-10"
                                    onClick={() => navigate("/pagar-productos")}
                                    disabled={!order}>
                                    Finalizar pago pendiente
                                </button>
                            )}
                            {!order && (
                                <button
                                    type="button"
                                    className="w-full btn btn-primary mt-10"
                                    onClick={handleRedirectToCheckout}
                                    disabled={shoppingCart.filter(item => item.isChecked).length === 0}>
                                    Proceder al pago
                                </button>
                            )}
                        </div>
                    }
                    <div className="w-full">
                        <p className="text-2xl font-bold">Productos que te pueden interesar</p>
                        {adsLoading ? (
                            <div>
                                Cargando ....
                            </div>
                        ) : (
                            <div className="w-full flex flex-col gap-4 mt-5">
                                {ads && ads.slice(0, shoppingCart && shoppingCart.length === 0 ? 5 : 5).map((data, index) => (
                                    <div
                                        key={index}
                                        className={clsx(
                                            "w-full flex rounded-xl p-5 cursor-pointer",
                                            theme === "ligth" ? "bg-white" : "bg-slate-950"
                                        )}
                                        onClick={() => navigate(`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name.toLowerCase())}/${data.product_version.sku.toLowerCase()}`)}>
                                        <figure className="w-30/100 h-full">
                                            <img className="w-full h-full object-cover rounded-xl border border-gray-300" src={data.product_images[0].image_url} alt={data.product_name} />
                                        </figure>
                                        <div className="w-65/100 pl-2">
                                            <p className="text-lg/6 line-clamp-3">{data.product_name}</p>
                                            <p className="text-2xl font-bold">{formatPrice(data.product_version.unit_price, "es-MX")}</p>
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