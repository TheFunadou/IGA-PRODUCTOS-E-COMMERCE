import IGALogo from "../../../assets/logo/IGA-LOGO.webp";
import Header2 from "../../../assets/headers/HEADER2.webp";
import CoverageImg from "../../../assets/coverage/coverage.webp";
import { MdOpenInNew } from "react-icons/md";
import { HiGlobeAlt } from "react-icons/hi2";
import { IoLocationSharp } from "react-icons/io5";
import { FaBoxOpen, FaHandshake, FaIndustry } from "react-icons/fa";

/* ── Shared design tokens (same as Contact.tsx / AboutIGA.tsx) ── */
const SectionBar = () => (
    <div className="bg-primary px-10 py-1 w-fit rounded-xl shadow-lg" />
);
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h1 className="px-2 py-1 w-fit rounded-xl border border-base-300 bg-base-300 text-2xl sm:text-3xl lg:text-4xl font-bold">
        {children}
    </h1>
);
const SectionSubtitle = ({
    icon,
    children,
}: {
    icon: React.ReactNode;
    children: React.ReactNode;
}) => (
    <div className="bg-primary text-white w-fit px-2 rounded-xl">
        <p className="home-section-subtitle flex items-center gap-2">
            {icon && <span className="text-xl shrink-0">{icon}</span>}
            {children}
        </p>
    </div>
);
/* ─────────────────────────────────────────────────────────── */

const coverageStats = [
    { label: "Estados con cobertura", value: "32", icon: <IoLocationSharp /> },
    { label: "Países de exportación", value: "5+", icon: <HiGlobeAlt /> },
    { label: "Productos distribuidos", value: "100+", icon: <FaBoxOpen /> },
    { label: "Distribuidores activos", value: "200+", icon: <FaHandshake /> },
];

const Coverage = () => {
    document.title = "Iga Productos | Cobertura";
    return (
        <div className="w-full pt-6 sm:pt-10 pb-16 sm:pb-25 rounded-xl">
            <div className="w-full flex flex-col gap-10 md:gap-14 animate-fade-in-up">

                {/* ── HERO HEADER ─────────────────────────────────────────── */}
                <div
                    className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-60 py-6 sm:py-10 md:py-15 flex flex-col lg:flex-row text-white rounded-xl bg-cover bg-center lg:bg-right relative overflow-hidden"
                    style={{ backgroundImage: `url(${Header2})` }}
                >
                    {/* Overlay sutil para mejorar legibilidad */}
                    <div className="absolute inset-0 bg-black/70 rounded-xl" />

                    <div className="relative z-10 w-full lg:w-1/2 mb-6 lg:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-0.5 bg-primary rounded-full" />
                            <span className="text-white/70 text-xs uppercase tracking-widest font-semibold">IGA Productos</span>
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold leading-tight drop-shadow-md">Cobertura</p>
                        <section className="text-sm sm:text-base leading-7 text-white/90 mt-4 sm:mt-5 space-y-3 max-w-prose drop-shadow">
                            <p>
                                Plásticos del Golfo-Sur, S.A. de C.V. es una empresa 100% mexicana,
                                certificada bajo la norma ISO 9001:2015; especializada en la producción,
                                comercialización y distribución de lentes, barboquejos y cascos de seguridad industrial.
                            </p>
                            <p>
                                Contamos con presencia nacional e internacional, llegando a distribuidores
                                y clientes en toda la república y más allá de nuestras fronteras.
                            </p>
                        </section>

                        {/* Badges de alcance */}
                        <div className="flex flex-wrap gap-2 mt-5">
                            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                                <IoLocationSharp className="text-sm" /> Cobertura nacional
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                                <HiGlobeAlt className="text-sm text-primary" /> Presencia internacional
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                                <FaIndustry className="text-sm" /> ISO 9001:2015
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center lg:items-end">
                        <figure className="lg:ml-10 w-full sm:w-3/4 max-w-sm drop-shadow-2xl">
                            <img src={IGALogo} alt="IGA productos Logo" className="w-full h-auto" />
                        </figure>
                    </div>
                </div>

                {/* ── ESTADÍSTICAS DE COBERTURA ────────────────────────────── */}
                <div className="home-section">
                    <SectionBar />
                    <SectionTitle>Nuestra presencia</SectionTitle>
                    <SectionSubtitle icon={<HiGlobeAlt />}>
                        Alcance nacional e internacional con distribuidores en toda la república
                    </SectionSubtitle>

                    <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {coverageStats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-slate-900 rounded-xl px-5 py-6 flex flex-col items-center gap-3 border border-slate-700/50 hover:border-primary/40 transition-colors duration-300 group text-center"
                            >
                                <div className="bg-primary/20 text-primary p-3 rounded-xl group-hover:bg-primary/30 transition-colors duration-300 text-2xl">
                                    {stat.icon}
                                </div>
                                <p className="text-white font-bold text-3xl sm:text-4xl leading-none">{stat.value}</p>
                                <p className="text-white/55 text-xs sm:text-sm leading-snug">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── MAPA DE COBERTURA ────────────────────────────────────── */}
                <div className="home-section">
                    <SectionBar />
                    <SectionTitle>Cobertura nacional e internacional</SectionTitle>
                    <SectionSubtitle icon={<IoLocationSharp />}>
                        Únete a nuestra red de distribuidores en México y el mundo
                    </SectionSubtitle>

                    <div className="mt-5 w-full rounded-xl overflow-hidden shadow-2xl border border-base-200">
                        <figure className="w-full">
                            <img
                                src={CoverageImg}
                                alt="Zonas de cobertura nacional e internacional de IGA Productos"
                                className="w-full h-auto rounded-xl"
                            />
                        </figure>
                    </div>

                    {/* CTA para distribuidores */}
                    <div className="mt-5 bg-primary/10 border border-primary/30 rounded-xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl shrink-0">🤝</span>
                            <div>
                                <p className="font-bold text-base sm:text-lg text-base-content">¿Quieres ser distribuidor?</p>
                                <p className="text-base-content/60 text-sm sm:text-base mt-0.5">
                                    Expande tu negocio con nuestros productos certificados. Contáctanos y únete a nuestra red.
                                </p>
                            </div>
                        </div>

                        <a
                            href="/contacto"
                            className="btn btn-primary gap-2 shrink-0 w-full sm:w-auto"
                        >
                            <MdOpenInNew className="text-lg" />
                            Contáctanos
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Coverage;