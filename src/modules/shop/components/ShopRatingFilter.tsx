import { useState } from "react";

interface Props {
    onRatingChange: (rating?: number) => void;
}

const ShopRatingFilter = ({ onRatingChange }: Props) => {
    const [rating, setRating] = useState<number | undefined>(undefined);

    const handleRating = (value: number) => {
        setRating(value);
        onRatingChange(value);
    };

    const handleClear = () => {
        setRating(undefined);
        onRatingChange(undefined);
    };

    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-1">
                Calificación Mínima
            </p>
            <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <input
                        key={star}
                        type="radio"
                        name="rating-filter"
                        className="mask mask-star-2 bg-primary"
                        aria-label={`${star} star`}
                        checked={rating === star}
                        onChange={() => handleRating(star)}
                    />
                ))}
            </div>
            {rating !== undefined && (
                <button
                    type="button"
                    className="text-xs text-primary underline underline-offset-2 text-left mt-1 hover:opacity-70 transition-opacity w-fit"
                    onClick={handleClear}
                >
                    Limpiar calificación
                </button>
            )}
        </div>
    );
};

export default ShopRatingFilter;
