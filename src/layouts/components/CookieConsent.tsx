import { FaInfoCircle } from "react-icons/fa";

interface Props {
    onSetConsent: (consent: boolean) => void;
};

const CookieConsent = ({ onSetConsent }: Props) => {

    return (
        <div role="alert" className="max-w-3xl alert alert-vertical sm:alert-horizontal fixed bottom-5 left-5 z-50">
            <FaInfoCircle className="text-primary" size={24} />
            <span>Este sitio utiliza cookies para su funcionamiento y para mejorar tu experiencia. Aceptas su uso?</span>
            <div className="space-x-5">
                <button className="btn btn-sm" onClick={() => onSetConsent(false)}>Rechazar</button>
                <button className="btn btn-sm btn-primary" onClick={() => onSetConsent(true)}>Aceptar</button>
            </div>
        </div>
    );
};

export default CookieConsent;