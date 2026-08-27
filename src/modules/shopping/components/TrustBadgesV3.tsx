import { FaShippingFast, FaLock } from "react-icons/fa";
import igaLogo from "../../../assets/logo/igalogo-2.webp";
import { FaShieldHalved } from "react-icons/fa6";

const TrustBadgesV3 = () => {
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
        </div>
    );
};

export default TrustBadgesV3;
