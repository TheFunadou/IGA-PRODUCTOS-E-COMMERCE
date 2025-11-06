import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdOutlineCheckBox } from "react-icons/md";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import ShoppingCartProductResume from "../components/ShoppingCartProductResume";
import { Link, useNavigate } from "react-router-dom";
import { useShoppingCartStore } from "../states/shoppingCartStore";
import { formatPrice } from "../../products/Helpers";
import type { ShoppingCartType } from "../ShoppingTypes";
import { useAuthStore } from "../../auth/states/authStore";
import { useDebounceCallback } from "../../../global/hooks/useDebounceCallback";
import { usePaymentStore } from "../states/paymentStore";
import ProductVersionCardSkinny from "../../products/components/ProductVersionCardSkinny";
import ProductVersionCardSkinnySkeleton from "../../products/components/ProductVersionCardSkinnySkeleton";
import { useFetchAds } from "../../../layouts/hooks/useAds";



const ShoppingCart = () => {
    const { items, checkAllItems, uncheckAllItems, clearShoppingCart, toogleCheckItem, removeItem, updateItemQty } = useShoppingCartStore();
    const { order, cancelOrder} = usePaymentStore();
    const { isAuth, favorites, isLoading: favLoading } = useAuthStore();
    const navigate = useNavigate();
    const {
        data: ads,
        isLoading: adsLoading,
        error: adsError,
        refetch: refetchAds
    } = useFetchAds({ limit: 10, entity: "ads" })


    const customerFavorites: boolean = true;

    const subtotal: number = items.filter(items => items.isChecked === true).reduce((accumulator: number, product: ShoppingCartType) => {
        const itemTotal = parseFloat(product.product_version.unit_price) * product.quantity;
        return accumulator + itemTotal;
    }, 0);

    const handleRedirectToCheckout = () => {
        if (items.filter(item => item.isChecked).length > 0) {
            navigate("/resumen-de-carrito");
        };
    };
    const debouncedCheckAllItems = useDebounceCallback(checkAllItems, 400);
    const debouncedUncheckAllItems = useDebounceCallback(uncheckAllItems, 400);
    const debouncedClearShoppingCart = useDebounceCallback(clearShoppingCart, 400);
    return (
        <div className="w-full bg-base-300 px-5 py-10 rounded-xl">
            <p className="text-3xl font-bold">Carrito de Compras</p>
            <div className="flex gap-5 mb-2 [&_button]:cursor-pointer mt-2">
                <button type="button" className="underline text-xl text-primary flex gap-2 items-center" onClick={debouncedCheckAllItems}><MdOutlineCheckBox className="text-primary" />Seleccionar todo</button>
                <button type="button" className="underline text-xl text-primary flex gap-2 items-center" onClick={debouncedUncheckAllItems}><MdCheckBoxOutlineBlank className="text-primary" />Desmarcar todo</button>
                <button type="button" className="underline text-xl text-error flex gap-2 items-center" onClick={debouncedClearShoppingCart} ><MdOutlineRemoveShoppingCart className="text-error" />Vaciar carrito</button>
            </div>
            <section className="w-full flex mt-5">
                <div className="w-3/4">
                    {/* Shopping Cart container */}
                    {/* Shopping Cart */}
                    <div className="w-full bg-white rounded-xl p-5 flex flex-col gap-2">
                        {/* Product */}
                        {items && items.length > 0 && items.map((item, index) => (
                            <ShoppingCartProductResume
                                key={index}
                                data={item}
                                onRemoveItem={removeItem}
                                onToggleCheck={toogleCheckItem}
                                onUpdateQty={updateItemQty}
                                isAuth={isAuth ?? false}
                            />
                        ))}
                        {!items || items.length === 0 && <p className="text-xl text-gray-500 py-5">No hay productos en el carrito, <span className="text-primary underline"><Link to={"/tienda"}>explora nuestra tienda y conoce los diversos productos que ofrecemos para ti</Link></span></p>}
                        <div className="w-full border-t border-t-gray-300 pt-5">
                            <p className="text-xl text-right">{`Subtotal (${items && items.filter(item => item.isChecked === true).length}) productos: `}<span className="font-bold">${formatPrice((subtotal.toString()), "es-MX")}</span> </p>
                        </div>
                    </div>

                    {customerFavorites &&
                        <div className="w-full mt-5">
                            {/* Customer Favorites */}
                            <p className="text-3xl font-bold">Mis favoritos</p>
                            <Link to={"/mis-favoritos"} className="underline text-primary text-xl">Ir a mis favoritos</Link>
                            <div className="w-full rounded-xl mt-4 p-5 bg-white">
                                {favLoading ? (
                                    <div>
                                        <ProductVersionCardSkinnySkeleton />
                                        <ProductVersionCardSkinnySkeleton />
                                        <ProductVersionCardSkinnySkeleton />
                                    </div>
                                ) : (
                                    <div>
                                        {favorites ? (
                                            favorites.map((data, index) => (
                                                <ProductVersionCardSkinny key={index} versionData={data} className="w-75 h-135" />
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No tienes productos agregados en favoritos</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                </div>
                <div className="w-1/4 pl-5 flex flex-col gap-5">
                    <div className="w-full">
                        {/* Resume container */}
                        {items && items.length > 0 &&
                            <div className="w-full bg-white p-5 rounded-xl">
                                <p className="text-xl border-b border-b-gray-400 pb-5">{`Subtotal (${items && items.filter(item => item.isChecked === true).length}) productos: `}<span className="font-bold">${formatPrice((subtotal.toString()), "es-MX")}</span> </p>
                                {order ? (
                                    <button
                                        type="button"
                                        className="w-full btn bg-blue-500 text-white mt-10"
                                        onClick={() => navigate("/pagar-productos")}
                                        disabled={!order}>
                                        Finalizar pago pendiente
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="w-full btn btn-primary mt-10"
                                        onClick={handleRedirectToCheckout}
                                        disabled={items.filter(item => item.isChecked).length === 0}>
                                        Proceder al pago
                                    </button>
                                )}

                                {/* <button type="button" onClick={() => cancelOrder} className="btn btn-primary">Clear order</button> */}
                            </div>
                        }
                    </div>
                    <div className="w-full">
                        <p className="text-xl font-bold">Productos que te pueden interesar</p>
                        {adsLoading ? (
                            <div>
                                Cargando ....
                            </div>
                        ) : (
                            <div className="w-full flex flex-col gap-4 mt-5">
                                {ads && ads.map((data, index) => (
                                    <div key={index} className="w-full bg-white rounded-xl p-3 flex">
                                        <figure className="w-25/100">
                                            <img className="rounded-xl border border-gray-300" src={data.product_images[0].image_url} alt={data.product_name} />
                                        </figure>
                                        <div className="w-65/100 pl-2">
                                            <p className="text-lg/6">{data.product_name}</p>
                                            <p className="text-2xl font-bold">{formatPrice(data.product_version.unit_price,"es-MX")}</p>
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