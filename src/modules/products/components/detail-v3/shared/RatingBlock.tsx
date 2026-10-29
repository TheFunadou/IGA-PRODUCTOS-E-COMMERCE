import { FaStar } from "react-icons/fa6";
import { smoothScrollToSection } from "../../../../../global/GlobalHelpers";
import type { PVReviewResumeType } from "../../../ProductTypes";

/* Bloque de SKU (badge) + bloque de rating: reutilizados en mobile (bajo el
   nombre, SKU sobre la imagen) y en desktop (columna de info). */
export const SkuBadgeBlock = ({ sku }: { sku: string }) => (
    <div className="flex items-center gap-2 flex-wrap">
        <span className="badge badge-ghost badge-sm font-mono font-bold text-sm lg:text-xs text-base-content/70">
            SKU: {sku}
        </span>
    </div>
);

export const RatingBlock = ({ reviewsResume }: { reviewsResume?: PVReviewResumeType }) => (
    (reviewsResume && reviewsResume.totalReviews > 0) ? (
        <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-base-300 px-2.5 py-1 rounded-lg border border-base-200">
                <FaStar className="text-yellow-400 text-sm" />
                <span className="text-sm font-extrabold text-base-content">
                    {(reviewsResume.ratingAverage / 10).toFixed(1)}
                </span>
            </div>
            <a
                href="#reseñas"
                onClick={(e) => { e.preventDefault(); smoothScrollToSection("reseñas"); }}
                className="text-xs font-bold text-primary hover:underline underline-offset-4"
            >
                Leer {reviewsResume.totalReviews} {reviewsResume.totalReviews === 1 ? "opinión" : "opiniones"}
            </a>
        </div>
    ) : (
        <div className="flex items-center gap-2">
            <div className="flex text-base-content/25">
                {[1, 2, 3, 4, 5].map(v => <FaStar key={v} className="text-sm" />)}
            </div>
            <a
                href="#reseñas"
                onClick={(e) => { e.preventDefault(); smoothScrollToSection("reseñas"); }}
                className="text-xs font-bold text-base-content/45 hover:text-primary transition-colors"
            >
                Sé el primero en opinar
            </a>
        </div>
    )
);
