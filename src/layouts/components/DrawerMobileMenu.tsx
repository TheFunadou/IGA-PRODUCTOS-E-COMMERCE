import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/states/authStore";
import { 
    FaBox, FaCertificate, FaCodeBranch, FaMap, FaPhone, FaShop, FaStar, FaUser, 
    FaShieldHalved, FaFileContract, FaCircleQuestion, FaFacebook, FaWhatsapp, FaBuilding, FaMapLocationDot, FaInstagram, FaXTwitter
} from "react-icons/fa6";
import { BiLogOut, BiEnvelope } from "react-icons/bi";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import { IoIosClose, IoIosMenu } from "react-icons/io";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => Promise<void>
}

const DrawerMobileMenu = ({ isOpen, onClose, onLogout }: Props) => {
    const navigate = useNavigate();
    const { isAuth, authCustomer } = useAuthStore();

    const handleNav = (route: string) => {
        navigate(route);
        onClose();
    };

    return (
        <div className="drawer z-[9999]">
            {/* Control del checkbox con React */}
            <input
                id="my-drawer-1"
                type="checkbox"
                className="drawer-toggle"
                checked={isOpen}
                onChange={onClose}
                aria-label="close sidebar"
            />

            <div className="drawer-side z-[9999]">
                <label
                    htmlFor="my-drawer-1"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                    onClick={onClose}
                ></label>

                <div className="menu p-0 w-80 min-h-full bg-base-100 text-base-content shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="sticky top-0 z-20 bg-base-100/80 backdrop-blur-md border-b border-base-300 px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <IoIosMenu className="text-primary text-xl" />
                            <h2 className="text-lg font-black uppercase tracking-tight">Menú</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="btn btn-circle btn-ghost btn-sm"
                        >
                            <IoIosClose className="text-2xl" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto w-full">
                        {/* Perfil del usuario */}
                        <div className="px-5 py-6 bg-base-200/50 border-b border-base-300">
                            {isAuth && authCustomer ? (
                                <div className="flex items-center gap-4">
                                    <div className="avatar placeholder">
                                        <div className="bg-primary text-primary-content rounded-full w-12 shadow-lg shadow-primary/20">
                                            <span className="text-xl font-bold uppercase">{authCustomer.name.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-base-content leading-tight">
                                            {`${authCustomer.name} ${authCustomer.last_name}`}
                                        </p>
                                        <p className="text-xs text-base-content/60 font-medium">Cuenta de cliente</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <p className="text-sm font-semibold text-base-content/80">
                                        Explora nuestra tienda e inicia sesión para comprar.
                                    </p>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary btn-sm rounded-xl font-bold w-fit shadow-lg shadow-primary/20"
                                        onClick={() => handleNav("/iniciar-sesion")}
                                    >
                                        <FaUser className="mr-1" /> Iniciar Sesión
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Menus usando ui daisy menu */}
                        <ul className="menu menu-md px-4 py-6 w-full text-base-content gap-1 [&_li>a]:rounded-xl [&_li>a]:py-3 [&_details>summary]:rounded-xl [&_details>summary]:py-3 font-bold">
                            
                            <li><a onClick={() => handleNav("/")}><FaHome className="text-base-content/50 text-lg" /> Inicio</a></li>
                            <li><a onClick={() => handleNav("/tienda")}><FaShop className="text-primary text-lg" /> Tienda</a></li>
                            
                            {isAuth && authCustomer && (
                                <>
                                    <div className="divider my-2 text-xs font-black text-base-content/30 uppercase tracking-widest text-left items-start before:h-[1px] after:h-[1px]">Mi Cuenta</div>
                                    <li><a onClick={() => handleNav("/mi-cuenta/informacion-personal")}><FaUser className="text-base-content/50" /> Mi perfil</a></li>
                                    <li><a onClick={() => handleNav("/mi-cuenta/direcciones-de-envio")}><FaMap className="text-base-content/50" /> Direcciones de envío</a></li>
                                    <li><a onClick={() => handleNav("/mis-ordenes")}><FaBox className="text-base-content/50" /> Mis órdenes</a></li>
                                    <li><a onClick={() => handleNav("/mis-favoritos")}><FaStar className="text-warning" /> Mis favoritos</a></li>
                                </>
                            )}

                            <div className="divider my-2 text-xs font-black text-base-content/30 uppercase tracking-widest text-left items-start before:h-[1px] after:h-[1px]">Empresa</div>
                            
                            <li>
                                <details>
                                    <summary><FaBuilding className="text-base-content/50" /> Nosotros</summary>
                                    <ul className="ml-5 border-l-2 border-base-200 mt-2 mb-2 gap-1 font-semibold text-sm">
                                        <li><a onClick={() => handleNav("/acerca-de-iga")}><FaInfoCircle className="text-xs opacity-50" /> Acerca de IGA</a></li>
                                        <li><a onClick={() => handleNav("/certificaciones")}><FaCertificate className="text-xs opacity-50" /> Certificaciones</a></li>
                                        <li><a onClick={() => handleNav("/cobertura")}><FaMapLocationDot className="text-xs opacity-50" /> Cobertura</a></li>
                                        <li><a onClick={() => handleNav("/distribuidores")}><FaCodeBranch className="text-xs opacity-50" /> Distribuidores</a></li>
                                    </ul>
                                </details>
                            </li>

                            <li>
                                <details>
                                    <summary><FaCircleQuestion className="text-base-content/50" /> Ayuda & Legal</summary>
                                    <ul className="ml-5 border-l-2 border-base-200 mt-2 mb-2 gap-1 font-semibold text-sm">
                                        <li><a onClick={() => handleNav("/contacto")}><FaPhone className="text-xs opacity-50" /> Contacto</a></li>
                                        <li><a onClick={() => handleNav("/preguntas-frecuentes")}><FaCircleQuestion className="text-xs opacity-50" /> Preguntas frecuentes</a></li>
                                        <li><a href="mailto:atencionacliente@igaproductos.com.mx" target="_blank"><BiEnvelope className="text-xs opacity-50" /> Soporte a compras</a></li>
                                        <li><a href="https://api.whatsapp.com/send?phone=529211963246" target="_blank"><FaWhatsapp className="text-xs text-success" /> Contacta a un experto</a></li>
                                        <div className="divider my-1 opacity-20"></div>
                                        <li><a onClick={() => handleNav("/politica-de-privacidad")}><FaShieldHalved className="text-xs opacity-50" /> Política de privacidad</a></li>
                                        <li><a onClick={() => handleNav("/politica-de-devolucion")}><FaBox className="text-xs opacity-50" /> Política de devolución</a></li>
                                        <li><a onClick={() => handleNav("/terminos-y-condiciones")}><FaFileContract className="text-xs opacity-50" /> Términos y condiciones</a></li>
                                    </ul>
                                </details>
                            </li>
                        </ul>

                        <div className="px-6 pb-8 mt-2">
                            <p className="text-xs font-black text-base-content/30 uppercase tracking-widest mb-3">Redes Sociales</p>
                            <div className="flex gap-4">
                                <a href="https://www.facebook.com/Cascos.Iga" target="_blank" className="btn btn-circle btn-sm btn-ghost bg-base-200 hover:bg-[#1877F2] hover:text-white transition-colors">
                                    <FaFacebook className="text-lg" />
                                </a>
                                <a href="https://www.instagram.com/iga_cascos/" target="_blank" className="btn btn-circle btn-sm btn-ghost bg-base-200 hover:bg-[#E1306C] hover:text-white transition-colors">
                                    <FaInstagram className="text-lg" />
                                </a>
                                <a href="https://x.com/iga_productos?s=20" target="_blank" className="btn btn-circle btn-sm btn-ghost bg-base-200 hover:bg-black hover:text-white transition-colors">
                                    <FaXTwitter className="text-lg" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer del Drawer */}
                    {isAuth && (
                        <div className="sticky bottom-0 bg-base-100 p-4 border-t border-base-300 z-10">
                            <button 
                                type="button" 
                                className="btn btn-error btn-outline w-full rounded-2xl h-12 font-bold" 
                                onClick={onLogout}
                            >
                                <BiLogOut className="text-xl" /> Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DrawerMobileMenu;
