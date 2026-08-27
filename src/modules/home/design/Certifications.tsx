import { useState } from "react";
import clsx from "clsx";
import Header1 from "../../../assets/headers/HEADER_1.webp";
import CertCorazaPlagoAM from "../../../assets/certs/certificacion-coraza-y-plagosur-am-clase-e.jpg";
import CertPlagosurC from "../../../assets/certs/certificacion-plagosur-c-coraza-a-i-clase-e.jpg";
import TestReportPlagosurAM from "../../../assets/certs/test-report-plagosur-am.jpg";
import TestReportPlagosurAMPDF from "../../../assets/certs/test-report-plagosur-am.pdf";
import CertAnceCorazaPlagosur from "../../../assets/certs/igaproductos-certificado-ance.pdf";
import { PiCertificateBold } from "react-icons/pi";
import { BiSolidCertification } from "react-icons/bi";
import { MdKeyboardArrowRight, MdOpenInNew } from "react-icons/md";
import { HiShieldCheck } from "react-icons/hi2";
import { IoDocumentText } from "react-icons/io5";
import { HomeSection, PageHero, SectionHeading, StampBadge } from "./shared";

type CertKey = "nom115" | "nmx055" | "cfe" | "pemex" | "ansi" | "iso9001";

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
        url: CertAnceCorazaPlagosur,
        image: CertCorazaPlagoAM,
        alt: "Certificado de conformidad de producto 1",
        label: "Certificado ANCE 1",
    },
    {
        url: CertAnceCorazaPlagosur,
        image: CertPlagosurC,
        alt: "Certificado de conformidad de producto 2",
        label: "Certificado ANCE 2",
    },
    {
        url: TestReportPlagosurAMPDF,
        image: TestReportPlagosurAM,
        alt: "Certificado de conformidad de producto 3",
        label: "Certificado ICS",
    },
];

const Certifications = () => {
    document.title = "Iga Productos | Cumplimientos Normativos";
    const [selected, setSelected] = useState<CertKey>("nom115");

    const current = certifications.find((c) => c.id === selected)!;

    return (
        <div className="px-3 sm:px-5 lg:px-8 pt-4 sm:pt-6 pb-16 sm:pb-24 animate-fade-in-up flex flex-col">
            <PageHero
                image={Header1}
                eyebrow="Plásticos del Golfo-Sur, S.A. de C.V."
                title="Cumplimientos Normativos"
                paragraphs={
                    <p>
                        Es una empresa 100% mexicana, certificada bajo la norma
                        ISO 9001:2015; especializada en la producción,
                        comercialización y distribución de lentes, barboquejos y
                        cascos de seguridad industrial.
                    </p>
                }
            />

            <HomeSection>
                <SectionHeading
                    title="Conoce nuestros cumplimientos normativos"
                    subtitle="Selecciona una norma para obtener más información"
                    icon={BiSolidCertification}
                />
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
                    <div className="w-full lg:w-[45%] flex flex-col gap-3">
                        {certifications.map((cert) => (
                            <button
                                key={cert.id}
                                type="button"
                                onClick={() => setSelected(cert.id)}
                                className={clsx(
                                    "flex items-center justify-between gap-3 w-full px-4 py-3.5 rounded-xl cursor-pointer text-left text-sm sm:text-base font-semibold transition-all duration-300 border",
                                    selected === cert.id
                                        ? "bg-blue-950 text-white border-blue-950 shadow-lg shadow-blue-950/20"
                                        : "bg-base-100 hover:border-primary/40 hover:shadow-sm border-base-200 text-base-content/75"
                                )}
                            >
                                <span className="min-w-0">{cert.label}</span>
                                <MdKeyboardArrowRight
                                    className={clsx(
                                        "text-xl transition-transform shrink-0",
                                        selected === cert.id ? "rotate-90" : "opacity-40"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="w-full lg:w-[55%] relative bg-blue-950 rounded-2xl px-6 sm:px-10 py-7 sm:py-9 overflow-hidden shadow-md flex flex-col justify-center">
                        <PiCertificateBold
                            className="absolute -right-5 -bottom-6 text-white/5 pointer-events-none"
                            aria-hidden="true"
                            size={170}
                        />
                        <div key={current.id} className="animate-fade-in-up relative">
                            <span className="text-[11px] sm:text-xs text-primary font-bold uppercase tracking-widest">
                                {current.category}
                            </span>
                            <p className="text-2xl sm:text-3xl font-black text-white mt-1 leading-tight">
                                {current.title}
                            </p>
                            <p className="text-sm sm:text-base leading-6 sm:leading-7 text-white/85 text-justify mt-4 max-w-prose">
                                {current.description}
                            </p>
                        </div>
                    </div>
                </div>
            </HomeSection>

            <HomeSection tinted>
                <SectionHeading
                    title="Empresa Certificada"
                    subtitle="Comprometidos con la calidad y la seguridad industrial"
                    icon={HiShieldCheck}
                />
                <div className="bg-blue-950 rounded-3xl px-6 sm:px-12 py-10 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 shadow-md">
                    <StampBadge icon={PiCertificateBold} className="text-white" />
                    <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                            Empresa certificada
                        </p>
                        <p className="text-white/70 text-sm sm:text-base max-w-sm">
                            Avalada por organismos nacionales e internacionales
                            de normalización
                        </p>
                    </div>
                </div>
            </HomeSection>

            <HomeSection>
                <SectionHeading
                    title="Certificados Oficiales"
                    subtitle="Haz clic en cualquier certificado para ver el documento completo"
                    icon={IoDocumentText}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {certImages.map((img) => (
                        <a
                            key={img.label}
                            href={img.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download="igaproductos-certificado-ance.pdf"
                            className="group relative rounded-2xl overflow-hidden border border-base-200 bg-base-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-primary"
                        >
                            <figure className="w-full overflow-hidden bg-base-200/40">
                                <img
                                    src={img.image}
                                    alt={img.alt}
                                    loading="lazy"
                                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                                />
                            </figure>
                            <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-base-200">
                                <span className="text-sm font-bold text-base-content truncate">
                                    {img.label}
                                </span>
                                <span className="flex items-center gap-1 text-primary text-xs font-semibold shrink-0">
                                    <MdOpenInNew /> Ver PDF
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </HomeSection>
        </div>
    );
};

export default Certifications;
