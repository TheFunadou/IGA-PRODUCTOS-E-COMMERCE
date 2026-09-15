import { useState } from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import Header1 from "../../../assets/headers/HEADER_1.webp";
import IMG1 from "../../../assets/expo/IMG-1.webp";
import IMG2 from "../../../assets/expo/IMG-2.webp";
import IMG3 from "../../../assets/expo/IMG-3.webp";
import IMG4 from "../../../assets/expo/IMG-4.webp";
import IMG5 from "../../../assets/expo/IMG-5.webp";
import IMG6 from "../../../assets/expo/IMG-6.webp";
import IMG7 from "../../../assets/expo/IMG-7.webp";
import IMG8 from "../../../assets/expo/IMG-8.webp";
import CfeLogo from "../../../assets/aboutiga/cfe-logo.webp"
import PemexLogo from "../../../assets/aboutiga/pemex-logo.webp"
import ComprasMxLogo from "../../../assets/aboutiga/comprasmx-logo.webp"

import { BiCertification, BiTargetLock } from "react-icons/bi";
import {
    MdKeyboardArrowRight,
    MdPrecisionManufacturing,
} from "react-icons/md";
import { TbDeviceVisionPro } from "react-icons/tb";
import { IoDiamond, IoLocationSharp } from "react-icons/io5";
import {
    FaCircleCheck,
    FaImage,
    FaLandmark,
    FaMagnifyingGlassPlus,
    FaVideo,
} from "react-icons/fa6";
import { OverflowXComponent } from "../components/OverflowXComponent";
import { HomeSection, PageHero, SectionHeading } from "./shared";
import { useThemeStore } from "../../../layouts/states/themeStore";

type PrincipleKey = "mision" | "vision" | "policy" | "value";

const principles: Record<
    PrincipleKey,
    { title: string; description: string; icon: ReactNode }
> = {
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

const principleKeys: PrincipleKey[] = ["mision", "vision", "policy", "value"];

const NormChip = ({ children }: { children: string }) => (
    <span className="font-semibold px-1.5 py-0.5 bg-base-200 rounded text-xs whitespace-nowrap">
        {children}
    </span>
);

const milestones: { year: string; body: (isDark: boolean) => ReactNode }[] = [
    {
        year: "1999",
        body: (isDark) => (
            <>
                <strong className={clsx("font-bold", isDark ? "text-base-content" : "text-blue-950")}>
                    PLÁSTICOS DEL GOLFO SUR S.A. DE CV.
                </strong>{" "}
                como Asociación Civil se involucra en la transformación y
                comercialización de productos mediante el proceso de inyección
                de plásticos.
            </>
        ),
    },
    {
        year: "2003",
        body: () => (
            <>
                Incursionamos en el área de seguridad personal, fabricando dos
                líneas específicas; cascos y lentes de seguridad en varios
                modelos. Producidos bajo los más altos estándares de calidad en
                cumplimiento con las Normas:{" "}
                <NormChip>NOM-115-STPS-1994</NormChip>{" "}
                <NormChip>NMX-S-055-SCF1-2002</NormChip>{" "}
                <NormChip>ANSI/ISEA Z891-199</NormChip>.
            </>
        ),
    },
    {
        year: "2009",
        body: () => (
            <>
                Implementamos una serie de equipos de producción de primera
                calidad para lograr ahorros energéticos substanciales y una
                mejor operación de inyección.
            </>
        ),
    },
    {
        year: "2014-2020",
        body: () => (
            <>
                Certificación al proceso Normativos de nuestros cascos de
                seguridad industrial en las diversas Normas Mexicanas e
                Internacionales.
            </>
        ),
    },
    {
        year: "2017",
        body: () => (
            <>
                Plásticos obtiene la presidencia del subcomité de equipos de
                protección a la cabeza del comité técnico de normalización
                nacional para productos de protección y seguridad.
            </>
        ),
    },
    {
        year: "2018",
        body: () => (
            <>
                Se obtiene la certificación{" "}
                <strong className="text-primary font-black">ISO 9001-2015</strong>
                , alcance que comprende las actividades de: fabricación de
                cascos de protección personal, lentes, barbiquejos, actividades
                de ensamble e inyección.
            </>
        ),
    },
    {
        year: "2021",
        body: () => (
            <>
                Plásticos del Golfo Sur obtiene el certificado{" "}
                <strong className="text-primary font-black">
                    ANSI/ISEA Z89.1-2014 (R2019)
                </strong>{" "}
                para el casco Plagosur C en ajuste de matraca tipo I, Forma II
                en clase "E".
            </>
        ),
    },
];

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
    "Equipo de ventas corporativo dedicado a tu atención.",
];

const licitacionesLogos = [
    {
        url: CfeLogo,
        alt: "CFE Logo",
        width: "w-40/100",
    },
    {
        url: PemexLogo,
        alt: "Pemex Logo",
        width: "w-40/100",
    },
    {
        url: ComprasMxLogo,
        alt: "Compras Mx",
        width: "w-40/100",
    },
];

const sampleVideos: { videoUrl: string; title: string }[] = [
    {
        videoUrl:
            "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1943991622832390%2F&show_text=false&width=380&t=0",
        title: "Fabricamos cascos certificados ",
    },
    {
        videoUrl:
            "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1144234144137329%2F&show_text=false&width=380&t=0",
        title: "¿Tu casco realmente te protege?",
    },
    {
        videoUrl:
            "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2003782983796640%2F&show_text=false&width=380&t=0",
        title: "En Cascos IGA fabricamos cascos certificados bajo la NOM-115-STPS-2009, cumpliendo con los estándares más altos de protección",
    },
    {
        videoUrl:
            "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2FCascos.Iga%2Fvideos%2F1072011298391393%2F&show_text=false&width=380&t=0",
        title: "Cascos Iga  en  su ultimo día de actividades en la Expoferre 2025.",
    },
    {
        videoUrl:
            "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1226019325980440%2F&show_text=false&width=267&t=0",
        title: "Banda de Sudor para Cascos",
    },
    {
        videoUrl:
            "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1369548547637737%2F&show_text=false&width=267&t=0",
        title: "💛 Sabemos que cada jornada comienza con esfuerzo… y debe terminar con un abrazo.",
    },
    {
        videoUrl:
            "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1245484200499156%2F&show_text=false&width=267&t=0",
        title: "Conoce mas sobre nuestros cascos",
    },
];

const expoGallery = [IMG1, IMG2, IMG3, IMG4, IMG5, IMG6, IMG7, IMG8].map(
    (url, index) => ({
        url,
        alt: `Participación de Iga Productos en exposición (${index + 1})`,
    })
);

const MAPS_EMBED_URL =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3792.2144464596627!2d-94.45448402407892!3d18.10788558164854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85e98343453e5afd%3A0x22e09f3a6b82a914!2sIga%20Productos!5e0!3m2!1ses-419!2smx!4v1787605846475!5m2!1ses-419!2smx";

const IMAGE_LIGHTBOX_ID = "about_iga_image_lightbox";
const VIDEO_LIGHTBOX_ID = "about_iga_video_lightbox";

const AboutIGA = () => {
    document.title = "Iga Productos | Acerca de IGA";
    const [select, setSelect] = useState<PrincipleKey>("mision");
    const [activeImage, setActiveImage] = useState<(typeof expoGallery)[number] | null>(null);
    const [activeVideo, setActiveVideo] = useState<(typeof sampleVideos)[number] | null>(null);
    const { theme } = useThemeStore();

    const openLightbox = (image: (typeof expoGallery)[number]) => {
        setActiveImage(image);
        (document.getElementById(IMAGE_LIGHTBOX_ID) as HTMLDialogElement | null)?.showModal();
    };

    const openVideoLightbox = (video: (typeof sampleVideos)[number]) => {
        setActiveVideo(video);
        (document.getElementById(VIDEO_LIGHTBOX_ID) as HTMLDialogElement | null)?.showModal();
    };

    return (
        <div className="px-3 sm:px-5 lg:px-8 pt-4 sm:pt-6 pb-16 sm:pb-24 animate-fade-in-up flex flex-col">
            <PageHero
                image={Header1}
                eyebrow="Plásticos del Golfo-Sur, S.A. de C.V."
                title="Acerca de IGA"
                paragraphs={
                    <>
                        <p>
                            Es una empresa 100% mexicana, certificada bajo la
                            norma ISO 9001:2015; especializada en la producción,
                            comercialización y distribución de lentes,
                            barboquejos y cascos de seguridad industrial.
                        </p>
                        <p>
                            Inició sus actividades el 8 de marzo de 1999, en
                            Coatzacoalcos, Veracruz, como una empresa dedicada a
                            la transformación por inyección de plásticos y su
                            comercialización, cuyo primer proceso fue la
                            fabricación de palillos con hilo dental integrado.
                        </p>
                        <p>
                            En el 2003 incursionó en el área de seguridad
                            personal, con la producción de dos líneas
                            específicas: cascos y lentes de seguridad, en varios
                            modelos. Los cascos se elaboran y comercializan bajo
                            la marca registrada IGA.
                        </p>
                    </>
                }
            />

            <HomeSection>
                <SectionHeading
                    title="Nuestros Principios"
                    subtitle="Da clic en cada uno de los principios para conocer más"
                />
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
                    <div className="w-full lg:w-[38%] flex flex-col gap-3">
                        {principleKeys.map((key) => (
                            <button
                                key={key}
                                type="button"
                                className={clsx(
                                    "flex justify-between items-center w-full px-5 py-4 rounded-xl cursor-pointer text-base sm:text-lg font-bold transition-all duration-300 border text-left",
                                    select === key
                                        ? "bg-blue-950 text-white border-blue-950 shadow-lg shadow-blue-950/20"
                                        : "bg-base-100 text-base-content/70 hover:border-primary/40 hover:shadow-sm border-base-200"
                                )}
                                onClick={() => setSelect(key)}
                            >
                                <span className="flex items-center gap-3 min-w-0">
                                    <span className={clsx("text-xl shrink-0", select === key ? "text-white" : "opacity-70")}>
                                        {principles[key].icon}
                                    </span>
                                    {principles[key].title}
                                </span>
                                <MdKeyboardArrowRight
                                    className={clsx(
                                        "text-2xl transition-transform shrink-0",
                                        select === key ? "rotate-90" : "opacity-40"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="w-full lg:w-[62%] bg-blue-950 rounded-2xl px-6 sm:px-10 py-8 sm:py-10 flex flex-col justify-center gap-4 shadow-md">
                        <h3 className="text-2xl sm:text-3xl font-black flex items-center gap-3 text-white">
                            <span className="text-white">{principles[select].icon}</span>
                            {principles[select].title}
                        </h3>
                        <p
                            key={select}
                            className="animate-fade-in-up text-sm sm:text-base leading-7 lg:leading-8 text-white/85 text-justify"
                        >
                            {principles[select].description}
                        </p>
                    </div>
                </div>
            </HomeSection>

            <HomeSection tinted>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 xl:gap-12 items-start">
                    <div className="xl:col-span-2">
                        <SectionHeading
                            title="Historia Corporativa"
                            subtitle="Análisis, innovación, normalización y certificación desde 1999"
                        />
                        <div className="bg-base-100 rounded-2xl p-4 sm:p-8 border border-base-200 shadow-sm">
                            <ul className="timeline timeline-snap-icon timeline-compact timeline-vertical">
                                {milestones.map((milestone, index) => (
                                    <li key={milestone.year}>
                                        {index > 0 && <hr className="bg-primary/30" />}
                                        <div className="timeline-middle">
                                            <FaCircleCheck className="text-primary text-xl" />
                                        </div>
                                        <div className="timeline-end timeline-box mb-6 md:mb-8 border-base-200 bg-base-100 shadow-sm rounded-xl max-w-none">
                                            <time className={clsx("font-black text-lg leading-none mb-1 block", theme === "dark" ? "text-base-content" : "text-blue-950")}>
                                                {milestone.year}
                                            </time>
                                            <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-justify text-base-content/80">
                                                {milestone.body(theme === "dark")}
                                            </p>
                                        </div>
                                        {index < milestones.length - 1 && (
                                            <hr className="bg-primary/30" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <aside className="flex flex-col">
                        <SectionHeading
                            title="Licitaciones"
                            subtitle="Instituciones gubernamentales que requieren alta calidad"
                            icon={FaLandmark}
                        />
                        <div className="flex flex-col gap-4">
                            {licitacionesLogos.map((logo) => (
                                <div
                                    key={logo.alt}
                                    className="bg-white rounded-2xl shadow-sm border border-base-200 p-6 flex flex-col items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                                >
                                    <img
                                        src={logo.url}
                                        alt={logo.alt}
                                        loading="lazy"
                                        className={clsx("object-contain mix-blend-multiply", logo.width)}
                                    />
                                    <p className="text-[11px] font-bold text-base-content/50 uppercase mt-3 tracking-widest">
                                        Acreditado
                                    </p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </HomeSection>

            <HomeSection>
                <SectionHeading
                    title="Servicios al Cliente"
                    subtitle="Maquila, distribución y soporte para tu operación"
                    icon={MdPrecisionManufacturing}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {servicesList.map((service, i) => (
                        <div
                            key={i}
                            className="flex gap-3 items-start bg-base-100 border border-base-200 rounded-xl px-4 py-3.5 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                        >
                            <FaCircleCheck className="text-success text-lg mt-0.5 shrink-0" />
                            <p className="text-xs sm:text-sm leading-5 sm:leading-6 opacity-80 text-justify">
                                {service}
                            </p>
                        </div>
                    ))}
                </div>
            </HomeSection>

            <HomeSection tinted id="conoce-nuestra-marca">
                <SectionHeading
                    title="Conoce nuestra marca"
                    subtitle="Videos y participaciones en exposiciones nacionales e internacionales"
                    center
                />

                <div className="flex items-center gap-2 mb-4">
                    <FaVideo className="text-primary shrink-0" aria-hidden="true" />
                    <h3 className="font-bold text-base-content">Videos</h3>
                    <span className="text-xs sm:text-sm text-base-content/50 ml-1 hidden sm:inline">
                        Toca un video para verlo en grande
                    </span>
                </div>
                <OverflowXComponent className="flex gap-4 md:gap-5 items-stretch pb-2">
                    {sampleVideos.map((video, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => openVideoLightbox(video)}
                            aria-label={`Ampliar ${video.title}`}
                            className="group flex flex-col w-40 sm:w-44 md:w-52 shrink-0 rounded-xl border border-base-200 bg-base-100 shadow-sm overflow-hidden cursor-zoom-in focus-visible:outline-2 focus-visible:outline-primary text-left hover:shadow-md transition-shadow duration-300"
                        >
                            <p className="text-xs md:text-sm font-semibold leading-snug line-clamp-2 px-3 pt-2 text-base-content h-12">
                                {video.title}
                            </p>
                            <div className="relative w-full aspect-[9/16] overflow-hidden bg-blue-base-300">
                                <iframe
                                    src={video.videoUrl}
                                    style={{ border: "none", overflow: "hidden" }}
                                    scrolling="no"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                    allowFullScreen
                                    title={video.title}
                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                />
                                <span className="absolute inset-0 grid place-items-center bg-blue-950/0 group-hover:bg-blue-950/25 transition-colors duration-300">
                                    <FaMagnifyingGlassPlus className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow" />
                                </span>
                            </div>
                        </button>
                    ))}
                </OverflowXComponent>

                <div className="flex items-center gap-2 mt-10 mb-4">
                    <FaImage className="text-primary shrink-0" aria-hidden="true" />
                    <h3 className="font-bold text-base-content">Exposiciones</h3>
                    <span className="text-xs sm:text-sm text-base-content/50 ml-1 hidden sm:inline">
                        Toca una imagen para ampliarla
                    </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {expoGallery.map((image, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => openLightbox(image)}
                            aria-label={`Ampliar ${image.alt}`}
                            className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-sm focus-visible:outline-2 focus-visible:outline-primary"
                        >
                            <img
                                src={image.url}
                                alt={image.alt}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <span className="absolute inset-0 grid place-items-center bg-blue-950/0 group-hover:bg-blue-950/25 transition-colors duration-300">
                                <FaMagnifyingGlassPlus className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow" />
                            </span>
                        </button>
                    ))}
                </div>

                <dialog id={IMAGE_LIGHTBOX_ID} className="modal">
                    <div className="modal-box w-[min(92vw,52rem)] max-w-[92vw] h-[min(82vh,46rem)] p-3 sm:p-4 flex flex-col gap-3 overflow-hidden">
                        <form method="dialog">
                            <button
                                aria-label="Cerrar"
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 bg-base-200/80 hover:bg-base-300"
                            >
                                ✕
                            </button>
                        </form>
                        <p className="text-xs sm:text-sm font-semibold text-base-content/70 truncate pr-8">
                            {activeImage?.alt}
                        </p>
                        <div className="flex-1 min-h-0 overflow-auto overscroll-contain bg-base-300/50 rounded-lg [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-base-content/20 [&::-webkit-scrollbar-track]:bg-transparent">
                            <img
                                src={activeImage?.url ?? ""}
                                alt={activeImage?.alt ?? ""}
                                className="block max-w-none min-w-full h-auto"
                            />
                        </div>
                    </div>
                </dialog>

                <dialog id={VIDEO_LIGHTBOX_ID} className="modal" onClose={() => setActiveVideo(null)}>
                    <div className="modal-box w-[min(92vw,24rem,calc(78vh*9/16))] max-w-[92vw] p-0 overflow-hidden bg-base-300">
                        <form method="dialog">
                            <button
                                aria-label="Cerrar"
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 text-primary bg-white border-0"
                            >
                                ✕
                            </button>
                        </form>
                        <div className="w-full aspect-9/16 bg-base-300">
                            {activeVideo && (
                                <iframe
                                    src={activeVideo.videoUrl}
                                    style={{ border: "none", overflow: "hidden" }}
                                    scrolling="no"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                    allowFullScreen
                                    title={activeVideo.title}
                                    className="w-full h-full"
                                />
                            )}
                        </div>
                        <p className="px-4 py-2.5 text-center text-xs sm:text-sm text-base-content/70 ">
                            {activeVideo?.title}
                        </p>
                    </div>
                </dialog>
            </HomeSection>

            <HomeSection>
                <SectionHeading
                    title="Encuéntranos"
                    subtitle="Visítanos en nuestras instalaciones en Coatzacoalcos, Veracruz"
                    icon={IoLocationSharp}
                />
                <div className="w-full h-72 sm:h-96 lg:h-[28rem] rounded-2xl overflow-hidden shadow-sm border border-base-200">
                    <iframe
                        src={MAPS_EMBED_URL}
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title="Ubicación de Iga Productos"
                        className="w-full h-full"
                    />
                </div>
            </HomeSection>
        </div>
    );
};

export default AboutIGA;
