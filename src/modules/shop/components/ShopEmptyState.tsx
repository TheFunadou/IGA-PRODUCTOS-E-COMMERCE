import { FaStore } from "react-icons/fa6";

interface ShopEmptyStateProps {
    type: "error" | "empty";
    message?: string;
    onRetry?: () => void;
}

const ShopEmptyState = ({ type, message, onRetry }: ShopEmptyStateProps) => {
    if (type === "error") {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20 bg-base-100 rounded-2xl border border-base-300">
                <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-3xl shadow-inner">
                    ⚠️
                </div>
                <div className="text-center px-4">
                    <p className="font-extrabold text-lg text-base-content">Ocurrió un error</p>
                    <p className="text-error/80 text-sm mt-1 mb-2 max-w-sm">
                        {message || "No se pudieron cargar los productos"}
                    </p>
                    {onRetry && (
                        <button className="btn btn-primary font-bold shadow-md" onClick={onRetry}>
                            Intentar nuevamente
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center justify-center py-24 bg-base-100 rounded-3xl border border-base-300 border-dashed">
            <FaStore className="text-5xl text-base-content/10 mb-4" />
            <p className="text-lg font-bold text-base-content/60">No se encontraron productos</p>
            <p className="text-sm text-base-content/40 mt-1 max-w-sm text-center">
                Intenta ajustando los filtros o seleccionando otra categoría.
            </p>
        </div>
    );
};

export default ShopEmptyState;
