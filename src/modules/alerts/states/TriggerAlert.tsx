
// Context api

import { createContext, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import Alert from "../components/Alert";
// import AlertModal from "../components/AlertModal";
import FavoriteAlert from "../components/FavoriteAlert";

// Se tipa el customHook con las funciones y datos que contiene
export type TriggerAlertType = "Successfull" | "Error" | "Message" | "Favorite" | null;

type TriggerAlertContextType = {
    showTriggerAlert: (type: TriggerAlertType, message: string, options?: { favoriteType?: "add" | "remove", delay?: number, duration: number }) => void;
    showModal: (type: TriggerAlertType, title: string, info: string, onClose?: () => void) => void;
};

// Crear contexto
export const TriggerAlertContext = createContext<TriggerAlertContextType | undefined>(undefined);


// Crear provider
export const TriggerAlertProvider = ({ children }: { children: ReactNode }) => {
    const [triggerAlertType, setTriggerAlertType] = useState<TriggerAlertType>(null);
    const [favoriteType, setFavoriteType] = useState<"add" | "remove" | null>(null);
    const [title, setTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [callback, setCallback] = useState<() => void>();
    const modal = useRef<HTMLDialogElement>(null);


    const showTriggerAlert = (
        type: TriggerAlertType,
        message: string,
        options: { favoriteType?: "add" | "remove", delay?: number, duration: number } = { duration: 3000, delay: 0 }
    ) => {
        if (message) { setMessage(message); };
        if (options && options.favoriteType) { setFavoriteType(options.favoriteType); };
        setTriggerAlertType(type);

        const showTimeout = setTimeout(() => {
            setTriggerAlertType(type);
            const hideTimeout = setTimeout(() => {
                setTriggerAlertType(null);
            },options.duration);

            return () => clearTimeout(hideTimeout);
        },options.delay);

        return () => clearTimeout(showTimeout);
    };

    const showModal = (type: TriggerAlertType, title: string, message: string, onClose?: () => void): void => {

        setTriggerAlertType(type);
        setTitle(title);
        setMessage(message);

        if (onClose) {
            setCallback(onClose);
        };

        const showModal = modal.current;
        if (showModal) { showModal.showModal(); }
    }

    return (
        <TriggerAlertContext.Provider value={{ showTriggerAlert, showModal }}>
            {children}
            {triggerAlertType === "Successfull" && (<Alert type="Succesfull" message={message} />)}
            {triggerAlertType === "Favorite" && (<FavoriteAlert message={message} type={favoriteType} />)}
            {triggerAlertType === "Message" && (<Alert type="Message" message={message} />)}
            {triggerAlertType === "Error" && (<Alert type="Error" message={message} />)}

        </TriggerAlertContext.Provider>
    );
};

export const useTriggerAlert = () => {
    const context = useContext(TriggerAlertContext);
    if (!context) {
        throw new Error("useTriggerAlert debe usarse dentro de un TriggerAlertProvider");
    }

    return context;
}