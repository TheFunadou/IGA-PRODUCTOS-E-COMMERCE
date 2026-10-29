import { formatDate, toDriveDownloadUrl } from "../../../Helpers";
import {
    FaAward, FaDownload, FaFileLines, FaShieldHalved
} from "react-icons/fa6";
import { showModal } from "../../../../../global/GlobalHelpers";
import type { ProductResourceI } from "../../../ProductTypes";

/* Badge "Descargar" mostrado dentro de cada fila descargable (recurso o
   certificación); el botón padre sigue siendo el target del clic. */
const DownloadBadge = () => (
    <span className="badge badge-sm gap-1 rounded-full bg-primary text-primary-content font-bold text-[10px] px-2 shrink-0">
        Descargar <FaDownload />
    </span>
);

/* Ficha técnica (PDF), otros recursos descargables y certificaciones */
interface ResourcesPanelProps {
    techSheetUrl?: string;
    otherResources: ProductResourceI[];
    certificationResources: ProductResourceI[];
    pdfModalRef: React.RefObject<HTMLDialogElement | null>;
}

const ResourcesPanel = ({ techSheetUrl, otherResources, certificationResources, pdfModalRef }: ResourcesPanelProps) => (
    <>
        <h2 className="text-xl font-black text-base-content mb-1 flex items-center gap-2.5">
            <FaShieldHalved className="text-primary" /> Recursos y cumplimiento
        </h2>

        {techSheetUrl && (
            <button
                type="button"
                onClick={() => showModal(pdfModalRef.current)}
                className="btn btn-outline btn-primary btn-sm w-full justify-between rounded-lg font-bold border-primary/30 hover:bg-primary hover:border-primary"
            >
                {/* Copy por breakpoint: "Toca" en mobile (<lg), "Clic" en lg+ */}
                <span className="lg:hidden">Toca para ver ficha técnica</span>
                <span className="hidden lg:inline">Clic para ver ficha técnica</span>
                <FaFileLines />
            </button>
        )}

        {otherResources.length > 0 && (
            <div className="flex flex-col gap-1.5">
                {otherResources.map(resource => (
                    <a
                        key={resource.id}
                        href={toDriveDownloadUrl(resource.resourceUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-primary btn-xs rounded-full font-bold gap-1.5 px-3 border-primary/30 hover:bg-primary hover:border-primary justify-between"
                        title={resource.description}
                        data-tip="Descargar recurso"
                    >
                        <span className="flex items-center gap-1.5 min-w-0">
                            <FaFileLines className="text-[10px] shrink-0" />
                            <span className="truncate">{resource.description}</span>
                        </span>
                        <DownloadBadge />
                    </a>
                ))}
            </div>
        )}

        {certificationResources.length > 0 && (
            <div className="flex flex-col gap-2">
                {certificationResources.map(resource => (
                    <a
                        key={resource.id}
                        href={resource.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-200 hover:border-primary/40 hover:bg-primary/[0.03] transition-all"
                    >
                        <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
                            <FaAward className="text-base" />
                        </div>
                        <div className="min-w-0 flex-1 leading-tight">
                            <p className="text-[13px] font-bold text-base-content/85 truncate">{resource.description}</p>
                            <p className="text-[10px] font-semibold text-base-content/45 mt-0.5">
                                Certificación · Act. {formatDate(resource.updatedAt as Date, "es-MX")}
                            </p>
                        </div>
                        <DownloadBadge />
                    </a>
                ))}
            </div>
        )}

        {!techSheetUrl && certificationResources.length === 0 && otherResources.length === 0 && (
            <div className="flex items-center justify-center h-24 border border-dashed border-base-300 rounded-xl bg-base-200/30 text-center px-4">
                <p className="text-xs font-bold text-base-content/40">
                    Este producto aún no tiene ficha técnica ni recursos publicados.
                </p>
            </div>
        )}
    </>
);

export default ResourcesPanel;
