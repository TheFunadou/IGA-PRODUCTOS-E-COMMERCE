import { useState, useEffect, useRef } from "react";
import {
    MdOutlineShoppingBag,
    MdOutlinePayments,
    MdLocalShipping,
    MdVerifiedUser,
    MdOutlineArrowForwardIos,
    MdOutlineHelpCenter,
    MdQuestionMark
} from "react-icons/md";
import { Link } from "react-router-dom";

/* ── Shared design tokens ──────────────────────────────────── */
const SectionBar = () => (
    <div className="bg-primary px-10 py-1 w-fit rounded-xl shadow-lg" />
);

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode; icon: any }) => (
    <h2 className="px-2 py-1 w-fit rounded-xl border border-base-300 bg-base-300 text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-3">
        {Icon && <Icon className="text-primary flex-shrink-0" />}
        {children}
    </h2>
);

/* ── Nav item ─────────────────────────────────────────────── */
function NavItem({
    href,
    label,
    icon: Icon,
    active,
    onClick,
}: {
    href: string;
    label: string;
    icon: any;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <li>
            <a
                href={href}
                onClick={onClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 group
                    ${active
                        ? "bg-primary text-white shadow-md scale-[1.02]"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
            >
                <span className={`flex-shrink-0 transition-colors ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                    <Icon size={20} />
                </span>
                <span className="leading-snug">{label}</span>
            </a>
        </li>
    );
}

/* ── FAQ Block ────────────────────────────────────────────── */
function FAQItem({ question, children }: { question: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-base-200 bg-base-100 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left hover:bg-base-200/50 transition-colors"
                aria-expanded={isOpen}
            >
                <div className="flex gap-3 items-start pr-4">
                    <MdQuestionMark className="text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-base-content/90 leading-tight">
                        {question}
                    </span>
                </div>
                <MdOutlineArrowForwardIos
                    className={`text-base-content/30 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-90" : ""}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="px-5 sm:px-14 pb-5 sm:pb-6 text-sm sm:text-base leading-7 text-base-content/70 border-t border-base-200/50 pt-4 text-justify">
                    {children}
                </div>
            </div>
        </div>
    );
}

const FrecuentQuestions = () => {
    document.title = "Iga Productos | Preguntas Frecuentes";
    const [activeSection, setActiveSection] = useState("compras");
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const sections = [
        { id: "compras", label: "Proceso de Compra", icon: MdOutlineShoppingBag },
        { id: "pagos", label: "Pagos y Seguridad", icon: MdOutlinePayments },
        { id: "envios", label: "Envíos y Cobertura", icon: MdLocalShipping },
        { id: "garantias", label: "Garantías y PNC", icon: MdVerifiedUser },
    ];

    /* Intersection observer para resaltar navegación activa */
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
        <section className="w-full bg-base-300 rounded-xl px-3 sm:px-5 py-6 sm:py-10 animate-fade-in shadow-inner">

            {/* ── HERO HEADER ────────────────────────────────────────── */}
            <div className="flex flex-col items-center mb-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg mb-4 text-white">
                    <MdOutlineHelpCenter size={40} />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-base-content mb-2 tracking-tight italic">
                    Centro de Ayuda
                </h1>
                <p className="text-sm sm:text-base text-base-content/50 max-w-xl">
                    Resolvemos tus dudas sobre compras, envíos y el funcionamiento de nuestra plataforma de manera sencilla y clara.
                </p>
            </div>

            {/* ── Mobile nav toggle ─────────────────────────────── */}
            <div className="lg:hidden mb-5">
                <button
                    onClick={() => setMobileNavOpen((v) => !v)}
                    className="w-full flex items-center justify-between bg-blue-950 text-white rounded-xl px-5 py-3 font-semibold text-sm shadow-xl"
                >
                    <div className="flex items-center gap-2">
                        <MdOutlineHelpCenter size={20} className="text-primary" />
                        <span>Categorías de dudas</span>
                    </div>
                    <span className="text-lg">{mobileNavOpen ? "▲" : "▼"}</span>
                </button>
                {mobileNavOpen && (
                    <div className="mt-2 bg-blue-950 text-white rounded-xl p-4 shadow-2xl border border-white/5 animate-scale-in">
                        <ul className="flex flex-col gap-2">
                            {sections.map((sec) => (
                                <NavItem
                                    key={sec.id}
                                    href={`#${sec.id}`}
                                    label={sec.label}
                                    icon={sec.icon}
                                    active={activeSection === sec.id}
                                    onClick={() => handleNavClick(sec.id)}
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex gap-6 xl:gap-10">

                {/* ── Sidebar nav (desktop) ─────────────────────────── */}
                <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
                    <div className="bg-blue-950 text-white rounded-2xl p-6 sticky top-5 shadow-2xl overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                        <p className="text-base font-bold mb-4 flex items-center gap-2 relative z-1">
                            <MdOutlineHelpCenter className="text-primary" />
                            Explorar por tema
                        </p>
                        <ul className="flex flex-col gap-2 relative z-1">
                            {sections.map((sec) => (
                                <NavItem
                                    key={sec.id}
                                    href={`#${sec.id}`}
                                    label={sec.label}
                                    icon={sec.icon}
                                    active={activeSection === sec.id}
                                    onClick={() => handleNavClick(sec.id)}
                                />
                            ))}
                        </ul>

                        <div className="mt-8 pt-6 border-t border-white/10 relative z-1">
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                ¿No encuentras lo que buscas? Nuestro equipo está listo para ayudarte personalmente.
                            </p>
                            <Link
                                to={"/contacto"}
                                className="w-full btn btn-primary btn-sm rounded-lg text-white font-bold hover:scale-105 transition-transform"
                            >
                                Contactar soporte
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* ── Main content ──────────────────────────────────── */}
                <div ref={contentRef} className="flex-1 min-w-0 flex flex-col gap-10 sm:gap-12 pb-10">

                    {/* SECCIÓN: COMPRAS */}
                    <div id="compras" className="scroll-mt-6 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <SectionBar />
                            <SectionTitle icon={MdOutlineShoppingBag}>Proceso de Compra</SectionTitle>
                        </div>

                        <div className="flex flex-col gap-3">
                            <FAQItem question="¿Es necesario crear una cuenta para comprar?">
                                No, puedes realizar tu pedido como <strong>Invitado</strong>. Al hacerlo, te pediremos los datos mínimos necesarios para el envío y facturación. Sin embargo, registrarte te da acceso a beneficios exclusivos, historial detallado de tus compras y guardado de direcciones para compras futuras más rápidas.
                            </FAQItem>

                            <FAQItem question="¿Qué sucede si inicio un proceso de pago y decido no terminarlo?">
                                Si te encuentras en el resumen de compra y decides no pagar, simplemente puedes <strong>Abandonar la orden</strong>. Al hacerlo, la orden no se procesa y tus productos permanecen disponibles para ser seleccionados de nuevo.
                                <br /><br />
                                Es importante aclarar que "Abandonar" no genera ningún cargo bancario ni cancelación de dinero, debido a que el pago aún no ha sido autorizado en la pasarela de pago.
                            </FAQItem>

                            <FAQItem question="¿Cómo sé si mi pedido fue confirmado exitosamente?">
                                Una vez que completes tu pago, el sistema de Mercado Pago nos notificará automáticamente. Recibirás un correo electrónico de confirmación y, si eres usuario registrado, podrás consultar tu <strong>Ticket de pago</strong> desde la sección "Mis Órdenes" en tu perfil.
                            </FAQItem>
                        </div>
                    </div>

                    {/* SECCIÓN: PAGOS */}
                    <div id="pagos" className="scroll-mt-6 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <SectionBar />
                            <SectionTitle icon={MdOutlinePayments}>Pagos y Seguridad</SectionTitle>
                        </div>

                        <div className="flex flex-col gap-3">
                            <FAQItem question="¿Qué métodos de pago puedo utilizar?">
                                Aceptamos diversas formas de pago a través de <strong>Mercado Pago</strong>, incluyendo: tarjetas de crédito y débito (Visa, Mastercard, American Express), pagos en efectivo en tiendas OXXO, transferencias bancarias (SPEI) y saldo de cuenta Mercado Pago.
                            </FAQItem>

                            <FAQItem question="¿Mis datos bancarios están protegidos?">
                                Absolutamente. Iga Productos <strong>no almacena datos bancarios sensibles</strong>. Toda la información financiera se gestiona directamente en los servidores seguros y encriptados de Mercado Pago, quienes cuentan con los más altos estándares de seguridad (PCI DSS).
                            </FAQItem>

                            <FAQItem question="¿Por qué mi pago aparece como 'Pendiente' en mi historial?">
                                Esto ocurre usualmente cuando el método elegido no es de acreditación instantánea. Los depósitos en efectivo (OXXO) o transferencias de ciertos bancos pueden tardar de 1 a 24 horas en reflejarse. Tu pedido se procesará automáticamente en cuanto recibamos la confirmación de acreditación.
                            </FAQItem>
                        </div>
                    </div>

                    {/* SECCIÓN: ENVÍOS */}
                    <div id="envios" className="scroll-mt-6 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <SectionBar />
                            <SectionTitle icon={MdLocalShipping}>Envíos y Cobertura</SectionTitle>
                        </div>

                        <div className="flex flex-col gap-3">
                            <FAQItem question="¿Hasta dónde llega su cobertura de envíos?">
                                Contamos con una red logística nacional robusta e internacional; puedes revisar las zonas específicas en nuestra sección de <Link to="/cobertura" className="text-primary font-bold hover:underline">Cobertura</Link>. Si tu zona es de difícil acceso, nuestro equipo te contactará para mas detalles.
                            </FAQItem>

                            <FAQItem question="¿Cuánto tiempo tardará en llegar mi paquete?">
                                El tiempo promedio de entrega es de 3 a 7 días hábiles, dependiendo de tu ubicación geográfica. Este periodo comienza a contar a partir de que el pago es verificado y la orden es procesada en nuestro almacén.
                            </FAQItem>

                            <FAQItem question="¿Puedo modificar mi dirección una vez realizado el pago?">
                                Una vez que la orden ha sido pagada y entra en proceso de preparación para envío, no podemos garantizar cambios de domicilio por motivos de seguridad y logística externa. Te recomendamos validar tus datos cuidadosamente antes de finalizar la transacción.
                            </FAQItem>
                        </div>
                    </div>

                    {/* SECCIÓN: GARANTÍAS */}
                    <div id="garantias" className="scroll-mt-6 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <SectionBar />
                            <SectionTitle icon={MdVerifiedUser}>Garantías y Producto No Conforme (PNC)</SectionTitle>
                        </div>

                        <div className="flex flex-col gap-3">
                            <FAQItem question="¿Qué debo hacer si recibo un producto dañado?">
                                Aplica nuestra política de <strong>PNC</strong>. Tienes un periodo máximo de <strong>48 horas</strong> posteriores a la recepción para reportar daños físicos visibles o defectos de fabricación. Es vital contar con el número de lote y folio de factura para procesar tu solicitud.
                            </FAQItem>

                            <FAQItem question="¿Qué pasa si me equivoqué de modelo o color al pedir?">
                                De acuerdo a nuestra política de devoluciones, no aceptamos cambios ni regresos de mercancía por errores de selección del cliente (color, modelo, ajuste, etc.). Te recomendamos revisar detalladamente la ficha técnica del producto antes de comprar.
                            </FAQItem>

                            <FAQItem question="¿Cómo inicio una reclamación por garantía?">
                                Puedes contactarnos a través del <Link to="/contacto" className="text-primary font-bold hover:underline">Formulario de Contacto</Link> o enviar un correo con los detalles de la incidencia y fotos del producto a <strong>atencionacliente@igaproductos.com.mx</strong>.
                            </FAQItem>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FrecuentQuestions;