import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ── Shared design tokens (matching PrivacyPolicy) ────────── */
const SectionBar = () => (
    <div className="bg-primary px-10 py-1 w-fit rounded-xl shadow-lg" />
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="px-2 py-1 w-fit rounded-xl border border-base-300 bg-base-300 text-2xl sm:text-3xl lg:text-4xl font-bold">
        {children}
    </h2>
);

/* ── Nav item ─────────────────────────────────────────────── */
function NavItem({
    href,
    label,
    index,
    active,
    onClick,
}: {
    href: string;
    label: string;
    index: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <li>
            <a
                href={href}
                onClick={onClick}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group
                    ${active
                        ? "bg-primary text-white shadow-sm"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
            >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-colors
                    ${active ? "bg-white/20 text-white" : "bg-white/10 text-slate-400 group-hover:text-white"}`}>
                    {index}
                </span>
                <span className="leading-snug">{label}</span>
            </a>
        </li>
    );
}

/* ── Section block ────────────────────────────────────────── */
function PolicySection({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div id={id} className="scroll-mt-6">
            <div className="flex flex-col gap-2 mb-4">
                <SectionBar />
                <SectionTitle>{title}</SectionTitle>
            </div>
            <div className="bg-base-100 rounded-xl px-5 sm:px-8 py-5 sm:py-6 text-justify text-sm sm:text-base leading-7 sm:leading-8 text-base-content/80">
                {children}
            </div>
        </div>
    );
}

const TermsAndConditions = () => {
    const [activeSection, setActiveSection] = useState("acceptance");
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const sections = [
        { id: "acceptance", label: "Aceptación de términos" },
        { id: "use-of-site", label: "Uso del sitio y cuenta" },
        { id: "intellectual-property", label: "Propiedad Intelectual" },
        { id: "purchases-payments", label: "Compras y Pagos" },
        { id: "shipping-delivery", label: "Envíos y Entregas" },
        { id: "returns-exchanges", label: "Cambios y Devoluciones" },
        { id: "liability", label: "Limitación de responsabilidad" },
        { id: "modifications", label: "Modificaciones" },
    ];

    /* Intersection observer to highlight active nav item */
    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
                { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach((o) => o.disconnect());
    }, []);

    const handleNavClick = (id: string) => {
        setActiveSection(id);
        setMobileNavOpen(false);
    };

    return (
        <section className="w-full bg-base-300 rounded-xl px-3 sm:px-5 py-6 sm:py-10">

            {/* ── Mobile nav toggle ─────────────────────────────── */}
            <div className="lg:hidden mb-5">
                <button
                    onClick={() => setMobileNavOpen((v) => !v)}
                    className="w-full flex items-center justify-between bg-blue-950 text-white rounded-xl px-5 py-3 font-semibold text-sm shadow"
                >
                    <span>📋 Directorio de términos</span>
                    <span className="text-lg">{mobileNavOpen ? "▲" : "▼"}</span>
                </button>
                {mobileNavOpen && (
                    <div className="mt-2 bg-blue-950 text-white rounded-xl p-4 shadow-lg">
                        <ul className="flex flex-col gap-1">
                            {sections.map(({ id, label }, i) => (
                                <NavItem
                                    key={id}
                                    href={`#${id}`}
                                    label={label}
                                    index={i + 1}
                                    active={activeSection === id}
                                    onClick={() => handleNavClick(id)}
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex gap-6 xl:gap-8">

                {/* ── Sidebar nav (desktop) ─────────────────────────── */}
                <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
                    <div className="bg-blue-950 text-white rounded-xl p-5 sticky top-30 shadow-lg">
                        <p className="text-base font-bold mb-1 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                            Directorio
                        </p>
                        <p className="text-[0.70rem] text-slate-400 mb-4 leading-relaxed">
                            Reglas de uso y condiciones comerciales de IGA Productos.
                        </p>
                        <ul className="flex flex-col gap-1">
                            {sections.map(({ id, label }, i) => (
                                <NavItem
                                    key={id}
                                    href={`#${id}`}
                                    label={label}
                                    index={i + 1}
                                    active={activeSection === id}
                                    onClick={() => handleNavClick(id)}
                                />
                            ))}
                        </ul>
                        <div className="mt-5 pt-4 border-t border-white/10">
                            <p className="text-[0.68rem] text-slate-500 leading-relaxed text-center">
                                Versión vigente<br />
                                <span className="text-slate-400 font-medium">Marzo 2026</span>
                            </p>
                        </div>
                    </div>
                </aside>

                {/* ── Main content ──────────────────────────────────── */}
                <div ref={contentRef} className="flex-1 min-w-0 flex flex-col gap-8 sm:gap-10 pb-6">

                    {/* INTRO / ACEPTACIÓN */}
                    <div id="acceptance" className="scroll-mt-6">
                        <div className="flex flex-col gap-2 mb-4">
                            <SectionBar />
                            <h1 className="px-2 py-1 w-fit rounded-xl border border-base-300 bg-base-300 text-2xl sm:text-3xl lg:text-4xl font-bold">
                                Términos y Condiciones
                            </h1>
                        </div>
                        <div className="bg-blue-950 rounded-xl px-5 sm:px-8 py-6 sm:py-8">
                            <p className="text-white/90 text-sm sm:text-base leading-7 sm:leading-8 text-justify">
                                Bienvenido a IGA Productos. Al acceder y utilizar este sitio web, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, le solicitamos abstenerse de utilizar nuestra plataforma.
                            </p>
                            <p className="text-white/90 text-sm sm:text-base leading-7 sm:leading-8 text-justify mt-4">
                                Estos términos rigen la relación comercial entre IGA Productos y sus usuarios, incluyendo la navegación, el uso de cuentas personales y el proceso de adquisición de productos a través de nuestra tienda en línea.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                {["Transacciones seguras", "Cumplimiento normativo", "Respeto al usuario"].map((badge) => (
                                    <span key={badge} className="bg-primary/20 border border-primary/30 text-white text-[0.72rem] font-semibold px-3 py-1 rounded-full">
                                        ✓ {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* USO DEL SITIO */}
                    <PolicySection id="use-of-site" title="Uso del sitio y cuenta">
                        <p>
                            Para acceder a ciertas funciones como el historial de pedidos o favoritos, es necesario crear una cuenta de usuario. Usted es responsable de mantener la confidencialidad de sus datos de acceso y de todas las actividades que ocurran bajo su cuenta.
                        </p>
                        <br />
                        <p><strong>Conducta del usuario:</strong></p>
                        <ul className="list-disc ml-5 mt-2 space-y-2">
                            <li>No se permite el uso de la plataforma para fines ilícitos o fraudulentos.</li>
                            <li>Los comentarios y reseñas deben ser respetuosos. IGA Productos se reserva el derecho de eliminar contenido ofensivo, spam o ataques personales.</li>
                            <li>Queda prohibido cualquier intento de vulnerar la seguridad de nuestra API o servidores mediante inyección de código o ataques de denegación de servicio.</li>
                        </ul>
                    </PolicySection>

                    {/* PROPIEDAD INTELECTUAL */}
                    <PolicySection id="intellectual-property" title="Propiedad Intelectual">
                        <p>
                            Todo el contenido presente en este sitio, incluyendo pero no limitado a textos, logotipos, imágenes, audios, descargas digitales y compilaciones de datos, es propiedad de <strong>IGA Productos</strong> o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual e industrial vigentes en México e internacionales.
                        </p>
                        <br />
                        <p>
                            No se permite la reproducción total o parcial de los productos, descripciones o diseños expuestos en la tienda sin el consentimiento expreso y por escrito de la empresa.
                        </p>
                    </PolicySection>

                    {/* COMPRAS Y PAGOS */}
                    <PolicySection id="purchases-payments" title="Compras y Pagos">
                        <p>
                            Al realizar una orden, usted se compromete a proporcionar información de pago verídica y completa. Todas nuestras transacciones se procesan de forma segura a través de <strong>Mercado Pago</strong>.
                        </p>
                        <ul className="list-disc ml-5 mt-3 space-y-2">
                            <li><strong>Precios:</strong> Todos los precios están expresados en pesos mexicanos (MXN) e incluyen los impuestos correspondientes, a menos que se indique lo contrario.</li>
                            <li><strong>Confirmación:</strong> La recepción de un pedido no constituye la aceptación final del mismo. IGA Productos se reserva el derecho de cancelar órdenes por falta de stock o errores en el etiquetado de precios.</li>
                            <li><strong>Seguridad de Pago:</strong> No almacenamos datos sensibles de tarjetas. Su información financiera viaja encriptada directamente hacia el procesador de pagos.</li>
                        </ul>
                    </PolicySection>

                    {/* ENVÍOS Y ENTREGAS */}
                    <PolicySection id="shipping-delivery" title="Envíos y Entregas">
                        <p>
                            Hacemos envíos a las zonas de cobertura especificadas en nuestra sección de {" "}
                            <Link to="/cobertura" className="text-primary font-medium hover:underline">
                                Cobertura
                            </Link>.
                        </p>
                        <br />
                        <p>
                            Los tiempos de entrega son estimaciones y pueden variar según el destino y la logística externa. IGA Productos no se hace responsable por retrasos derivados de causas de fuerza mayor o problemas ajenos a nuestra operación interna. Usted recibirá una notificación con la información de seguimiento una vez que su pedido esté en camino.
                        </p>
                    </PolicySection>

                    {/* DEVOLUCIONES */}
                    <PolicySection id="returns-exchanges" title="Cambios y Devoluciones">
                        <p>
                            La satisfacción de nuestros clientes es fundamental. Si usted recibe un producto con defectos de fabricación o que no corresponde a lo solicitado, puede iniciar un proceso de devolución.
                        </p>
                        <br />
                        <p>
                            Para conocer los requisitos detallados, tiempos y restricciones, consulte nuestra {" "}
                            <Link to="/politica-de-devolucion" className="text-primary font-medium hover:underline">
                                Política de Devolución
                            </Link>. Es indispensable conservar el empaque original y el comprobante de compra (ticket) generado por el sistema.
                        </p>
                    </PolicySection>

                    {/* LIMITACIÓN DE RESPONSABILIDAD */}
                    <PolicySection id="liability" title="Limitación de responsabilidad">
                        <p>
                            IGA Productos no garantiza que el sitio web sea libre de errores o que el acceso al mismo sea ininterrumpido. No seremos responsables de daños directos, indirectos o incidentales derivados del uso de la página o de la imposibilidad de uso de la misma.
                        </p>
                        <br />
                        <p>
                            La precisión técnica de los productos mostrados depende de la información proporcionada por los fabricantes; nos esforzamos por mantener los catálogos actualizados, pero no garantizamos la absoluta exactitud de las descripciones en todo momento.
                        </p>
                    </PolicySection>

                    {/* MODIFICACIONES */}
                    <PolicySection id="modifications" title="Modificaciones">
                        <p>
                            Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento sin previo aviso. Es responsabilidad del usuario revisar periódicamente esta sección. El uso continuado del sitio tras la publicación de cambios implicará la aceptación de los nuevos términos.
                        </p>
                    </PolicySection>

                </div>
            </div>
        </section>
    );
};

export default TermsAndConditions;