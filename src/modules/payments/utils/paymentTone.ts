export const cardToneClass = (tone: "success" | "warning" | "error") => {
    switch (tone) {
        case "success":
            return {
                tint: "bg-success/5",
                strip: "bg-success",
                iconBoxClass: "bg-success/10 text-success border-success/20",
                boxClass: "bg-success/10",
                labelClass: "text-success/70",
                valueClass: "text-success",
            };
        case "warning":
            return {
                tint: "bg-warning/5",
                strip: "bg-warning",
                iconBoxClass: "bg-warning/10 text-warning border-warning/20",
                boxClass: "bg-warning/10",
                labelClass: "text-warning/70",
                valueClass: "text-warning",
            };
        case "error":
            return {
                tint: "bg-error/5",
                strip: "bg-error",
                iconBoxClass: "bg-error/10 text-error border-error/20",
                boxClass: "bg-error/10",
                labelClass: "text-error/70",
                valueClass: "text-error",
            };
    }
};