import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import { useThemeStore } from "../../../layouts/states/themeStore";

type Props = {
    className?: string
}

const CategoriesCarousel = ({ className }: Props) => {
    const { theme } = useThemeStore();
    const navigate = useNavigate();

    return (
        <div className={`w-full ${className}`}>
            <Carousel>
                <div className="flex gap-10 items-center">
                    <div className={`w-100 h-110  px-2 pt-2 pb-5 shadow-lg rounded-xl flex-shrink-0 ${theme === "ligth" ? "bg-white" : "bg-gray-950"}`}>
                        <div className="w-full h-full">
                            <div className="w-full h-45/100 flex gap-2">
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/cascos/iga-casco-de-seguridad-industrial-tipo-plagosur-c-intervalo-clase-e/cas1-ai1-008")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2024/07/plagosur_beige_AI_03-1.jpg"
                                        alt="Casco 1"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/cascos/iga-casco-de-seguridad-industrial-tipo-coraza-a-dielectrico/cas2-am1-002")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2024/07/Amarillo_003.jpg"
                                        alt="Casco 1"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <div className="w-full h-45/100 flex gap-2 mt-2">
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/cascos/iga-casco-de-seguridad-industrial-tipo-plagosur-c-intervalo-clase-e/cas1-ai1-001")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2024/07/IMG_7697-copia-1-e1722380357898.jpg"
                                        alt="Casco 1"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/cascos/iga-casco-de-seguridad-industrial-tipo-plagosur-c-intervalo-clase-e/cas1-ai1-007")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2024/07/plagosur_verde_AM_02-1.jpg"
                                        alt="Casco 1"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <p className="text-center text-2xl mt-2 font-semibold cursor-pointer hover:underline hover:text-primary" onClick={() => navigate("/tienda")}>Cascos</p>
                        </div>
                    </div>
                    <div className={`w-100 h-110  px-2 pt-2 pb-5 shadow-lg rounded-xl flex-shrink-0 ${theme === "ligth" ? "bg-white" : "bg-gray-950"}`}>
                        <div className="w-full h-full">
                            <div className="w-full h-45/100 flex gap-2">
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/barboquejos/iga-barboquejo-para-casco-sin-mentonera/bar-001-001")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2025/10/001-scaled.jpg"
                                        alt="Baboquejo sin mentonera"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/barboquejos/iga-barboquejo-para-cascos-con-mentonera/bar-001-002")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2025/10/009-scaled.jpg"
                                        alt="Barboquejo con mentonera"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <div className="w-full h-45/100 flex gap-2 mt-2">
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/barboquejos/iga-barboquejo-para-casco-de-cuatro-puntos/bar-001-003")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2025/10/010-scaled.jpg"
                                        alt="Barboquejo para casco de cuatro puntos"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/suspensiones/iga-suspension-para-cascos-de-ajuste-de-intervalo-de-cuatro-puntos/sus-ai2-001")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2025/10/banda01.jpg"
                                        alt="Barboque banda antisudor"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <p className="text-center text-2xl mt-2 font-semibold cursor-pointer hover:underline hover:text-primary" onClick={() => navigate("/tienda")}>Barboquejos</p>
                        </div>
                    </div>
                    <div className={`w-100 h-110  px-2 pt-2 pb-5 shadow-lg rounded-xl flex-shrink-0 ${theme === "ligth" ? "bg-white" : "bg-gray-950"}`}>
                        <div className="w-full h-full">
                            <div className="w-full h-45/100 flex gap-2">
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/suspensiones/iga-suspension-para-cascos-de-ajuste-de-intervalo-de-cuatro-puntos/sus-ai2-001")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2024/06/WhatsApp-Image-2024-07-04-at-5.46.15-PM-3.jpeg"
                                        alt="Suspension de ajuste de intervalo de cuatro puntos"
                                        loading="lazy"

                                    />
                                </div>
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/suspensiones/iga-suspension-para-casco-de-ajuste-de-intervalo-de-seis-puntos/sus-ai1-001")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2024/06/INTER-002.jpg"
                                        alt="Suspension de ajuste de intervalo de seis puntos"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <div className="w-full h-45/100 flex gap-2 mt-2">
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/barboquejos/iga-barboquejo-para-casco-de-cuatro-puntos/bar-001-003")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2024/06/WhatsApp-Image-2024-07-04-at-5.46.15-PM-2.jpeg"
                                        alt="Suspension de ajuste de matraca de cuatro puntos"
                                        loading="lazy"

                                    />
                                </div>
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/suspensiones/iga-suspension-para-cascos-de-ajuste-de-intervalo-de-cuatro-puntos/sus-ai2-001")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2024/06/WhatsApp-Image-2024-07-04-at-5.46.15-PM.jpeg"
                                        alt="Suspension de ajuste de matraca de seis puntos"
                                        loading="lazy"

                                    />
                                </div>
                            </div>
                            <p className="text-center text-2xl mt-2 font-semibold cursor-pointer hover:underline hover:text-primary" onClick={() => navigate("/tienda")}>Suspensiones</p>
                        </div>
                    </div>
                    <div className={`w-100 h-110  px-2 pt-2 pb-5 shadow-lg rounded-xl flex-shrink-0 ${theme === "ligth" ? "bg-white" : "bg-gray-950"}`}>
                        <div className="w-full h-full">
                            <div className="w-full h-45/100 flex gap-2">
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/lentes/iga-lente-de-seguridad-tipo-medical-de-mica-polarizada/len3-001-003")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2024/07/MEDICA_P_01-1.jpg"
                                        alt="Lente de seguridad tipo medical de mica polarizada"
                                        loading="lazy"

                                    />
                                </div>
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/lentes/iga-lente-de-seguridad-tipo-artico-de-mica-polarizada/len3-003-005")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2024/07/ARTICO_02.jpg"
                                        alt="Lente de seguridad tipo artico de mica polarizada"
                                        loading="lazy"

                                    />
                                </div>
                            </div>
                            <div className="w-full h-45/100 flex gap-2 mt-2">
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/lentes/iga-lente-de-seguridad-tipo-artico-de-mica-transparente/len3-001-002")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2024/07/ARTICO_04.jpg"
                                        alt="Lente de seguridad tipo artico de mica transparente"
                                        loading="lazy"

                                    />
                                </div>
                                <div className="w-50/100 border border-gray-100 rounded-xl cursor-pointer" onClick={() => navigate("/tienda/lentes/iga-lente-de-seguridad-tipo-artico-de-mica-transparente/len3-001-002")}>
                                    <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src="https://igaproductos.com.mx/wp-content/uploads/2024/07/ARTICO_06.jpg"
                                        alt="Lente de seguridad tipo artico de mica transparente"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <p className="text-center text-2xl mt-2 font-semibold cursor-pointer hover:underline hover:text-primary" onClick={() => navigate("/tienda")}>Lentes</p>
                        </div>
                    </div>
                </div>
            </Carousel>
        </div>
    );
};

export default CategoriesCarousel;