import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../modules/auth/states/authStore";
import { FaFacebook } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useThemeContext } from "../modules/products/states/ThemeContext";
import { FaSearch } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useFetchSearchProductVersions } from "../modules/products/hooks/useFetchProductVersionCards";
import useDebounceInputString from "../modules/products/hooks/useDebounce";
import { useRef } from "react";
import { useOutsideSearchClick } from "../modules/products/hooks/useOutsideSearchClick";
import { makeSlug } from "../modules/products/Helpers";
import { useShoppingCartStore } from "../modules/shopping/states/shoppingCartStore";
import useDebounce from "../global/hooks/useDebounce";


const MainLayout = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [inputSearch, setInputSearch] = useState<string>("");
    const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
    const { debouncedValue, debouncedLoading } = useDebounceInputString(inputSearch, 2000);
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const { data: searchedData, isLoading: searchLoading } = useFetchSearchProductVersions(debouncedValue);
    const { isAuth, logout, getProfile, favorites, getFavorites } = useAuthStore();
    const { items } = useShoppingCartStore();
    const { theme } = useThemeContext();
    const location = useLocation();
    useOutsideSearchClick(searchResultsRef, () => setShowSearchResults(false));
    const IGA_LOGO = "https://igaproductos.com.mx/wp-content/themes/igaproductos/images/igaproductos.png";
    const PLASTICOS_DEL_GOLFO_LOGO = "https://igaproductos.com.mx/wp-content/themes/igaproductos/images/plasticos-minib.png";

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // load customer profile
    useEffect(() => {
        const loadCustomerData = async () => { await getProfile(); }
        const loadFavorites = async () => await getFavorites();
        if (!isAuth) loadCustomerData;
        if (!favorites) loadFavorites();
    }, []);

    // Close the search container when the location changed
    useEffect(() => { setShowSearchResults(false); setInputSearch(""); }, [location.pathname]);

    return (
        <div className="w-full">
            <nav className="w-full flex px-15 py-5 bg-blue-950 text-white text-base">
                <div className="w-1/2 flex gap-3">
                    <figure className="w-1/5">
                        <img src={IGA_LOGO} alt="IGA Prodcutos Logo" />
                    </figure>
                    <div className="w-3/4 relative">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className="w-95/100 input text-black rounded-xl focus:outline-white focus:outline-1"
                                placeholder="Buscar productos"
                                onChange={(e) => { setInputSearch(e.target.value); setShowSearchResults(true) }}
                                onKeyDown={(e) => {
                                    e.stopPropagation();
                                }}

                            />
                            {debouncedLoading ? <span className="loading loading-dots loading-xs"></span>
                                : (<FaSearch className="text-xl" />)}
                        </div>
                        {showSearchResults && searchedData && searchedData.length > 0 &&
                            <div className="w-full flex flex-col absolute top-12 border border-gray-300 py-5 bg-white rounded-xl z-1" ref={searchResultsRef}>
                                {searchedData && searchedData.map((data, index) => (
                                    <Link key={index} to={`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name)}/${data.sku.toLowerCase()}`}><p className=" text-black flex items-center hover:bg-base-300 py-1 px-5 text-sm"><FaSearch className="mr-2 text-primary" /><strong>{`${data.product_name} Color ${data.color}`}</strong></p></Link>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                <div className="w-1/2 flex gap-10 items-center justify-end">
                    {/* Theme controller */}

                    {isAuth &&
                        <div className="flex gap-10 items-center justify-end"                        >
                            <div className="dropdown dropdown-end">
                                <div role="button" className="text-center p-1 bg-blue-950">Español</div>
                                <ul className="dropdown-content menu bg-blue-900 rounded-box z-1 p-2 shadow-sm">
                                    <li><a>Español</a></li>
                                    <li><a>Inglés</a></li>
                                </ul>
                            </div>
                            <Link to={"/mis-compras"}>Mis compras</Link>
                            <Link to={"/mis-favoritos"}>Mis favoritos</Link>
                            <div className="dropdown dropdown-center cursor-pointer" >
                                <div tabIndex={0} role="button" className="text-center px-2 rounded-xl focus:animate-heartbeat focus:bg-white focus:px-5 focus:py-2 focus:text-black">Mi cuenta</div>
                                <ul tabIndex={-1} className="dropdown-content menu bg-white w-65 text-black text-base flex flex-col gap-5 rounded-box z-1 mt-7 px-2 py-5 shadow-xl">
                                    <li><Link to={"mi-cuenta-informacion-personal"}>Mi información personal</Link></li>
                                    <li><Link to={"/mi-cuenta/direcciones-de-envio"}>Mis direcciones de envio</Link></li>
                                    <button type="button" className="rounded-xl cursor-pointer bg-blue-950 p-2 text-white" onClick={handleLogout}>{loading ? ("Cargando ...") : ("Cerrar sesión")}</button>
                                </ul>
                            </div>
                        </div>
                    }

                    {isAuth === false && <Link to="/iniciar-sesion">Iniciar Sesión</Link>}

                    <Link to={"/carrito-de-compras"}><p className="flex gap-1"><MdOutlineShoppingCart className="text-3xl" /><span className="px-3 flex items-center justify-center rounded-full bg-red-500 font-bold">{items.length}</span></p></Link>
                </div>
            </nav>
            <div className="w-full bg-blue-900 px-15 p-2 flex gap-15 text-white font-bold">
                <div className="w-3/4 flex gap-15">
                    <Link to={"/"}>Inicio</Link>
                    <Link to={"/tienda"}>Tienda</Link>
                    <Link to={"/acerca-de-iga"}>Acerca de IGA</Link>
                    <Link to={"/certificaciones"}>Certificaciones</Link>
                    <Link to={"/cobertura"}>Cobertura</Link>
                    <Link to={"/contacto"}>Contacto</Link>
                    <Link to={"/distribuidores"}>Distribuidores</Link>
                </div>
                <div className="w-1/4 text-right">
                    <a href="tel:9222158300" target="_blank">¿Tienes dudas? Llamanos al 921 215 8300| 01</a>
                </div>

            </div>
            <main className={`w-full px-15 py-5 ${theme}`}>
                <Outlet />
            </main>
            <footer className="w-full bg-blue-950 px-15 py-10 text-white">
                <div className="w-full items-start justify-center flex gap-30 [&_ul]:mt-2 [&_li]:list-disc [&_li]:ml-2">
                    <div>
                        <p className="text-3xl font-bold">Conocenos</p>
                        <ul className="flex flex-col gap-5">
                            <li><Link to={"acerca-de-nosotros"}>Acerca de Nosotros</Link></li>
                            <li><Link to={"contacto"}>Contacto</Link></li>
                            <li><Link to={"bolsa-de-trabajo"}>Bolsa de trabajo</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">FAQ´s</p>
                        <ul className="flex flex-col gap-5">
                            <li><Link to={"#"}>Preguntas frecuentes</Link></li>
                            <li><a href="atencionacliente@igaproductos.com.mx" target="_blank">Soporte a compras</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">Legal</p>
                        <ul className="flex flex-col gap-5">
                            <li><Link to={"politica-de-privacidad"}>Politica de privacidad</Link></li>
                            <li><Link to={"politica-de-devolucion"}>Politica de devolución</Link></li>
                            <li><Link to={"distribuidores"}>Distribuidores</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">Conocenos</p>
                        <ul className="flex flex-col gap-5">
                            <li><a href="https://api.whatsapp.com/send?phone=529211963246" target="_blank">Contacta a un experto</a></li>
                        </ul>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between">
                    <figure className="w-1/6">
                        <img src={PLASTICOS_DEL_GOLFO_LOGO} alt="Logo Plasticos del Golfo Sur" />
                    </figure>

                    <div className="flex flex-col text-center">
                        <p>Condiciones de uso</p>
                        <p>2025@ Todos los Derechos Reservados</p>
                    </div>

                    <div className="flex flex-col text-center">
                        <p className="font-bold">Redes sociales</p>
                        <div className="flex items-center gap-3">
                            <FaFacebook className="text-5xl" />
                            <FaInstagramSquare className="text-5xl" />
                            <FaSquareXTwitter className="text-5xl" />
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default MainLayout;