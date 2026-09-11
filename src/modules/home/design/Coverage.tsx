import Header2 from "../../../assets/headers/HEADER2.webp";
import CoverageImg from "../../../assets/coverage/coverage.webp";
import { MdOpenInNew } from "react-icons/md";
import { HiGlobeAlt } from "react-icons/hi2";
import { IoLocationSharp } from "react-icons/io5";
import { FaBoxOpen, FaHandshake, FaIndustry } from "react-icons/fa6";
import { HomeSection, PageHero, SectionHeading, HeroPill, StampBadge } from "./shared";

const coverageStats = [
    { label: "Estados con cobertura", value: "32", icon: <IoLocationSharp /> },
    { label: "Países de exportación", value: "5+", icon: <HiGlobeAlt /> },
    { label: "Productos distribuidos", value: "100+", icon: <FaBoxOpen /> },
    { label: "Distribuidores activos", value: "200+", icon: <FaHandshake /> },
];

const Coverage = () => {
    document.title = "Iga Productos | Cobertura";

    return (
        <div className="px-3 sm:px-5 lg:px-8 pt-4 sm:pt-6 pb-16 sm:pb-24 animate-fade-in-up flex flex-col">
            <PageHero
                image={Header2}
                overlayClassName="absolute inset-0 bg-blue-950/85"
                eyebrow="Iga Productos"
                title="Cobertura"
                paragraphs={
                    <>
                        <p>
                            Plásticos del Golfo-Sur, S.A. de C.V. es una empresa
                            100% mexicana, certificada bajo la norma ISO
                            9001:2015; especializada en la producción,
                            comercialización y distribución de lentes,
                            barboquejos y cascos de seguridad industrial.
                        </p>
                        <p>
                            Contamos con presencia nacional e internacional,
                            llegando a distribuidores y clientes en toda la
                            república y más allá de nuestras fronteras.
                        </p>
                    </>
                }
                badges={
                    <>
                        <HeroPill icon={<IoLocationSharp className="text-sm" />}>
                            Cobertura nacional
                        </HeroPill>
                        <HeroPill icon={<HiGlobeAlt className="text-sm text-primary" />}>
                            Presencia internacional
                        </HeroPill>
                        <HeroPill icon={<FaIndustry className="text-sm" />}>
                            ISO 9001:2015
                        </HeroPill>
                    </>
                }
            />

            <HomeSection>
                <SectionHeading
                    title="Nuestra presencia"
                    subtitle="Alcance nacional e internacional con distribuidores en toda la república"
                    icon={HiGlobeAlt}
                />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {coverageStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-base-100 border border-base-200 rounded-2xl px-4 py-6 flex flex-col items-center gap-3 text-center hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                        >
                            <span className="bg-primary/10 text-primary p-3 rounded-xl text-2xl">
                                {stat.icon}
                            </span>
                            <p className="font-black text-3xl sm:text-4xl leading-none text-blue-950">
                                {stat.value}
                            </p>
                            <p className="text-xs sm:text-sm leading-snug text-base-content/60">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </HomeSection>

            <HomeSection tinted>
                <SectionHeading
                    title="Cobertura nacional e internacional"
                    subtitle="Únete a nuestra red de distribuidores en México y el mundo"
                    icon={IoLocationSharp}
                />
                <figure className="rounded-2xl overflow-hidden shadow-sm border border-base-200 bg-base-100">
                    <img
                        src={CoverageImg}
                        alt="Zonas de cobertura nacional e internacional de Iga Productos"
                        loading="lazy"
                        className="w-full h-auto"
                    />
                </figure>

                <div className="mt-8 bg-blue-950 rounded-3xl px-6 sm:px-10 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-md">
                    <div className="flex items-center gap-5 min-w-0">
                        <StampBadge icon={FaHandshake} className="text-white" />
                        <div className="min-w-0">
                            <p className="font-black text-lg sm:text-xl text-white leading-snug">
                                ¿Quieres ser distribuidor?
                            </p>
                            <p className="text-white/70 text-sm sm:text-base mt-0.5">
                                Expande tu negocio con nuestros productos
                                certificados. Contáctanos y únete a nuestra red.
                            </p>
                        </div>
                    </div>
                    <a
                        href="/contacto"
                        className="btn btn-primary btn-lg w-full sm:w-auto shrink-0 rounded-xl gap-2"
                    >
                        <MdOpenInNew className="text-lg" />
                        Contáctanos
                    </a>
                </div>
            </HomeSection>
        </div>
    );
};

export default Coverage;
