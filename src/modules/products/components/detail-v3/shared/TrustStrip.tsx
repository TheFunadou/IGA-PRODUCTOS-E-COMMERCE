import { FaShieldHalved, FaTruck, FaFileInvoiceDollar, FaHeadset } from "react-icons/fa6";

/* Franja de confianza: en mobile (<md) es una matriz 2x2 y en md+ conserva la
   fila flex horizontal con chips iguales (flex-1 solo aplica a hijos de flex,
   en el grid de mobile las cajas delimitadas estiran a su columna). */
const TrustStrip = () => (
    <div className="grid grid-cols-2 items-stretch gap-2 mt-6 pt-6 border-t border-base-200 md:flex md:flex-wrap">
        {[
            { icon: FaShieldHalved, label: "Garantía de calidad", sub: "Productos certificados" },
            { icon: FaTruck, label: "Envío rastreado", sub: "Entregas lo antes posible" },
            { icon: FaFileInvoiceDollar, label: "Facturación", sub: "CFDI inmediato" },
            { icon: FaHeadset, label: "Soporte dedicado", sub: "Asesor disponible" },
        ].map(({ icon: Icon, label, sub }, i) => (
            <div key={i} className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-base-200/40 border border-base-200 md:flex-1 md:w-fit md:min-w-47.5">
                <Icon className="text-primary shrink-0" />
                {/* min-w-0 defensivo: un label largo de BD se contrae en vez de expandir el chip */}
                <div className="min-w-0 leading-tight">
                    <p className="text-xs font-bold text-base-content">{label}</p>
                    <p className="text-[10px] text-base-content/55">{sub}</p>
                </div>
            </div>
        ))}
    </div>
);

export default TrustStrip;
