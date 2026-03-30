import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Props {
    onSetConsent: (consent: boolean) => void;
};

const CookieConsent = ({ onSetConsent }: Props) => {

    return (
        <div role="alert" className="max-w-3xl alert alert-vertical sm:alert-horizontal fixed bottom-5 left-5 z-50">
            <FaInfoCircle className="text-primary" size={24} />
            <div>
                <h4>Aviso de cookies</h4>
                <p>Este sitio utiliza cookies para ayudar a mejorar tu experiencia de usuario. Visita nuestra <Link to="/politica-de-privacidad" className="underline text-primary cursor-pointer">Política de privacidad</Link> para obtener más información.</p>
            </div>
            <div className="space-x-5">
                <button className="btn btn-sm" onClick={() => onSetConsent(false)}>Rechazar</button>
                <button className="btn btn-sm btn-primary" onClick={() => onSetConsent(true)}>Aceptar</button>
            </div>
        </div>
    );
};

export default CookieConsent;