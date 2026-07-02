import { Link } from "react-router-dom";
import { MdOutlineCookie, MdChevronRight, MdClose } from "react-icons/md";
import { SiMeta } from "react-icons/si";
import { useState } from "react";
import type { ConsentStatus } from "../../modules/auth/states/cookieStore";

interface Props {
    onSetConsent: (status: Exclude<ConsentStatus, null>) => void;
}

const CookieConsent = ({ onSetConsent }: Props) => {
    const [visible, setVisible] = useState(true);

    const handleConsent = (status: "accepted" | "rejected") => {
        setVisible(false);
        // Small delay to let exit animation play before removing from DOM
        setTimeout(() => onSetConsent(status), 280);
    };

    return (
        <div
            role="dialog"
            aria-label="Preferencias de cookies"
            aria-modal="false"
            className={[
                "fixed bottom-4 left-4 z-50",
                "w-[calc(100vw-2rem)] max-w-sm",
                "bg-base-100 border border-base-300",
                "rounded-2xl shadow-2xl shadow-black/20",
                "flex flex-col gap-0",
                "overflow-hidden",
                "transition-all duration-300 ease-out",
                visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none",
            ].join(" ")}
        >
            {/* ── Header strip ─────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3 border-b border-base-200">
                <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                        <MdOutlineCookie size={18} />
                    </span>
                    <p className="text-sm font-bold text-base-content leading-tight">
                        Personaliza tu experiencia
                    </p>
                </div>
                <button
                    type="button"
                    aria-label="Cerrar sin decidir"
                    onClick={() => handleConsent("rejected")}
                    className="text-base-content/30 hover:text-base-content/60 transition-colors flex-shrink-0"
                >
                    <MdClose size={16} />
                </button>
            </div>

            {/* ── Body ─────────────────────────────────────────── */}
            <div className="px-4 pt-3 pb-1 flex flex-col gap-3">
                <p className="text-xs text-base-content/70 leading-relaxed">
                    Usamos cookies para entender tus intereses y mostrarte
                    contenido relevante que se ajuste a ti, ofreciéndote una
                    experiencia más personalizada en nuestro sitio.
                </p>

                {/* ── Expandable detail ────────────────────────── */}
                <details className="group text-xs">
                    <summary className="flex items-center gap-1 cursor-pointer select-none text-primary font-medium list-none">
                        <MdChevronRight
                            size={14}
                            className="transition-transform duration-200 group-open:rotate-90"
                        />
                        Ver detalles técnicos
                    </summary>
                    <div className="mt-2 pl-4 flex flex-col gap-2 text-base-content/60 border-l-2 border-primary/20">
                        <div className="flex items-start gap-2">
                            <SiMeta size={10} className="text-primary mt-0.5 flex-shrink-0" />
                            <p>Datos de navegación como páginas visitadas e interacciones con productos.</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <SiMeta size={10} className="text-primary mt-0.5 flex-shrink-0" />
                            <p>Esta información se comparte con Meta Platforms, Inc. y se sujeta a su <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="underline text-primary">política de privacidad</a>.</p>
                        </div>
                    </div>
                </details>

                <p className="text-[10px] text-base-content/40 leading-relaxed">
                    Consulta nuestra{" "}
                    <Link to="/politica-de-privacidad" className="underline text-primary/70 hover:text-primary transition-colors">
                        Política de privacidad
                    </Link>{" "}
                    para más detalles. Puedes cambiar esta preferencia en cualquier momento.
                </p>
            </div>

            {/* ── Actions ──────────────────────────────────────── */}
            <div className="px-4 pb-4 pt-3 flex items-center gap-2 justify-end border-t border-base-200 mt-2">
                <button
                    type="button"
                    id="cookie-reject-btn"
                    onClick={() => handleConsent("rejected")}
                    className="btn btn-xs btn-ghost text-base-content/30 hover:text-base-content/60 font-normal"
                >
                    Solo necesario
                </button>
                <button
                    type="button"
                    id="cookie-accept-btn"
                    onClick={() => handleConsent("accepted")}
                    className="btn btn-xs btn-primary font-semibold gap-1"
                >
                    <MdOutlineCookie size={12} />
                    Permitir todo
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;