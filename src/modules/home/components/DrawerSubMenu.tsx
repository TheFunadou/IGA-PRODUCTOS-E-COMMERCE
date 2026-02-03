import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/states/authStore";
import { FaX } from "react-icons/fa6";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

const DrawerSubMenu = ({ isOpen, onClose }: Props) => {
    const navigate = useNavigate();
    const { isAuth } = useAuthStore();

    const handleNav = (route: string) => {
        navigate(route);
        onClose();
    }

    return (
        <div className="drawer">
            {/* Control del checkbox con React */}
            <input
                id="my-drawer-1"
                type="checkbox"
                className="drawer-toggle"
                checked={isOpen}
                onChange={onClose} // permite cerrarlo si se hace clic fuera
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
                        <button type="button" onClick={onClose}><FaX className="text-white border rounded-xl text-xl" /></button>
                    </div>
                    <div className="mt-5 flex flex-col gap-5 text-lg text-white">
                        {!isAuth && <button type="button" className="w-fit btn border " onClick={() => handleNav("/iniciar-sesion")}>Iniciar Sesión</button>}
                        <button type="button" className="w-fit" onClick={() => handleNav("/")}>Inicio</button>
                        <button type="button" className="w-fit" onClick={() => handleNav("/tienda")}>Tienda</button>
                        <button type="button" className="w-fit" onClick={() => handleNav("/acerca-de-iga")}>Acerca de IGA</button>
                        <button type="button" className="w-fit" onClick={() => handleNav("/certificaciones")}>Certificaciones</button>
                        <button type="button" className="w-fit" onClick={() => handleNav("/cobertura")}>Cobertura</button>
                        <button type="button" className="w-fit" onClick={() => handleNav("/contacto")}>Contacto</button>
                        <button type="button" className="w-fit" onClick={() => handleNav("/distribuidores")}>Distribuidores</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DrawerSubMenu;
