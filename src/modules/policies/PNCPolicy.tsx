import { MdOutlineVerified, MdOutlineContactMail } from "react-icons/md";

const SectionBar = () => (
    <div className="bg-primary px-10 py-1 w-fit rounded-xl shadow-lg" />
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="px-2 py-1 w-fit rounded-xl border border-base-300 bg-base-300 text-2xl sm:text-3xl lg:text-4xl font-bold">
        {children}
    </h2>
);

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

/* ── Main component ─────────────────────────────────────────── */
const PNCPolicy = () => {
    return (
        <section className="w-full bg-base-300 rounded-xl px-3 sm:px-5 py-6 sm:py-10">
            <div className="flex flex-col gap-8 sm:gap-10">

                <div id="intro" className="scroll-mt-6">
                    <div className="flex flex-col gap-2 mb-4">
                        <SectionBar />
                        <h1 className="px-2 py-1 w-fit rounded-xl border border-base-300 bg-base-300 text-2xl sm:text-3xl lg:text-4xl font-bold">
                            Política de Devolución PNC
                        </h1>
                    </div>
                    <div className="bg-blue-950 rounded-xl px-5 sm:px-8 py-6 sm:py-8">
                        <p className="text-white/90 text-sm sm:text-base leading-7 sm:leading-8 text-justify">
                            En <strong className="text-white">IGA Productos</strong>, valoramos la satisfacción de nuestros clientes y nos esforzamos por ofrecer productos de alta calidad que cumplan con sus expectativas. Por lo tanto, hemos desarrollado una política de devolución para apoyar a nuestros clientes en caso de que se presente alguna de las situaciones descritas a continuación.
                        </p>
                        <p className="text-white/90 text-sm sm:text-base leading-7 sm:leading-8 text-justify mt-4">
                            A continuación, se detallan los términos y condiciones de esta política aplicable a productos catalogados como <strong className="text-white">No Conformes (PNC)</strong>.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {["Plazo máx. 48 horas", "Defectos de fábrica", "Requiere N.º de lote"].map((badge) => (
                                <span key={badge} className="bg-primary/20 border border-primary/30 text-white text-[0.72rem] font-semibold px-3 py-1 rounded-full">
                                    ✓ {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── FORMULARIO ──────────────────────────────────── */}
                <PolicySection id="formulario" title="Formulario de solicitud">
                    <p>
                        Para solicitar un proceso de devolución de producto, deberá llenar el formulario de contacto o bien reportar dicha inconformidad vía correo electrónico al área de atención a clientes, con copia a la administración general.
                    </p>
                    <div className="mt-5 flex flex-col sm:flex-row gap-3 not-prose">
                        <a
                            href="/contacto"
                            className="inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 hover:shadow-md active:translate-y-px transition-all duration-150"
                        >
                            <MdOutlineContactMail className="text-base flex-shrink-0" />
                            Ir al formulario de contacto
                        </a>
                        <a
                            href="mailto:atencionacliente@igaproductos.com.mx"
                            className="inline-flex items-center justify-center gap-2 border border-primary text-primary text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-primary hover:text-white transition-all duration-150"
                        >
                            ✉ atencionacliente@igaproductos.com.mx
                        </a>
                    </div>
                    <p className="mt-3 text-xs text-base-content/50 not-prose">
                        Enviar copia a:{" "}
                        <a href="mailto:administracion@igaproductos.com.mx" className="text-primary hover:underline">
                            administracion@igaproductos.com.mx
                        </a>
                    </p>
                </PolicySection>

                {/* ── GARANTÍA ────────────────────────────────────── */}
                <PolicySection id="garantia" title="Garantía">
                    <p>
                        La garantía será válida únicamente cuando la mercancía y/o el artículo adquirido presente <strong>defectos de fábrica</strong> y/o <strong>daños severos, visibles e imputables</strong> al manejo en almacén o durante su traslado por parte de la paquetería.
                    </p>
                    <p className="mt-4">
                        En estos casos, <strong>IGA Productos</strong> se reserva el derecho de cancelación de la operación conforme a los criterios internos de evaluación del producto.
                    </p>
                    <div className="mt-5 not-prose">
                        <div className="border-l-4 border-primary pl-4">
                            <h3 className="font-bold text-sm text-base-content mb-1 flex items-center gap-2">
                                <MdOutlineVerified className="text-primary text-base" />
                                Casos cubiertos por garantía
                            </h3>
                            <ul className="list-disc ml-4 text-sm space-y-1 text-base-content/70">
                                <li>Defectos de fabricación visibles</li>
                                <li>Daños imputables al almacén</li>
                                <li>Daños durante el traslado por paquetería</li>
                            </ul>
                        </div>
                    </div>
                </PolicySection>

                {/* ── DEVOLUCIÓN ──────────────────────────────────── */}
                <PolicySection id="devolucion" title="Devolución">
                    <p>
                        <strong>IGA Productos</strong> podrá recibir mercancía como devolución únicamente proporcionando la siguiente información. En caso de no contar con estos datos, la mercancía <strong>no será aceptada</strong>.
                    </p>
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
                        {[
                            { label: "Número de lote", icon: "🏷", desc: "Identificador del lote de fabricación" },
                            { label: "Número de folio de factura", icon: "🧾", desc: "Folio de la factura de compra" },
                        ].map(({ label, icon, desc }) => (
                            <div key={label} className="bg-base-300 rounded-lg px-4 py-3 border border-base-200">
                                <p className="text-xs font-bold text-primary flex items-center gap-1">
                                    <span>{icon}</span> {label}
                                </p>
                                <p className="text-[0.70rem] text-base-content/60 mt-0.5">{desc}</p>
                                <p className="text-xs font-semibold text-base-content mt-2">Requerido ✓</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 not-prose border-l-4 border-amber-400 pl-4">
                        <p className="text-amber-700 text-xs sm:text-sm font-medium leading-relaxed">
                            ⚠ La devolución podrá ser recibida en un plazo máximo de{" "}
                            <strong>48 horas</strong> posteriores a la recepción del producto.
                        </p>
                    </div>
                </PolicySection>

                {/* ── EXCEPCIONES ─────────────────────────────────── */}
                <PolicySection id="excepciones" title="Casos no cubiertos">
                    <p>
                        Con el objetivo de mantener la integridad del proceso de devolución, <strong>IGA Productos</strong> no aceptará devoluciones en los siguientes casos:
                    </p>
                    <div className="mt-5 not-prose space-y-3">
                        {[
                            { label: "Error en el producto solicitado", desc: "Si el cliente seleccionó un producto equivocado al momento de realizar el pedido." },
                            { label: "Modelo o clase incorrecto", desc: "Si la selección del modelo o clase no corresponde a la necesidad del cliente." },
                            { label: "Ajuste, color o marca equivocados", desc: "Errores de configuración originados por el cliente en el proceso de compra." },
                        ].map(({ label, desc }) => (
                            <div key={label} className="border-l-4 border-primary pl-4">
                                <h3 className="font-bold text-sm text-base-content mb-1">{label}</h3>
                                <p className="text-[0.78rem] text-base-content/60 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 not-prose flex flex-wrap gap-2">
                        {["Producto", "Modelo", "Clase", "Ajuste", "Color", "Marca"].map((tag) => (
                            <span key={tag} className="bg-primary text-white text-[0.72rem] font-semibold px-3 py-1.5 rounded-lg">
                                {tag}
                            </span>
                        ))}
                    </div>
                </PolicySection>

            </div>
        </section>
    );
};

export default PNCPolicy;