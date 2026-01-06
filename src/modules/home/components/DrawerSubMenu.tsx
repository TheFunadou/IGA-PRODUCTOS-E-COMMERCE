import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

const DrawerSubMenu = ({ isOpen, onClose }: Props) => {
    const navigate = useNavigate();

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
                        <p className="text-2xl text-white font-medium">Submenu</p>
                        <button type="button" onClick={onClose}><X className="text-white border rounded-xl" /></button>
                    </div>
                    <div className="mt-5 flex flex-col gap-5 text-lg text-white">
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
