import { FaCheckCircle } from "react-icons/fa";
import wallpeaper2 from "../../../../assets/hero/wallpeaperherov6.webp";
import { scrollToTienda } from "../../../shop/utils/scrollToTienda";
import { getWhatsAppLink } from "../../../../global/GlobalHelpers";
import { useMediaQuery } from "../../../../global/hooks/useMediaQuery";
import { useThemeStore } from "../../../../layouts/states/themeStore";

const HERO_QUOTE_MESSAGE = `Hola, buen día. Vengo del sitio web de Iga Productos y me interesa cotizar cascos por volumen. ¿Me podrían apoyar con una cotización?

Quedo atento a su pronta respuesta. Saludos cordiales.`;

const HeroV3Web = () => {
    const { theme } = useThemeStore();
    const quoteClass = theme === "dark" ? "text-base-content" : "text-blue-950";

    return (
        <section className="relative min-h-160 lg:min-h-140 xl:min-h-160 2xl:min-h-180 2xl:max-h-[860px] overflow-hidden">

            {/* Imagen */}
            <div className="absolute inset-0 bg-base-200">
                <img
                    src={wallpeaper2}
                    alt="Iga Productos | Cascos de Seguridad"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="h-full w-full object-cover object-right"
                />
            </div>

            {/* Degradado */}
            <div
                className="
        absolute inset-0
        bg-[linear-gradient(to_right,white_0%,white_45%,rgba(255,255,255,0.3)_55%,transparent_75%)]
    "
            />

            {/* Contenido */}
            <div className="relative z-10 flex p-6 sm:p-10 lg:p-20">
                <div className="w-full lg:w-60/100">
                    <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-8xl 2xl:text-9xl font-staatliches text-blue-950">
                        CASCOS DE SEGURIDAD <br className="hidden lg:inline" /> CERTIFICADOS PARA <br className="hidden lg:inline" /> CADA INDUSTRIA
                    </h1>

                    <div className="mt-2 md:mt-4 text-xs sm:text-lg xl:text-xl text-white md:text-blue-950 font-bold">
                        <div className="w-full lg:w-60/100">
                            <p className="underline">Compra directamente con fabricantes mexicanos.</p>
                            <p>Modelos para industria, construcción, energia y trabajos en altura.</p>
                        </div>
                        <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-5 mt-2 md:mt-8 lg:mt-10">
                            <button
                                type="button"
                                onClick={() => scrollToTienda()}
                                className="btn btn-sm md:btn-base bg-blue-950 text-white px-5 py-3 lg:p-6 xl:px-8 xl:py-7 rounded-lg hover:ring-2 hover:ring-blue-900 transition-all duration-300"
                            >
                                COMPRAR CASCOS IGA
                            </button>
                            <a
                                href={getWhatsAppLink(HERO_QUOTE_MESSAGE)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`btn btn-sm md:btn-base border px-5 py-3 lg:p-6 xl:px-8 xl:py-7 rounded-lg hover:ring-2 hover:ring-blue-900 transition-all duration-300 border-blue-950 ${quoteClass}`}
                            >
                                COTIZAR POR VOLUMÉN
                            </a>
                        </div>
                        <div className="mt-8 lg:mt-10 flex flex-wrap gap-x-5 gap-y-2 lg:gap-5 text-xs md:text-base xl:text-lg text-white md:text-blue-950">
                            <div className="flex items-center justify-center gap-2">
                                <FaCheckCircle className="text-blue-950" />
                                <p>Fabricación Mexicana</p>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <FaCheckCircle className="text-blue-950" />
                                <p>Envios Nacionales</p>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <FaCheckCircle className="text-blue-950" />
                                <p>Facturación</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Espacio equivalente al lado derecho */}
                <div className="hidden lg:block lg:w-40/100" />
            </div>
        </section>
    );
};

const HeroV3Mobile = () => {
    const { theme } = useThemeStore();
    const quoteClass = theme === "dark" ? "text-base-content" : "text-blue-950";

    return (
        <section className="relative min-h-[80vh] overflow-hidden">
            <div className="absolute inset-0 bg-base-200">
                <img
                    src={wallpeaper2}
                    alt="Iga Productos | Cascos de Seguridad"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="h-full w-full object-cover object-right"
                />
            </div>

            <div className="absolute inset-0 bg-black/10" />

            <div className="relative z-10 flex min-h-[80vh] flex-col justify-center p-6 sm:p-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-staatliches text-white">
                    CASCOS DE SEGURIDAD CERTIFICADOS PARA CADA INDUSTRIA
                </h1>

                <div className="mt-3 md:mt-4 text-xs sm:text-lg text-white font-bold">
                    <p className="underline">Compra directamente con fabricantes mexicanos.</p>
                    <p>Modelos para industria, construcción, energia y trabajos en altura.</p>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 mt-5 md:mt-8">
                    <button
                        type="button"
                        onClick={() => scrollToTienda()}
                        className="btn btn-sm md:btn-base bg-blue-950 text-white px-5 py-3 lg:p-6 xl:px-8 xl:py-7 rounded-lg hover:ring-2 hover:ring-blue-900 transition-all duration-300"
                    >
                        COMPRAR CASCOS IGA
                    </button>
                    <a
                        href={getWhatsAppLink(HERO_QUOTE_MESSAGE)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn btn-sm md:btn-base border px-5 py-3 lg:p-6 xl:px-8 xl:py-7 rounded-lg hover:ring-2 hover:ring-blue-900 transition-all duration-300 border-blue-950 ${quoteClass}`}
                    >
                        COTIZAR POR VOLUMÉN
                    </a>
                </div>

                <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-x-5 text-xs sm:text-base text-white">
                    <div className="flex items-center gap-2">
                        <FaCheckCircle />
                        <p>Fabricación Mexicana</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCheckCircle />
                        <p>Envios Nacionales</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCheckCircle />
                        <p>Facturación</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const HeroV3 = () => {
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    if (!isDesktop) {
        return <HeroV3Mobile />;
    }

    return <HeroV3Web />;
};

export default HeroV3;
