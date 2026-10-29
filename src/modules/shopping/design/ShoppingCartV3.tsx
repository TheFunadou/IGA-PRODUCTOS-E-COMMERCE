import { useShoppingCartV3Controller } from "../hooks/useShoppingCartV3Controller";
import PageHeader from "../components/PageHeader";
import CartLeftColumn from "../components/cart-v3/CartLeftColumn";
import CartRightColumn from "../components/cart-v3/CartRightColumn";
import EmptyCartV3 from "../components/EmptyCartV3";

/* Página del carrito V3: solo composición. Toda la lógica vive en
   useShoppingCartV3Controller; los bloques visuales están separados en
   subcomponentes bajo components/cart-v3.

   Garantía anti-desborde horizontal (X): la raíz lleva `overflow-x-clip` como
   red final (no crea scroll container, no rompe los `sticky`), los hijos de
   flex/grid que contienen texto llevan `min-w-0`, y el texto dinámico de BD
   lleva `break-words` (dirección, nombre de producto, SKU). */
const ShoppingCartV3 = () => {
    const c = useShoppingCartV3Controller();
    const { isAuth, allItems, handleCart } = c;

    return (
        <div className="w-full flex justify-center items-center overflow-x-clip">
            <div className="w-full md:w-80/100 px-2 sm:px-3 md:px-4 py-6 md:py-10 rounded-2xl">
                <PageHeader
                    title="Carrito de compras"
                    subtitle="Revisa tu pedido y completa tu compra"
                    guestTip="Estás navegando como invitado. Solo la información del pedido será persistida. Los articulos del carrito se persisten por tiempo limitado."
                    isAuth={isAuth}
                />

                {allItems.length === 0 && !handleCart.isLoading ? (
                    <EmptyCartV3 />
                ) : (
                    <section className="w-full flex flex-col lg:flex-row gap-5">
                        {/* lg+ (desktop, idéntico a antes): Left = Dirección → Pago →
                            Productos → Vistos → Favoritos | Right = Resumen → Sellos →
                            Publicidad. Mobile (<lg): ambas columnas son `contents` y
                            cada bloque lleva `order-N lg:order-none` → Dirección → Pago →
                            Productos → Resumen del pedido + Sellos → Favoritos →
                            Vistos (lista <sm) → Publicidad. */}
                        <CartLeftColumn c={c} />

                        <CartRightColumn c={c} />
                    </section>
                )}
            </div>
        </div>
    );
};

export default ShoppingCartV3;
