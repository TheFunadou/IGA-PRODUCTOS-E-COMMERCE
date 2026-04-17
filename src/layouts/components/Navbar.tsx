import { Link, useNavigate } from "react-router-dom";
import { FaClock, FaTrash, FaX } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { VscThreeBars } from "react-icons/vsc";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../modules/auth/states/authStore";
import { useFetchSearchProductVersions } from "../../modules/products/hooks/useFetchProductVersionCards";
import useDebounceInputString from "../../modules/products/hooks/useDebounce";
import { useOutsideSearchClick } from "../../modules/products/hooks/useOutsideSearchClick";
import { makeSlug } from "../../modules/products/Helpers";
import { useSearchHistoryStore } from "../states/searchCachedStore";
import ThemeController from "../../modules/home/components/ThemeController";
import ShopMenuPreview from "./ShopMenuPreview";
import IgaLogo from "../../assets/logo/IGA-LOGO.webp";
import { useTriggerAlert } from "../../modules/alerts/states/TriggerAlert";
import { useHandleShoppingCart } from "../../modules/shopping/hooks/handleShoppingCart";

interface MainNavbarProps {
    onOpenMobileMenu: () => void;
    onLogout: () => Promise<void>;
    logoutLoading: boolean;
}

const Navbar = ({ onOpenMobileMenu, onLogout, logoutLoading }: MainNavbarProps) => {
    const { searches: searchHistory, addSearch, clearSearches } = useSearchHistoryStore();
    const [isInputSearchActive, setIsInputSearchActive] = useState(false);
    const [inputSearch, setInputSearch] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showShopMenuPreview, setShowShopMenuPreview] = useState(false);
    const { debouncedValue, debouncedLoading } = useDebounceInputString(inputSearch, 300);
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const { data: searchedData } = useFetchSearchProductVersions(debouncedValue);
    const { isAuth, authCustomer } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    const { data } = useHandleShoppingCart({
        isAuth,
        authCustomer,
        showTriggerAlert: (type, message, options) => showTriggerAlert(type, message, options)
    });
    const hideTimeoutRef = useRef<number | null>(null);
    const navigate = useNavigate();

    useOutsideSearchClick(searchResultsRef, () => setShowSearchResults(false));

    const cancelHideTimeout = () => {
        if (hideTimeoutRef.current !== null) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    };

    const scheduleHide = () => {
        cancelHideTimeout();
        hideTimeoutRef.current = window.setTimeout(() => setShowShopMenuPreview(false), 300);
    };

    const handleMouseEnter = () => {
        cancelHideTimeout();
        setShowShopMenuPreview(true);
    };

    const handleSearchNavigate = (args: { category: string; productName: string; color: string; sku: string }) => {
        addSearch(args.productName.toUpperCase());
        navigate(`/tienda/${args.category.toLowerCase()}/${makeSlug(args.productName)}/${args.sku.toLowerCase()}`);
    };

    const onMouseDownSearchHistory = (args: { e: React.MouseEvent; search: string }) => {
        args.e.preventDefault();
        setInputSearch(args.search);
        setShowSearchResults(true);
    };

    const onClearSearchHistory = (args: { e: React.MouseEvent }) => {
        args.e.preventDefault();
        clearSearches();
    };


    useEffect(() => {
        console.log(data?.shoppingCart);
    }, [data]);

    return (
        <section className="sticky top-0 z-50 w-full">
            {/* ── Barra principal ── */}
            <nav className="w-full flex items-center gap-3 px-4 py-3 md:px-8 lg:px-10 bg-blue-950 text-white">
                {/* Logo */}
                <button type="button" className="flex-shrink-0 w-28 md:w-36 lg:w-40 cursor-pointer" onClick={() => navigate("/")}>
                    <img src={IgaLogo} alt="IGA Productos Logo" className="w-full object-contain" />
                </button>
                {/* Buscador desktop */}
                <div className="hidden lg:flex flex-1 relative">
                    <div className="flex items-center w-full gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 focus-within:border-white/60 transition-colors">
                        {debouncedLoading
                            ? <span className="loading loading-dots loading-xs text-white flex-shrink-0" />
                            : <FaSearch className="text-white/50 text-sm flex-shrink-0" />
                        }
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none min-w-0"
                            placeholder="Buscar productos..."
                            value={inputSearch}
                            onChange={(e) => { setInputSearch(e.target.value); setShowSearchResults(true); }}
                            onFocus={() => setIsInputSearchActive(true)}
                            onBlur={() => setIsInputSearchActive(false)}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                        {inputSearch.length > 0 && (
                            <button
                                type="button"
                                onMouseDown={(e) => { e.preventDefault(); setInputSearch(""); setShowSearchResults(false); }}
                                className="text-white/40 hover:text-white text-xs flex-shrink-0"
                            >
                                <FaX />
                            </button>
                        )}
                    </div>
                    {/* Dropdown historial */}
                    {searchHistory.length > 0 && isInputSearchActive && inputSearch.length === 0 && (
                        <div className="absolute top-full mt-2 w-full bg-base-100 border border-base-300 rounded-xl shadow-xl z-[60] overflow-hidden" ref={searchResultsRef}>
                            <div className="flex items-center justify-between px-4 py-2 border-b border-base-200">
                                <span className="text-xs font-semibold uppercase text-base-content/40">Búsquedas recientes</span>
                                <button type="button" onMouseDown={(e) => onClearSearchHistory({ e })} className="flex items-center gap-1 text-xs text-error hover:underline">
                                    <FaTrash size={10} /> Limpiar
                                </button>
                            </div>
                            {searchHistory.map((data, index) => (
                                <button key={`${index}-${data}`} type="button" onMouseDown={(e) => onMouseDownSearchHistory({ e, search: data })} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-base-200 text-left transition-colors">
                                    <FaClock size={14} className="text-base-content/30 flex-shrink-0" />
                                    <span className="text-sm text-base-content">{data}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    {/* Dropdown resultados */}
                    {showSearchResults && searchedData && searchedData.length > 0 && (
                        <div className="absolute top-full mt-2 w-full bg-base-100 border border-base-300 rounded-xl shadow-xl z-[60] overflow-hidden" ref={searchResultsRef}>
                            {searchedData.map((data, index) => (
                                <button key={`${index}-${data.sku}`} type="button" onClick={() => handleSearchNavigate({ category: data.category, productName: data.product_name, color: data.color, sku: data.sku })} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-base-200 text-left transition-colors">
                                    <FaSearch className="text-primary text-xs flex-shrink-0" />
                                    <span className="text-sm text-base-content font-medium line-clamp-1">{data.product_name.toUpperCase()} — {data.color.toUpperCase()}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {/* Acciones derecha */}
                <div className="flex items-center gap-3 md:gap-4 lg:gap-6 ml-auto flex-shrink-0">
                    <ThemeController />
                    {isAuth && authCustomer && (
                        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
                            <Link to="/mis-ordenes" className="hover:text-white/70 transition-colors whitespace-nowrap">Mis órdenes</Link>
                            <Link to="/mis-favoritos" className="hover:text-white/70 transition-colors whitespace-nowrap">Mis favoritos</Link>
                            <div className="dropdown dropdown-end cursor-pointer">
                                <div tabIndex={0} role="button" className="border border-white/40 hover:border-white px-3 py-1 rounded-xl text-sm text-center transition-colors whitespace-nowrap max-w-[160px] truncate">
                                    {authCustomer.name.toUpperCase()} {authCustomer.last_name.toUpperCase()}
                                </div>
                                <ul tabIndex={-1} className="dropdown-content menu bg-base-100 text-base-content w-64 rounded-2xl z-[70] mt-3 p-3 shadow-2xl border border-base-200 flex flex-col gap-1">
                                    <li><Link to="/mi-cuenta/informacion-personal" className="px-3 py-2 rounded-xl hover:bg-base-200 text-sm transition-colors">Mi información personal</Link></li>
                                    <li><Link to="/mi-cuenta/direcciones-de-envio" className="px-3 py-2 rounded-xl hover:bg-base-200 text-sm transition-colors">Mis direcciones de envío</Link></li>
                                    <div className="border-t border-base-200 mt-1 pt-1">
                                        <button type="button" className="w-full flex items-center justify-center gap-2 bg-blue-950 hover:bg-blue-900 text-white text-sm px-3 py-2 rounded-xl transition-colors" onClick={onLogout}>
                                            {logoutLoading ? <span className="loading loading-dots loading-xs" /> : <><IoLogOutOutline className="text-lg" /> Cerrar sesión</>}
                                        </button>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    )}
                    {isAuth === false && (
                        <Link to="/iniciar-sesion" className="hidden md:block text-sm border border-white/40 hover:border-white px-3 py-1 rounded-xl transition-colors whitespace-nowrap">
                            Iniciar sesión
                        </Link>
                    )}
                    <Link to="/carrito-de-compras" className="relative flex-shrink-0">
                        <MdOutlineShoppingCart className="text-2xl md:text-3xl" />
                        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                            {data && data.shoppingCart.length}
                        </span>
                    </Link>
                    <button type="button" className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-white/10 transition-colors flex-shrink-0" onClick={onOpenMobileMenu} aria-label="Abrir menú">
                        <VscThreeBars className="text-2xl" />
                    </button>
                </div>
            </nav>
            {/* ── Barra secundaria desktop ── */}
            <div className="hidden lg:flex w-full items-center justify-between bg-blue-950 border-t border-white/10 px-10 py-2 text-white text-sm font-semibold">
                <div className="flex items-center gap-8">
                    <Link to="/" className="hover:text-white/70 transition-colors">Inicio</Link>
                    <div onMouseEnter={handleMouseEnter} onMouseLeave={scheduleHide} className="relative flex items-center h-full">
                        <Link to="/tienda" className="hover:text-white/70 transition-colors">Tienda</Link>
                        {showShopMenuPreview && <ShopMenuPreview onScheduleHide={scheduleHide} />}
                    </div>
                    <Link to="/acerca-de-iga" className="hover:text-white/70 transition-colors">Acerca de IGA</Link>
                    <Link to="/certificaciones" className="hover:text-white/70 transition-colors">Cumplimientos normativos</Link>
                    <Link to="/cobertura" className="hover:text-white/70 transition-colors">Cobertura</Link>
                    <Link to="/contacto" className="hover:text-white/70 transition-colors">Contacto</Link>
                    <Link to="/distribuidores" className="hover:text-white/70 transition-colors">Distribuidores</Link>
                </div>
                <a href="tel:9222158300" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white text-xs transition-colors whitespace-nowrap">
                    ¿Tienes dudas? Llámanos al 921 215 8300 | 01
                </a>
            </div>
            {/* ── Barra mobile: buscador ── */}
            <div className="lg:hidden w-full bg-blue-950 border-t border-white/10 px-4 py-2.5 relative">
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 focus-within:border-white/50 transition-colors">
                    {debouncedLoading
                        ? <span className="loading loading-dots loading-xs text-white flex-shrink-0" />
                        : <FaSearch className="text-white/50 text-sm flex-shrink-0" />
                    }
                    <input
                        type="text"
                        className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none min-w-0 font-normal"
                        placeholder="Buscar productos..."
                        value={inputSearch}
                        onChange={(e) => { setInputSearch(e.target.value); setShowSearchResults(true); }}
                        onFocus={() => setIsInputSearchActive(true)}
                        onBlur={() => setIsInputSearchActive(false)}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                    {inputSearch.length > 0 && (
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); setInputSearch(""); setShowSearchResults(false); }} className="text-white/40 hover:text-white text-xs flex-shrink-0 p-1">✕</button>
                    )}
                </div>
                {showSearchResults && searchedData && searchedData.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mx-4 bg-base-100 border border-base-300 rounded-xl shadow-xl z-[60] overflow-hidden" ref={searchResultsRef}>
                        {searchedData.map((data, index) => (
                            <button key={`${index}-${data.sku}`} type="button" onClick={() => navigate(`/tienda/${data.category.toLowerCase()}/${makeSlug(data.product_name)}/${data.sku.toLowerCase()}`)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-200 text-left transition-colors border-b border-base-100 last:border-0">
                                <FaSearch className="text-primary text-xs flex-shrink-0" />
                                <span className="text-sm text-base-content font-medium line-clamp-1">{data.product_name} — {data.color}</span>
                            </button>
                        ))}
                    </div>
                )}
                {searchHistory.length > 0 && isInputSearchActive && inputSearch.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mx-4 bg-base-100 border border-base-300 rounded-xl shadow-xl z-[60] overflow-hidden" ref={searchResultsRef}>
                        <div className="flex items-center justify-between px-4 py-2 border-b border-base-200">
                            <span className="text-xs font-semibold uppercase text-base-content/40">Recientes</span>
                            <button type="button" onMouseDown={(e) => onClearSearchHistory({ e })} className="flex items-center gap-1 text-xs text-error hover:underline">
                                <FaTrash size={10} /> Limpiar
                            </button>
                        </div>
                        {searchHistory.map((data, index) => (
                            <button key={`${index}-${data}`} type="button" onMouseDown={(e) => onMouseDownSearchHistory({ e, search: data })} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-200 text-left transition-colors">
                                <FaClock size={14} className="text-base-content/30 flex-shrink-0" />
                                <span className="text-sm text-base-content">{data}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Navbar;