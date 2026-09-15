import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { GiMexico } from "react-icons/gi";
import { FaTruckFast } from "react-icons/fa6";
import { SlEarphones } from "react-icons/sl";
import { getWhatsAppLink } from "../../../../global/GlobalHelpers";
import { useThemeStore } from "../../../../layouts/states/themeStore";
import clsx from "clsx";
import BannerImg from "../../../../assets/home/helmetsbanner.webp"

const BANNER_WA_MESSAGE = `Hola, buen día. Vengo del sitio web de Iga Productos y necesito atención especializada. ¿Podrían asignarme a un asesor?

Espero su pronta respuesta. Saludos cordiales.`;

export const Banner1 = () => {
    const { theme } = useThemeStore();

    return (
        <div>
            <div className="bg-blue-950 flex items-center justify-center py-10 px-5 lg:px-0">
                <div className="w-full lg:w-80/100 text-white flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-5">
                    <img className="w-full max-w-md lg:max-w-none lg:w-55/100" src={BannerImg} alt="Imagen de Cascos Iga" />
                    <div className="w-full lg:w-45/100 text-center lg:text-left">
                        <h1 className="text-3xl sm:text-4xl lg:text-6xl">¿Necesitas equipar a todo tu equipo?</h1>
                        <p
                            className="text-lg lg:text-2xl mt-2"
                        >
                            Recibe atención especializada para pedidos por volumen, distribuidores y empresas.
                        </p>
                        <a
                            href={getWhatsAppLink(BANNER_WA_MESSAGE)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-warning btn-md sm:btn-lg lg:btn-xl mt-5 text-blue-950"
                        >
                            QUIERO UN CASCO IGA
                        </a>
                    </div>
                </div>
            </div>
            <div
                className="bg-base-300  flex items-center justify-center px-5 lg:px-0"
            >
                <div
                    className={clsx("w-full lg:w-80/100 font-bold text-base sm:text-lg lg:text-2xl grid grid-cols-2 lg:flex items-center py-5 gap-y-5 lg:gap-0", theme === "dark" ? "text-base-content" : "text-blue-950")}
                >
                    <div className="flex items-center gap-2 flex-1 justify-center lg:justify-start">
                        <IoShieldCheckmarkOutline className="text-4xl sm:text-5xl lg:text-6xl" />
                        <p>Cascos<br />Certificados</p>
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-center border-gray-300 lg:border-x">
                        <GiMexico className="text-5xl sm:text-6xl lg:text-7xl" />
                        <p>Fabricados<br />en México</p>
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-center border-gray-300 lg:border-r">
                        <FaTruckFast className="text-4xl sm:text-5xl lg:text-6xl" />
                        <p>Seguimiento<br />de Envios</p>
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-center lg:justify-end">
                        <SlEarphones className="text-4xl sm:text-5xl lg:text-6xl" />
                        <p>Atención<br />Especializada</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner1;