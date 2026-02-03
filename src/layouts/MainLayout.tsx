import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../modules/auth/states/authStore";
import { FaFacebook, FaWhatsapp } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useFetchSearchProductVersions } from "../modules/products/hooks/useFetchProductVersionCards";
import useDebounceInputString from "../modules/products/hooks/useDebounce";
import { useRef } from "react";
import { useOutsideSearchClick } from "../modules/products/hooks/useOutsideSearchClick";
import { makeSlug } from "../modules/products/Helpers";
import { useShoppingCartStore } from "../modules/shopping/states/shoppingCartStore";
import { IoArrowUp, IoLogOutOutline } from "react-icons/io5";
import { VscThreeBars } from "react-icons/vsc";
import DrawerSubMenu from "../modules/home/components/DrawerSubMenu";
import ShopMenuPreview from "./components/ShopMenuPreview";
import ThemeController from "../modules/home/components/ThemeController";
import { useThemeStore } from "./states/themeStore";
import clsx from "clsx";
import { useShoppingCart } from "../modules/shopping/hooks/useShoppingCart";
import { useSearchHistoryStore } from "./states/searchCachedStore";
import { Clock8, Trash } from "lucide-react";

const MainLayout = () => {
    const { theme } = useThemeStore();
    const { searches: searchHistory, addSearch, clearSearches } = useSearchHistoryStore();
    const [isInputSearchActive, setIsInputSearchActive] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [inputSearch, setInputSearch] = useState<string>("");
    const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
    const [showMobileSubmenu, setShowMobileSubmenu] = useState<boolean>(false);
    const { debouncedValue, debouncedLoading } = useDebounceInputString(inputSearch, 300);
    const { shoppingCart: authShoppingCart } = useShoppingCart();
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const { data: searchedData } = useFetchSearchProductVersions(debouncedValue);
    const { isAuth, logout, getProfile, authCustomer } = useAuthStore();
    const { items: localShoppingCart } = useShoppingCartStore();
    const [showShopMenuPreview, setShowShopMenuPreview] = useState<boolean>(false);
    const hideTimeoutRef = useRef<number | null>(null);
    const navigate = useNavigate();
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

    const cancelHideTimeout = () => {
        if (hideTimeoutRef.current !== null) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    };

    const scheduleHide = () => {
        cancelHideTimeout(); // Cancela cualquier timeout pendiente
        hideTimeoutRef.current = window.setTimeout(() => {
            setShowShopMenuPreview(false);
        }, 300); // 1 segundo de delay
    };

    const handleMouseEnter = () => {
        cancelHideTimeout(); // Cancela el cierre programado
        setShowShopMenuPreview(true);
    };


    const handleSearchNavigate = (args: { category: string, productName: string, color: string, sku: string }) => {
        addSearch(`${args.productName.toUpperCase()}`);
        navigate(`/tienda/${args.category.toLowerCase()}/${makeSlug(args.productName)}/${args.sku.toLowerCase()}`)
    };

    const onMouseDownSearchHistory = (args: { e: React.MouseEvent, search: string }) => {
        args.e.preventDefault();
        setInputSearch(args.search);
        setShowSearchResults(true);
    };

    const onClearSearchHistory = (args: { e: React.MouseEvent }) => {
        args.e.preventDefault();
        clearSearches();
    };

    // load customer profile
    useEffect(() => {
        const loadCustomerData = async () => { await getProfile(); }
        if (isAuth && !authCustomer) loadCustomerData;
    }, []);

    // Close the search container when the location changed
    useEffect(() => { setShowSearchResults(false); setInputSearch(""); }, [location.pathname]);


    return (
        <div className="w-full relative" id="top">
            <nav className="w-full flex p-5 lg:px-10 md:py-5 xl:px-10 xl:py-5 bg-blue-950 text-white text-sm lg:text-base">
                <div className=" w-50/100 md:w-65/100 xl:w-65/100 flex gap-1 md:gap-3 items-center">
                    <figure className=" md:w-45/100 lg:w-35/100 xl:w-1/5 cursor-pointer" onClick={() => navigate("/")}>
                        <img src={IGA_LOGO} alt="IGA Prodcutos Logo" />
                    </figure>
                    <div className="hidden md:block md:w-55/100 lg:w-65/100 xl:w-3/4 relative">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className={clsx("xl:w-95/100 input rounded-xl focus:outline-white focus:outline-1", theme === "ligth" ? "bg-white text-black" : "bg-slate-950 border border-white text-white")}
                                placeholder="Buscar productos"
                                onChange={(e) => { setInputSearch(e.target.value); setShowSearchResults(true) }}
                                onFocus={() => setIsInputSearchActive(true)}
                                onBlur={() => setIsInputSearchActive(false)}
                                value={inputSearch}
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                            {debouncedLoading ? <span className="loading loading-dots loading-xs"></span>
                                : (<FaSearch className="text-xl" />)}
                        </div>
                        {searchHistory.length > 0 && isInputSearchActive && inputSearch.length === 0 && (
                            <div className={clsx("w-95/100 flex flex-col absolute top-12 border border-gray-300 py-5 rounded-xl z-1", theme === "ligth" ? "bg-white text-black" : "bg-slate-950 border border-white text-white")} ref={searchResultsRef}>
                                <button type="button" onMouseDown={(e) => onClearSearchHistory({ e })} className="cursor-pointer">
                                    <p className="flex items-center justify-end gap-2 px-5 py-1 text-sm underline text-primary"><Trash size={15} className="text-primary" />Eliminar historial</p>
                                </button>
                                {searchHistory.map((data, index) => (
                                    <button
                                        key={`${index}-${data}`}
                                        type="button"
                                        onMouseDown={(e) => onMouseDownSearchHistory({ e, search: data })}
                                    >
                                        <p className="flex items-center gap-2 hover:bg-base-300 py-2 px-5 text-sm cursor-pointer"><Clock8 size={20} className="text-gray-500" /><strong>{data}</strong></p>
                                    </button>
                                ))}
                            </div>
                        )}
                        {showSearchResults && searchedData && searchedData.length > 0 &&
                            <div className={clsx("w-95/100 flex flex-col absolute top-12 border border-gray-300 py-5 rounded-xl z-1", theme === "ligth" ? "bg-white text-black" : "bg-slate-950 border border-white text-white")} ref={searchResultsRef}>
                                {searchedData && searchedData.map((data, index) => (
                                    <button
                                        key={`${index}-${data.sku}`}
                                        type="button"
                                        onClick={() => handleSearchNavigate({ category: data.category, productName: data.product_name, color: data.color, sku: data.sku })}>
                                        <p className="flex items-center hover:bg-base-300 py-2 px-5 text-sm cursor-pointer"><FaSearch className="mr-2 text-primary" /><strong>{`${data.product_name.toUpperCase()} COLOR ${data.color.toUpperCase()}`}</strong></p>
                                    </button>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                <div className=" w-50/100 md:w-35/100 xl:w-35/100 flex gap-5 xl:gap-10 items-center justify-end">
                    <ThemeController />
                    {isAuth && authCustomer &&
                        <div className="flex md:gap-5 lg:gap-10 items-center justify-end"                        >
                            <Link to={"/mis-compras"}>Mis compras</Link>
                            <Link to={"/mis-favoritos"}>Mis favoritos</Link>
                            <div className="dropdown dropdown-center cursor-pointer" >
                                <div tabIndex={0} role="button" className="border border-white px-5 py-1 text-center rounded-xl focus:bg-white focus:text-black">{`${authCustomer.name.toUpperCase()} ${authCustomer.last_name.toUpperCase()}`}</div>
                                <ul tabIndex={-1} className=" dropdown-content menu bg-base-100 w-65 text-black text-base flex flex-col items-center gap-5 rounded-box z-1 mt-7 px-2 py-5 shadow-xl">
                                    <li><Link to={"/mi-cuenta/informacion-personal"}>Mi información personal</Link></li>
                                    <li><Link to={"/mi-cuenta/direcciones-de-envio"}>Mis direcciones de envio</Link></li>
                                    <button type="button" className="w-full border rounded-xl cursor-pointer bg-blue-950 p-2 text-white" onClick={handleLogout}>{loading ? ("Cargando ...") : (<p className="flex items-center gap-1 justify-center"><IoLogOutOutline className="text-2xl" />Cerrar sesión</p>)}</button>
                                </ul>
                            </div>
                        </div>
                    }

                    {isAuth === false && <Link to="/iniciar-sesion" className="hidden md:block text-sm border md:text-base lg:text-lg p-1 md:px-2 rounded-xl">Iniciar Sesión</Link>}
                    <Link to={"/carrito-de-compras"}><p className="flex gap-1"><MdOutlineShoppingCart className="text-2xl md:text-3xl" /><span className="px-2 md:px-3 flex items-center justify-center rounded-full bg-red-500 font-bold">{isAuth ? authShoppingCart.length : localShoppingCart.length}</span></p></Link>
                </div>
            </nav>
            <div className="w-full flex bg-blue-950 px-5 lg:px-10 xl:px-10 flex-col lg:flex-row lg:gap-0 xl:gap-15 text-white font-bold lg:text-sm xl:text-lg">
                <div className="w-full relative">
                    <div className="hidden md:flex w-full justify-between lg:justify-start md:gap-6 xl:gap-15">
                        <Link to={"/"}>Inicio</Link>
                        <div
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={scheduleHide}
                            className="hidden md:flex"
                        >
                            <Link to={"/tienda"}>Tienda</Link>
                            {showShopMenuPreview && <ShopMenuPreview onScheduleHide={scheduleHide} />}
                        </div>
                        <Link to={"/acerca-de-iga"}>Acerca de IGA</Link>
                        <Link to={"/certificaciones"}>Cumplimientos normativos</Link>
                        <Link to={"/cobertura"}>Cobertura</Link>
                        <Link to={"/contacto"}>Contacto</Link>
                        <Link to={"/distribuidores"}>Distribuidores</Link>
                    </div>
                    <div className="w-full hidden md:block text-right">
                        <a href="tel:9222158300" target="_blank">¿Tienes dudas? Llamanos al 921 215 8300| 01</a>
                    </div>
                </div>
                <div className="w-full md:hidden relative flex gap-2">
                    <button type="button" onClick={() => setShowMobileSubmenu(true)} className="w-10/100"><VscThreeBars className="text-3xl" /></button>
                    <div className="w-90/100 flex items-center justify-between">
                        <input type="text"
                            className="w-90/100 bg-base-100 rounded-md text-black font-normal p-1 text-xs md:text-base"
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
                        <div className="w-full flex flex-col absolute top-10 border border-gray-300 py-5 bg-white rounded-xl z-1" ref={searchResultsRef}>
                            {/* Este si detecta el clic en el button */}
                            {searchedData && searchedData.map((data, index) => (
                                <button
                                    key={`${index}-${data.sku}`}
                                    type="button"
                                    onClick={() => navigate(`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name)}/${data.sku.toLowerCase()}`)}>
                                    <p className=" text-black flex items-center hover:bg-base-300 py-1 px-5 text-sm"><FaSearch className="mr-2 text-primary" /><strong>{`${data.product_name} Color ${data.color}`}</strong></p>
                                </button>
                            ))}
                        </div>
                    }

                </div>
            </div>

            <main className={`w-full px-2 lg:px-10 xl:px-10 pt-5 pb-10 bg-base-300 bg-gradient-to-t from-bg-base-300 to-blue-950 bg-[length:100%_500px] bg-no-repeat`}>
                <Outlet />
            </main>
            <div className="w-full bg-blue-900 text-center text-white py-3 flex items-center justify-center"><a href="#top" className="flex gap-2 text-xl items-center">Ir al inicio<IoArrowUp /></a></div>
            <footer className="w-full bg-blue-950 px-5 py-10 text-white">
                <div className="hidden md:flex w-full items-start justify-center gap-10 xl:gap-20 [&_ul]:mt-2 [&_li]:list-disc [&_li]:ml-2">
                    <div>
                        <p className="text-3xl font-bold">Conocenos</p>
                        <ul className="flex flex-col gap-5">
                            <li><Link to={"/acerca-de-iga"}>Acerca de Nosotros</Link></li>
                            <li><Link to={"/contacto"}>Contacto</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">FAQ´s</p>
                        <ul className="flex flex-col gap-5">
                            <li><a href="mailto:atencionacliente@igaproductos.com.mx" type="email" target="_blank">Soporte a compras</a></li>
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
                    <figure className="w-50/100 md:w-20/100">
                        <img src={PLASTICOS_DEL_GOLFO_LOGO} alt="Logo Plasticos del Golfo Sur" />
                    </figure>

                    <div className="w-50/100 md:w-60/100 text-sm md:text-base flex flex-col text-center ">
                        <p>Condiciones de uso</p>
                        <p>2025@ Todos los Derechos Reservados</p>
                    </div>

                    <div className="hidden base:flex w-20/100 flex-col text-center ">
                        <p className="font-bold">Redes sociales</p>
                        <div className="w-full flex justify-center items-center gap-3">
                            <a href="https://www.facebook.com/Cascos.Iga" target="_blank"><FaFacebook className="text-5xl hover:scale-110 duration-250" /></a>
                            <a href="https://www.instagram.com/iga_cascos/" target="_blank"><FaInstagramSquare className="text-5xl hover:scale-110 duration-250" /></a>
                            <a href="https://x.com/iga_productos?s=20" target="_blank"><FaSquareXTwitter className="text-5xl hover:scale-110 duration-250" /></a>
                        </div>
                    </div>
                </div>
            </footer>
            <DrawerSubMenu onClose={() => setShowMobileSubmenu(false)} isOpen={showMobileSubmenu} />
            <div className="hidden md:block fixed bottom-5 right-5 text-5xl hover:scale-110 duration-250 bg-success rounded-full p-3 z-1000 tooltip tooltip-left" data-tip="Contactanos por whatsapp"><a href="https://api.whatsapp.com/send?phone=529211963246" target="_blank"><FaWhatsapp /></a></div>
        </div>
    );
};


export default MainLayout;