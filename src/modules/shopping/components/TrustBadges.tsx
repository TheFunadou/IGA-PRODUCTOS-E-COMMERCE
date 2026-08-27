import { FaShippingFast, FaLock, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { FaShieldHalved } from "react-icons/fa6";
import igaLogo from "../../../assets/logo/igalogo-2.webp";
import type { PV3CardData } from "../../products/ProductTypes";
import type { ShoppingCartI } from "../ShoppingTypes";

const WHATSAPP_NUMBER = "529211963246";
const COTIZACION_EMAIL = "atencionaclientes@igaproductos.com";

interface TrustBadgesProps {
    items: ShoppingCartI[];
    cardsMap: Map<string, PV3CardData>;
}

const TrustBadges = ({ items, cardsMap }: TrustBadgesProps) => {
    const whatsappMsg = encodeURIComponent(
        `Hola, me gustaría solicitar una cotización para los siguientes productos de mi carrito:\n\n${items.map((entry) => {
            const card = cardsMap.get(entry.item.sku.toLowerCase());
            const name = card?.product?.product_name ?? entry.item.sku;
            return `· ${name} (SKU: ${entry.item.sku}) x${entry.quantity}`;
        }).join("\n")}`
    );

    const emailSubject = encodeURIComponent("Cotización de productos IGA");
    const emailBody = encodeURIComponent(
        `Hola, me gustaría solicitar una cotización para los siguientes productos de mi carrito:\n\n${items.map((entry) => {
            const card = cardsMap.get(entry.item.sku.toLowerCase());
            const name = card?.product?.product_name ?? entry.item.sku;
            return `· ${name} (SKU: ${entry.item.sku}) x${entry.quantity}`;
        }).join("\n")}`
    );

    return (
        <div className="flex flex-col gap-3">
            {/* IGA Trust Badge */}
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-base-100 border border-base-300">
                <figure className="w-1/2">
                    <img src={igaLogo} alt="IGA" className="object-contain shrink-0" />
                </figure>
                <p className="text-xs text-base-content/50 leading-relaxed">
                    Tu información personal y de pago está protegida y segura con nosotros.
                </p>
            </div>

            {/* Envíos */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-300">
                <FaShippingFast className="text-primary text-lg flex-shrink-0" />
                <span className="text-xs font-semibold text-base-content/70 leading-tight">Envíos a todo México</span>
            </div>

            {/* Seguridad y privacidad */}
            <a
                href="/politica-de-privacidad"
                className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-300 hover:border-primary/30 transition-colors"
            >
                <FaShieldHalved className="text-primary text-lg flex-shrink-0" />
                <span className="text-xs font-semibold text-base-content/70 leading-tight">Seguridad y privacidad</span>
            </a>

            {/* Pagos seguros */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-300">
                <FaLock className="text-primary text-lg flex-shrink-0" />
                <span className="text-xs font-semibold text-base-content/70 leading-tight">Pagos seguros</span>
            </div>

            {/* Cotización */}
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-base-100 border border-base-300">
                <p className="text-xs font-semibold text-base-content leading-tight">
                    ¿Requieres una cotización de estos productos?
                </p>
                <p className="text-[10px] text-base-content/50">
                    Da clic en una opción para enviar el contenido de tu carrito
                </p>
                <div className="flex gap-2">
                    <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}/?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg alert alert-success alert-soft text-sm font-bold hover:bg-success hover:text-white transition-colors"
                    >
                        <FaWhatsapp className="text-sm" />
                        WhatsApp
                    </a>
                    <a
                        href={`mailto:${COTIZACION_EMAIL}?subject=${emailSubject}&body=${emailBody}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-base-300 text-base-content text-xs font-bold hover:bg-base-content/20 transition-colors"
                    >
                        <FaEnvelope className="text-sm" />
                        Correo
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TrustBadges;
