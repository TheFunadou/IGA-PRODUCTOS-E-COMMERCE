import { useState } from "react";
import { PiCertificateBold } from "react-icons/pi";
import { BiSolidCertification } from "react-icons/bi";
import { MdKeyboardArrowRight, MdOpenInNew } from "react-icons/md";
import { HiShieldCheck } from "react-icons/hi2";
import { IoDocumentText } from "react-icons/io5";
import clsx from "clsx";
import Header1 from "../../../assets/headers/HEADER_1.webp";
import IGALogo from "../../../assets/logo/IGA-LOGO.webp";

/* ── Shared design tokens (same as AboutIGA.tsx) ─────────── */
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
            {icon && <span className="text-xl flex-shrink-0">{icon}</span>}
            {children}
        </p>
    </div>
);
/* ─────────────────────────────────────────────────────────── */

type CertKey =
    | "nom115"
    | "nmx055"
    | "cfe"
    | "pemex"
    | "ansi"
    | "iso9001";

interface Cert {
    id: CertKey;
    label: string;
    title: string;
    description: string;
    category: string;
}

const certifications: Cert[] = [
    {
        id: "nom115",
        label: "NOM-115-STPS-2009",
        title: "NOM-115-STPS-2009",
        category: "Norma Oficial Mexicana",
        description:
            "La norma oficial mexicana establece los requisitos mínimos que deberán cumplir los cascos de protección que se comercializan en territorio nacional.",
    },
    {
        id: "nmx055",
        label: "NMX-S-055-SCFI-2002",
        title: "NMX-S-055-SCFI-2002",
        category: "Norma Mexicana",
        description:
            "La norma mexicana establece los requisitos mínimos y los métodos de prueba que deben cumplir, de acuerdo a su clasificación, los cascos de protección industrial que se utilizan en los centros de trabajo.",
    },
    {
        id: "cfe",
        label: "CFE: 8H 342-02",
        title: "CFE: 8H 342-02",
        category: "Comisión Federal de Electricidad",
        description:
            "Establece las características técnicas que deben cumplir los cascos de protección contra impactos y de manera limitada contra descargas eléctricas.",
    },
    {
        id: "pemex",
        label: "PEMEX-EST-SS-058-2018",
        title: "PEMEX-EST-SS-058-2018",
        category: "Petróleos Mexicanos",
        description:
            "El Estándar Técnico establece los requisitos técnicos que deben cumplir los cascos de protección para la cabeza de uso industrial; así como los requisitos documentales y la hoja de especificaciones respectiva.",
    },
    {
        id: "ansi",
        label: "ANSI/ISEA Z89.1-2014",
        title: "ANSI/ISEA Z89.1-2014 (R2019)",
        category: "Norma Internacional",
        description:
            "Esta norma establece los requisitos mínimos de rendimiento para cascos protectores que reducen las fuerzas de impacto y la penetración y que puedan proporcionar protección contra descargas eléctricas (no para arco eléctrico).",
    },
    {
        id: "iso9001",
        label: "ISO 9001:2015",
        title: "ISO 9001:2015",
        category: "Sistema de Gestión de Calidad",
        description:
            "Es el estándar internacional de carácter certificable que regula los Sistemas de Gestión de la Calidad, garantizando la satisfacción del cliente y la mejora continua.",
    },
];

const certImages = [
    {
        src: "https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/1portadaancejpg_P%C3%A1gina_1.jpg",
        alt: "Certificado de conformidad de producto 1",
        label: "Certificado ANCE 1",
    },
    {
        src: "https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/2portadaance.jpg",
        alt: "Certificado de conformidad de producto 2",
        label: "Certificado ANCE 2",
    },
    {
        src: "https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/3portadaics_P%C3%A1gina_1.jpg",
        alt: "Certificado de conformidad de producto 3",
        label: "Certificado ICS",
    },
];

const Certifications = () => {
    document.title = "Iga Productos | Cumplimientos Normativos";
    const [selected, setSelected] = useState<CertKey>("nom115");

    const current = certifications.find((c) => c.id === selected)!;

    return (
        <div className="w-full pt-6 sm:pt-10 pb-16 sm:pb-25 rounded-xl">
            <div className="w-full flex flex-col gap-10 md:gap-14 animate-fade-in-up">

                {/* ── HERO HEADER ─────────────────────────────────────────── */}
                <div
                    className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-60 py-6 sm:py-10 md:py-15 flex flex-col lg:flex-row text-white rounded-xl bg-cover bg-center lg:bg-right"
                    style={{ backgroundImage: `url(${Header1})` }}
                >
                    <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
                        <p className="text-2xl sm:text-3xl font-bold">Cumplimientos Normativos</p>
                        <section className="text-base sm:text-lg leading-6 sm:leading-8 text-justify mt-3 sm:mt-5">
                            <p>
                                <strong>Plásticos del Golfo-Sur, S.A. de C.V.</strong> Es una
                                empresa 100% mexicana, certificada bajo la norma ISO 9001:2015;
                                especializada en la producción, comercialización y distribución
                                de lentes, barboquejos y cascos de seguridad industrial.
                            </p>
                        </section>
                    </div>
                    <div className="w-full lg:w-1/2 flex items-center justify-center lg:items-end">
                        <figure className="lg:ml-10 w-full sm:w-3/4 max-w-sm">
                            <img src={IGALogo} alt="IGA productos Logo" className="w-full h-auto" />
                        </figure>
                    </div>
                </div>

                {/* ── NORMAS INTERACTIVAS ──────────────────────────────────── */}
                <div className="home-section">
                    <SectionBar />
                    <SectionTitle>Conoce nuestros cumplimientos normativos</SectionTitle>
                    <SectionSubtitle icon={<BiSolidCertification />}>
                        Da clic en cada norma para obtener más información
                    </SectionSubtitle>

                    <div className="mt-5 flex flex-col lg:flex-row gap-5">
                        {/* Selector list */}
                        <div className="w-full lg:w-1/2 p-4 sm:p-5 bg-base-100 rounded-xl">
                            <div className="flex flex-col gap-3 sm:gap-4 mt-2">
                                {certifications.map((cert) => (
                                    <button
                                        key={cert.id}
                                        onClick={() => setSelected(cert.id)}
                                        className={clsx(
                                            "flex items-center gap-2 cursor-pointer text-base sm:text-xl font-medium transition-colors text-left",
                                            selected === cert.id ? "text-primary" : ""
                                        )}
                                    >
                                        <MdKeyboardArrowRight
                                            className={clsx(
                                                "flex-shrink-0 transition-transform",
                                                selected === cert.id ? "rotate-90 text-primary" : ""
                                            )}
                                        />
                                        {cert.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Detail panel */}
                        <div className="w-full lg:w-1/2 bg-slate-900 rounded-xl px-6 sm:px-10 lg:px-12 py-6 flex flex-col justify-between gap-4">
                            <div>
                                <span className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-widest">
                                    {current.category}
                                </span>
                                <p className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 mt-1">
                                    {current.title}
                                    <BiSolidCertification className="text-primary flex-shrink-0" />
                                </p>
                                <p className="text-base sm:text-lg leading-6 sm:leading-7 text-white text-justify mt-4">
                                    {current.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── EMPRESA CERTIFICADA ──────────────────────────────────── */}
                <div className="home-section">
                    <SectionBar />
                    <SectionTitle>Empresa Certificada</SectionTitle>
                    <SectionSubtitle icon={<HiShieldCheck />}>
                        Comprometidos con la calidad y la seguridad industrial
                    </SectionSubtitle>

                    <div className="mt-5 w-full bg-blue-950 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-10 px-6">
                        <figure className="w-3/4 sm:w-1/3 max-w-xs">
                            <img src={IGALogo} alt="IGA productos Logo" className="w-full h-auto" />
                        </figure>
                        <div className="flex flex-col items-center sm:items-start gap-2">
                            <PiCertificateBold className="text-white text-6xl sm:text-7xl" />
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white text-center sm:text-left">
                                Empresa certificada
                            </p>
                            <p className="text-white/70 text-sm sm:text-base text-center sm:text-left max-w-xs">
                                Avalada por organismos nacionales e internacionales de normalización
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── CERTIFICADOS OFICIALES ───────────────────────────────── */}
                <div className="home-section">
                    <SectionBar />
                    <SectionTitle>Certificados Oficiales</SectionTitle>
                    <SectionSubtitle icon={<IoDocumentText />}>
                        Haz clic en cualquier certificado para ver el documento completo
                    </SectionSubtitle>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        {certImages.map((img) => (
                            <a
                                key={img.src}
                                href={img.src}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                            >
                                <figure className="w-full">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-auto rounded-xl group-hover:opacity-80 transition-opacity"
                                    />
                                </figure>
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent rounded-xl pointer-events-none">
                                    <span className="text-white text-sm font-semibold flex items-center gap-1">
                                        <MdOpenInNew /> Ver certificado
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Certifications;