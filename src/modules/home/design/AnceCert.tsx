import { FaCertificate } from "react-icons/fa6";
import AnceCertResource from "../../../assets/certs/igaproductos-certificado-ance.pdf";

const INTERVAL_DRIVE_PREVIEW =
    "https://drive.google.com/file/d/1HgKWciUnLdKHyhPqHc7g1ufs9GxmD1cp/preview";
const INTERVAL_DRIVE_DOWNLOAD =
    "https://drive.google.com/uc?export=download&id=1HgKWciUnLdKHyhPqHc7g1ufs9GxmD1cp";
const INTERVAL_DRIVE_VIEW =
    "https://drive.google.com/file/d/1HgKWciUnLdKHyhPqHc7g1ufs9GxmD1cp/view";

function CertBlock({
    title,
    subtitle,
    downloadHref,
    downloadName,
    printHref,
    src,
}: {
    title: string;
    subtitle: string;
    downloadHref: string;
    downloadName?: string;
    printHref: string;
    src: string;
}) {
    return (
        <div className="w-full flex flex-col">
            <div className="w-full flex gap-2 items-center">
                <div className="p-5 bg-primary/10 rounded-xl">
                    <FaCertificate size={25} className="text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-base">{subtitle}</p>
                </div>
            </div>
            <div className="w-full flex justify-end gap-3">
                <a
                    href={downloadHref}
                    download={downloadName}
                    className="btn btn-primary underline"
                >
                    Descargar
                </a>
                <a
                    href={printHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost underline"
                >
                    Imprimir
                </a>
            </div>
            <iframe
                src={src}
                width="100%"
                height="650"
                style={{ border: "none", borderRadius: "10px", marginTop: "20px" }}
                allow="autoplay"
            />
        </div>
    );
}

export const AnceCert = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full px-10 py-10 rounded-3xl gap-14">
            <CertBlock
                title="Certificado ANCE - NOM-115-STPS-2009"
                subtitle="Para Cascos Iga Coraza A y Plagosur C de Ajuste de Matraca"
                downloadHref={AnceCertResource}
                downloadName="Certificado ANCE 2026 - Iga Productos"
                printHref={AnceCertResource}
                src="https://drive.google.com/file/d/1fvSKDNilQKkwNNQ3buX0mezV4URgAenY/preview"
            />
            <CertBlock
                title="Certificado ANCE - NOM-115-STPS-2009"
                subtitle="Para Cascos Iga Coraza A y Plagosur C de Ajuste de Intervalo"
                downloadHref={INTERVAL_DRIVE_DOWNLOAD}
                printHref={INTERVAL_DRIVE_VIEW}
                src={INTERVAL_DRIVE_PREVIEW}
            />
        </div>
    );
};

export default AnceCert;