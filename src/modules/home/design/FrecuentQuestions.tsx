import { useState, useEffect, useRef } from "react";
import {
    MdOutlineShoppingBag,
    MdOutlinePayments,
    MdLocalShipping,
    MdVerifiedUser,
    MdOutlinePersonOutline,
    MdOutlineArrowForwardIos,
    MdOutlineHelpCenter,
    MdOutlineTopic,
    MdOutlineLiveHelp,
    MdQuestionMark
} from "react-icons/md";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";

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
    icon: IconType;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <li>
            <a
                href={href}
                onClick={onClick}
                className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${active
                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                        : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
                    }`}
            >
                {Icon && (
                    <Icon
                        size={17}
                        className={`flex-shrink-0 transition-colors ${active ? "text-primary" : "text-base-content/40 group-hover:text-base-content"}`}
                    />
                )}
                <span className="leading-snug">{label}</span>
            </a>
        </li>
    );
}

/* ── FAQ Block ────────────────────────────────────────────── */
function FAQItem({ question, children }: { question: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-base-300 bg-base-100 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left hover:bg-base-200/60 transition-colors"
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
                <div className="px-5 sm:px-14 pb-5 sm:pb-6 text-sm sm:text-base leading-7 text-base-content/70 border-t border-base-300/60 pt-4 text-justify">
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
        { id: "invitados", label: "Comprar como Invitado", icon: MdOutlinePersonOutline },
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
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MdOutlineHelpCenter className="text-primary text-lg sm:text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none tracking-tight">
                        Centro de Ayuda
                    </h1>
                    <p className="text-xs sm:text-sm text-base-content/50 mt-1">
                        Preguntas frecuentes sobre compras, pagos, envíos, garantías y compras como invitado.
                    </p>
                </div>
            </div>

            {/* ── Mobile nav toggle ─────────────────────────────── */}
            <div className="lg:hidden mb-5">
                <button
                    onClick={() => setMobileNavOpen((v) => !v)}
                    className="w-full flex items-center justify-between bg-base-200 border border-base-300 text-base-content rounded-xl px-5 py-3 font-semibold text-sm transition-colors duration-200 hover:bg-base-300/50"
                >
                    <span className="flex items-center gap-2">
                        <MdOutlineTopic className="text-primary text-sm" />
                        Directorio de dudas
                    </span>
                    <span className="text-xs text-base-content/50">{mobileNavOpen ? "▲" : "▼"}</span>
                </button>
                {mobileNavOpen && (
                    <div className="mt-2 bg-base-200 border border-base-300 rounded-xl p-4">
                        <ul className="flex flex-col gap-1">
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

            <div className="flex gap-6 xl:gap-8">

                {/* ── Sidebar nav (desktop) ─────────────────────────── */}
                <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
                    <div className="bg-base-200 border border-base-300 rounded-2xl p-5 sticky top-30">
                        <p className="text-sm font-bold text-base-content mb-1 flex items-center gap-2">
                            <MdOutlineTopic className="text-primary text-sm" />
                            Directorio
                        </p>
                        <p className="text-xs text-base-content/50 mb-4 leading-relaxed">
                            Resolvemos tus dudas sobre compras, pagos, envíos, garantías y el flujo de compra como invitado.
                        </p>
                        <ul className="flex flex-col gap-1">
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

                        <div className="mt-5 pt-4 border-t border-base-300">
                            <p className="text-xs text-base-content/40 leading-relaxed text-center mb-3">
                                ¿No encuentras lo que buscas? Nuestro equipo está listo para ayudarte personalmente.
                            </p>
                            <Link
                                to={"/contacto"}
                                className="w-full btn btn-primary btn-sm rounded-lg text-white font-bold hover:scale-105 transition-transform"
                            >
                                Contactar soporte
                            </Link>
                            <p className="text-xs text-base-content/40 leading-relaxed text-center mt-4">
                                Última actualización<br />
                                <span className="text-base-content/60 font-medium">28 de agosto, 2026</span>
                            </p>
                        </div>
                    </div>
                </aside>

                {/* ── Main content ──────────────────────────────────── */}
                <div ref={contentRef} className="flex-1 min-w-0 flex flex-col gap-10 sm:gap-12 pb-10">

                    {/* SECCIÓN: COMPRAS */}
                    <div id="compras" className="scroll-mt-28 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 rounded-full bg-primary shrink-0" />
                            <div className="flex items-center gap-2.5">
                                <MdOutlineShoppingBag className="text-primary" size={22} />
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-base-content">Proceso de Compra</h2>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <FAQItem question="¿Es necesario crear una cuenta para comprar?">
                                No, puedes realizar tu pedido como <strong>Invitado</strong>. Al hacerlo te pediremos los datos mínimos necesarios para el envío y la facturación. Registrar una cuenta no es obligatorio, pero te da beneficios exclusivos: historial de tus compras, <strong>Ticket de pago</strong> en "Mis Órdenes" y direcciones guardadas para agilizar compras futuras.
                            </FAQItem>

                            <FAQItem question="¿Qué sucede si inicio un proceso de pago y decido no terminarlo?">
                                Si te encuentras en el resumen de compra y decides no pagar, puedes <strong>Abandonar la orden</strong>. Al hacerlo la orden se libera, tus productos quedan disponibles de nuevo y el stock regresa a nuestro inventario. Abandonar no genera ningún cargo bancario: el pago aún no ha sido autorizado en la pasarela de Mercado Pago.
                            </FAQItem>

                            <FAQItem question="¿Cómo sé si mi pedido fue confirmado exitosamente?">
                                Al completar tu pago, Mercado Pago nos notifica automáticamente y enviamos un <strong>correo de confirmación</strong> con el folio de tu orden, tanto a compradores registrados como a invitados. Si tienes cuenta, además podrás consultar tu <strong>Ticket de pago</strong> en la sección "Mis Órdenes" de tu perfil.
                            </FAQItem>
                        </div>
                    </div>

                    {/* SECCIÓN: PAGOS */}
                    <div id="pagos" className="scroll-mt-28 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 rounded-full bg-primary shrink-0" />
                            <div className="flex items-center gap-2.5">
                                <MdOutlinePayments className="text-primary" size={22} />
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-base-content">Pagos y Seguridad</h2>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <FAQItem question="¿Qué métodos de pago puedo utilizar?">
                                Aceptamos diversas formas de pago a través de <strong>Mercado Pago</strong>, incluyendo: tarjetas de crédito y débito (Visa, Mastercard, American Express), pagos en efectivo en tiendas OXXO, transferencias bancarias (SPEI) y saldo de cuenta Mercado Pago.
                            </FAQItem>

                            <FAQItem question="¿Mis datos bancarios están protegidos?">
                                Absolutamente. Iga Productos <strong>no almacena datos bancarios sensibles</strong>. Toda la información financiera se gestiona directamente en los servidores seguros y encriptados de Mercado Pago, quienes cuentan con los más altos estándares de seguridad (PCI DSS).
                            </FAQItem>

                            <FAQItem question="¿Por qué mi pago aparece como 'Pendiente'?">
                                Casi siempre se debe a que el método elegido no es de acreditación instantánea: los pagos en efectivo (OXXO) o transferencias de algunos bancos pueden tardar de 1 a 24 horas en reflejarse. También ocurre cuando la pasarela reporta el pago en <strong>verificación</strong>. En ese caso verás la pantalla "Estamos verificando tu pago" y te enviaremos un correo con el resultado en cuanto Mercado Pago confirme. Tu pedido se procesa automáticamente al acreditarse.
                            </FAQItem>

                            <FAQItem question="¿Qué pasa si mi pago falla? ¿Puedo reintentar?">
                                Si tu pago fue rechazado no se realiza ningún cobro. Si al momento del fallo el pago quedó <strong>en proceso</strong> en nuestros registros, verás el botón <strong>Intentar pagar nuevamente</strong> para volver a la pantalla de pago con los datos de tu pedido. Si el estado ya es rechazado, solo necesitas crear una nueva orden desde tu carrito. En ningún caso se hacen dobles cobros.
                            </FAQItem>
                        </div>
                    </div>

                    {/* SECCIÓN: ENVÍOS */}
                    <div id="envios" className="scroll-mt-28 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 rounded-full bg-primary shrink-0" />
                            <div className="flex items-center gap-2.5">
                                <MdLocalShipping className="text-primary" size={22} />
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-base-content">Envíos y Cobertura</h2>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <FAQItem question="¿Hasta dónde llega su cobertura de envíos?">
                                Contamos con una red logística nacional robusta e internacional; puedes revisar las zonas específicas en nuestra sección de <Link to="/cobertura" className="text-primary font-bold hover:underline">Cobertura</Link>. Si tu zona es de difícil acceso, nuestro equipo te contactará para más detalles.
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
                    <div id="garantias" className="scroll-mt-28 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 rounded-full bg-primary shrink-0" />
                            <div className="flex items-center gap-2.5">
                                <MdVerifiedUser className="text-primary" size={22} />
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-base-content">Garantías y Producto No Conforme (PNC)</h2>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <FAQItem question="¿Qué debo hacer si recibo un producto dañado?">
                                Aplica nuestra política de <strong>PNC</strong>. Tienes un periodo máximo de <strong>48 horas</strong> posteriores a la recepción para reportar daños físicos visibles o defectos de fabricación. Es vital contar con el número de lote y folio de factura para procesar tu solicitud. Este proceso aplica también para compras hechas como invitado.
                            </FAQItem>

                            <FAQItem question="¿Qué pasa si me equivoqué de modelo o color al pedir?">
                                De acuerdo a nuestra política de devoluciones, no aceptamos cambios ni regresos de mercancía por errores de selección del cliente (color, modelo, ajuste, etc.). Te recomendamos revisar detalladamente la ficha técnica del producto antes de comprar.
                            </FAQItem>

                            <FAQItem question="¿Cómo inicio una reclamación por garantía?">
                                Puedes contactarnos a través del <Link to="/contacto" className="text-primary font-bold hover:underline">Formulario de Contacto</Link> o enviar un correo con los detalles de la incidencia y fotos del producto a <strong>atencionacliente@igaproductos.com</strong>.
                            </FAQItem>
                        </div>
                    </div>

                    {/* SECCIÓN: INVITADOS */}
                    <div id="invitados" className="scroll-mt-28 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 rounded-full bg-primary shrink-0" />
                            <div className="flex items-center gap-2.5">
                                <MdOutlinePersonOutline className="text-primary" size={22} />
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-base-content">Comprar como Invitado</h2>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <FAQItem question="¿Qué es 'Comprar como Invitado'?">
                                Es un flujo de compra sin registro: eliges tus productos, agregas solo los datos mínimos de envío y facturación, y pagas directamente con Mercado Pago. Recibes la confirmación por correo como cualquier comprador. La única diferencia es que no tendrás historial en "Mis Órdenes" ni datos guardados para futuras compras.
                            </FAQItem>

                            <FAQItem question="¿Qué pasa si cierro la página o el navegador a mitad del pago?">
                                Por seguridad, tu sesión temporal de compra está protegida y los enlaces de regreso son de un solo uso. Si abandonas la orden, esta se libera y el stock queda disponible de nuevo. Si el pago quedó <strong>en proceso</strong> en nuestros registros, podrás intentar pagarlo nuevamente desde la pantalla que te mostraremos; en caso contrario, crea una nueva orden desde tu carrito.
                            </FAQItem>

                            <FAQItem question="¿Por qué veo 'orden no encontrada' al volver a mi pedido ya pagado?">
                                Es una medida de seguridad: cuando tu pago se confirma, eliminamos los datos temporales de la orden para que nadie pueda acceder a ella desde ese enlace de regreso. Tu confirmación llega por correo con el folio de tu orden. Si necesitas consultarla después, te recomendamos registrarte para llevar tu historial de compras.
                            </FAQItem>

                            <FAQItem question="¿Qué pasa con mi carrito después de pagar o de abandonar la orden?">
                                Al confirmarse el pago liberamos tu carrito y, si abandonas la orden, esta se libera y el stock regresa a nuestro inventario. Iga Productos no reserva productos, por lo que los artículos que viste pueden seguir disponibles o haberse agotado. Para agilizar tu próxima compra, regístrate y guarda tus direcciones.
                            </FAQItem>

                            <FAQItem question="¿Puedo hacer valer una garantía si compré como invitado?">
                                Sí. Nuestras políticas de PNC y garantías aplican igual para compras sin registro. Para procesar tu reclamación ten a la mano el <strong>folio de la orden</strong> y el correo electrónico que usaste al comprar; contáctanos con fotos del producto y la descripción de la incidencia.
                            </FAQItem>
                        </div>
                    </div>

                    {/* ── FOOTER CTA ──────────────────────────────────── */}
                    <div className="scroll-mt-28">
                        <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-blue-950/5 border border-primary/10 px-6 py-6 sm:px-8 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <MdOutlineLiveHelp className="text-primary text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-base-content">¿Aún tienes dudas?</h3>
                                    <p className="text-sm text-base-content/60 leading-relaxed">
                                        Escríbenos a <a href="mailto:atencionacliente@igaproductos.com" className="text-primary font-bold hover:underline">atencionacliente@igaproductos.com</a> o contacta a nuestro equipo de soporte.
                                    </p>
                                </div>
                            </div>
                            <Link
                                to={"/contacto"}
                                className="btn btn-primary btn-lg rounded-xl text-white font-bold hover:scale-105 transition-transform shrink-0"
                            >
                                Contactar soporte
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FrecuentQuestions;