import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaFileContract, FaListUl, FaCheckCircle } from "react-icons/fa";

/* ── Nav item ─────────────────────────────────────────────── */
function NavItem({
    href,
    label,
    active,
    onClick,
}: {
    href: string;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <li>
            <a
                href={href}
                onClick={onClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${active
                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                        : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
                    }`}
            >
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
        <div className="scroll-mt-28">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 rounded-full bg-primary shrink-0" />
                <h2 id={id} className="text-lg sm:text-xl font-bold text-base-content">{title}</h2>
            </div>
            <div className="rounded-2xl bg-base-100 border border-base-300 px-5 sm:px-8 py-5 sm:py-6 text-justify text-sm sm:text-base leading-7 sm:leading-8 text-base-content/80">
                {children}
            </div>
        </div>
    );
}

const TermsAndConditions = () => {
    document.title = "Iga Productos | Términos y Condiciones";
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
        <div className="w-full flex justify-center items-start">
            <div className="w-full md:w-80/100 px-2 sm:px-3 md:px-4 py-6 md:py-10 rounded-2xl">

                {/* ── Page Header ── */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FaFileContract className="text-primary text-lg sm:text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                            Términos y Condiciones
                        </h1>
                        <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                            Reglas de uso y condiciones comerciales de IGA Productos.
                        </p>
                    </div>
                </div>

                {/* ── Mobile nav toggle ── */}
                <div className="lg:hidden mb-5">
                    <button
                        onClick={() => setMobileNavOpen((v) => !v)}
                        className="w-full flex items-center justify-between bg-base-200 border border-base-300 text-base-content rounded-xl px-5 py-3 font-semibold text-sm transition-colors duration-200 hover:bg-base-300/50"
                    >
                        <span className="flex items-center gap-2">
                            <FaListUl className="text-primary text-xs" />
                            Directorio de términos
                        </span>
                        <span className="text-xs text-base-content/50">{mobileNavOpen ? "▲" : "▼"}</span>
                    </button>
                    {mobileNavOpen && (
                        <div className="mt-2 bg-base-200 border border-base-300 rounded-xl p-4">
                            <ul className="flex flex-col gap-1">
                                {sections.map(({ id, label }) => (
                                    <NavItem
                                        key={id}
                                        href={`#${id}`}
                                        label={label}
                                        active={activeSection === id}
                                        onClick={() => handleNavClick(id)}
                                    />
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex gap-6 xl:gap-8">

                    {/* ── Sidebar nav (desktop) ── */}
                    <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
                        <div className="bg-base-200 border border-base-300 rounded-2xl p-5 sticky top-30">
                            <p className="text-sm font-bold text-base-content mb-1 flex items-center gap-2">
                                <FaListUl className="text-primary text-xs" />
                                Directorio
                            </p>
                            <p className="text-xs text-base-content/50 mb-4 leading-relaxed">
                                Reglas de uso y condiciones comerciales de IGA Productos.
                            </p>
                            <ul className="flex flex-col gap-1">
                                {sections.map(({ id, label }) => (
                                    <NavItem
                                        key={id}
                                        href={`#${id}`}
                                        label={label}
                                        active={activeSection === id}
                                        onClick={() => handleNavClick(id)}
                                    />
                                ))}
                            </ul>
                            <div className="mt-5 pt-4 border-t border-base-300">
                                <p className="text-xs text-base-content/40 leading-relaxed text-center">
                                    Versión vigente<br />
                                    <span className="text-base-content/60 font-medium">Marzo 2026</span>
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* ── Main content ── */}
                    <div ref={contentRef} className="flex-1 min-w-0 flex flex-col gap-8 sm:gap-10 pb-6">

                        {/* INTRO / ACEPTACIÓN */}
                        <div className="scroll-mt-28">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-8 rounded-full bg-primary shrink-0" />
                                <h2 id="acceptance" className="text-lg sm:text-xl font-bold text-base-content">Aceptación de términos</h2>
                            </div>
                            <div className="bg-base-200 border border-base-300 rounded-2xl px-5 sm:px-8 py-6 sm:py-8">
                                <p className="text-base-content/80 text-sm sm:text-base leading-7 sm:leading-8 text-justify">
                                    Bienvenido a IGA Productos. Al acceder y utilizar este sitio web, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, le solicitamos abstenerse de utilizar nuestra plataforma.
                                </p>
                                <p className="text-base-content/80 text-sm sm:text-base leading-7 sm:leading-8 text-justify mt-4">
                                    Estos términos rigen la relación comercial entre IGA Productos y sus usuarios, incluyendo la navegación, el uso de cuentas personales y el proceso de adquisición de productos a través de nuestra tienda en línea.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    {[
                                        { label: "Transacciones seguras", icon: <FaCheckCircle className="text-xs" /> },
                                        { label: "Cumplimiento normativo", icon: <FaCheckCircle className="text-xs" /> },
                                        { label: "Respeto al usuario", icon: <FaCheckCircle className="text-xs" /> },
                                    ].map((badge) => (
                                        <span key={badge.label} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-lg">
                                            {badge.icon}
                                            {badge.label}
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

            </div>
        </div>
    );
};

export default TermsAndConditions;
