import { FaStar } from "react-icons/fa6";
import clsx from "clsx";
import type { PVReviewResumeType } from "../../../../ProductTypes";

/* Tarjeta de resumen de reseñas: promedio global + desglose por estrella */
interface ReviewSummaryProps {
    reviewsResume?: PVReviewResumeType;
    reviewsResumeLoading: boolean;
}

const ReviewSummary = ({ reviewsResume, reviewsResumeLoading }: ReviewSummaryProps) => (
    <div className="rounded-xl bg-base-100 border border-base-200 p-6 flex flex-col gap-4 lg:sticky lg:top-16">
        {reviewsResumeLoading && (
            <div className="flex items-center justify-center h-40 gap-3 text-sm font-bold text-base-content/50 uppercase tracking-widest">
                <span className="loading loading-spinner loading-md text-primary" /> Analizando...
            </div>
        )}
        {reviewsResume && (
            <>
                <div className="text-center flex flex-col items-center">
                    <h3 className="text-[11px] font-bold text-base-content/50 uppercase tracking-widest mb-1.5">Calificación Global</h3>
                    <p className="text-5xl font-black text-base-content tracking-tighter">
                        {(reviewsResume.ratingAverage / 10).toFixed(1)}
                    </p>
                    <div className="rating rating-md pointer-events-none justify-center mt-2">
                        {[1, 2, 3, 4, 5].map(v => (
                            <div key={v} className={clsx(
                                "mask mask-star-2",
                                v <= Math.round(reviewsResume.ratingAverage / 2) ? "bg-yellow-400" : "bg-base-200"
                            )} />
                        ))}
                    </div>
                    <p className="text-xs font-bold text-base-content/55 mt-2">
                        Basado en {reviewsResume.totalReviews} {reviewsResume.totalReviews === 1 ? "opinión" : "opiniones"}
                    </p>
                </div>
                <div className="divider my-0"></div>
                <div className="flex flex-col gap-2.5">
                    {reviewsResume.ratingResume.map((star, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                            <span className="text-xs font-bold text-base-content/60 w-8 flex items-center justify-end gap-1">
                                {star.rating} <FaStar className="text-yellow-400 text-[10px]" />
                            </span>
                            <progress className="progress progress-warning bg-base-200 w-full h-2" value={star.percentage} max="100" />
                            <span className="text-xs font-bold text-base-content/60 w-9 text-right">{Math.round(star.percentage)}%</span>
                        </div>
                    ))}
                </div>
            </>
        )}
    </div>
);

export default ReviewSummary;
