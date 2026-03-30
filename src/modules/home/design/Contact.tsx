import Header1 from "../../../assets/headers/HEADER_1.webp";
import IGALogo from "../../../assets/logo/IGA-LOGO.webp";
import { MdEmail, MdPhone, MdOpenInNew, MdContentCopy } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";
import { HiLightBulb, HiShieldCheck } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

/* ── Shared design tokens (same as AboutIGA.tsx / Certifications.tsx) ── */
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

const CONTACT_EMAIL = "atencionaclientes@igaproductos.com.mx";
const CONTACT_PHONE = "+529211963246";
const CONTACT_PHONE_DISPLAY = "+52 921 196 3246";
const WHATSAPP_URL = `https://wa.me/529211963246`;

const reasons = [
    { label: "Atención a cliente", icon: "👤" },
    { label: "Quejas y sugerencias", icon: "💬" },
    {
        label: "Devoluciones",
        icon: "↩️",
        note: "Ver política de devoluciones",
        link: "/politica-de-devolucion",
    },
    { label: "Quiero ser distribuidor", icon: "🤝" },
    { label: "Cotización", icon: "📋" },
    { label: "Ventas", icon: "🛒" },
    { label: "Facturación", icon: "🧾" },
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
            className="btn btn-xs btn-ghost gap-1 text-primary transition-all duration-200"
            title="Copiar mensaje de ejemplo"
        >
            {copied
                ? <IoCheckmarkCircle className="text-success text-base" />
                : <MdContentCopy className="text-base" />}
            {copied ? "¡Copiado!" : "Copiar"}
        </button>
    );
};

const Contact = () => {
    document.title = "Iga Productos | Contacto";
    return (
        <div className="w-full pt-6 sm:pt-10 pb-16 sm:pb-25 rounded-xl">
            <div className="w-full flex flex-col gap-10 md:gap-14 animate-fade-in-up">

                {/* ── HERO HEADER ─────────────────────────────────────────── */}
                <div
                    className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-60 py-6 sm:py-10 md:py-15 flex flex-col lg:flex-row text-white rounded-xl bg-cover bg-center lg:bg-right relative overflow-hidden"
                    style={{ backgroundImage: `url(${Header1})` }}
                >
                    {/* Overlay sutil para mejorar legibilidad */}
                    <div className="absolute inset-0 bg-black/30 rounded-xl" />

                    <div className="relative z-10 w-full lg:w-1/2 mb-6 lg:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-0.5 bg-primary rounded-full" />
                            <span className="text-white/70 text-xs uppercase tracking-widest font-semibold">IGA Productos</span>
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold leading-tight drop-shadow-md">Contacto</p>
                        <section className="text-sm sm:text-base leading-7 text-white/90 mt-4 sm:mt-5 space-y-3 max-w-prose drop-shadow">
                            <p>
                                Estamos disponibles para atenderte por correo electrónico o vía
                                WhatsApp. Elige el canal que más te convenga y con gusto un
                                ejecutivo te dará atención personalizada.
                            </p>
                            <p>
                                Para una atención más ágil, incluye tu nombre, empresa, teléfono
                                y el motivo de tu contacto al escribirnos.
                            </p>
                        </section>

                        {/* Badges de canales disponibles */}
                        <div className="flex flex-wrap gap-2 mt-5">
                            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                                <MdEmail className="text-sm" /> Correo electrónico
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                                <FaWhatsapp className="text-sm text-green-400" /> WhatsApp
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                                <MdPhone className="text-sm" /> Teléfono
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center lg:items-end">
                        <figure className="lg:ml-10 w-full sm:w-3/4 max-w-sm drop-shadow-2xl">
                            <img src={IGALogo} alt="IGA productos Logo" className="w-full h-auto" />
                        </figure>
                    </div>
                </div>

                {/* ── CANALES DE CONTACTO ──────────────────────────────────── */}
                <div className="home-section">
                    <SectionBar />
                    <SectionTitle>Medios de contacto</SectionTitle>
                    <SectionSubtitle icon={<HiShieldCheck />}>
                        Elige el canal que prefieras para comunicarte con nosotros
                    </SectionSubtitle>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

                        {/* Email card */}
                        <div className="bg-slate-900 rounded-xl px-6 sm:px-10 py-8 flex flex-col gap-4 border border-slate-700/50 hover:border-primary/40 transition-colors duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/20 text-primary p-3 rounded-xl flex-shrink-0 group-hover:bg-primary/30 transition-colors duration-300">
                                    <MdEmail className="text-3xl" />
                                </div>
                                <div>
                                    <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">
                                        Correo electrónico
                                    </p>
                                    <p className="text-white font-bold text-sm sm:text-base lg:text-lg break-all leading-snug">
                                        {CONTACT_EMAIL}
                                    </p>
                                </div>
                            </div>

                            <p className="text-white/65 text-sm sm:text-base leading-6">
                                Envíanos un correo con tus datos y el asunto de tu consulta.
                                Te respondemos en un plazo máximo de{" "}
                                <strong className="text-white/90">24–48 horas hábiles</strong>.
                            </p>

                            {/* Indicador de tiempo de respuesta */}
                            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                                <span className="text-primary text-xs font-medium">Tiempo de respuesta: 24–48 horas hábiles</span>
                            </div>

                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="btn btn-primary w-full gap-2 mt-auto"
                            >
                                <MdEmail className="text-lg" />
                                Enviar correo
                            </a>
                        </div>

                        {/* WhatsApp / Phone card */}
                        <div className="bg-slate-900 rounded-xl px-6 sm:px-10 py-8 flex flex-col gap-4 border border-slate-700/50 hover:border-green-500/40 transition-colors duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-500/20 text-green-400 p-3 rounded-xl flex-shrink-0 group-hover:bg-green-500/30 transition-colors duration-300">
                                    <FaWhatsapp className="text-3xl" />
                                </div>
                                <div>
                                    <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">
                                        WhatsApp / Teléfono
                                    </p>
                                    <p className="text-white font-bold text-base sm:text-lg leading-snug">
                                        {CONTACT_PHONE_DISPLAY}
                                    </p>
                                </div>
                            </div>

                            <p className="text-white/65 text-sm sm:text-base leading-6">
                                Llámanos o mándanos un mensaje de WhatsApp directamente.
                                Atención en{" "}
                                <strong className="text-white/90">horario de oficina</strong>.
                            </p>

                            {/* Indicador de disponibilidad */}
                            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                                <span className="text-green-400 text-xs font-medium">Disponible en horario de oficina</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success flex-1 gap-2 text-white"
                                >
                                    <FaWhatsapp className="text-lg" />
                                    WhatsApp
                                </a>
                                <a

                                    href={`tel:${CONTACT_PHONE}`}
                                    className="btn btn-outline btn-success flex-1 gap-2"
                                >
                                    <MdPhone className="text-lg" />
                                    Llamar
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── ASUNTOS DISPONIBLES ──────────────────────────────────── */}
                <div className="home-section">
                    <SectionBar />
                    <SectionTitle>Asuntos de contacto</SectionTitle>
                    <SectionSubtitle icon={<BiMessageDetail />}>
                        Indica el asunto al inicio de tu mensaje para una atención más ágil
                    </SectionSubtitle>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {reasons.map((r) => (
                            <div
                                key={r.label}
                                className="bg-base-100 rounded-xl px-5 py-4 flex items-start gap-3 border border-base-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                            >
                                <span className="text-2xl flex-shrink-0 leading-none mt-0.5">{r.icon}</span>
                                <div className="min-w-0">
                                    <p className="font-semibold text-sm sm:text-base leading-snug">{r.label}</p>
                                    {r.note && r.link && (
                                        <a
                                            href={r.link}
                                            className="text-primary text-xs flex items-center gap-1 mt-1.5 hover:underline font-medium"
                                        >
                                            <MdOpenInNew className="flex-shrink-0 text-sm" />
                                            {r.note}
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CÓMO REDACTAR TU MENSAJE ─────────────────────────────── */}
                <div className="home-section">
                    <SectionBar />
                    <SectionTitle>¿Cómo redactar tu mensaje?</SectionTitle>
                    <SectionSubtitle icon={<HiLightBulb />}>
                        Incluir estos datos agiliza tu atención y evita retrasos
                    </SectionSubtitle>

                    <div className="mt-5 flex flex-col lg:flex-row gap-5">

                        {/* Instrucciones */}
                        <div className="w-full lg:w-1/2 bg-base-100 rounded-xl px-6 sm:px-8 py-6 flex flex-col gap-4 border border-base-200">
                            <p className="font-bold text-base sm:text-lg">Incluye los siguientes datos:</p>

                            <ul className="flex flex-col gap-2.5 text-sm sm:text-base">
                                {[
                                    ["Asunto", "Ej: Cotización, Facturación, Devoluciones…"],
                                    ["Nombre completo", "Tu nombre y apellidos"],
                                    ["Empresa", "Nombre de tu empresa o razón social (si aplica)"],
                                    ["Teléfono de contacto", "Con código de país, ej: +52 921 XXX XXXX"],
                                    ["Cuerpo de tu solicitud", "Escribe tu solicitud de manera clara y concisa"],
                                ].map(([field, hint], i) => (
                                    <li key={field} className="flex items-start gap-3 bg-base-200/50 rounded-lg px-3 py-2.5">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold mt-0.5">
                                            {i + 1}
                                        </span>
                                        <span>
                                            <strong className="text-base-content">{field}:</strong>{" "}
                                            <span className="text-base-content/60 text-xs sm:text-sm">{hint}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 text-sm sm:text-base text-primary font-medium flex items-start gap-2">
                                <span className="flex-shrink-0 mt-0.5">💡</span>
                                <span>Cuanta más información nos brindes, más precisa y rápida será nuestra respuesta.</span>
                            </div>
                        </div>

                        {/* Ejemplo de mensaje */}
                        <div className="w-full lg:w-1/2 bg-slate-900 rounded-xl px-6 sm:px-8 py-6 flex flex-col gap-3 border border-slate-700/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/* Dot indicators estilo terminal */}
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                                    <p className="font-semibold text-white/80 text-sm sm:text-base ml-2">Ejemplo de mensaje</p>
                                </div>
                                <CopyButton text={exampleMessage} />
                            </div>

                            <pre className="text-white/75 text-xs sm:text-sm leading-6 sm:leading-7 whitespace-pre-wrap font-mono bg-white/5 rounded-xl px-4 py-4 flex-1 border border-white/5">
                                {exampleMessage}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* ── MAPA ─────────────────────────────────────────────────── */}
                <div className="home-section">
                    <SectionBar />
                    <SectionTitle>Encuéntranos</SectionTitle>
                    <SectionSubtitle icon={<MdPhone />}>
                        Visítanos en nuestras instalaciones en Coatzacoalcos, Veracruz
                    </SectionSubtitle>

                    <div className="mt-5 w-full h-72 sm:h-96 lg:h-[28rem] rounded-xl overflow-hidden shadow-2xl border border-base-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3792.2139536792088!2d-94.45189435!3d18.10790835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85e98343453e5afd%3A0x22e09f3a6b82a914!2sIga%20Productos!5e0!3m2!1ses-419!2smx!4v1761233007110!5m2!1ses-419!2smx"
                            className="w-full h-full"
                            allowFullScreen
                            loading="lazy"
                            title="Ubicación de IGA Productos"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;