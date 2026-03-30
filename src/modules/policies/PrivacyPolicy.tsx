import { useState, useEffect, useRef } from "react";

/* ── Shared design tokens ──────────────────────────────────── */
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

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState("intro");
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const sections = [
        { id: "intro", label: "Política de privacidad" },
        { id: "about-us", label: "Quiénes somos" },
        { id: "comments", label: "Comentarios y moderación" },
        { id: "cookies", label: "Cookies y Persistencia" },
        { id: "data-usage", label: "Uso de datos en nuestro sistema" },
        { id: "guest-queries", label: "Preguntas como invitado" },
        { id: "my-rights", label: "Tus derechos sobre los datos" },
        { id: "third-party", label: "Seguridad y Pagos (Terceros)" },
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
                    <span>📋 Directorio de secciones</span>
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
                            Navega por las secciones revisadas según nuestro comportamiento técnico local.
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
                        {/* Footer badge */}
                        <div className="mt-5 pt-4 border-t border-white/10">
                            <p className="text-[0.68rem] text-slate-500 leading-relaxed text-center">
                                Última actualización<br />
                                <span className="text-slate-400 font-medium">Marzo 2026</span>
                            </p>
                        </div>
                    </div>
                </aside>

                {/* ── Main content ──────────────────────────────────── */}
                <div ref={contentRef} className="flex-1 min-w-0 flex flex-col gap-8 sm:gap-10 pb-6">

                    {/* INTRO */}
                    <div id="intro" className="scroll-mt-6">
                        <div className="flex flex-col gap-2 mb-4">
                            <SectionBar />
                            <h1 className="px-2 py-1 w-fit rounded-xl border border-base-300 bg-base-300 text-2xl sm:text-3xl lg:text-4xl font-bold">
                                Política de privacidad
                            </h1>
                        </div>
                        <div className="bg-blue-950 rounded-xl px-5 sm:px-8 py-6 sm:py-8">
                            <p className="text-white/90 text-sm sm:text-base leading-7 sm:leading-8 text-justify">
                                En IGA Productos, la privacidad de su información es nuestra prioridad. Los datos personales que recabamos sobre usted son utilizados para verificar su identidad, administrar y procesar los pedidos de productos que solicita con nosotros, y cumplir con las obligaciones legales derivadas de nuestro servicio comercial.
                            </p>
                            <p className="text-white/90 text-sm sm:text-base leading-7 sm:leading-8 text-justify mt-4">
                                Nos comprometemos a no comercializar ni lucrar con sus datos personales hacia terceros. La información proporcionada se utiliza exclusivamente para la mejora de su experiencia y la gestión operativa de nuestra plataforma.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                {["Transparencia técnica", "Análisis interno", "Sin rastreo de IP"].map((badge) => (
                                    <span key={badge} className="bg-primary/20 border border-primary/30 text-white text-[0.72rem] font-semibold px-3 py-1 rounded-full">
                                        ✓ {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* QUIÉNES SOMOS */}
                    <PolicySection id="about-us" title="Quiénes somos">
                        La dirección de nuestro sitio web es:{" "}
                        <a href="https://igaproductos.com/" className="text-primary font-medium hover:underline break-all" target="_blank" rel="noreferrer">
                            https://igaproductos.com/
                        </a>
                        <br /><br />
                        Nuestra plataforma está diseñada para facilitar la adquisición de productos especializados, manteniendo un control estricto sobre el flujo de información técnica. A diferencia de otros sitios, <strong>no capturamos ni almacenamos su dirección IP</strong> en nuestra base de datos activa para fines de rastreo o identificación personal.
                    </PolicySection>

                    {/* COMENTARIOS */}
                    <PolicySection id="comments" title="Comentarios y moderación">
                        <p>
                            Cuando los usuarios registrados dejan comentarios en el sitio, recopilamos los datos que se muestran en el formulario para poder publicarlos y asociarlos a su perfil de cliente. Estos comentarios se almacenan de forma segura en nuestra base de datos.
                        </p>
                        <br />
                        <p>
                            <strong>Derecho de remoción:</strong> La empresa se reserva el derecho de moderar y eliminar cualquier comentario que se considere inapropiado, incluyendo aquellos que contengan lenguaje ofensivo, spam, publicidad no deseada o contenido que vulnere los derechos de terceros.
                        </p>
                    </PolicySection>

                    {/* COOKIES */}
                    <PolicySection id="cookies" title="Cookies y Persistencia">
                        <p>En nuestro sitio optimizamos el uso de datos locales para garantizar que su sesión sea fluida pero segura:</p>
                        <ul className="list-disc ml-5 mt-3 space-y-2">
                            <li><strong>Cookies de Sesión:</strong> Tienen una duración estricta de 24 horas.</li>
                            <li><strong>Persistencia de inicio de sesión:</strong> Sus datos de acceso se guardan en el navegador de forma persistente únicamente mientras su sesión esté activa. Estos datos se borran automáticamente al cerrar la sesión de forma manual (Logout).</li>
                            <li><strong>Usuarios Invitados:</strong> No generan datos en caché. Solo almacenamos en el <code>localStorage</code> un identificador de sesión único (Session ID) para gestionar el carrito de compras y el proceso de checkout temporal sin requerir una cuenta.</li>
                        </ul>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
                            {[
                                { type: "Cookies de Sesión", duration: "24 horas", desc: "Mantenimiento del estado técnico" },
                                { type: "LocalStorage (Guest)", duration: "Temporal", desc: "ID de sesión único para compras" },
                            ].map((c) => (
                                <div key={c.type} className="bg-base-300 rounded-lg px-4 py-3 border border-base-200">
                                    <p className="text-xs font-bold text-primary">{c.type}</p>
                                    <p className="text-[0.70rem] text-base-content/60 mt-0.5">{c.desc}</p>
                                    <p className="text-xs font-semibold text-base-content mt-2">⏱ {c.duration}</p>
                                </div>
                            ))}
                        </div>
                    </PolicySection>

                    {/* USO DE DATOS (BACKEND) */}
                    <PolicySection id="data-usage" title="Uso de datos en nuestro sistema">
                        <p>
                            La información que se guarda en nuestro servidor (backend) tiene como fin exclusivo el análisis de métricas de negocio. Esto incluye, de manera general y fácil de entender:
                        </p>
                        <ul className="list-disc ml-5 mt-3 space-y-2">
                            <li>Contabilizar el número de ventas diarias y mensuales.</li>
                            <li>Gestionar el histórico de órdenes para su atención al cliente.</li>
                            <li>Mejorar el inventario basándonos en los productos más solicitados.</li>
                        </ul>
                        <p className="mt-4">
                            Este análisis es vital para que podamos ofrecerle mejores productos y un servicio más eficiente, sin identificar individualmente sus comportamientos fuera de nuestra plataforma.
                        </p>
                    </PolicySection>

                    {/* INVITADOS */}
                    <PolicySection id="guest-queries" title="Preguntas como invitado">
                        <p>
                            Para aquellas personas que desean realizar preguntas o consultas sin crear una cuenta (invitados), la plataforma solicita su consentimiento explícito para tratar sus datos con el fin de procesar la respuesta o la orden en curso.
                        </p>
                        <br />
                        <p>
                            <strong>Importante:</strong> Estos datos no se guardan en nuestra base de datos de manera definitiva. Solo se utilizan durante el tiempo necesario para atender su solicitud inmediata y no se crea un perfil de usuario permanente a partir de esta interacción.
                        </p>
                    </PolicySection>

                    {/* DERECHOS */}
                    <PolicySection id="my-rights" title="Tus derechos sobre los datos">
                        <p>
                            Como titular de sus datos personales, usted tiene control total sobre su información. En nuestra plataforma, usted puede:
                        </p>
                        <ul className="list-disc ml-5 mt-3 space-y-2">
                            <li><strong>Editar su correo electrónico:</strong> Para mantener su contacto actualizado.</li>
                            <li><strong>Cambiar su contraseña:</strong> En cualquier momento por motivos de seguridad.</li>
                        </ul>
                        <p className="mt-4">
                            Si desea eliminar su cuenta y todos los datos asociados, o tiene dudas sobre cómo modificar otros datos personales, puede ponerse en contacto con nuestro equipo de soporte.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2 not-prose">
                            {["Actualización de cuenta", "Borrado de sesión", "Control de seguridad"].map((r) => (
                                <span key={r} className="bg-primary text-white text-[0.72rem] font-semibold px-3 py-1.5 rounded-lg">
                                    {r}
                                </span>
                            ))}
                        </div>
                    </PolicySection>

                    {/* SECCIONES DE TERCEROS */}
                    <PolicySection id="third-party" title="Seguridad y Pagos (Terceros)">
                        <p>Para proteger su navegación y procesar sus pagos de forma segura, utilizamos herramientas líderes en la industria que operan bajo sus propias políticas de privacidad:</p>

                        <div className="mt-6 space-y-6">
                            <div className="border-l-4 border-primary pl-4">
                                <h3 className="font-bold text-base text-base-content mb-2">Protección contra Bots (Google reCaptcha)</h3>
                                <p className="text-sm">
                                    Utilizamos reCaptcha de Google para prevenir ataques automatizados y spam en nuestros formularios. El uso de esta herramienta está sujeto a la{" "}
                                    <a href="https://policies.google.com/privacy" className="text-primary hover:underline font-medium" target="_blank" rel="noreferrer">
                                        Política de Privacidad de Google
                                    </a>{" "}
                                    y a sus{" "}
                                    <a href="https://policies.google.com/terms" className="text-primary hover:underline font-medium" target="_blank" rel="noreferrer">
                                        Términos de Servicio
                                    </a>.
                                </p>
                            </div>

                            <div className="border-l-4 border-primary pl-4">
                                <h3 className="font-bold text-base text-base-content mb-2">Procesador de Pagos (Mercado Pago)</h3>
                                <p className="text-sm">
                                    Para las transacciones económicas, utilizamos el servicio de <strong>Mercado Pago Checkout Pro</strong>.
                                    Al realizar un pago, sus datos financieros son procesados de forma segura por Mercado Pago.
                                    IGA Productos únicamente conserva información de referencia (últimos 4 dígitos, emisor y entidad bancaria)
                                    para el seguimiento de su pedido (solo en usuarios registrados), sin almacenar datos sensibles de su tarjeta.
                                    Puede consultar las políticas aplicables en el sitio oficial de{" "}
                                    <a
                                        href="https://www.mercadopago.com.mx/ayuda/terminos-y-politicas_194"
                                        className="text-primary hover:underline font-medium"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Términos y Políticas de Mercado Pago
                                    </a>.
                                </p>
                            </div>
                        </div>
                    </PolicySection>

                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicy;