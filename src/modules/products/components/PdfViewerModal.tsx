import { useEffect, useState, type RefObject } from "react";
import { FaDownload, FaFilePdf, FaPrint, FaXmark } from "react-icons/fa6";
import { toDrivePreviewUrl, toDriveDownloadUrl } from "../Helpers";

interface Props {
    ref: RefObject<HTMLDialogElement | null>;
    url?: string;
    title?: string;
}

/**
 * Modal con visor de PDF nativo (iframe) + botón de descarga.
 * El iframe solo se monta la primera vez que se abre el diálogo para
 * evitar peticiones innecesarias.
 */
const PdfViewerModal = ({ ref, url, title }: Props) => {
    const [hasOpened, setHasOpened] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || !url) return;

        setHasOpened(false);
        const observer = new MutationObserver(() => {
            if (el.open) setHasOpened(true);
        });
        observer.observe(el, { attributes: true, attributeFilter: ["open"] });
        return () => observer.disconnect();
    }, [ref, url]);

    if (!url) return null;

    return (
        <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box w-full max-w-5xl h-[85vh] flex flex-col gap-3 p-4 bg-base-100 border border-base-200">
                <div className="flex items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <FaFilePdf className="text-error text-lg shrink-0" />
                        <p className="font-bold text-sm truncate">{title ?? "Ficha técnica"}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm gap-1.5"
                        >
                            <FaPrint className="text-xs" />
                            <span className="hidden sm:inline">Imprimir</span>
                        </a>
                        <a
                            href={toDriveDownloadUrl(url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm gap-1.5"
                        >
                            <FaDownload className="text-xs" />
                            <span className="hidden sm:inline">Descargar</span>
                        </a>
                        <form method="dialog">
                            <button type="submit" className="btn btn-circle btn-ghost btn-sm" aria-label="Cerrar">
                                <FaXmark className="text-lg" />
                            </button>
                        </form>
                    </div>
                </div>

                {hasOpened && (
                    <iframe
                        src={toDrivePreviewUrl(url)}
                        title={title ?? "Vista previa del documento"}
                        className="w-full flex-1 rounded-xl border border-base-200 bg-base-200"
                    />
                )}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="submit" aria-label="Cerrar">close</button>
            </form>
        </dialog>
    );
};

export default PdfViewerModal;
