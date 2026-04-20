import Header1 from "../../../assets/headers/HEADER_1.webp";
import IGALogo from "../../../assets/logo/IGA-LOGO.webp";
import { BiCertification, BiTargetLock } from "react-icons/bi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useState } from "react";
import { TbDeviceVisionPro } from "react-icons/tb";
import { IoDiamond } from "react-icons/io5";
import { TiWorld } from "react-icons/ti";
import { SiGooglecolab } from "react-icons/si";
import { FaCheckCircle } from "react-icons/fa";
import clsx from "clsx";

/* ── Shared design tokens (same as Home.tsx) ─────────────── */
const SectionBar = () => (
    <div className="bg-primary px-10 py-1 w-fit rounded-xl shadow-lg" />
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h1 className="px-3 py-2 mt-2 w-fit rounded-xl border border-base-300 bg-base-100 shadow-sm text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-base-content">
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
    <div className="bg-primary/10 text-primary border border-primary/20 w-fit px-3 py-1.5 rounded-xl shadow-sm mt-3">
        <p className="home-section-subtitle flex items-center gap-2 font-bold text-sm sm:text-base">
            {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
            {children}
        </p>
    </div>
);

/* timeline check icon */
const CheckIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-6 w-6 text-primary drop-shadow-sm"
    >
        <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
        />
    </svg>
);

/* ─────────────────────────────────────────────────────────── */

const AboutIGA = () => {
    document.title = "Iga Productos | Acerca de IGA";
    const [select, setSelect] = useState<"mision" | "vision" | "policy" | "value">("mision");

    const cfeLogo =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Comisi%C3%B3n_Federal_de_Electricidad_%28logo%29_.svg/2560px-Comisi%C3%B3n_Federal_de_Electricidad_%28logo%29_.svg.png";
    const pemexLogo =
        "https://upload.wikimedia.org/wikipedia/commons/9/99/Logo_Petr%C3%B3leos_Mexicanos.svg";
    const asaLogo =
        "https://www.gob.mx/cms/uploads/image/file/917560/ASA_COLOR.png";

    const principles = {
        mision: {
            title: "Misión",
            description:
                "Proporcionar a los clientes productos de protección personal que cumplan con las normas mexicanas para su uso, y procesos de fabricación por inyección; así como la extrusión soplo de envases, brindando asesoramiento de los mismos, manteniendo una rentabilidad creciente y sostenible en los procesos, basados en el sistema de gestión de calidad propiciando la mejora continua de los mismos.",
            icon: <BiTargetLock />,
        },
        vision: {
            title: "Visión",
            description:
                "Ser una empresa líder en la fabricación y comercialización de equipos de protección personal; desarrollando proyectos innovadores en envases y contenedores que cumplan con normas internacionales que contribuyan con el medio ambiente, a través de productos reciclables y biodegradables.",
            icon: <TbDeviceVisionPro />,
        },
        policy: {
            title: "Política de Calidad",
            description:
                "PLÁSTICOS DEL GOLFO SUR es una organización de la transformación de polímeros dedicada al proceso de inyección y/o extrusión soplo que garantiza la calidad de los productos dando cumplimiento a las especificaciones y normativas vigentes, asegurando la satisfacción de los clientes; aplicando la mejora continua a través de la participación de todos sus colaboradores, para incrementar el valor agregado de nuestra organización, a través de la implementación de un sistema de gestión de calidad basado en la norma internacional ISO 9001:2015.",
            icon: <BiCertification />,
        },
        value: {
            title: "Valor",
            description:
                "IGA es una empresa que se compromete a brindar productos de calidad, innovación y sostenibilidad, manteniendo un alto nivel de servicio al cliente y comprometida con el desarrollo sostenible.",
            icon: <IoDiamond />,
        },
    };

    const principleKeys = ["mision", "vision", "policy", "value"] as const;

    const servicesList = [
        "Ofrecemos servicio de maquila de inyección en plásticos, contando con la experiencia, equipo y maquinaria para el proceso de materiales termoplásticos y resinas de ingeniería.",
        "Capacidad instalada en máquinas de inyección de 35 a 320 toneladas de cierre.",
        "Equipo periférico para proceso y control del producto en moldeo, deshidratadores, cargadores de material, termorreguladores y enfriamiento.",
        "Tiempos de entrega confiables e insuperables.",
        "Logísticas de surtimiento de acuerdo a sus necesidades.",
        "Garantía de calidad en los productos marca IGA.",
        "Precios Accesibles y competitivos.",
        "Innovación constante en la imagen y empaque de productos.",
        "Productos con código de barras en etiquetas.",
        "Personal operativo en constante capacitación y altamente calificado.",
        "Equipo de ventas corporativo dedicado a tu atención."
    ];

    return (
        <div className="max-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 sm:pb-24 rounded-xl">
            <div className="w-full flex flex-col gap-12 sm:gap-16 lg:gap-24 animate-fade-in-up">

                {/* ── HERO HEADER ─────────────────────────────────────────── */}
                <div
                    className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-10 sm:py-16 flex flex-col lg:flex-row text-white rounded-2xl shadow-2xl bg-cover bg-center lg:bg-right overflow-hidden relative"
                    style={{ backgroundImage: `url(${Header1})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 to-transparent"></div>
                    <div className="w-full lg:w-3/5 mb-6 lg:mb-0 relative z-10">
                        <p className="text-3xl sm:text-4xl lg:text-5xl font-black drop-shadow-lg tracking-tight">Acerca de IGA</p>
                        <section className="text-base sm:text-lg leading-relaxed text-justify mt-5 sm:mt-7 space-y-4 font-medium opacity-90">
                            <p>
                                <strong className="font-bold opacity-100 drop-shadow-md text-xl">Plásticos del Golfo-Sur, S.A. de C.V.</strong> Es una
                                empresa 100% mexicana, certificada bajo la norma ISO 9001:2015;
                                especializada en la producción, comercialización y distribución
                                de lentes, barboquejos y cascos de seguridad industrial.
                            </p>
                            <p>
                                Inició sus actividades el 8 de marzo de 1999, en Coatzacoalcos,
                                Veracruz, como una empresa dedicada a la transformación por
                                inyección de plásticos y su comercialización, cuyo primer
                                proceso fue la fabricación de palillos con hilo dental
                                integrado.
                            </p>
                            <p>
                                En el 2003 incursionó en el área de seguridad personal, con la
                                producción de dos líneas específicas: cascos y lentes de
                                seguridad, en varios modelos. Los cascos se elaboran y
                                comercializan bajo la marca registrada IGA.
                            </p>
                        </section>
                    </div>
                    <div className="w-full lg:w-2/5 flex items-center justify-center lg:items-end relative z-10">
                        <figure className="lg:ml-10 w-full sm:w-3/4 max-w-xs drop-shadow-2xl">
                            <img
                                src={IGALogo}
                                alt="IGA productos Logo"
                                className="w-full h-auto filter brightness-0 invert"
                            />
                        </figure>
                    </div>
                </div>

                {/* ── NUESTROS PRINCIPIOS ─────────────────────────────────── */}
                <div className="home-section flex flex-col relative w-full">
                    <SectionBar />
                    <SectionTitle>Nuestros Principios</SectionTitle>
                    <SectionSubtitle icon={null}>
                        Da clic en cada uno de los principios para obtener más información
                    </SectionSubtitle>

                    <div className="mt-8 flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-[300px]">
                        {/* Selector Tab List */}
                        <div className="w-full lg:w-[40%] flex flex-col gap-3">
                            {principleKeys.map((key) => (
                                <button
                                    key={key}
                                    className={clsx(
                                        "flex justify-between items-center w-full px-6 py-4 rounded-2xl cursor-pointer text-lg font-bold transition-all duration-300 border",
                                        select === key
                                            ? "bg-primary text-primary-content shadow-lg shadow-primary/20 border-primary scale-[1.02]"
                                            : "bg-base-100 text-base-content/70 hover:bg-base-200 border-base-200 hover:shadow-md"
                                    )}
                                    onClick={() => setSelect(key)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl opacity-80">{principles[key].icon}</span>
                                        {principles[key].title}
                                    </div>
                                    <MdKeyboardArrowRight className={clsx("text-2xl transition-transform", select === key ? "rotate-90 md:rotate-0" : "opacity-50")} />
                                </button>
                            ))}
                        </div>

                        {/* Content Viewer Plate */}
                        <div className="w-full lg:w-[60%] relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl shadow-xl transform transition-transform duration-500 scale-100 group-hover:scale-[1.01]"></div>
                            <div className="relative h-full text-white rounded-3xl px-8 sm:px-12 py-10 flex flex-col justify-center gap-4">
                                <h3 className="text-3xl sm:text-4xl font-black flex items-center gap-3 text-primary-content drop-shadow-md" key={principles[select].title + "-title"}>
                                    {principles[select].icon}
                                    {principles[select].title}
                                </h3>
                                <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-200 opacity-90 mt-2 font-medium" key={principles[select].title + "-desc"}>
                                    {principles[select].description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── HISTORIA ────────────────────────────────────────────── */}
                <div className="home-section w-full">
                    <SectionBar />
                    <SectionTitle>Historia Corporativa</SectionTitle>
                    <SectionSubtitle icon={null}>
                        FABRICAMOS UNA VARIEDAD DE PRODUCTOS DE SEGURIDAD INDUSTRIAL APLICANDO ANÁLISIS, INNOVACIÓN, NORMALIZACIÓN Y CERTIFICACIÓN
                    </SectionSubtitle>

                    <div className="mt-12 bg-base-100/50 rounded-3xl p-4 sm:p-10 border border-base-200 shadow-sm">
                        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                            <li>
                                <div className="timeline-middle"><CheckIcon /></div>
                                <div className="timeline-start mb-10 md:text-end group">
                                    <time className="text-2xl font-black text-primary drop-shadow-sm">1999</time>
                                    <div className="text-base mt-2 bg-base-100 border border-base-200 rounded-2xl shadow-sm px-6 py-5 text-justify group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                                        <strong className="text-base-content font-bold">PLÁSTICOS DEL GOLFO SUR S.A. DE CV.</strong> como Asociación Civil se
                                        involucra en la transformación y comercialización de productos
                                        mediante el proceso de inyección de plásticos.
                                    </div>
                                </div>
                                <hr className="bg-primary/30" />
                            </li>
                            <li>
                                <hr className="bg-primary/30" />
                                <div className="timeline-middle"><CheckIcon /></div>
                                <div className="timeline-end md:mb-10 group">
                                    <time className="text-2xl font-black text-primary drop-shadow-sm">2003</time>
                                    <div className="text-base mt-2 bg-base-100 border border-base-200 rounded-2xl shadow-sm px-6 py-5 text-justify group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                                        Incursionamos en el área de seguridad personal, fabricando dos
                                        líneas específicas; cascos y lentes de seguridad en varios
                                        modelos. Producidos bajo los más altos estándares de calidad en
                                        cumplimiento con las Normas: <span className="font-semibold px-1 bg-base-200 rounded text-xs ml-1">NOM-115-STPS-1994</span>, <span className="font-semibold px-1 bg-base-200 rounded text-xs">NMX-S-055-SCF1-2002</span> y <span className="font-semibold px-1 bg-base-200 rounded text-xs">ANSI/ISEA Z891-199</span>.
                                    </div>
                                </div>
                                <hr className="bg-primary/30" />
                            </li>
                            <li>
                                <hr className="bg-primary/30" />
                                <div className="timeline-middle"><CheckIcon /></div>
                                <div className="timeline-start mb-10 md:text-end group">
                                    <time className="text-2xl font-black text-primary drop-shadow-sm">2009</time>
                                    <div className="text-base mt-2 bg-base-100 border border-base-200 rounded-2xl shadow-sm px-6 py-5 text-justify group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                                        Implementamos una serie de equipos de producción de primera
                                        calidad para lograr ahorros energéticos substanciales y una
                                        mejor operación de inyección.
                                    </div>
                                </div>
                                <hr className="bg-primary/30" />
                            </li>
                            <li>
                                <hr className="bg-primary/30" />
                                <div className="timeline-middle"><CheckIcon /></div>
                                <div className="timeline-end md:mb-10 group">
                                    <time className="text-2xl font-black text-primary drop-shadow-sm">2014-2020</time>
                                    <div className="text-base mt-2 bg-base-100 border border-base-200 rounded-2xl shadow-sm px-6 py-5 text-justify group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                                        Certificación al proceso Normativos de nuestros cascos de
                                        seguridad industrial en las diversas Normas Mexicanas e Internacionales.
                                    </div>
                                </div>
                                <hr className="bg-primary/30" />
                            </li>
                            <li>
                                <hr className="bg-primary/30" />
                                <div className="timeline-middle"><CheckIcon /></div>
                                <div className="timeline-start mb-10 md:text-end group">
                                    <time className="text-2xl font-black text-primary drop-shadow-sm">2017</time>
                                    <div className="text-base mt-2 bg-base-100 border border-base-200 rounded-2xl shadow-sm px-6 py-5 text-justify group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                                        Plásticos obtiene la presidencia del subcomité de equipos de
                                        protección a la cabeza del comité técnico de normalización
                                        nacional para productos de protección y seguridad.
                                    </div>
                                </div>
                                <hr className="bg-primary/30" />
                            </li>
                            <li>
                                <hr className="bg-primary/30" />
                                <div className="timeline-middle"><CheckIcon /></div>
                                <div className="timeline-end md:mb-10 group">
                                    <time className="text-2xl font-black text-primary drop-shadow-sm">2018</time>
                                    <div className="text-base mt-2 bg-base-100 border border-base-200 rounded-2xl shadow-sm px-6 py-5 text-justify group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                                        Se obtiene la certificación <strong className="text-primary font-black">ISO 9001-2015</strong>, alcance que
                                        comprende las actividades de: fabricación de cascos de
                                        protección personal, lentes, barbiquejos, actividades de
                                        ensamble e inyección.
                                    </div>
                                </div>
                                <hr className="bg-primary/30" />
                            </li>
                            <li>
                                <hr className="bg-primary/30" />
                                <div className="timeline-middle"><CheckIcon /></div>
                                <div className="timeline-start mb-10 md:text-end group">
                                    <time className="text-2xl font-black text-primary drop-shadow-sm">2021</time>
                                    <div className="text-base mt-2 bg-base-100 border border-base-200 rounded-2xl shadow-sm px-6 py-5 text-justify group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                                        Plásticos del Golfo Sur obtiene el certificado <strong className="text-primary font-black">ANSI/ISEA Z89.1-2014 (R2019)</strong> para el casco Plagosur C en ajuste de
                                        matraca tipo I, Forma II en clase "E".
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ── SERVICIOS Y LICITACIONES ─────────────────────────────── */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">

                    {/* servicios */}
                    <div className="w-full lg:w-1/2 home-section flex flex-col">
                        <SectionBar />
                        <SectionTitle>Servicios al Cliente</SectionTitle>
                        <SectionSubtitle icon={<TiWorld />}>
                            Distintos Servicios Especiales
                        </SectionSubtitle>

                        <div className="mt-8 bg-base-100 rounded-3xl p-6 sm:p-8 flex-1 border border-base-200 shadow-sm flex flex-col gap-4">
                            {servicesList.map((service, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <FaCheckCircle className="text-success text-xl mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <p className="text-base font-medium opacity-80 leading-relaxed text-justify">{service}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* licitaciones */}
                    <div className="w-full lg:w-1/2 home-section flex flex-col">
                        <SectionBar />
                        <SectionTitle>Licitaciones</SectionTitle>
                        <SectionSubtitle icon={<SiGooglecolab />}>
                            Instituciones gubernamentales que requieren alta calidad
                        </SectionSubtitle>

                        <div className="mt-8 flex gap-4 sm:gap-6 items-stretch justify-center flex-wrap flex-1">
                            {/* CFE */}
                            <div className="bg-white rounded-3xl shadow-sm border border-base-200 p-6 flex flex-col items-center justify-center w-full sm:w-[calc(50%-12px)] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 min-h-[160px]">
                                <img src={cfeLogo} alt="CFE Logo" className="w-[80%] h-auto object-contain max-h-24 mix-blend-multiply" />
                                <p className="text-xs font-bold text-base-content/50 uppercase mt-4 tracking-widest">Acreditado</p>
                            </div>

                            {/* Pemex */}
                            <div className="bg-white rounded-3xl shadow-sm border border-base-200 p-6 flex flex-col items-center justify-center w-full sm:w-[calc(50%-12px)] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 min-h-[160px]">
                                <img src={pemexLogo} alt="Pemex Logo" className="w-[70%] h-auto object-contain max-h-24 mix-blend-multiply" />
                                <p className="text-xs font-bold text-base-content/50 uppercase mt-4 tracking-widest">Acreditado</p>
                            </div>

                            {/* ASA */}
                            <div className="bg-white rounded-3xl shadow-sm border border-base-200 p-6 flex flex-col items-center justify-center w-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 min-h-[160px]">
                                <img src={asaLogo} alt="Aeropuertos y Servicios Auxiliares Logo" className="w-[60%] sm:w-[40%] h-auto object-contain max-h-24 mix-blend-multiply" />
                                <p className="text-xs font-bold text-base-content/50 uppercase mt-4 tracking-widest">Acreditado</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutIGA;