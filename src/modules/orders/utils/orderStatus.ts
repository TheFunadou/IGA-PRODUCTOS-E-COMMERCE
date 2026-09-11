import type { OrderStatusType } from "../../shopping/ShoppingTypes";

type Tone = "success" | "warning" | "error" | "info" | "primary" | "neutral";

const STATUS_TONE: Record<OrderStatusType, Tone> = {
    APPROVED: "success",
    AUTHORIZED: "info",
    PENDING: "warning",
    IN_PROCESS: "primary",
    REFUNDED: "success",
    PARTIALLY_REFUNDED: "warning",
    ABANDONED: "error",
    REJECTED: "error",
    CANCELLED: "neutral",
    CHARGED_BACK: "error",
    IN_MEDIATION: "warning",
    CANCELLATION_REQUESTED: "warning",
};

const toneOf = (status: string): Tone => STATUS_TONE[status as OrderStatusType] ?? "neutral";

export const orderStatusBadgeClass = (status: string) => {
    switch (toneOf(status)) {
        case "success": return "bg-success/10 text-success border-success/20";
        case "warning": return "bg-warning/10 text-warning border-warning/20";
        case "error": return "bg-error/10 text-error border-error/20";
        case "info": return "bg-info/10 text-info border-info/20";
        case "primary": return "bg-primary/10 text-primary border-primary/20";
        default: return "bg-base-200 text-base-content/50 border-base-300";
    }
};

export const orderStatusStripClass = (status: string) => {
    switch (toneOf(status)) {
        case "success": return "bg-success";
        case "warning": return "bg-warning";
        case "error": return "bg-error";
        case "info": return "bg-info";
        case "primary": return "bg-primary";
        default: return "bg-base-content/25";
    }
};

export const orderStatusDotClass = (status: string) => {
    switch (toneOf(status)) {
        case "success": return "bg-success";
        case "warning": return "bg-warning";
        case "error": return "bg-error";
        case "info": return "bg-info";
        case "primary": return "bg-primary";
        default: return "bg-base-content/40";
    }
};

export const orderStatusCardTintClass = (status: string): string => {
    switch (toneOf(status)) {
        case "success": return "bg-success/[0.04]";
        case "warning": return "bg-warning/[0.04]";
        case "error": return "bg-error/[0.04]";
        default: return "bg-base-100";
    }
};

export const orderStatusIconTextClass = (status: string) => {
    switch (toneOf(status)) {
        case "success": return "text-success";
        case "warning": return "text-warning";
        case "error": return "text-error";
        case "info": return "text-info";
        case "primary": return "text-primary";
        default: return "text-base-content/40";
    }
};

export const canRequestInvoice = (status: string): boolean => status === "APPROVED";

export const isAbandoned = (status: string): boolean => status === "ABANDONED";