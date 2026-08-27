import { useEffect, useState, type RefObject } from "react";
import { FaArrowUp } from "react-icons/fa6";
import clsx from "clsx";
import { scrollToTienda } from "../utils/scrollToTienda";

interface Props {
    sentinelRef: RefObject<HTMLDivElement | null>;
}

const ShopBackToTop = ({ sentinelRef }: Props) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const target = sentinelRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [sentinelRef]);

    return (
        <button
            type="button"
            onClick={() => scrollToTienda()}
            aria-label="Volver arriba"
            className={clsx(
                "fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full",
                "inline-flex items-center justify-center",
                "bg-blue-950 text-white hover:bg-blue-900",
                "shadow-sm hover:shadow-md active:scale-95",
                "transition-all duration-300",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            )}
        >
            <FaArrowUp className="text-base" />
        </button>
    );
};

export default ShopBackToTop;
