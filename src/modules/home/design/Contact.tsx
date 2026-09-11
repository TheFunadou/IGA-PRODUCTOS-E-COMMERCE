import { useState } from "react";
import Header1 from "../../../assets/headers/HEADER_1.webp";
import {
    MdEmail,
    MdPhone,
    MdOpenInNew,
    MdContentCopy,
    MdFeedback,
    MdAssignmentReturn,
    MdRequestQuote,
    MdShoppingCart,
    MdReceiptLong,
    MdContacts,
} from "react-icons/md";
import { IoCheckmarkCircle, IoLocationSharp } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";
import { HiLightBulb } from "react-icons/hi2";
import { FaHandshake, FaHeadset, FaWhatsapp } from "react-icons/fa6";
import type { ReactNode } from "react";
import { trackLead } from "../../analytics/MetaEvents";
import { HomeSection, PageHero, SectionHeading, HeroPill } from "./shared";

const CONTACT_EMAIL = "atencionaclientes@igaproductos.com";
const CONTACT_PHONE = "+529211963246";
const CONTACT_PHONE_DISPLAY = "+52 921 196 3246";
const WHATSAPP_URL = `https://wa.me/529211963246`;

interface ContactReason {
    label: string;
    icon: ReactNode;
    note?: string;
    link?: string;
}

const reasons: ContactReason[] = [
    { label: "Atención a cliente", icon: <FaHeadset /> },
    { label: "Quejas y sugerencias", icon: <MdFeedback /> },
    {
        label: "Devoluciones",
        icon: <MdAssignmentReturn />,
        note: "Ver política de devoluciones",
        link: "/politica-de-devolucion",
    },
    { label: "Quiero ser distribuidor", icon: <FaHandshake /> },
    { label: "Cotización", icon: <MdRequestQuote /> },
    { label: "Ventas", icon: <MdShoppingCart /> },
    { label: "Facturación", icon: <MdReceiptLong /> },
];

const exampleMessage = `Asunto: Cotización
Buenos días,
Mi nombre es [Tu nombre completo].
Empresa: [Nombre de tu empresa]
Teléfono: [Tu número con código de país]
Buen dia, me gustaria realizar una cotizacion del producto [Nombre del producto] con las especificaciones y cumplimientos normativos...etc.
Quedo en espera de su respuesta.
Atentamente,
[Tu nombre]`;

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="btn btn-xs btn-ghost gap-1 text-blue-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            title="Copiar mensaje de ejemplo"
        >
            {copied ? (
                <IoCheckmarkCircle className="text-success text-base" />
            ) : (
                <MdContentCopy className="text-base" />
            )}
            {copied ? "¡Copiado!" : "Copiar"}
        </button>
    );
};

const messageFields: [string, string][] = [
    ["Asunto", "Ej: Cotización, Facturación, Devoluciones…"],
    ["Nombre completo", "Tu nombre y apellidos"],
    ["Empresa", "Nombre de tu empresa o razón social (si aplica)"],
    ["Teléfono de contacto", "Con código de país, ej: +52 921 XXX XXXX"],
    ["Cuerpo de tu solicitud", "Escribe tu solicitud de manera clara y concisa"],
];

const Contact = () => {
    document.title = "Iga Productos | Contacto";

    return (
        <div className="px-3 sm:px-5 lg:px-8 pt-4 sm:pt-6 pb-16 sm:pb-24 animate-fade-in-up flex flex-col">
            <PageHero
                image={Header1}
                eyebrow="Iga Productos"
                title="Contacto"
                paragraphs={
                    <>
                        <p>
                            Estamos disponibles para atenderte por correo
                            electrónico o vía WhatsApp. Elige el canal que más te
                            convenga y con gusto un ejecutivo te dará atención
                            personalizada.
                        </p>
                        <p>
                            Para una atención más ágil, incluye tu nombre,
                            empresa, teléfono y el motivo de tu contacto al
                            escribirnos.
                        </p>
                    </>
                }
                badges={
                    <>
                        <HeroPill icon={<MdEmail className="text-sm" />}>
                            Correo electrónico
                        </HeroPill>
                        <HeroPill icon={<FaWhatsapp className="text-sm text-green-400" />}>
                            WhatsApp
                        </HeroPill>
                        <HeroPill icon={<MdPhone className="text-sm" />}>
                            Teléfono
                        </HeroPill>
                    </>
                }
            />

            <HomeSection>
                <SectionHeading
                    title="Medios de contacto"
                    subtitle="Elige el canal que prefieras para comunicarte con nosotros"
                    icon={MdContacts}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="bg-blue-950 rounded-2xl px-6 sm:px-8 py-7 flex flex-col gap-4 shadow-md">
                        <div className="flex items-start gap-4">
                            <span className="bg-white/10 text-white p-3 rounded-xl shrink-0">
                                <MdEmail className="text-2xl" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-white/50 text-[11px] uppercase tracking-widest font-bold mb-1">
                                    Correo electrónico
                                </p>
                                <p className="text-white font-bold text-sm sm:text-base break-all leading-snug">
                                    {CONTACT_EMAIL}
                                </p>
                            </div>
                        </div>

                        <p className="text-white/70 text-sm leading-6">
                            Envíanos un correo con tus datos y el asunto de tu
                            consulta. Te respondemos en un plazo máximo de{" "}
                            <strong className="text-white/90">
                                24–48 horas hábiles
                            </strong>
                            .
                        </p>

                        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 mt-auto">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
                            <span className="text-blue-100 text-xs font-medium">
                                Tiempo de respuesta: 24–48 horas hábiles
                            </span>
                        </div>

                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="btn w-full rounded-xl border-0 bg-white text-blue-950 hover:bg-blue-100 gap-2"
                            onClick={() => trackLead()}
                        >
                            <MdEmail className="text-lg" />
                            Enviar correo
                        </a>
                    </div>

                    <div className="bg-blue-950 rounded-2xl px-6 sm:px-8 py-7 flex flex-col gap-4 shadow-md">
                        <div className="flex items-start gap-4">
                            <span className="bg-green-500/20 text-green-400 p-3 rounded-xl shrink-0">
                                <FaWhatsapp className="text-2xl" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-white/50 text-[11px] uppercase tracking-widest font-bold mb-1">
                                    WhatsApp / Teléfono
                                </p>
                                <p className="text-white font-bold text-base sm:text-lg leading-snug">
                                    {CONTACT_PHONE_DISPLAY}
                                </p>
                            </div>
                        </div>

                        <p className="text-white/70 text-sm leading-6">
                            Llámanos o mándanos un mensaje de WhatsApp
                            directamente. Atención en{" "}
                            <strong className="text-white/90">
                                horario de oficina
                            </strong>
                            .
                        </p>

                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 mt-auto">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                            <span className="text-green-300 text-xs font-medium">
                                Disponible en horario de oficina
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-success flex-1 rounded-xl gap-2 text-white border-0 hover:bg-green-600"
                                onClick={() => trackLead()}
                            >
                                <FaWhatsapp className="text-lg" />
                                WhatsApp
                            </a>
                            <a
                                href={`tel:${CONTACT_PHONE}`}
                                className="btn btn-outline btn-success flex-1 rounded-xl gap-2"
                                onClick={() => trackLead()}
                            >
                                <MdPhone className="text-lg" />
                                Llamar
                            </a>
                        </div>
                    </div>
                </div>
            </HomeSection>

            <HomeSection tinted>
                <SectionHeading
                    title="Asuntos de contacto"
                    subtitle="Indica el asunto al inicio de tu mensaje para una atención más ágil"
                    icon={BiMessageDetail}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {reasons.map((r) => (
                        <div
                            key={r.label}
                            className="bg-base-100 rounded-xl px-4 py-3.5 flex items-start gap-3 border border-base-200 hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-default"
                        >
                            <span className="text-primary text-xl mt-0.5 shrink-0 leading-none">
                                {r.icon}
                            </span>
                            <div className="min-w-0">
                                <p className="font-semibold text-sm sm:text-base leading-snug">
                                    {r.label}
                                </p>
                                {r.note && r.link && (
                                    <a
                                        href={r.link}
                                        className="text-primary text-xs flex items-center gap-1 mt-1 hover:underline font-medium"
                                    >
                                        <MdOpenInNew className="shrink-0 text-sm" />
                                        {r.note}
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </HomeSection>

            <HomeSection>
                <SectionHeading
                    title="¿Cómo redactar tu mensaje?"
                    subtitle="Incluir estos datos agiliza tu atención y evita retrasos"
                    icon={HiLightBulb}
                />
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-stretch">
                    <div className="w-full lg:w-1/2 bg-base-100 rounded-2xl px-5 sm:px-7 py-6 flex flex-col gap-3 border border-base-200">
                        <p className="font-black text-base sm:text-lg text-blue-950">
                            Incluye los siguientes datos:
                        </p>
                        <ol className="flex flex-col gap-2.5">
                            {messageFields.map(([field, hint], i) => (
                                <li
                                    key={field}
                                    className="flex items-start gap-3 bg-base-200/50 rounded-lg px-3 py-2.5"
                                >
                                    <span className="shrink-0 w-5 h-5 rounded-full bg-blue-950 text-white text-xs grid place-items-center font-bold mt-0.5">
                                        {i + 1}
                                    </span>
                                    <span className="min-w-0">
                                        <strong className="text-base-content">{field}:</strong>{" "}
                                        <span className="text-base-content/60 text-xs sm:text-sm">
                                            {hint}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ol>
                        <div className="mt-auto bg-primary/10 border border-primary/25 rounded-xl px-4 py-3 text-xs sm:text-sm text-primary font-medium flex items-start gap-2">
                            <HiLightBulb className="shrink-0 mt-0.5 text-base" />
                            <span>
                                Cuanta más información nos brindes, más precisa
                                y rápida será nuestra respuesta.
                            </span>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 bg-blue-950 rounded-2xl px-5 sm:px-7 py-6 flex flex-col gap-3 shadow-md">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 shrink-0" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 shrink-0" />
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 shrink-0" />
                                <p className="font-semibold text-white/80 text-sm ml-2 truncate">
                                    Ejemplo de mensaje
                                </p>
                            </div>
                            <CopyButton text={exampleMessage} />
                        </div>
                        <pre className="text-white/75 text-xs leading-6 whitespace-pre-wrap font-mono bg-white/5 rounded-xl px-4 py-4 flex-1 border border-white/10 overflow-x-auto">
                            {exampleMessage}
                        </pre>
                    </div>
                </div>
            </HomeSection>

            <HomeSection tinted>
                <SectionHeading
                    title="Encuéntranos"
                    subtitle="Visítanos en nuestras instalaciones en Coatzacoalcos, Veracruz"
                    icon={IoLocationSharp}
                />
                <div className="w-full h-72 sm:h-96 lg:h-[28rem] rounded-2xl overflow-hidden shadow-sm border border-base-200">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3792.2139536792088!2d-94.45189435!3d18.10790835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85e98343453e5afd%3A0x22e09f3a6b82a914!2sIga%20Productos!5e0!3m2!1ses-419!2smx!4v1761233007110!5m2!1ses-419!2smx"
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

export default Contact;
