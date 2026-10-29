import { FaFileLines } from "react-icons/fa6";
import { showModal } from "../../../../../global/GlobalHelpers";

/* Fila de color + botón de ficha técnica (compartida por mobile y desktop) */
interface ColorSpecRowProps {
    color: { line: string; name: string; code: string };
    techSheetUrl?: string;
    pdfModalRef: React.RefObject<HTMLDialogElement | null>;
}

const ColorSpecRow = ({ color, techSheetUrl, pdfModalRef }: ColorSpecRowProps) => (
    <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-base-200/30 border border-base-200">
        <div className="flex items-center gap-2.5 min-w-0">
            <div
                className="w-7 h-7 rounded-full shadow-sm border border-base-300 shrink-0"
                style={{ backgroundColor: color.code }}
            />
            <div className="min-w-0 leading-tight">
                <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest">Color</p>
                <p className="text-sm font-extrabold text-base-content truncate">{color.name}</p>
                <p className="text-[10px] font-bold text-base-content/50 uppercase">{color.line}</p>
            </div>
        </div>
        {techSheetUrl && (
            <button
                type="button"
                onClick={() => showModal(pdfModalRef.current)}
                className="btn btn-outline btn-sm rounded-lg font-bold gap-2 border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary shrink-0"
            >
                <FaFileLines /> Ficha técnica
            </button>
        )}
    </div>
);

export default ColorSpecRow;
