import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/states/authStore";
import { FaBox, FaCertificate, FaCodeBranch, FaMap, FaPhone, FaShop, FaStar, FaUser, FaX } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import { FaHome, FaInfoCircle } from "react-icons/fa";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => Promise<void>
}

const DrawerSubMenu = ({ isOpen, onClose, onLogout }: Props) => {
    const navigate = useNavigate();
    const { isAuth, authCustomer } = useAuthStore();

    const handleNav = (route: string) => {
        navigate(route);
        onClose();
    };

    return (
        <div className="drawer">
            {/* Control del checkbox con React */}
            <input
                id="my-drawer-1"
                type="checkbox"
                className="drawer-toggle"
                checked={isOpen}
                onChange={onClose}
                aria-label="close sidebar"
            />

            <div className="h-full drawer-side">
                <label
                    htmlFor="my-drawer-1"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                    onClick={onClose}
                ></label>
                <div className="menu bg-blue-950 min-h-full w-80 p-4">
                    <div className="flex justify-between">
                        <p className="text-xl text-white font-medium">Menu</p>
                        <button type="button" onClick={onClose}><FaX className="text-white rounded-xl text-xl" /></button>
                    </div>
                    <div className="mt-5  text-lg text-white">
                        <div className="flex flex-col gap-5">
                            {isAuth && authCustomer && (
                                <h4>
                                    Bienvenido, {`${authCustomer.name.toUpperCase()} ${authCustomer.last_name.toUpperCase()}`}
                                </h4>
                            )}
                            {!isAuth && <button type="button" className="w-fit btn border " onClick={() => handleNav("/iniciar-sesion")}>Iniciar Sesión</button>}
                            <button type="button" className="w-fit icon-button" onClick={() => handleNav("/")}><FaHome className="text-white" />Inicio</button>
                            <button type="button" className="w-fit icon-button" onClick={() => handleNav("/tienda")}><FaShop />Tienda</button>
                            {isAuth && authCustomer && (
                                <div className="flex flex-col gap-5">
                                    <button type="button" className="w-fit icon-button" onClick={() => handleNav("/mi-cuenta/informacion-personal")}><FaUser className="text-white" />Mi perfil</button>
                                    <button type="button" className="w-fit icon-button" onClick={() => handleNav("/mi-cuenta/direcciones-de-envio")}><FaMap className="text-white" />Mis direcciones de envio</button>
                                    <button type="button" className="w-fit icon-button" onClick={() => handleNav("/mis-ordenes")}><FaBox className="text-white" />Mis ordenes</button>
                                    <button type="button" className="w-fit icon-button" onClick={() => handleNav("/mis-favoritos")}><FaStar className="text-white" />Mis favoritos</button>
                                </div>
                            )}
                            <button type="button" className="w-fit icon-button" onClick={() => handleNav("/acerca-de-iga")}><FaInfoCircle />Acerca de IGA</button>
                            <button type="button" className="w-fit icon-button" onClick={() => handleNav("/certificaciones")}><FaCertificate />Certificaciones</button>
                            <button type="button" className="w-fit icon-button" onClick={() => handleNav("/cobertura")}><FaMap />Cobertura</button>
                            <button type="button" className="w-fit icon-button" onClick={() => handleNav("/contacto")}><FaPhone />Contacto</button>
                            <button type="button" className="w-fit icon-button" onClick={() => handleNav("/distribuidores")}><FaCodeBranch />Distribuidores</button>
                        </div>
                        <div className="mt-10">
                            {isAuth && authCustomer && (
                                <button type="button" className="btn btn-outline w-fit flex items-center gap-2" onClick={onLogout}><BiLogOut className="text-white" />Cerrar Sesión</button>
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default DrawerSubMenu;
