import { useRef, useState } from "react";
import { FaCheck, FaRegCopy } from "react-icons/fa";

type Props = {
    uuid: string;
    sizeClass?: string;
};

const FolioCopyButton = ({ uuid, sizeClass = "text-[11px]" }: Props) => {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<number | null>(null);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(uuid);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = uuid;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }

        setCopied(true);
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                handleCopy();
            }}
            data-tip={copied ? "¡Folio copiado!" : "Copiar folio"}
            aria-label="Copiar folio al portapapeles"
            className={`inline-flex items-center justify-center rounded-md border px-1.5 py-1 transition-all duration-150 shrink-0 ${
                copied
                    ? "bg-success/10 text-success border-success/30"
                    : "bg-base-200 text-base-content/40 border-base-300 hover:text-base-content hover:border-base-content/30"
            }`}
        >
            {copied ? <FaCheck className={sizeClass} /> : <FaRegCopy className={sizeClass} />}
        </button>
    );
};

export default FolioCopyButton;