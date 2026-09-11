import clsx from "clsx";
import React from "react";
import NotFoundSVG from "../../../assets/products/NotFound.svg";

type Props = {
    thumbnails: string[];
    remainingItems: number;
    size?: "sm" | "md";
};

const SIZE_CLASSES: Record<NonNullable<Props["size"]>, string> = {
    sm: "w-9 h-9 sm:w-10 sm:h-10",
    md: "w-10 h-10 sm:w-11 sm:h-11",
};

const ThumbnailGallery = ({ thumbnails, remainingItems, size = "md" }: Props) => {
    const tile = SIZE_CLASSES[size];

    if (thumbnails.length === 0) {
        return (
            <img
                src={NotFoundSVG}
                alt="Sin imagen disponible"
                loading="lazy"
                className={clsx(tile, "rounded-lg object-cover border border-base-300 bg-base-100 shrink-0")}
            />
        );
    }

    return (
        <div className="flex items-center gap-1.5 flex-wrap shrink-0 justify-end">
            {thumbnails.map((url, idx) => (
                <img
                    key={idx}
                    src={url}
                    alt={`Producto ${idx + 1}`}
                    loading="lazy"
                    className={clsx(tile, "rounded-lg object-cover border border-base-300 bg-base-100 shrink-0")}
                />
            ))}
            {remainingItems > 0 && (
                <span
                    className={clsx(
                        tile,
                        "inline-flex items-center justify-center rounded-lg border border-dashed border-base-300 bg-base-200",
                        "text-[10px] font-black text-base-content/50 shrink-0"
                    )}
                    title={`${remainingItems} más`}
                >
                    +{remainingItems}
                </span>
            )}
        </div>
    );
};

export default React.memo(ThumbnailGallery);