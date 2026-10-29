import { FaUserShield } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";

/* Encabezado compartido de páginas de compra V3 (carrito, comprar ahora):
   icono + título + badge de invitado + subtítulo. */
interface PageHeaderProps {
    title: string;
    subtitle: string;
    /** Texto del tooltip del badge "Invitado" (cada página explica su persistencia) */
    guestTip: string;
    isAuth: boolean;
}

const PageHeader = ({ title, subtitle, guestTip, isAuth }: PageHeaderProps) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MdShoppingBag className="text-primary text-lg sm:text-xl" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-none">
                    {title}
                </h1>
                {!isAuth && (
                    <div className="tooltip tooltip-bottom" data-tip={guestTip}>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-warning/50 text-warning-content text-xs font-bold tracking-widest uppercase cursor-help">
                            <FaUserShield className="text-[10px]" />
                            Invitado
                        </span>
                    </div>
                )}
            </div>
            <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
                {subtitle}
            </p>
        </div>
    </div>
);

export default PageHeader;
