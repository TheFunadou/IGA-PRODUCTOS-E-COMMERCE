import { FaCertificate } from "react-icons/fa6";
import AnceCertResource from "../../../assets/certs/igaproductos-certificado-ance.pdf"

export const AnceCert = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-base-300 px-10 rounded-3xl">
            <div className="w-full flex gap-2 items-center">
                <div className="p-5 bg-primary/10 rounded-xl">
                    <FaCertificate size={25} className="text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Certificado ANCE</h1>
                    <p className="text-base">Inspecciona el certificado que ampara la calidad de nuestros productos</p>
                </div>
            </div>
            <div className="w-full flex justify-end">
                <a
                    href={AnceCertResource}
                    download="Certificado ANCE 2026 - Iga Productos"
                    className="btn btn-primary underline"
                >
                    Descargar certificado
                </a>
            </div>
            <iframe
                src="https://drive.google.com/file/d/1fvSKDNilQKkwNNQ3buX0mezV4URgAenY/preview"
                width="100%"
                height="80%"
                style={{ border: "none", borderRadius: "10px", marginTop: "20px" }}
                allow="autoplay">
            </iframe>

        </div>
    )
};

export default AnceCert;