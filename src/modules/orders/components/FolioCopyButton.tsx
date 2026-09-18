import { useRef, useState } from "react";
import { FaCheck, FaRegCopy } from "react-icons/fa";

type Tone = "neutral" | "warning" | "error" | "success";

type Props = {
    uuid: string;
    sizeClass?: string;
    tone?: Tone;
};

const toneStyles: Record<Tone, { base: string; copied: string }> = {
    neutral: {
        base: "bg-base-200 text-base-content/40 border-base-300 hover:text-base-content hover:border-base-content/30",
        copied: "bg-success/10 text-success border-success/30",
    },
    warning: {
        base: "bg-warning-content/20 text-warning-content border-warning-content/25 hover:bg-warning-content/30 hover:border-warning-content/40",
        copied: "bg-warning-content text-warning border-warning-content",
    },
    error: {
        base: "bg-error-content/20 text-error-content border-error-content/25 hover:bg-error-content/30 hover:border-error-content/40",
        copied: "bg-error-content text-error border-error-content",
    },
    success: {
        base: "bg-success-content/20 text-success-content border-success-content/25 hover:bg-success-content/30 hover:border-success-content/40",
        copied: "bg-success-content text-success border-success-content",
    },
};

const FolioCopyButton = ({ uuid, sizeClass = "text-[11px]", tone = "neutral" }: Props) => {
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
            data-tip={copied ? "¡Folio copiado!" : "Copiar al portapapeles"}
            aria-label="Copiar folio al portapapeles"
            className={`tooltip tooltip-top z-50 inline-flex items-center justify-center rounded-md border px-1.5 py-1 transition-all duration-150 shrink-0 ${
                copied ? toneStyles[tone].copied : toneStyles[tone].base
            }`}
        >
            {copied ? <FaCheck className={sizeClass} /> : <FaRegCopy className={sizeClass} />}
        </button>
    );
};

export default FolioCopyButton;