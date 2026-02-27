import Header1 from "../../../assets/headers/HEADER_1.webp";
import IGALogo from "../../../assets/logo/IGA-LOGO.webp";
import { BiCertification, BiTargetLock } from "react-icons/bi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useState } from "react";
import { TbDeviceVisionPro } from "react-icons/tb";
import clsx from "clsx";
import { IoDiamond } from "react-icons/io5";
import { TiWorld } from "react-icons/ti";
import { SiGooglecolab } from "react-icons/si";

/* ── Shared design tokens (same as Home.tsx) ─────────────── */
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
            <span className="text-xl flex-shrink-0">{icon}</span>
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
        className="h-5 w-5 text-primary"
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

    return (
        <div className="w-full px-3 sm:px-5 lg:px-5 pt-6 sm:pt-10 pb-16 sm:pb-25 rounded-xl">
            <div className="w-full flex flex-col gap-10 md:gap-14 animate-fade-in-up">

                {/* ── HERO HEADER ─────────────────────────────────────────── */}
                <div
                    className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-60 py-6 sm:py-10 md:py-15 flex flex-col lg:flex-row text-white rounded-xl bg-cover bg-center lg:bg-right"
                    style={{ backgroundImage: `url(${Header1})` }}
                >
                    <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
                        <p className="text-2xl sm:text-3xl font-bold">Acerca de IGA</p>
                        <section className="text-base sm:text-lg leading-6 sm:leading-8 text-justify mt-3 sm:mt-5">
                            <p>
                                <strong>Plásticos del Golfo-Sur, S.A. de C.V.</strong> Es una
                                empresa 100% mexicana, certificada bajo la norma ISO 9001:2015;
                                especializada en la producción, comercialización y distribución
                                de lentes, barboquejos y cascos de seguridad industrial.
                            </p>
                            <br />
                            <p>
                                Inició sus actividades el 8 de marzo de 1999, en Coatzacoalcos,
                                Veracruz, como una empresa dedicada a la transformación por
                                inyección de plásticos y su comercialización, cuyo primer
                                proceso fue la fabricación de palillos con hilo dental
                                integrado.
                            </p>
                            <br />
                            <p>
                                En el 2003 incursionó en el área de seguridad personal, con la
                                producción de dos líneas específicas: cascos y lentes de
                                seguridad, en varios modelos. Los cascos se elaboran y
                                comercializan bajo la marca registrada IGA.
                            </p>
                        </section>
                    </div>
                    <div className="w-full lg:w-1/2 flex items-center justify-center lg:items-end">
                        <figure className="lg:ml-10 w-full sm:w-3/4 max-w-sm">
                            <img
                                src={IGALogo}
                                alt="IGA productos Logo"
                                className="w-full h-auto"
                            />
                        </figure>
                    </div>
                </div>

                {/* ── NUESTROS PRINCIPIOS ─────────────────────────────────── */}
                <div className="home-section">
                    <SectionBar />
                    <SectionTitle>Nuestros principios</SectionTitle>
                    <SectionSubtitle icon={null}>
                        Da clic en cada uno de los principios para obtener más información
                    </SectionSubtitle>

                    <div className="mt-5 flex flex-col lg:flex-row gap-5">
                        {/* selector */}
                        <div className="w-full lg:w-1/2 p-4 sm:p-5 bg-base-100 rounded-xl">
                            <div className="flex flex-col gap-3 sm:gap-5 mt-3">
                                {principleKeys.map((key) => (
                                    <button
                                        key={key}
                                        className={clsx(
                                            "flex items-center gap-2 cursor-pointer text-lg sm:text-2xl font-medium transition-colors",
                                            select === key ? "text-primary" : ""
                                        )}
                                        onClick={() => setSelect(key)}
                                    >
                                        {principles[key].title}
                                        <MdKeyboardArrowRight />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* content */}
                        <div className="w-full lg:w-1/2 bg-slate-900 rounded-xl px-6 sm:px-10 lg:px-20 py-5">
                            <p className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                                {principles[select].title}
                                {principles[select].icon}
                            </p>
                            <p className="text-base sm:text-lg lg:text-xl leading-6 sm:leading-7 text-white text-justify mt-3">
                                {principles[select].description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── HISTORIA ────────────────────────────────────────────── */}
                <div className="home-section">
                    <SectionBar />
                    <SectionTitle>Historia</SectionTitle>
                    <SectionSubtitle icon={null}>
                        FABRICAMOS UNA VARIEDAD DE PRODUCTOS DE SEGURIDAD INDUSTRIAL
                        APLICANDO ANÁLISIS, INNOVACIÓN, NORMALIZACIÓN Y CERTIFICACIÓN EN
                        PROCESOS DE INYECCIÓN DE PLÁSTICOS
                    </SectionSubtitle>

                    <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical mt-5">
                        <li>
                            <div className="timeline-middle"><CheckIcon /></div>
                            <div className="timeline-start mb-10 md:text-end">
                                <time className="text-lg sm:text-xl font-bold">1999</time>
                                <div className="text-sm sm:text-base lg:text-lg mt-2 bg-base-100 rounded-xl px-5 sm:px-10 py-3 sm:py-5 text-justify">
                                    PLÁSTICOS DEL GOLFO SUR S.A. DE CV. como Asociación Civil se
                                    involucra en la transformación y comercialización de productos
                                    mediante el proceso de inyección de plásticos.
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle"><CheckIcon /></div>
                            <div className="timeline-end md:mb-10">
                                <time className="text-lg sm:text-xl font-bold">2003</time>
                                <div className="text-sm sm:text-base lg:text-lg mt-2 bg-base-100 rounded-xl px-5 sm:px-10 py-3 sm:py-5 text-justify">
                                    Incursionamos en el área de seguridad personal, fabricando dos
                                    líneas específicas; cascos y lentes de seguridad en varios
                                    modelos. Producidos bajo los más altos estándares de calidad en
                                    cumplimiento con las Normas: NOM-115-STPS-1994,
                                    NMX-S-055-SCF1-2002 y ANSI/ISEA Z891-199.
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle"><CheckIcon /></div>
                            <div className="timeline-start mb-10 md:text-end">
                                <time className="text-lg sm:text-xl font-bold">2009</time>
                                <div className="text-sm sm:text-base lg:text-lg mt-2 bg-base-100 rounded-xl px-5 sm:px-10 py-3 sm:py-5 text-justify">
                                    Implementamos una serie de equipos de producción de primera
                                    calidad para lograr ahorros energéticos substanciales y una
                                    mejor operación de inyección.
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle"><CheckIcon /></div>
                            <div className="timeline-end md:mb-10">
                                <time className="text-lg sm:text-xl font-bold">2014-2020</time>
                                <div className="text-sm sm:text-base lg:text-lg mt-2 bg-base-100 rounded-xl px-5 sm:px-10 py-3 sm:py-5 text-justify">
                                    Certificación al proceso Normativos de nuestros cascos de
                                    seguridad industrial en las siguientes Normas:
                                    NOM-115-STPS-2009, NMX-S-055-SCFI-2002, ANSI/ISEA Z89.1-2014
                                    (R2019), PEMEX-EST-SS-058-2018 y CFE: 8H 341-02.
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle"><CheckIcon /></div>
                            <div className="timeline-start mb-10 md:text-end">
                                <time className="text-lg sm:text-xl font-bold">2017</time>
                                <div className="text-sm sm:text-base lg:text-lg mt-2 bg-base-100 rounded-xl px-5 sm:px-10 py-2 sm:py-2 text-justify">
                                    Plásticos obtiene la presidencia del subcomité de equipos de
                                    protección a la cabeza del comité técnico de normalización
                                    nacional para productos de protección y seguridad.
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle"><CheckIcon /></div>
                            <div className="timeline-end md:mb-10">
                                <time className="text-lg sm:text-xl font-bold">2018</time>
                                <div className="text-sm sm:text-base lg:text-lg mt-2 bg-base-100 rounded-xl px-5 sm:px-10 py-2 sm:py-2 text-justify">
                                    Se obtiene la certificación ISO 9001-2015, alcance que
                                    comprende las actividades de: fabricación de cascos de
                                    protección personal, lentes, barbiquejos, actividades de
                                    ensamble e inyección.
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle"><CheckIcon /></div>
                            <div className="timeline-start mb-10 md:text-end">
                                <time className="text-lg sm:text-xl font-bold">2021</time>
                                <div className="text-sm sm:text-base lg:text-lg mt-2 bg-base-100 rounded-xl px-5 sm:px-10 py-2 sm:py-2 text-justify">
                                    Plásticos del Golfo Sur obtiene el certificado ANSI/ISEA
                                    Z89.1-2014 (R2019) para el casco Plagosur C en ajuste de
                                    matraca tipo I, Forma II en clase "E".
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* ── SERVICIOS Y LICITACIONES ─────────────────────────────── */}
                <div className="flex flex-col lg:flex-row gap-5 lg:gap-0">

                    {/* servicios */}
                    <div className="w-full lg:w-1/2 lg:pr-5 home-section">
                        <SectionBar />
                        <SectionTitle>Servicios al Cliente</SectionTitle>
                        <SectionSubtitle icon={<TiWorld />}>
                            Nacional e internacional
                        </SectionSubtitle>
                        <ul className="w-full text-justify list-disc list-inside text-base sm:text-lg lg:text-xl flex flex-col gap-3 sm:gap-5 mt-3 sm:mt-5">
                            <li>Ofrecemos servicio de maquila de inyección en plásticos, contando con la experiencia, equipo y maquinaria para el proceso de materiales termoplásticos y resinas de ingeniería.</li>
                            <li>Capacidad instalada en máquinas de inyección de 35 a 320 toneladas de cierre.</li>
                            <li>Equipo periférico para proceso y control del producto en moldeo, deshidratadores, cargadores de material, termorreguladores y enfriamiento.</li>
                            <li>Tiempos de entrega confiables.</li>
                            <li>Logísticas de surtimiento de acuerdo a sus necesidades.</li>
                            <li>Ganancia de calidad en los productos Iga.</li>
                            <li>Precios Accesibles.</li>
                            <li>Innovación constante en la imagen y empaque de productos.</li>
                            <li>Productos con código de barras en etiquetas.</li>
                            <li>Personal operativo calificado.</li>
                            <li>Equipo de ventas corporativa.</li>
                        </ul>
                    </div>

                    {/* licitaciones */}
                    <div className="w-full lg:w-1/2 lg:pl-5 home-section">
                        <SectionBar />
                        <SectionTitle>Licitaciones</SectionTitle>
                        <SectionSubtitle icon={<SiGooglecolab />}>
                            Colaboramos con empresas/instituciones gubernamentales que requieren de productos de calidad.
                        </SectionSubtitle>
                        <div className="mt-3 sm:mt-3 flex flex-wrap gap-3 sm:gap-5 items-center justify-center lg:justify-start">
                            <figure className="w-2/5 sm:w-1/3 lg:w-1/3">
                                <img src={cfeLogo} alt="CFE Logo" className="w-full h-auto" />
                            </figure>
                            <figure className="w-1/4 sm:w-1/5 lg:w-1/5">
                                <img src={pemexLogo} alt="Pemex Logo" className="w-full h-auto" />
                            </figure>
                            <figure className="w-2/5 sm:w-1/3 lg:w-1/3">
                                <img src={asaLogo} alt="ASA Logo" className="w-full h-auto" />
                            </figure>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutIGA;