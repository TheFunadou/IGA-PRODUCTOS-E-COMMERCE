import { Link, useNavigate } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { VscThreeBars } from "react-icons/vsc";
import { useRef, useState } from "react";
import { useAuthStore } from "../../modules/auth/states/authStore";
import { useOutsideSearchClick } from "../../modules/products/hooks/useOutsideSearchClick";
import ThemeController from "../../modules/home/components/ThemeController";
import ShopMenuPreview from "./ShopMenuPreview";
import IgaLogo from "../../assets/logo/IGA-LOGO.webp";
import { useTriggerAlert } from "../../modules/alerts/states/TriggerAlert";
import { useHandleShoppingCartV3 } from "../../modules/shopping/hooks/handleShoppingCartV3";
// ROLLBACK V2: para volver a flujo V2, cambiar import a: import { useHandleShoppingCart } from "../../modules/shopping/hooks/handleShoppingCart";
import NavbarSearch from "./NavbarSearch";
import NavbarBanner from "./NavbarBanner";

interface MainNavbarProps {
    onOpenMobileMenu: () => void;
    onLogout: () => Promise<void>;
    logoutLoading: boolean;
}

const Navbar = ({ onOpenMobileMenu, onLogout, logoutLoading }: MainNavbarProps) => {
    const [showShopMenuPreview, setShowShopMenuPreview] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { isAuth, authCustomer } = useAuthStore();
    const { showTriggerAlert } = useTriggerAlert();
    // Flujo V3 aislado (shopping-cart:load:v3) – V2 deprecado conservado para rollback
    const { data } = useHandleShoppingCartV3({
        isAuth,
        authCustomer,
        showTriggerAlert: (type, message, options) => showTriggerAlert(type, message, options)
    });
    const hideTimeoutRef = useRef<number | null>(null);
    const navigate = useNavigate();

    useOutsideSearchClick(dropdownRef, () => setIsDropdownOpen(false));

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

    // Preserve Tienda hover logic for rollback - evita noUnusedLocals
    void [ShopMenuPreview, showShopMenuPreview, handleMouseEnter, scheduleHide, hideTimeoutRef, cancelHideTimeout];

    return (
        <section className="sticky top-0 z-50 w-full">
            <NavbarBanner />
            {/* ── Barra principal ── */}
            <nav className="w-full flex items-center gap-3 px-4 py-2 md:px-8 lg:px-10 bg-blue-950 text-white border-t border-white/10">
                {/* Logo */}
                <button type="button" className="shrink-0 w-28 md:w-36 lg:w-40 cursor-pointer" onClick={() => navigate("/")}>
                    <img src={IgaLogo} alt="Iga Productos Logo" className="w-full object-contain" />
                </button>
                {/* Buscador desktop */}
                <NavbarSearch variant="desktop" />
                {/* Acciones derecha */}
                <div className="flex items-center gap-3 md:gap-4 lg:gap-6 ml-auto shrink-0">
                    <ThemeController />
                    {isAuth && authCustomer && (
                        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
                            <Link to="/mis-ordenes" className="hover:text-white/70 transition-colors whitespace-nowrap">Mis órdenes</Link>
                            <Link to="/mis-favoritos" className="hover:text-white/70 transition-colors whitespace-nowrap">Mis favoritos</Link>
                            <div ref={dropdownRef} className={`dropdown dropdown-end cursor-pointer ${isDropdownOpen ? 'dropdown-open' : ''}`}>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="border border-white/40 hover:border-white px-3 py-1 rounded-xl text-sm text-center transition-colors whitespace-nowrap max-w-40 truncate cursor-pointer"
                                >
                                    {authCustomer.name.toUpperCase()} {authCustomer.last_name.toUpperCase()}
                                </button>
                                {isDropdownOpen && (
                                    <ul className="dropdown-content menu bg-base-100 text-base-content w-64 rounded-2xl z-70 mt-3 p-3 shadow-2xl border border-base-200 flex flex-col gap-1">
                                        <li>
                                            <Link
                                                to="/mi-cuenta/informacion-personal"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="px-3 py-2 rounded-xl hover:bg-base-200 text-sm transition-colors"
                                            >
                                                Mi información personal
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/mi-cuenta/direcciones-de-envio"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="px-3 py-2 rounded-xl hover:bg-base-200 text-sm transition-colors"
                                            >
                                                Mis direcciones de envío
                                            </Link>
                                        </li>
                                        <div className="border-t border-base-200 mt-1 pt-1">
                                            <button
                                                type="button"
                                                className="w-full flex items-center justify-center gap-2 bg-blue-950 hover:bg-blue-900 text-white text-sm px-3 py-2 rounded-xl transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    onLogout();
                                                }}
                                            >
                                                {logoutLoading ? <span className="loading loading-dots loading-xs" /> : <><IoLogOutOutline className="text-lg" /> Cerrar sesión</>}
                                            </button>
                                        </div>
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                    {isAuth === false && (
                        <Link to="/iniciar-sesion" className="hidden md:block text-sm border border-white/40 hover:border-white px-3 py-1 rounded-xl transition-colors whitespace-nowrap">
                            Iniciar sesión
                        </Link>
                    )}
                    <Link to="/carrito-de-compras" className="relative shrink-0">
                        <MdOutlineShoppingCart className="text-2xl md:text-3xl" />
                        <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                            {data && data.shoppingCart.length}
                        </span>
                    </Link>
                    <button type="button" className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-white/10 transition-colors shrink-0" onClick={onOpenMobileMenu} aria-label="Abrir menú">
                        <VscThreeBars className="text-2xl" />
                    </button>
                </div>
            </nav>
            {/* ── Barra secundaria desktop ── */}
            <div className="hidden lg:flex w-full items-center justify-between bg-blue-950 border-t border-white/10 px-10 py-2 text-white text-sm font-semibold">
                <div className="flex items-center gap-8">
                    <Link to="/" className="hover:text-white/70 transition-colors">Inicio</Link>
                    {/* COMENTADO FASE V3: Tienda integrada en Home (/#tienda) */}
                    {/* ROLLBACK: Descomentar bloque siguiente para restaurar Tienda standalone */}
                    {/* <div onMouseEnter={handleMouseEnter} onMouseLeave={scheduleHide} className="relative flex items-center h-full">
                        <Link to="/tienda" className="hover:text-white/70 transition-colors">Tienda</Link>
                        {showShopMenuPreview && <ShopMenuPreview onScheduleHide={scheduleHide} />}
                    </div> */}
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
            <div className="lg:hidden w-full bg-blue-950 border-t border-white/10 px-4 py-2.5">
                <NavbarSearch variant="mobile" />
            </div>
        </section>
    );
};

export default Navbar;
