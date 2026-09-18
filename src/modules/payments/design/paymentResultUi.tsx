import React from "react";
import clsx from "clsx";

export const PageFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full flex justify-center items-start">
        <div className="w-full md:w-80/100 px-2 sm:px-3 md:px-4 py-6 md:py-10">
            {children}
        </div>
    </div>
);

export const Badge = ({ label, color = "gray" }: { label: string; color?: string }) => (
    <span
        className={clsx(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase",
            color === "success" && "bg-success/20 text-success",
            color === "warning" && "bg-warning/20 text-warning",
            color === "error" && "bg-error/20 text-error",
            color === "primary" && "bg-primary/20 text-primary",
            color === "gray" && "bg-base-200 text-base-content/70",
        )}
    >
        {label}
    </span>
);

export const InfoRow = ({
    label,
    value,
    icon,
}: {
    label: string;
    value?: string | null;
    icon?: React.ReactNode;
}) => (
    <div className="flex flex-col gap-0.5">
        <p className="text-[10px] font-black uppercase text-base-content/40 tracking-widest flex items-center gap-1">
            {icon && <span className="opacity-70">{icon}</span>}
            {label}
        </p>
        <p className="text-sm text-base-content break-words leading-snug">
            {value || <span className="italic text-base-content/30">—</span>}
        </p>
    </div>
);

export const SectionCard = ({
    icon,
    title,
    children,
    action,
    tint,
    strip,
    iconBoxClass,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    tint?: string;
    strip?: string;
    iconBoxClass?: string;
}) => (
    <div className={clsx("w-full rounded-3xl bg-base-100 border border-base-300 shadow-sm overflow-hidden relative", tint)}>
        {strip && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                <div className={clsx("absolute top-0 left-0 right-0 h-1", strip)} />
            </div>
        )}
        <div className="px-5 py-4 bg-base-200/40 border-b border-base-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
                <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-sm border", iconBoxClass ?? "bg-primary/10 text-primary border-primary/5")}>
                    {icon}
                </div>
                <h2 className="text-xs font-black text-base-content uppercase tracking-widest">{title}</h2>
            </div>
            {action}
        </div>
        <div className="p-5 sm:p-6">{children}</div>
    </div>
);

const largeValueToneClass: Record<"success" | "warning" | "error" | "none", string> = {
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
    none: "text-primary",
};

export const SummaryLine = ({
    label,
    value,
    sub,
    highlight,
    minus,
    large,
    isTotalCollected,
    tone,
}: {
    label: string;
    value: string;
    sub?: string;
    highlight?: boolean;
    minus?: boolean;
    large?: boolean;
    isTotalCollected?: boolean;
    tone?: "success" | "warning" | "error";
}) => (
    <div
        className={clsx(
            "flex justify-between items-start gap-2",
            large && "pt-3 mt-1 border-t border-base-300",
        )}
    >
        <div className="flex flex-col">
            <span
                className={clsx(
                    large ? "text-base font-bold text-base-content" : "text-sm text-base-content/70",
                    highlight && "text-success font-semibold",
                )}
            >
                {label}
            </span>
            {sub && <span className="text-xs text-base-content/40">{sub}</span>}
        </div>
        <span
            className={clsx(
                "font-semibold tabular-nums whitespace-nowrap",
                large
                    ? clsx("text-xl font-extrabold", largeValueToneClass[tone ?? "none"])
                    : "text-sm text-base-content",
                highlight && "text-success",
                minus && "text-success",
            )}
        >
            {!isTotalCollected && (minus ? "− " : "+ ")}
            {value}
        </span>
    </div>
);