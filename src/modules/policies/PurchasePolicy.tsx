import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    FaFileContract,
    FaListUl,
    FaCheckCircle,
    FaShoppingCart,
    FaEnvelope,
    FaExternalLinkAlt,
    FaBoxOpen,
    FaGavel,
    FaTruck,
} from "react-icons/fa";
import { FaMoneyBillWave, FaShieldHalved } from "react-icons/fa6";

// ── Nav item ───────────────────────────────────────────────
function NavItem({
    href,
    label,
    sub,
    active,
    onClick,
}: {
    href: string;
    label: string;
    sub?: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <li>
            <a
                href={href}
                onClick={onClick}
                className={`flex flex-col gap-0.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border
                    ${active
                        ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                        : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content border-transparent hover:border-base-300"
                    }`}
            >
                <span className="leading-none font-bold">{label}</span>
                {sub && <span className="text-[11px] opacity-60 leading-none">{sub}</span>}
            </a>
        </li>
    );
}

// ── Section block ──────────────────────────────────────────
function PolicySection({
    id,
    title,
    number,
    kicker,
    children,
}: {
    id: string;
    title: string;
    number: string;
    kicker?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="scroll-mt-28" id={id}>
            <div className="flex items-start gap-3 mb-4">
                <div className="hidden sm:flex flex-col items-center gap-1 shrink-0 pt-1">
                    <span className="text-[10px] font-black tracking-widest text-primary/60">{number}</span>
                    <div className="w-px h-6 bg-gradient-to-b from-primary to-transparent opacity-40" />
                </div>
                <div className="flex-1 min-w-0">
                    {kicker && <p className="text-[11px] font-black tracking-[0.18em] text-primary/70 uppercase mb-1">{kicker}</p>}
                    <h2 className="text-base sm:text-lg font-black text-base-content leading-tight">{title}</h2>
                    <div className="mt-2 h-px w-full bg-gradient-to-r from-primary/20 via-base-300 to-transparent" />
                </div>
            </div>
            <div className="rounded-2xl bg-base-100 border border-base-300 px-5 sm:px-8 py-5 sm:py-6 text-justify text-sm sm:text-[15px] leading-7 sm:leading-8 text-base-content/80">
                {children}
            </div>
        </div>
    );
}

// ── Main component ───────────────────────────────────────────
const PurchasePolicy = () => {
    document.title = "Iga Productos | Política de Compras";
    const [activeSection, setActiveSection] = useState("objeto");
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    // Sidebar groups — UX agrupado (9) pero cada artículo tiene id propio para deep-link
    const groups = [
        { id: "objeto", label: "Objeto y aceptación", sub: "Arts. 1–2" },
        { id: "invitado", label: "Modalidades", sub: "Arts. 3–5 · Invitado, cuenta, carrito" },
        { id: "realizacion", label: "Proceso de compra", sub: "Arts. 6–8" },
        { id: "precios", label: "Precio e impuestos", sub: "Arts. 9–11" },
        { id: "metodos-pago", label: "Pagos", sub: "Arts. 12–14 · Mercado Pago" },
        { id: "envios", label: "Envíos y facturación", sub: "Arts. 15–17" },
        { id: "cancelaciones", label: "Cancelación y post-compra", sub: "Arts. 18–23" },
        { id: "promociones", label: "Promos y seguridad", sub: "Arts. 24–28" },
        { id: "responsabilidades", label: "Marco legal", sub: "Arts. 29–37" },
    ];

    // All ids for scroll spy (first id of each group is enough, but watch all for progress)
    const allIds = [
        "objeto", "aceptacion",
        "invitado", "cuenta", "carrito",
        "realizacion", "confirmacion", "registro",
        "precios", "impuestos", "disponibilidad",
        "metodos-pago", "procesamiento", "seguridad",
        "envios", "tiempos", "facturacion",
        "cancelaciones", "revocacion", "devoluciones", "danados", "garantias", "reembolsos",
        "promociones", "errores", "fraude", "datos",
        "responsabilidades", "comunicaciones", "fuerza-mayor", "internacional", "atencion", "legislacion", "modificaciones", "relacion", "conservacion", "identificacion",
    ];

    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        groups.forEach(({ id }) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const h = document.documentElement;
            const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
            setScrollProgress(Number.isFinite(scrolled) ? Math.min(100, Math.max(0, scrolled)) : 0);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleNavClick = (id: string) => {
        setActiveSection(id);
        setMobileNavOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="w-full flex justify-center items-start">
            {/* progress */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-base-300/60 z-50">
                <div className="h-full bg-gradient-to-r from-primary via-primary to-orange-400 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
            </div>

            <div className="w-full md:w-80/100 px-2 sm:px-3 md:px-4 py-6 md:py-10 rounded-2xl">
                {/* ── Page Header — thesis: contrato como hoja de ruta ── */}
                <div className="relative overflow-hidden rounded-2xl border border-base-300 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white p-6 sm:p-8 mb-6">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, #FF6B2C 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
                    <div className="absolute -left-12 -bottom-12 w-56 h-56 rounded-full bg-orange-500/15 blur-3xl" />
                    <div className="relative flex flex-col lg:flex-row gap-6 lg:items-start">
                        <div className="flex gap-4 flex-1 min-w-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center shrink-0">
                                <FaShoppingCart className="text-white text-xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black tracking-[0.2em] text-white/60 uppercase">Documento legal • Compra</p>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none mt-1">
                                    Política de Compras
                                </h1>
                                <p className="text-sm text-white/70 mt-2 leading-relaxed max-w-2xl">
                                    Condiciones aplicables a toda compra en <span className="text-white font-bold">igaproductos.com</span> — operado por <strong className="text-white">Plásticos del Golfo Sur, S.A. de C.V.</strong> (marca IGA Productos).
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur">
                                        <FaCheckCircle className="text-emerald-300 text-xs" /> Última actualización: 28 de agosto de 2026
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-400/30 text-orange-100 text-xs font-bold px-3 py-1.5 rounded-full">
                                        <FaShieldHalved className="text-orange-200" /> 37 artículos
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-72 shrink-0 bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-4 flex flex-col gap-3">
                            <p className="text-xs font-bold text-white/80 leading-relaxed">
                                ¿Vas a comprar? Lee los puntos esenciales antes de pagar. Al confirmar tu pedido aceptas esta Política junto con{" "}
                                <Link to="/terminos-y-condiciones" className="underline decoration-white/40 hover:text-white">Términos y Condiciones</Link>,{" "}
                                <Link to="/politica-de-privacidad" className="underline decoration-white/40 hover:text-white">Aviso de Privacidad</Link> y{" "}
                                <Link to="/politica-de-devolucion" className="underline decoration-white/40 hover:text-white">Devolución PNC</Link>.
                            </p>
                            <div className="flex gap-2">
                                <a href="mailto:atencionaclientes@igaproductos.com" className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-blue-950 text-sm font-black px-4 py-2.5 rounded-xl hover:bg-white/90 transition">
                                    <FaEnvelope className="text-xs" /> Contacto
                                </a>
                                <a href="mailto:facturacion@igaproductos.com" className="inline-flex items-center justify-center gap-1.5 border border-white/20 text-white text-sm font-bold px-3 py-2.5 rounded-xl hover:bg-white/10 transition">
                                    Facturación <FaExternalLinkAlt className="text-[10px] opacity-70" />
                                </a>
                            </div>
                            <p className="text-[11px] text-white/50 leading-relaxed text-center">Arts. 32 y 37 — Atención al cliente y datos de identificación</p>
                        </div>
                    </div>
                </div>

                {/* ── Mobile nav toggle ── */}
                <div className="lg:hidden mb-5">
                    <button
                        onClick={() => setMobileNavOpen((v) => !v)}
                        className="w-full flex items-center justify-between bg-base-200 border border-base-300 text-base-content rounded-xl px-5 py-3 font-semibold text-sm hover:bg-base-300/50 transition"
                    >
                        <span className="flex items-center gap-2">
                            <FaListUl className="text-primary text-xs" />
                            Directorio de la política
                        </span>
                        <span className="text-xs text-base-content/50">{mobileNavOpen ? "▲" : "▼"}</span>
                    </button>
                    {mobileNavOpen && (
                        <div className="mt-2 bg-base-200 border border-base-300 rounded-xl p-4 max-h-[60vh] overflow-auto">
                            <ul className="flex flex-col gap-1">
                                {groups.map(({ id, label, sub }) => (
                                    <NavItem key={id} href={`#${id}`} label={label} sub={sub} active={activeSection === id} onClick={() => handleNavClick(id)} />
                                ))}
                            </ul>
                            <div className="mt-3 pt-3 border-t border-base-300">
                                <p className="text-xs text-base-content/40 text-center">37 artículos • Vigencia desde 28/08/2026</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-6 xl:gap-8">
                    {/* ── Sidebar nav (desktop) ── */}
                    <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
                        <div className="bg-base-200 border border-base-300 rounded-2xl p-5 sticky top-6">
                            <p className="text-sm font-black text-base-content mb-1 flex items-center gap-2">
                                <FaListUl className="text-primary text-xs" />
                                Directorio
                            </p>
                            <p className="text-xs text-base-content/50 mb-4 leading-relaxed">
                                9 grupos • 37 artículos. El documento completo es la versión vigente.
                            </p>
                            <ul className="flex flex-col gap-1">
                                {groups.map(({ id, label, sub }) => (
                                    <NavItem key={id} href={`#${id}`} label={label} sub={sub} active={activeSection === id} onClick={() => handleNavClick(id)} />
                                ))}
                            </ul>
                            <div className="mt-4 space-y-2">
                                <Link to="/terminos-y-condiciones" className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"><FaFileContract /> Términos y Condiciones</Link>
                                <Link to="/politica-de-devolucion" className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"><FaBoxOpen /> Devolución PNC</Link>
                                <Link to="/politica-de-privacidad" className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"><FaShieldHalved /> Aviso de Privacidad</Link>
                            </div>
                            <div className="mt-5 pt-4 border-t border-base-300">
                                <p className="text-xs text-base-content/40 leading-relaxed text-center">
                                    Versión vigente<br />
                                    <span className="text-base-content/60 font-medium">28 de agosto de 2026</span>
                                </p>
                                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-base-content/50">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Art. {allIds.indexOf(activeSection) + 1 || 1} de 37
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ── Main content ── */}
                    <div ref={contentRef} className="flex-1 min-w-0 flex flex-col gap-8 sm:gap-10 pb-6">

                        {/* Intro card — marco legal */}
                        <div className="rounded-2xl bg-base-200 border border-base-300 px-5 sm:px-8 py-6">
                            <p className="text-[11px] font-black tracking-[0.18em] text-primary/60 uppercase mb-2">Marco aplicable</p>
                            <p className="text-sm leading-7 text-base-content/70 text-justify">
                                Las compras se rigen por esta Política, los <Link to="/terminos-y-condiciones" className="text-primary font-bold hover:underline">Términos y Condiciones</Link>, el <Link to="/politica-de-privacidad" className="text-primary font-bold hover:underline">Aviso de Privacidad</Link>, la <Link to="/politica-de-devolucion" className="text-primary font-bold hover:underline">Política de Devolución PNC</Link> y demás políticas aplicables. Cuando una compra está sujeta a legislación mexicana, aplican <strong>Ley Federal de Protección al Consumidor</strong>, disposiciones fiscales, protección de datos y demás ordenamientos. En operaciones internacionales aplican las normas imperativas del país correspondiente. Cuando una disposición de esta Política sea incompatible con un derecho irrenunciable del consumidor, prevalece la ley.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full"><FaGavel className="text-xs" /> LFPC</span>
                                <span className="inline-flex items-center gap-1.5 bg-base-100 border border-base-300 text-base-content/60 text-xs font-semibold px-3 py-1.5 rounded-full">CFDI • IVA • SPEI</span>
                                <span className="inline-flex items-center gap-1.5 bg-base-100 border border-base-300 text-base-content/60 text-xs font-semibold px-3 py-1.5 rounded-full"><FaTruck className="text-xs text-primary" /> Cobertura nacional</span>
                            </div>
                        </div>

                        {/* 1 */}
                        <PolicySection id="objeto" number="01" kicker="Finalidad" title="Objeto de la Política">
                            <p>La Política regula las condiciones bajo las cuales el Comprador podrá adquirir productos de Plásticos del Golfo Sur vía IGA Productos, entre otros:</p>
                            <ul className="list-disc ml-5 mt-3 space-y-1.5">
                                <li>Proceso y modalidades de compra</li>
                                <li>Precios, impuestos, disponibilidad</li>
                                <li>Métodos de pago y confirmación</li>
                                <li>Envíos, cancelaciones, devoluciones, reembolsos</li>
                                <li>Facturación, promociones, responsabilidades e incidencias</li>
                            </ul>
                            <p className="mt-3">Debe interpretarse conjuntamente con los demás documentos legales del Sitio. Si una disposición contradice un derecho irrenunciable, prevalece la ley.</p>
                        </PolicySection>

                        <PolicySection id="aceptacion" number="02" kicker="Consentimiento" title="Aceptación de la Política de Compras">
                            <p>El acceso y navegación no obligan a comprar. Antes de pagar, el Comprador puede revisar productos, cantidades, precios, envío, impuestos y método de pago. Al completar la compra manifiesta su voluntad de adquirir bajo las condiciones mostradas. Debe revisar el resumen y proporcionar datos correctos para procesar y entregar.</p>
                            <p className="mt-3 text-xs bg-primary/5 border border-primary/10 rounded-xl px-4 py-3">Esta aceptación se interconecta con los <Link to="/terminos-y-condiciones" className="text-primary font-bold hover:underline">Términos y Condiciones</Link>: aceptar T&C implica aceptar esta Política (ver T&C actualizado).</p>
                        </PolicySection>

                        {/* 3-5 */}
                        <PolicySection id="invitado" number="03" kicker="Modalidad A" title="Compra como invitado">
                            <p>IGA permite comprar sin cuenta. Se solicitará la información mínima para procesar, identificar, entregar y dar seguimiento: nombre, email, teléfono, dirección, datos de facturación y lo estrictamente necesario.</p>
                            <p className="mt-3">La información se asocia al pedido como <strong>instantánea</strong> al momento de la compra y podrá conservarse para identificar la operación, administrar el pedido, atender reclamaciones, cumplir obligaciones legales, prevenir fraude, auditar y acreditar condiciones.</p>
                            <p className="mt-3">La compra como invitado no genera historial en cuenta. El tratamiento se rige por el <Link to="/politica-de-privacidad" className="text-primary hover:underline font-medium">Aviso de Privacidad</Link>.</p>
                            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-amber-900">
                                <p className="text-xs font-bold">¿Invitado y carrito?</p>
                                <p className="text-xs leading-relaxed">Los artículos persisten de forma temporal. Si no completas el pago, la orden no obliga a pagar (ver Art. 6).</p>
                            </div>
                        </PolicySection>

                        <PolicySection id="cuenta" number="04" kicker="Modalidad B" title="Compra mediante cuenta registrada">
                            <p>Los clientes registrados pueden reutilizar información previa y, según disponibilidad:</p>
                            <ul className="list-disc ml-5 mt-3 space-y-1.5">
                                <li>Consultar historial y estado de pedidos</li>
                                <li>Administrar direcciones y seleccionar una registrada</li>
                                <li>Administrar información de cuenta</li>
                            </ul>
                            <p className="mt-3">Las compras quedan asociadas al historial. La cuenta se rige por T&C y Aviso de Privacidad.</p>
                        </PolicySection>

                        <PolicySection id="carrito" number="05" kicker="Antes de pagar" title="Carrito de compra">
                            <p>Agregar al carrito es solo selección preliminar:</p>
                            <ul className="list-disc ml-5 mt-3 space-y-1.5">
                                <li>No garantiza disponibilidad</li>
                                <li>No fija precio permanentemente</li>
                                <li>No constituye compra ni obliga a pago</li>
                            </ul>
                            <p className="mt-3">El Comprador puede modificar cantidades o eliminar productos antes de confirmar. La información definitiva es la del resumen de confirmación, sin perjuicio de derechos del consumidor.</p>
                        </PolicySection>

                        {/* 6-8 */}
                        <PolicySection id="realizacion" number="06" kicker="Checkout" title="Realización de la compra">
                            <ol className="list-decimal ml-5 space-y-1.5 mt-2">
                                <li>Seleccionar productos</li>
                                <li>Revisar cantidades y características</li>
                                <li>Proporcionar datos de entrega</li>
                                <li>Seleccionar método de pago</li>
                                <li>Revisar resumen</li>
                                <li>Confirmar operación</li>
                                <li>Completar pago</li>
                            </ol>
                            <p className="mt-3">Generar una orden/solicitud no pagada <strong>no</strong> es compra confirmada ni obliga a pagar; el Comprador puede abandonar el proceso antes de completarlo.</p>
                        </PolicySection>

                        <PolicySection id="confirmacion" number="07" kicker="Pago acreditado" title="Confirmación de la compra">
                            <p>Se considera confirmada cuando: (1) se completó el proceso, (2) el pago se procesó exitosamente, (3) el proveedor de pagos confirmó a Plásticos del Golfo Sur y (4) no hay impedimento legal.</p>
                            <p className="mt-3">Confirmado el pago, se inicia preparación y despacho. Podrás recibir confirmación por email. Conserva correo y folio para aclaraciones.</p>
                        </PolicySection>

                        <PolicySection id="registro" number="08" kicker="Trazabilidad" title="Registro de la compra">
                            <p>Se conservan registros electrónicos: folio, fecha/hora, productos, cantidades, precios, impuestos, envío, datos de identificación, estado, pago, envío y comunicaciones.</p>
                            <p className="mt-3">Sirven para administrar/acreditar la operación, aclaraciones, auditorías y requerimientos de autoridad.</p>
                        </PolicySection>

                        {/* 9-11 */}
                        <PolicySection id="precios" number="09" kicker="Tarifa" title="Precios">
                            <p>Los precios son los publicados al momento de comprar y pueden modificarse antes de confirmar. Confirmada la compra, se respetan condiciones, salvo supuestos permitidos por ley. Ante error manifiesto en precio/descripción, se revisará la operación conforme a derecho.</p>
                        </PolicySection>

                        <PolicySection id="impuestos" number="10" kicker="Fiscal" title="Impuestos">
                            <p>Los precios podrán incluir impuestos cuando se indique. Para operaciones mexicanas, se determinan conforme a legislación vigente (p. ej. IVA tasa general). El resumen podrá desglosar: subtotal, envío, impuestos y total. Operaciones internacionales sujetas a aranceles/derechos del país destino.</p>
                        </PolicySection>

                        <PolicySection id="disponibilidad" number="11" kicker="Existencias" title="Disponibilidad de productos">
                            <p>Sujeta a existencias. Ante falta de stock tras confirmar, se informará y podrá ofrecerse: sustitución (con consentimiento), cancelación total/parcial, reembolso, reprogramación u otra alternativa legal. No se sustituye unilateralmente sin consentimiento, salvo disposición legal.</p>
                        </PolicySection>

                        {/* 12-14 */}
                        <PolicySection id="metodos-pago" number="12" kicker="Mercado Pago" title="Métodos de pago">
                            <p>Actualmente vía <strong>Mercado Pago</strong>. Según habilitación del proveedor, podrás encontrar:</p>
                            <ul className="list-disc ml-5 mt-3 space-y-1.5">
                                <li>Tarjetas crédito/débito, SPEI</li>
                                <li>Pagos en establecimientos: OXXO, 7-Eleven, Soriana y otros habilitados</li>
                            </ul>
                            <p className="mt-3">Disponibilidad varía por importe, ubicación y condiciones del proveedor.</p>
                            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
                                <span className="badge badge-sm bg-primary/10 text-primary border-primary/20">Visa</span>
                                <span className="badge badge-sm bg-primary/10 text-primary border-primary/20">Mastercard</span>
                                <span className="badge badge-sm bg-base-200">SPEI</span>
                                <span className="badge badge-sm bg-base-200">OXXO</span>
                            </div>
                        </PolicySection>

                        <PolicySection id="procesamiento" number="13" kicker="Autorización" title="Procesamiento de pagos">
                            <p>Procesados por el proveedor. Plásticos del Golfo Sur no solicita ni almacena datos completos de tarjetas; podrá conservar: últimos 4 dígitos, ID de transacción, método, estado y conciliación. Autorización/rechazo depende del proveedor/emisor. El uso de proveedor externo no elimina obligaciones legales del Proveedor.</p>
                        </PolicySection>

                        <PolicySection id="seguridad" number="14" kicker="Prevención" title="Seguridad de los pagos">
                            <p>Se implementan medidas razonables. Mercado Pago puede aplicar autenticación, prevención de fraude y seguridad. La información financiera sensible se procesa conforme a mecanismos del proveedor.</p>
                        </PolicySection>

                        {/* 15-17 */}
                        <PolicySection id="envios" number="15" kicker="Destino" title="Envíos">
                            <p>Se envía a la dirección proporcionada. Verifica que sea correcta y completa. Se usan transportistas externos. Al despachar, podrás recibir número/enlace de seguimiento al email.</p>
                        </PolicySection>

                        <PolicySection id="tiempos" number="16" kicker="Estimación" title="Tiempos de entrega">
                            <p>Los tiempos comunicados son estimaciones, salvo plazo garantizado expreso. Pueden afectarse por: disponibilidad, preparación, transportista, ubicación, clima, saturación, días inhábiles, operatividad, acceso o fuerza mayor. Incidencias relevantes se informan con lo disponible.</p>
                        </PolicySection>

                        <PolicySection id="facturacion" number="17" kicker="CFDI" title="Facturación">
                            <p>Solicítala a <a href="mailto:facturacion@igaproductos.com" className="text-primary font-bold hover:underline">facturacion@igaproductos.com</a> incluyendo <strong>folio de compra</strong> y datos fiscales correctos. Emisión sujeta a legislación fiscal mexicana.</p>
                        </PolicySection>

                        {/* 18-23 */}
                        <PolicySection id="cancelaciones" number="18" kicker="Solicitud" title="Cancelaciones">
                            <p>Solicita a <a href="mailto:atencionaclientes@igaproductos.com" className="text-primary font-bold hover:underline">atencionaclientes@igaproductos.com</a> con: nombre, folio, email, motivo e info adicional. La posibilidad depende del estado del pedido y derechos legales. Si aún no se prepara/envía, se procura atender antes de avanzar. No limita derechos legales.</p>
                        </PolicySection>

                        <PolicySection id="revocacion" number="19" kicker="LFPC" title="Revocación del consentimiento">
                            <p>Cuando aplica legislación mexicana, se respetan derechos de revocación de la <strong>Ley Federal de Protección al Consumidor</strong> en plazos y términos de ley. Si procede, se gestiona devolución conforme a derecho. Nada limita derechos irrenunciables.</p>
                        </PolicySection>

                        <PolicySection id="devoluciones" number="20" kicker="PNC 90 días" title="Devoluciones">
                            <p>Solo cuando cumplan la <Link to="/politica-de-devolucion" className="text-primary font-bold hover:underline">Política de Devolución PNC</Link>. Plazo máximo <strong>90 días naturales desde la compra</strong> (salvo plazo legal distinto). Transcurrido, no se aceptan salvo obligación legal. Fecha de compra = registro en sistemas. <Link to="/politica-de-devolucion" className="inline-flex items-center gap-1 text-primary font-bold hover:underline">Consultar PNC <FaExternalLinkAlt className="text-[10px]" /></Link></p>
                        </PolicySection>

                        <PolicySection id="danados" number="21" kicker="Incidencia" title="Productos dañados, defectuosos o incorrectos">
                            <p>Si recibes producto dañado, defectuoso, incompleto, diferente o no correspondiente, reporta a <a href="mailto:atencionaclientes@igaproductos.com" className="text-primary font-bold hover:underline">atencionaclientes@igaproductos.com</a> dentro del plazo PNC y en todo caso dentro de <strong>90 días</strong> (salvo plazo legal). Adjunta fotos/video, empaque, pedido y evidencia. Procedimiento en <Link to="/politica-de-devolucion" className="text-primary hover:underline">PNC</Link>.</p>
                        </PolicySection>

                        <PolicySection id="garantias" number="22" kicker="Fabricante" title="Garantías">
                            <p>Cuando exista garantía de fabricante/distribuidor/Plásticos del Golfo Sur se informarán periodo, cobertura, exclusiones, procedimiento, requisitos y centro de atención. Las garantías comerciales no limitan derechos legales.</p>
                        </PolicySection>

                        <PolicySection id="reembolsos" number="23" kicker="Medio de pago" title="Reembolsos">
                            <p>Cuando corresponda, se gestiona según causa, método y ley. Solicita a <a href="mailto:atencionaclientes@igaproductos.com" className="text-primary hover:underline">atencionaclientes@igaproductos.com</a> con nombre, folio, email, motivo e info. Cuando sea posible, por mismo medio de pago. El plazo depende del proveedor/institución.</p>
                        </PolicySection>

                        {/* 24-28 */}
                        <PolicySection id="promociones" number="24" kicker="Campañas" title="Promociones y descuentos">
                            <p>Sujetas a condiciones particulares: vigencia, existencias, productos, cantidad, usos, pago, ubicación. No acumulables si se indica. Vigencia vencida no reclamable, salvo disposición en promoción o ley. Errores técnicos manifiestos se revisan conforme a ley.</p>
                        </PolicySection>

                        <PolicySection id="errores" number="25" kicker="Fe de erratas" title="Errores en precios o información">
                            <p>Pueden existir errores humanos/técnicos/tipográficos/sincronización. Detectado error manifiesto en precio/descripción/disponibilidad/promoción se revisan operaciones afectadas conforme a ley; si afecta compra realizada, se informa al Comprador.</p>
                        </PolicySection>

                        <PolicySection id="fraude" number="26" kicker="Seguridad" title="Prevención de fraude">
                            <p>Se implementan mecanismos contra fraude, suplantación, uso no autorizado de medios de pago, abuso de promos y accesos no autorizados. Ante indicios de irregularidad se puede pedir verificación; si no es validable, la operación puede suspenderse/cancelarse conforme a ley.</p>
                        </PolicySection>

                        <PolicySection id="datos" number="27" kicker="Privacidad" title="Protección de datos personales">
                            <p>Tratamiento conforme al <Link to="/politica-de-privacidad" className="text-primary font-bold hover:underline">Aviso de Privacidad</Link> y ley. Medidas administrativas/técnicas/organizativas. Fines: procesar compra, pagos, envíos, facturas, soporte, reclamaciones, fraude, registros, obligaciones legales y defensa de intereses. Proveedores (pago, logística, tech) tratan datos en lo necesario.</p>
                        </PolicySection>

                        <PolicySection id="responsabilidades" number="28" kicker="Checklist" title="Responsabilidades del Comprador">
                            <p>Antes de confirmar verifica: producto/modelo/variante, características, cantidad, precio, envío, dirección, contacto, datos fiscales, método e importe total.</p>
                            <p className="mt-3">Proporciona info veraz y completa. Ante dirección incorrecta se puede solicitar corrección, sin limitar derechos cuando la incidencia es imputable al Proveedor/logística.</p>
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {["Producto", "Cantidad", "Precio", "Dirección", "Pago", "Total"].map((t) => (
                                    <span key={t} className="bg-base-200 border border-base-300 text-xs font-bold px-3 py-2 rounded-lg text-center">{t}</span>
                                ))}
                            </div>
                        </PolicySection>

                        {/* 29-37 */}
                        <PolicySection id="comunicaciones" number="29" kicker="Notificaciones" title="Comunicaciones relacionadas con la compra">
                            <p>Acepta recibir comunicaciones electrónicas directas: confirmación de compra/pago, preparación, envío, tracking, incidencias, cancelaciones, reembolsos, facturación y solicitudes. Proporciona email válido. Comunicaciones comerciales sujetas a consentimiento.</p>
                        </PolicySection>

                        <PolicySection id="fuerza-mayor" number="30" kicker="Caso fortuito" title="Casos de fuerza mayor">
                            <p>Impedimentos fuera de control razonable (desastres, clima extraordinario, conflictos, actos de autoridad, interrupciones de servicios, fallas de infraestructura, transporte, emergencias, incidentes tecnológicos). Se informará y se procurará mitigar; cuando proceda, reprogramación/suspensión/cancelación.</p>
                        </PolicySection>

                        <PolicySection id="internacional" number="31" kicker="Fronteras" title="Compras internacionales">
                            <p>Cuando el Sitio/logística lo permita. Pueden aplicar impuestos, aranceles, derechos, aduana, restricciones, regulaciones y requisitos documentales del país destino. Prevalecen normas imperativas de protección al consumidor del país correspondiente.</p>
                        </PolicySection>

                        <PolicySection id="atencion" number="32" kicker="Soporte" title="Atención al cliente">
                            <p>Para aclaraciones: <a href="mailto:atencionaclientes@igaproductos.com" className="text-primary font-bold hover:underline">atencionaclientes@igaproductos.com</a>. Recomendado enviar: nombre, folio, email, descripción y evidencia. Se procura atención en plazo razonable, sin perjuicio de acudir a autoridades competentes.</p>
                        </PolicySection>

                        <PolicySection id="legislacion" number="33" kicker="Jurisdicción" title="Legislación aplicable">
                            <p>Compras en México se rigen por leyes mexicanas: LFPC, Código de Comercio, civil/mercantil, fiscal, protección de datos. Normas obligatorias prevalecen sobre esta Política. En internacional aplican normas imperativas del país.</p>
                        </PolicySection>

                        <PolicySection id="modificaciones" number="34" kicker="Versión vigente" title="Modificaciones a la Política">
                            <p>Plásticos del Golfo Sur puede modificarla por cambios comerciales, pagos, logística, tecnología, regulatorios, productos o procedimientos. Versión vigente = publicada en Sitio. No afecta retroactivamente derechos de compras previas, salvo obligación legal.</p>
                        </PolicySection>

                        <PolicySection id="relacion" number="35" kicker="Sistema normativo" title="Relación con otras políticas">
                            <p>Forma parte del conjunto que regula compras: T&C, Aviso de Privacidad, Devolución PNC, Políticas de Envío, condiciones de promos y garantías. Ante contradicción, prevalece norma legal obligatoria y disposición específica. Nada renuncia derechos irrenunciables.</p>
                        </PolicySection>

                        <PolicySection id="conservacion" number="36" kicker="Expediente" title="Conservación de comprobantes">
                            <p>Conserva: correo/folio de compra, comprobante de pago, CFDI, tracking y comunicaciones — necesarios para aclaraciones, devoluciones, garantías o reembolsos.</p>
                        </PolicySection>

                        <PolicySection id="identificacion" number="37" kicker="Contacto oficial" title="Datos de identificación y contacto">
                            <div className="space-y-3">
                                <p><strong>Razón social:</strong> PLÁSTICOS DEL GOLFO SUR, S.A. DE C.V.<br /><strong>Marca:</strong> IGA Productos<br /><strong>Sitio:</strong> <a href="https://igaproductos.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">igaproductos.com</a></p>
                                <div className="grid sm:grid-cols-2 gap-3 not-prose">
                                    <a href="mailto:atencionaclientes@igaproductos.com" className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 hover:bg-primary/10 transition">
                                        <FaEnvelope className="text-primary" />
                                        <div><p className="text-xs font-black">Atención a clientes</p><p className="text-xs text-primary font-medium break-all">atencionaclientes@igaproductos.com</p></div>
                                    </a>
                                    <a href="mailto:facturacion@igaproductos.com" className="flex items-center gap-3 bg-base-200 border border-base-300 rounded-xl px-4 py-3 hover:bg-base-300/50 transition">
                                        <FaMoneyBillWave className="text-primary" />
                                        <div><p className="text-xs font-black">Facturación</p><p className="text-xs font-medium break-all">facturacion@igaproductos.com</p></div>
                                    </a>
                                </div>
                                <p className="text-xs text-base-content/50 border-l-2 border-primary/20 pl-3">La presente Política establece condiciones comerciales y debe interpretarse conforme a disposiciones legales aplicables.</p>
                            </div>
                        </PolicySection>

                        <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-orange-500/5 to-blue-950/5 border border-primary/10 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-black text-base-content"><FaGavel className="inline mr-1.5 text-primary" />¿Dudas sobre una compra?</p>
                                <p className="text-xs text-base-content/60 mt-1">Escala tu folio a atención al cliente. Respuesta en plazo razonable.</p>
                            </div>
                            <Link to="/contacto" className="btn btn-primary btn-sm rounded-xl font-bold">Ir a Contacto</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchasePolicy;
