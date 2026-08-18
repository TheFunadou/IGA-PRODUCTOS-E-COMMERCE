import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag, FiChevronRight } from "react-icons/fi";

import PartnersCarousel from "../PartnersCarousel";
import HeroIMG from "../../../../assets/hero/HeroImgV2.webp";

function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        const handleChange = () => {
            setMatches(mediaQuery.matches);
        };

        handleChange();

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, [query]);

    return matches;
}

export default function HeroV2() {
    const [in_, setIn] = useState(false);
    const navigate = useNavigate();

    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        const t = setTimeout(() => setIn(true), 60);

        return () => clearTimeout(t);
    }, []);

    const enter = (d = 0) =>
    ({
        transitionDelay: `${d}s`,
        opacity: in_ ? 1 : 0,
        transform: in_ ? "none" : "translateY(20px)",
        transition:
            "opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1)",
    } as React.CSSProperties);

    const goToStore = () => navigate("/tienda");
    const goToAbout = () => navigate("/acerca-de-iga");

    const StoreButton = () => (
        <button
            onClick={goToStore}
            className={[
                "btn btn-primary flex items-center gap-2",
                "font-bold uppercase tracking-wide",
                "text-[11px] sm:text-xs",
                "rounded-md px-5 sm:px-7 py-2.5 sm:py-3",
                "transition-all duration-200",
                "hover:-translate-y-0.5 active:scale-[0.98]",
            ].join(" ")}
        >
            <FiShoppingBag size={14} />
            Explorar tienda
            <FiChevronRight size={13} />
        </button>
    );

    const AboutButton = () => (
        <button
            onClick={goToAbout}
            className={[
                "font-semibold uppercase tracking-wide",
                "rounded-md px-5 sm:px-7 py-2.5 sm:py-3",
                "text-[11px] sm:text-xs",
                "transition-all duration-200 backdrop-blur-sm",
                "hover:-translate-y-0.5 active:scale-[0.98]",
                "bg-white/90 border border-slate-300 text-slate-600 hover:bg-white",
            ].join(" ")}
        >
            Conócenos
        </button>
    );

    const HeroImage = () => (
        <img
            src={HeroIMG}
            alt="Equipo de Protección Personal IGA"
            fetchPriority="high"
            className="w-full h-auto"
        />
    );

    /* =========================================================
       MOBILE
       < md
    ========================================================= */

    if (!isDesktop) {
        return (
            <div className="w-full bg-white p-4 sm:p-8 rounded-3xl">

                {/* HEADING */}
                <div
                    className="flex gap-3"
                    style={enter(0)}
                >
                    <div className="p-1 w-px h-15 bg-primary rounded-xl shrink-0" />

                    <div>
                        <h1 className="text-xl sm:text-3xl tracking-wide text-primary font-black">
                            TU SEGURIDAD ES PRIMERO.
                        </h1>

                        <h3 className="text-blue-900 font-light text-lg sm:text-xl">
                            Cuidamos tu capital intelectual.
                        </h3>
                    </div>
                </div>

                {/* IMAGE */}
                <div
                    className="w-full mt-6 sm:mt-8"
                    style={enter(0.10)}
                >
                    <figure className="w-6/10 mx-auto">
                        <HeroImage />
                    </figure>
                </div>

                {/* TEXT + CTAs */}
                <div className="w-full mt-6 sm:mt-8">

                    <p
                        className="text-xs sm:text-base text-justify leading-relaxed"
                        style={enter(0.20)}
                    >
                        En{" "}
                        <strong className="text-primary">
                            Iga Productos ®
                        </strong>{" "}
                        llevamos mas de <strong>20 años</strong> siendo tu{" "}
                        <strong>mejor</strong> aliado protegiendote con{" "}
                        <strong>Productos</strong> de la mejor calidad
                        fabricados orgullosamente en México. Explora nuestro{" "}
                        <strong>catalogo de productos</strong> y encuentra a
                        tus mejores aliados en seguridad.
                    </p>

                    {/* CTAs */}
                    <div
                        className="flex flex-wrap gap-2 mt-5"
                        style={enter(0.36)}
                    >
                        <StoreButton />
                        <AboutButton />
                    </div>
                </div>

                {/* PARTNERS */}
                <div
                    className="w-full mt-6 sm:mt-8"
                    style={enter(0.44)}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-px flex-1 bg-slate-200" />

                        <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase whitespace-nowrap text-slate-400">
                            Inspirando confianza en
                        </span>

                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="scale-75 sm:scale-90 origin-top">
                        <PartnersCarousel />
                    </div>
                </div>
            </div>
        );
    }

    /* =========================================================
       DESKTOP
       md+
    ========================================================= */

    return (
        <div className="w-full bg-white p-8 lg:p-12 xl:p-15 rounded-3xl">
            <div className="flex items-center">

                {/* CONTENT */}
                <div className="w-1/2 pr-6 lg:pr-10">

                    {/* HEADING */}
                    <div
                        className="flex gap-5"
                        style={enter(0)}
                    >
                        <div className="p-1 w-px h-20 bg-primary rounded-xl shrink-0" />

                        <div>
                            <h1 className="text-4xl lg:text-5xl xl:text-5xl tracking-widest text-primary">
                                TU SEGURIDAD ES PRIMERO.
                            </h1>

                            <h3 className="text-blue-900 font-light text-2xl lg:text-3xl mt-1">
                                Cuidamos tu capital intelectual.
                            </h3>
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div
                        className="w-4/5 mt-8 lg:mt-10 flex flex-col gap-2 text-lg lg:text-xl"
                        style={enter(0.20)}
                    >
                        <p className="text-justify">
                            En{" "}
                            <strong className="text-primary">
                                Iga Productos ®
                            </strong>{" "}
                            llevamos mas de <strong>20 años</strong> siendo tu{" "}
                            <strong>mejor</strong> aliado protegiendote con{" "}
                            <strong>Productos</strong> de la mejor calidad
                            fabricados orgullosamente en México. Explora
                            nuestro <strong>catalogo de productos</strong> y
                            encuentra a tus mejores aliados en seguridad.
                        </p>
                    </div>

                    {/* CTAs */}
                    <div
                        className="flex flex-wrap gap-2 mt-5"
                        style={enter(0.36)}
                    >
                        <StoreButton />
                        <AboutButton />
                    </div>

                    {/* PARTNERS */}
                    <div
                        className="w-4/5 mt-8 lg:mt-10"
                        style={enter(0.44)}
                    >
                        <PartnersCarousel />
                    </div>
                </div>

                {/* IMAGE */}
                <figure
                    className="w-1/2"
                    style={enter(0.10)}
                >
                    <HeroImage />
                </figure>
            </div>
        </div>
    );
}