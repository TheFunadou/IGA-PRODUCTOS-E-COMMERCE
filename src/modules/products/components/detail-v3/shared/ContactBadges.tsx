import { FaAward, FaBoxesPacking, FaCirclePause, FaHeadset, FaWarehouse } from "react-icons/fa6";

const WHATSAPP_NUMBER = "529211963246";

const SupportBadge = ({ productName, sku }: { productName: string; sku: string }) => (
    <a
        href={`https://wa.me/${WHATSAPP_NUMBER}/?text=${encodeURIComponent(`Hola, necesito ayuda o asistencia sobre el producto ${productName}, SKU ${sku}. ¿Me pueden apoyar?`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3.5 rounded-xl bg-success/10 border border-success/25 hover:bg-success/15 transition-colors"
    >
        <div className="w-9 h-9 rounded-lg bg-success/15 flex items-center justify-center shrink-0">
            <FaHeadset className="text-success" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-extrabold text-base-content leading-tight">¿Necesitas ayuda con este producto?</p>
            <p className="text-[10px] font-semibold text-success mt-0.5">Contáctanos ahora por WhatsApp</p>
        </div>
    </a>
);

const VolumeQuoteBadge = ({ productName, sku }: { productName: string; sku: string }) => (
    <a
        href={`mailto:atencionaclientes@igaproductos.com?subject=${encodeURIComponent(`Cotización en volumen: ${productName} (SKU ${sku})`)}&body=${encodeURIComponent(`Hola, requiero comprar el producto ${productName}, SKU ${sku}, en volúmenes grandes. ¿Podrían asesorarme con una cotización personalizada?`)}`}
        className="flex items-center gap-3 p-3.5 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
    >
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FaWarehouse className="text-primary" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-extrabold text-base-content leading-tight">¿Compras en volúmenes grandes?</p>
            <p className="text-[10px] font-semibold text-primary mt-0.5">Te asesoramos con una cotización</p>
            <p className="text-[10px] font-medium text-base-content/50 mt-0.5 break-all">atencionaclientes@igaproductos.com</p>
        </div>
    </a>
);

const AutomaticDiscountBadge = () => (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-primary/5 border border-primary/25">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <FaAward className="text-primary" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-extrabold text-base-content leading-tight">Recibe 10% descuento por mayoreo</p>
            <p className="text-[10px] font-semibold text-primary mt-0.5">en compras de 60 o más piezas de este producto</p>
        </div>
    </div>
);

const OutOfStockInquiryBadge = ({ productName, sku }: { productName: string; sku: string }) => (
    <a
        href={`https://wa.me/${WHATSAPP_NUMBER}/?text=${encodeURIComponent(`Hola, me interesa el producto ${productName} (SKU ${sku}) que actualmente figura sin stock. Quisiera consultar disponibilidad próxima o la posibilidad de hacer una solicitud bajo pedido. ¿Podrían brindarme más información?`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3.5 rounded-xl bg-error/10 border border-error/25 hover:bg-error/15 transition-colors"
    >
        <div className="w-9 h-9 rounded-lg bg-error/15 flex items-center justify-center shrink-0">
            <FaBoxesPacking className="text-error" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-extrabold text-base-content leading-tight">¿Te interesa este producto y no tiene stock?</p>
            <p className="text-[11px] font-medium text-base-content/70 leading-tight">Contáctanos para consultar disponibilidad próxima o hacer una solicitud bajo pedido</p>
            <p className="text-[10px] font-semibold text-error mt-0.5">Escríbenos por WhatsApp →</p>
        </div>
    </a>
);

const PausedInquiryBadge = ({ productName, sku }: { productName: string; sku: string }) => (
    <a
        href={`https://wa.me/${WHATSAPP_NUMBER}/?text=${encodeURIComponent(`Hola, me interesa el producto ${productName} (SKU ${sku}). Sé que actualmente está pausado, pero quisiera saber si todavía lo puedo adquirir. ¿Podrían brindarme más información sobre su disponibilidad?`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3.5 rounded-xl bg-warning/10 border border-warning/25 hover:bg-warning/15 transition-colors"
    >
        <div className="w-9 h-9 rounded-lg bg-warning/15 flex items-center justify-center shrink-0">
            <FaCirclePause className="text-warning" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-extrabold text-base-content leading-tight">¿Te interesa este producto?</p>
            <p className="text-[11px] font-medium text-base-content/70 leading-tight">Está pausado, pero si deseas adquirirlo contáctanos para consultar su disponibilidad</p>
            <p className="text-[10px] font-semibold text-warning mt-0.5">Escríbenos por WhatsApp →</p>
        </div>
    </a>
);

export { SupportBadge, VolumeQuoteBadge, AutomaticDiscountBadge, OutOfStockInquiryBadge, PausedInquiryBadge };
