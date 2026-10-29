import clsx from "clsx";
import { FaCirclePause } from "react-icons/fa6";

const StockIndicator = ({ stock, isPaused = false }: { stock: number; isPaused?: boolean }) => {
    if (isPaused) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-warning/15 text-warning">
                <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                <FaCirclePause /> Pausado
            </span>
        );
    }
    if (stock <= 0) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-error/15 text-error">
                <span className="w-1.5 h-1.5 rounded-full bg-error" />
                Agotado
            </span>
        );
    }
    const level = stock > 100 ? "high" : stock > 20 ? "medium" : "low";
    return (
        <span className={clsx(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
            level === "high" && "bg-success/15 text-success",
            level === "medium" && "bg-warning/15 text-warning",
            level === "low" && "bg-error/15 text-error",
        )}>
            <span className={clsx(
                "w-1.5 h-1.5 rounded-full",
                level === "high" && "bg-success",
                level === "medium" && "bg-warning",
                level === "low" && "bg-error animate-pulse",
            )} />
            {level === "high" && `En stock (${stock} uds.)`}
            {level === "medium" && `Stock limitado (${stock} uds.)`}
            {level === "low" && `Stock bajo, ¡te quedan pocos! (${stock} uds.)`}
        </span>
    );
};

export default StockIndicator;
